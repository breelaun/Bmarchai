import { useEffect, useState } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Package, ShoppingBag, Loader2 } from "lucide-react";
import { OrderCard } from "@/components/orders/OrderCard";
import { EmptyOrderState } from "@/components/orders/EmptyOrderState";

const Orders = () => {
  const session = useSession();
  const queryClient = useQueryClient();
  const [isSubscribed, setIsSubscribed] = useState(false);

  // Orders made by the user (as a buyer)
  const { data: ordersMade, isLoading: ordersLoading } = useQuery({
    queryKey: ["orders-made", session?.user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select(`
          *,
          order_items (
            *,
            product:products (
              name,
              image_url,
              vendor_profile_id
            )
          ),
          vendor:vendor_profiles (
            id,
            business_name,
            contact_email
          ),
          vendor_user:profiles (
            id,
            full_name,
            username
          )
        `)
        .eq("user_id", session?.user?.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Orders made error:", error);
        throw error;
      }
      return data;
    },
    enabled: !!session?.user?.id,
  });

  // Orders received by the user (as a vendor)
  const { data: ordersReceived, isLoading: receivedLoading } = useQuery({
    queryKey: ["orders-received", session?.user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select(`
          *,
          order_items (
            *,
            product:products (
              name,
              image_url
            )
          ),
          user:profiles (
            id,
            full_name,
            username
          )
        `)
        .eq("seller_profile_id", session?.user?.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Orders received error:", error);
        throw error;
      }
      return data;
    },
    enabled: !!session?.user?.id,
  });

  useEffect(() => {
    if (!session?.user?.id || isSubscribed) return;

    const channel = supabase
      .channel("orders-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "orders",
          filter: `user_id=eq.${session.user.id}`,
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ["orders-made"] });
        }
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "orders",
          filter: `seller_profile_id=eq.${session.user.id}`,
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ["orders-received"] });
        }
      )
      .subscribe();

    setIsSubscribed(true);

    return () => {
      supabase.removeChannel(channel);
      setIsSubscribed(false);
    };
  }, [session?.user?.id, queryClient, isSubscribed]);

  if (ordersLoading || receivedLoading) {
    return (
      <div className="container max-w-4xl mx-auto py-8 px-4">
        <div className="flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <Tabs defaultValue="made" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="made" className="flex items-center gap-2">
            <ShoppingBag className="h-4 w-4" />
            Orders Made
          </TabsTrigger>
          <TabsTrigger value="received" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            Orders Received
          </TabsTrigger>
        </TabsList>
        <TabsContent value="made" className="mt-4">
          {ordersMade?.length === 0 ? (
            <EmptyOrderState type="made" />
          ) : (
            ordersMade?.map((order) => (
              <OrderCard key={order.id} order={order} type="made" />
            ))
          )}
        </TabsContent>
        <TabsContent value="received" className="mt-4">
          {ordersReceived?.length === 0 ? (
            <EmptyOrderState type="received" />
          ) : (
            ordersReceived?.map((order) => (
              <OrderCard key={order.id} order={order} type="received" />
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Orders;
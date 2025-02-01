import { useSession } from "@supabase/auth-helpers-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Package, ShoppingBag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { useEffect } from "react";
import { toast } from "@/components/ui/use-toast";

const Orders = () => {
  const session = useSession();

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
              image_url
            )
          ),
          vendor:profiles!orders_vendor_id_fkey (
            id,
            full_name,
            username,
            email
          )
        `)
        .eq("user_id", session?.user?.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!session?.user?.id,
  });

  // Orders received (as a seller)
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
          buyer:profiles!orders_user_id_fkey (
            id,
            full_name,
            username,
            email
          )
        `)
        .eq("vendor_id", session?.user?.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!session?.user?.id,
  });

  // Subscribe to new orders (as a seller)
  useEffect(() => {
    if (!session?.user?.id) return;

    const channel = supabase
      .channel('orders')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'orders',
          filter: `vendor_id=eq.${session.user.id}`,
        },
        (payload) => {
          toast({
            title: "New Order Received!",
            description: `Order #${payload.new.id.slice(0, 8)} has been placed.`,
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [session?.user?.id]);

  const renderOrderCard = (order: any, type: "made" | "received") => (
    <Card key={order.id} className="mb-4">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-lg">
            Order #{order.id.slice(0, 8)}
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            {format(new Date(order.created_at), "PPP")}
          </p>
        </div>
        <Badge className={getStatusBadgeColor(order.order_status)}>
          {order.order_status.charAt(0).toUpperCase() + order.order_status.slice(1)}
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {type === "made" ? (
            <p className="text-sm">Seller: {order.vendor?.full_name || "Unknown Seller"}</p>
          ) : (
            <p className="text-sm">Buyer: {order.buyer?.full_name || "Unknown Buyer"}</p>
          )}
          <div className="space-y-2">
            {order.order_items?.map((item: any) => (
              <div key={item.id} className="flex items-center gap-4">
                {item.product?.image_url ? (
                  <img
                    src={item.product.image_url}
                    alt={item.product.name}
                    className="h-12 w-12 object-cover rounded"
                  />
                ) : (
                  <div className="h-12 w-12 bg-muted rounded flex items-center justify-center">
                    <Package className="h-6 w-6 text-muted-foreground" />
                  </div>
                )}
                <div>
                  <p className="font-medium">{item.product?.name}</p>
                  <p className="text-sm text-muted-foreground">
                    Quantity: {item.quantity} × ${item.price_at_time}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <p className="text-right font-medium">
            Total: ${order.total_amount}
          </p>
          {order.vendor_notes && type === "made" && (
            <div className="mt-4 p-3 bg-muted rounded-lg">
              <p className="text-sm font-medium">Seller Notes:</p>
              <p className="text-sm text-muted-foreground">{order.vendor_notes}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

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
        <TabsContent value="made">
          {ordersMade?.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-8">
                <ShoppingBag className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Orders Made</h3>
                <p className="text-muted-foreground">You haven't made any orders yet.</p>
              </CardContent>
            </Card>
          ) : (
            ordersMade?.map((order) => renderOrderCard(order, "made"))
          )}
        </TabsContent>
        <TabsContent value="received">
          {ordersReceived?.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-8">
                <Package className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Orders Received</h3>
                <p className="text-muted-foreground">You haven't received any orders yet.</p>
              </CardContent>
            </Card>
          ) : (
            ordersReceived?.map((order) => renderOrderCard(order, "received"))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Orders;

import { useQuery } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import VendorHeader from "./VendorHeader";
import ProductGrid from "./ProductGrid";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface VendorCustomizations {
  theme?: {
    primaryColor: string;
    secondaryColor: string;
    font: string;
  };
}

const VendorShop = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Redirect to home if id is "new" or invalid
  if (id === "new" || !id) {
    navigate("/");
    return null;
  }

  const { data: vendorData, isLoading: vendorLoading } = useQuery({
    queryKey: ["vendor", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("vendor_profiles")
        .select(`
          *,
          profiles:vendor_profiles_id_fkey(username, avatar_url)
        `)
        .eq("id", id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!id && id !== "new",
  });

  const { data: products, isLoading: productsLoading } = useQuery({
    queryKey: ["vendorProducts", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("vendor_id", id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!id && id !== "new",
  });

  if (vendorLoading || productsLoading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <Skeleton className="h-48 w-full" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-64 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (!vendorData) {
    return (
      <Card className="container mx-auto p-6">
        <p className="text-center text-muted-foreground">Vendor not found</p>
      </Card>
    );
  }

  const customizations = vendorData.customizations as VendorCustomizations;
  const theme = customizations?.theme || {
    primaryColor: "#f7bd00",
    secondaryColor: "#222222",
    font: "sans",
  };

  return (
    <div 
      className="min-h-screen"
      style={{ 
        fontFamily: `var(--font-${theme.font})`,
        backgroundColor: theme.secondaryColor,
        color: "#fff"
      }}
    >
      <VendorHeader vendor={vendorData} theme={theme} />
      <main className="container mx-auto p-6">
        <ProductGrid products={products || []} theme={theme} />
      </main>
    </div>
  );
};

export default VendorShop;
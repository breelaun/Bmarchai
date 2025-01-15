import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useSession } from "@supabase/auth-helpers-react";

interface Product {
  id: number;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  category: string | null;
  inventory_count: number | null;
  vendor_profiles: {
    business_name: string | null;
    profiles: {
      username: string | null;
      is_vendor: boolean;
    }
  }
}

const Shop = () => {
  const session = useSession();
  
  const { data: products, isLoading, error } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      console.log("Fetching products...");
      const { data, error } = await supabase
        .from("products")
        .select(`
          *,
          vendor_profiles (
            business_name,
            profiles (
              username,
              is_vendor
            )
          )
        `)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching products:", error);
        throw error;
      }
      
      console.log("Products fetched:", data);
      return data as Product[];
    },
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  // Log the current state
  console.log("Current state:", { isLoading, products, error });

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12 text-destructive">
          <p>Error loading products. Please try again later.</p>
          <p className="text-sm mt-2">{error.message}</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-4">
                <div className="w-full h-48 bg-muted rounded-lg mb-4" />
                <div className="h-4 bg-muted rounded w-3/4 mb-2" />
                <div className="h-4 bg-muted rounded w-1/4" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Products Available</h3>
          <p className="text-muted-foreground mb-4">
            {session ? 
              "Become a vendor to start selling products." :
              "Sign in to become a vendor and start selling products."
            }
          </p>
          {session ? (
            <Button asChild>
              <Link to="/profile">Become a Vendor</Link>
            </Button>
          ) : (
            <Button asChild>
              <Link to="/auth/login">Sign In</Link>
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Shop</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <Card key={product.id}>
            <CardContent className="p-4">
              {product.image_url ? (
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
              ) : (
                <div className="w-full h-48 bg-muted rounded-lg mb-4 flex items-center justify-center">
                  <Package className="h-12 w-12 text-muted-foreground" />
                </div>
              )}
              <h3 className="font-semibold mb-2">{product.name}</h3>
              <p className="text-muted-foreground text-sm mb-2 line-clamp-2">
                {product.description}
              </p>
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold">
                  {formatPrice(product.price)}
                </span>
                {product.inventory_count === 0 && (
                  <span className="text-sm text-destructive">Out of stock</span>
                )}
              </div>
              <div className="text-sm text-muted-foreground">
                Sold by: {product.vendor_profiles?.business_name || product.vendor_profiles?.profiles?.username || "Unknown Vendor"}
                {product.vendor_profiles?.profiles?.is_vendor && (
                  <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-primary/10 text-primary">
                    Verified Vendor
                  </span>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Shop;
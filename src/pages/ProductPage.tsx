import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface Product {
  id: number;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  category: string | null;
  inventory_count: number | null;
  vendor_id: string;
  vendor_profiles: {
    business_name: string | null;
    profiles: {
      username: string | null;
    }
  }
}

const ProductPage = () => {
  const { productId } = useParams<{ productId: string }>();
  const { toast } = useToast();

  const { data: product, isLoading } = useQuery({
    queryKey: ["product", productId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select(`
          *,
          vendor_profiles (
            business_name,
            profiles (
              username
            )
          )
        `)
        .eq("id", productId)
        .single();

      if (error) {
        toast({
          variant: "destructive",
          title: "Error loading product",
          description: error.message,
        });
        throw error;
      }

      return data as Product;
    },
  });

  const { data: relatedProducts } = useQuery({
    queryKey: ["relatedProducts", product?.category],
    queryFn: async () => {
      if (!product?.category) return [];
      
      const { data, error } = await supabase
        .from("products")
        .select(`
          *,
          vendor_profiles (
            business_name,
            profiles (
              username
            )
          )
        `)
        .eq("category", product.category)
        .neq("id", product.id)
        .limit(3);

      if (error) {
        console.error("Error fetching related products:", error);
        return [];
      }

      return data as Product[];
    },
    enabled: !!product?.category,
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-4">
        <Card className="animate-pulse">
          <CardContent className="p-4">
            <div className="w-full h-64 bg-muted rounded-lg mb-4" />
            <div className="h-8 bg-muted rounded w-3/4 mb-4" />
            <div className="h-4 bg-muted rounded w-1/2 mb-2" />
            <div className="h-4 bg-muted rounded w-1/4" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto p-4">
        <Card>
          <CardContent className="p-8 text-center">
            <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-2xl font-bold mb-2">Product Not Found</h2>
            <p className="text-muted-foreground">
              The product you're looking for doesn't exist or has been removed.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardContent className="p-6">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              {product.image_url ? (
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-full rounded-lg object-cover aspect-square"
                />
              ) : (
                <div className="w-full aspect-square bg-muted rounded-lg flex items-center justify-center">
                  <Package className="h-20 w-20 text-muted-foreground" />
                </div>
              )}
            </div>
            <div>
              <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
              <p className="text-muted-foreground mb-6">
                {product.description}
              </p>
              <div className="flex items-center justify-between mb-6">
                <span className="text-2xl font-bold">
                  {formatPrice(product.price)}
                </span>
                {product.inventory_count === 0 ? (
                  <span className="text-destructive">Out of stock</span>
                ) : (
                  <span className="text-muted-foreground">
                    {product.inventory_count} in stock
                  </span>
                )}
              </div>
              <Button
                className="w-full"
                disabled={product.inventory_count === 0}
              >
                Add to Cart
              </Button>
              <div className="mt-6 pt-6 border-t">
                <h3 className="font-semibold mb-2">Seller Information</h3>
                <p className="text-muted-foreground">
                  {product.vendor_profiles?.business_name || 
                   product.vendor_profiles?.profiles?.username || 
                   "Unknown Vendor"}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {relatedProducts && relatedProducts.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Related Products</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedProducts.map((relatedProduct) => (
              <Card key={relatedProduct.id}>
                <CardContent className="p-4">
                  {relatedProduct.image_url ? (
                    <img
                      src={relatedProduct.image_url}
                      alt={relatedProduct.name}
                      className="w-full h-48 object-cover rounded-lg mb-4"
                    />
                  ) : (
                    <div className="w-full h-48 bg-muted rounded-lg mb-4 flex items-center justify-center">
                      <Package className="h-12 w-12 text-muted-foreground" />
                    </div>
                  )}
                  <h3 className="font-semibold mb-2">{relatedProduct.name}</h3>
                  <p className="text-muted-foreground text-sm mb-2 line-clamp-2">
                    {relatedProduct.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">
                      {formatPrice(relatedProduct.price)}
                    </span>
                    {relatedProduct.inventory_count === 0 && (
                      <span className="text-sm text-destructive">Out of stock</span>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductPage;
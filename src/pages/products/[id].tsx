import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Package, ShoppingCart, Heart } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useCart } from "@/components/cart/CartProvider";
import PaymentButton from "@/components/payment/PaymentButton";

const ProductPage = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const { addToCart } = useCart();

  const { data: product, isLoading } = useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      const numericId = parseInt(id!, 10);
      
      if (isNaN(numericId)) {
        throw new Error("Invalid product ID");
      }

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
        .eq("id", numericId)
        .single();

      if (error) throw error;
      return data;
    },
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="animate-pulse">
          <CardContent className="p-6">
            <div className="w-full h-96 bg-muted rounded-lg mb-4" />
            <div className="space-y-2">
              <div className="h-8 bg-muted rounded w-2/3" />
              <div className="h-4 bg-muted rounded w-1/4" />
              <div className="h-20 bg-muted rounded w-full" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="p-6 text-center">
            <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-2xl font-semibold mb-2">Product Not Found</h2>
            <p className="text-muted-foreground">
              The product you're looking for doesn't exist or has been removed.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleAddToCart = async () => {
    await addToCart(product.id);
  };

  const handleAddToWishlist = () => {
    toast({
      title: "Added to Wishlist",
      description: `${product.name} has been added to your wishlist.`,
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="relative aspect-square">
              {product.image_url ? (
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-muted flex items-center justify-center">
                  <Package className="h-20 w-20 text-muted-foreground" />
                </div>
              )}
            </div>
            
            <div className="p-6 space-y-6">
              <div>
                <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
                <p className="text-2xl font-semibold text-primary">
                  {formatPrice(product.price)}
                </p>
              </div>

              <div className="space-y-4">
                <p className="text-muted-foreground">{product.description}</p>
                
                {product.inventory_count === 0 ? (
                  <p className="text-destructive font-semibold">Out of Stock</p>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    {product.inventory_count} in stock
                  </p>
                )}
              </div>

              <div className="flex flex-col space-y-4">
                <PaymentButton 
                  amount={product.price} 
                  vendorId={product.vendor_id}
                  className="w-full"
                />
                
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full"
                  onClick={handleAddToCart}
                  disabled={product.inventory_count === 0}
                >
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Add to Cart
                </Button>
                
                <Button
                  variant="secondary"
                  size="lg"
                  className="w-full"
                  onClick={handleAddToWishlist}
                >
                  <Heart className="mr-2 h-5 w-5" />
                  Add to Wishlist
                </Button>
              </div>

              <div className="pt-6 border-t border-border">
                <p className="text-sm text-muted-foreground">
                  Sold by:{" "}
                  <span className="font-semibold">
                    {product.vendor_profiles?.business_name ||
                      product.vendor_profiles?.profiles?.username ||
                      "Unknown Vendor"}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductPage;
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Store, Package, Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import ProductUploadForm from "./products/ProductUploadForm";

interface VendorStoreProps {
  vendorId?: string;
}

interface Product {
  id: number;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  category: string | null;
  is_featured: boolean;
  inventory_count: number;
  file_urls: string[] | null;
}

const VendorStore = ({ vendorId }: VendorStoreProps) => {
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [showUploadForm, setShowUploadForm] = useState(false);

  useEffect(() => {
    const getCurrentUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUserId(user?.id || null);
    };
    getCurrentUser();
  }, []);

  const effectiveVendorId = vendorId || currentUserId;
  const isOwner = currentUserId === effectiveVendorId;
  
  const isValidUUID = effectiveVendorId && 
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(effectiveVendorId);

  const { data: products, isLoading } = useQuery({
    queryKey: ["vendorProducts", effectiveVendorId],
    queryFn: async () => {
      if (!isValidUUID) return [];
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("vendor_id", effectiveVendorId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Product[];
    },
    enabled: !!isValidUUID,
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  if (!isValidUUID) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Store className="h-6 w-6" />
            Store Preview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Please save your vendor profile to view your store.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      {showUploadForm ? (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold">Add New Product</h2>
            <Button variant="outline" onClick={() => setShowUploadForm(false)}>
              Cancel
            </Button>
          </div>
          <ProductUploadForm onSuccess={() => setShowUploadForm(false)} />
        </div>
      ) : (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Store className="h-6 w-6" />
                Store Preview
              </CardTitle>
              {isOwner && (
                <Button onClick={() => setShowUploadForm(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Product
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="animate-pulse">
                    <CardContent className="p-4">
                      <div className="w-full h-48 bg-muted rounded-lg mb-4" />
                      <div className="h-4 bg-muted rounded w-3/4 mb-2" />
                      <div className="h-4 bg-muted rounded w-1/4" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : products && products.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                      <p className="text-muted-foreground text-sm mb-2">
                        {product.description?.slice(0, 100)}
                        {product.description && product.description.length > 100 ? "..." : ""}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="font-semibold">{formatPrice(product.price)}</span>
                        {product.inventory_count === 0 && (
                          <span className="text-sm text-destructive">Out of stock</span>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Products Yet</h3>
                {isOwner && (
                  <Button 
                    onClick={() => setShowUploadForm(true)}
                    variant="outline" 
                    className="mt-4"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Your First Product
                  </Button>
                )}
                <p className="text-muted-foreground mt-2">
                  {isOwner 
                    ? "Start adding products to your store to see them displayed here."
                    : "This vendor hasn't added any products yet."}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default VendorStore;

import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const ProductPage = () => {
  const { productId } = useParams();

  const { data: product, isLoading } = useQuery({
    queryKey: ["product", productId],
    queryFn: async () => {
      if (!productId) throw new Error("Product ID is required");
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", parseInt(productId))
        .single();

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) return <div>Loading...</div>;
  if (!product) return <div>Product not found</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">{product.name}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          {product.image_url && (
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full rounded-lg"
            />
          )}
        </div>
        <div>
          <p className="text-gray-600 mb-4">{product.description}</p>
          <p className="text-2xl font-bold">${product.price}</p>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
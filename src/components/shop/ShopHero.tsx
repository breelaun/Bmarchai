import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

const ShopHero = () => {
  const { data: featuredProducts } = useQuery({
    queryKey: ["featuredProducts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("is_featured", true)
        .limit(3);
      
      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="relative bg-[#121212] overflow-hidden">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Discover Amazing Deals
          </h1>
          <p className="text-lg text-gray-300 mb-8">
            Shop the latest products from our trusted vendors
          </p>
          <Button
            className="bg-[#f7bd00] text-black hover:bg-[#f7bd00]/90"
          >
            Explore Featured Products
          </Button>
        </div>

        {featuredProducts && featuredProducts.length > 0 && (
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-[#1a1a1a] rounded-lg p-4 shadow-lg border border-[#f7bd00]/20"
              >
                <img
                  src={product.image_url || "/placeholder.svg"}
                  alt={product.name}
                  className="w-full h-48 object-cover rounded-md mb-4"
                />
                <h3 className="text-white font-semibold">{product.name}</h3>
                <p className="text-[#f7bd00] font-bold mt-2">
                  ${product.price.toFixed(2)}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ShopHero;
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package } from "lucide-react";

interface ProductGridProps {
  products: Array<{
    id: number;
    name: string;
    description: string | null;
    price: number;
    image_url: string | null;
    inventory_count: number;
  }>;
  theme: {
    primaryColor: string;
    secondaryColor: string;
    font: string;
  };
}

const ProductGrid = ({ products, theme }: ProductGridProps) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  if (products.length === 0) {
    return (
      <Card className="p-12 text-center">
        <CardContent>
          <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">No products available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {products.map((product) => (
        <Card 
          key={product.id}
          className="overflow-hidden transition-transform hover:scale-[1.02]"
          style={{ backgroundColor: theme.primaryColor }}
        >
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
            <h3 
              className="font-semibold mb-2 text-lg"
              style={{ color: theme.secondaryColor }}
            >
              {product.name}
            </h3>
            {product.description && (
              <p 
                className="text-sm mb-4 line-clamp-2"
                style={{ color: theme.secondaryColor }}
              >
                {product.description}
              </p>
            )}
            <div className="flex items-center justify-between">
              <span 
                className="font-bold"
                style={{ color: theme.secondaryColor }}
              >
                {formatPrice(product.price)}
              </span>
              <Button
                style={{ 
                  backgroundColor: theme.secondaryColor,
                  color: theme.primaryColor 
                }}
                className="hover:opacity-90"
              >
                Buy Now
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ProductGrid;
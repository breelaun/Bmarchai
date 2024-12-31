import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Package } from "lucide-react";
import { BlogPagination } from "@/components/blogs/BlogPagination";

interface Product {
  id: number;
  name: string;
  price: number;
  image_url: string | null;
  vendor_profiles: {
    business_name: string | null;
  };
  vendor_id: string;
}

interface ProductGridProps {
  products: Product[];
  isLoading: boolean;
  currentPage: number;
  onPageChange: (page: number) => void;
}

const ProductGrid = ({ products, isLoading, currentPage, onPageChange }: ProductGridProps) => {
  const ITEMS_PER_PAGE = 12;
  const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <Card key={i} className="bg-[#1a1a1a] animate-pulse">
            <CardContent className="p-4">
              <div className="w-full h-48 bg-[#222] rounded-lg mb-4" />
              <div className="h-4 bg-[#222] rounded w-3/4 mb-2" />
              <div className="h-4 bg-[#222] rounded w-1/4" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const displayedProducts = products.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {displayedProducts.map((product) => (
          <Card key={product.id} className="bg-[#1a1a1a] border-[#f7bd00]/20 hover:border-[#f7bd00]/40 transition-colors">
            <CardContent className="p-4">
              {product.image_url ? (
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
              ) : (
                <div className="w-full h-48 bg-[#222] rounded-lg mb-4 flex items-center justify-center">
                  <Package className="h-12 w-12 text-gray-500" />
                </div>
              )}
              <h3 className="text-white font-semibold mb-2">{product.name}</h3>
              <Link
                to={`/vendors/${product.vendor_id}`}
                className="text-sm text-[#f7bd00] hover:text-[#f7bd00]/80"
              >
                {product.vendor_profiles?.business_name || "Unknown Vendor"}
              </Link>
              <p className="text-[#f7bd00] font-bold mt-2">
                ${product.price.toFixed(2)}
              </p>
            </CardContent>
            <CardFooter className="p-4 pt-0 flex gap-2">
              <Button
                variant="outline"
                className="flex-1 border-[#f7bd00] text-[#f7bd00] hover:bg-[#f7bd00] hover:text-black"
              >
                View Details
              </Button>
              <Button
                className="flex-1 bg-[#f7bd00] text-black hover:bg-[#f7bd00]/90"
              >
                Add to Cart
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {totalPages > 1 && (
        <BlogPagination
          currentPage={currentPage}
          totalPages={totalPages}
          baseUrl="/shop"
        />
      )}
    </div>
  );
};

export default ProductGrid;
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useSession } from "@supabase/auth-helpers-react";
import { useCart } from "@/components/cart/CartProvider";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { useState } from "react";
import { countries } from "@/lib/countries";

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
    country: string | null;
    profiles: {
      username: string | null;
      is_vendor: boolean;
    }
  }
}

const Shop = () => {
  const session = useSession();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedCountry, setSelectedCountry] = useState<string>("all");
  const [priceRange, setPriceRange] = useState([0, 1000]);
  
  const { data: products = [], isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          vendor_profiles (
            business_name,
            country,
            profiles (
              username,
              is_vendor
            )
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Error fetching products:", error);
        throw error;
      }
      
      return data as Product[];
    },
  });

  const { data: categories = [] } = useQuery({
    queryKey: ['product-categories'],
    queryFn: async () => {
      const { data } = await supabase
        .from('products')
        .select('category')
        .not('category', 'is', null);
      
      return [...new Set(data?.map(p => p.category))] as string[];
    },
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(search.toLowerCase()) ||
      product.description?.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesCountry = selectedCountry === 'all' || product.vendor_profiles?.country === selectedCountry;
    const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
    return matchesSearch && matchesCategory && matchesCountry && matchesPrice;
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 space-y-4">
        <h1 className="text-3xl font-bold mb-8">Shop</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Input
            type="search"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category || "uncategorized"}>
                  {category || "Uncategorized"}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedCountry} onValueChange={setSelectedCountry}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by country" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Countries</SelectItem>
              {countries.map((country) => (
                <SelectItem key={country.code} value={country.code}>
                  {country.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Price Range: {formatPrice(priceRange[0])} - {formatPrice(priceRange[1])}
            </p>
            <Slider
              min={0}
              max={1000}
              step={10}
              value={priceRange}
              onValueChange={setPriceRange}
            />
          </div>
        </div>
      </div>

      {filteredProducts.length === 0 ? (
        <div className="text-center py-12">
          <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Products Found</h3>
          <p className="text-muted-foreground">
            Try adjusting your filters or search terms
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredProducts.map((product) => (
            <Card 
              key={product.id}
              className="cursor-pointer transition-transform hover:scale-[1.02]"
              onClick={() => navigate(`/products/${product.id}`)}
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
                <h3 className="font-semibold mb-2 line-clamp-1">{product.name}</h3>
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
                  Sold by:{" "}
                  <Link 
                    to={`/vendors/${product.vendor_profiles?.profiles?.username}`}
                    onClick={(e) => e.stopPropagation()}
                    className="hover:underline"
                  >
                    {product.vendor_profiles?.business_name || "Unknown Vendor"}
                  </Link>
                </div>
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    addToCart(product.id);
                  }}
                  disabled={product.inventory_count === 0}
                  className="w-full mt-4"
                >
                  Add to Cart
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Shop;
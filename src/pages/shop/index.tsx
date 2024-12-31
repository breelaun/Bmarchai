import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import ShopHero from "@/components/shop/ShopHero";
import ProductGrid from "@/components/shop/ProductGrid";
import FilterSidebar from "@/components/shop/FilterSidebar";
import SearchSort from "@/components/shop/SearchSort";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

export type SortOption = "newest" | "price-asc" | "price-desc" | "popularity";

const ShopPage = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);

  const { data: products, isLoading } = useQuery({
    queryKey: ["products", searchQuery, sortBy, currentPage, selectedCategories, priceRange],
    queryFn: async () => {
      let query = supabase
        .from("products")
        .select(`
          *,
          vendor_profiles:vendor_id (
            business_name
          )
        `);

      if (searchQuery) {
        query = query.ilike("name", `%${searchQuery}%`);
      }

      if (selectedCategories.length > 0) {
        query = query.in("category", selectedCategories);
      }

      query = query.gte("price", priceRange[0]).lte("price", priceRange[1]);

      switch (sortBy) {
        case "price-asc":
          query = query.order("price", { ascending: true });
          break;
        case "price-desc":
          query = query.order("price", { ascending: false });
          break;
        case "popularity":
          query = query.order("view_count", { ascending: false });
          break;
        default:
          query = query.order("created_at", { ascending: false });
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="min-h-screen bg-[#121212]">
      <ShopHero />
      
      <div className="container mx-auto px-4 py-8">
        <SearchSort
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          sortBy={sortBy}
          onSortChange={setSortBy}
        />
        
        <div className="flex flex-col md:flex-row gap-8 mt-8">
          {/* Mobile Filter Toggle */}
          <div className="md:hidden">
            <Button
              variant="outline"
              className="w-full border-[#f7bd00] text-[#f7bd00]"
              onClick={() => setIsFilterOpen(!isFilterOpen)}
            >
              <Menu className="mr-2 h-4 w-4" />
              {isFilterOpen ? "Hide Filters" : "Show Filters"}
            </Button>
          </div>

          {/* Sidebar */}
          <div
            className={`${
              isFilterOpen ? "block" : "hidden"
            } md:block w-full md:w-64 shrink-0`}
          >
            <FilterSidebar
              selectedCategories={selectedCategories}
              onCategoryChange={setSelectedCategories}
              priceRange={priceRange}
              onPriceRangeChange={setPriceRange}
            />
          </div>

          {/* Product Grid */}
          <div className="flex-1">
            <ProductGrid
              products={products || []}
              isLoading={isLoading}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopPage;
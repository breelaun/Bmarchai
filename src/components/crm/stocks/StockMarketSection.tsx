import { useState, useEffect } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { SearchBar } from "./SearchBar";
import { ChartSection } from "./ChartSection";
import { TrendingStocks } from "./TrendingStocks";
import { SearchResults } from "./SearchResults";
import { NewsSection } from "./NewsSection";

type TimeRange = "1D" | "1W" | "1M" | "1Y" | "3Y" | "5Y" | "10Y";

// Make sure to export the component as default
const StockMarketSection = () => {
  const session = useSession();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTimeRange, setSelectedTimeRange] = useState<TimeRange>("1M");
  const [selectedStock, setSelectedStock] = useState<string>("AAPL"); // Set default value
  const [searchResults, setSearchResults] = useState<any[]>([]);

  const { data: favoriteStocks, refetch: refetchFavorites } = useQuery({
    queryKey: ["favorite-stocks", session?.user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("favorite_stocks")
        .select("*")
        .order("created_at", { ascending: true });

      if (error) throw error;
      return data;
    },
    enabled: !!session?.user?.id,
  });

  // ... rest of your existing functions (handleSearch, addToFavorites, removeFromFavorites) ...

  return (
    <div className="space-y-4 lg:space-y-6">
      <Card className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <CardHeader>
          <CardTitle>Stock Market</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <SearchBar
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              onSearch={handleSearch}
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="lg:col-span-2 space-y-4">
                <ChartSection
                  symbol={selectedStock}
                  selectedTimeRange={selectedTimeRange}
                  onTimeRangeChange={setSelectedTimeRange}
                />
              </div>
              <div className="space-y-4">
                <TrendingStocks 
                  onSelect={setSelectedStock}
                  favorites={favoriteStocks || []}
                  onAddToFavorites={addToFavorites}
                  onRemoveFromFavorites={removeFromFavorites}
                />
                <SearchResults
                  results={searchResults}
                  onAddToFavorites={addToFavorites}
                  favorites={favoriteStocks || []}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <NewsSection symbol={selectedStock} />
    </div>
  );
};

// Add both default and named exports
export default StockMarketSection;
export { StockMarketSection };

import { useState } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SearchBar } from "./SearchBar";
import { ChartSection } from "./ChartSection";
import { TrendingStocks } from "./TrendingStocks";
import { SearchResults } from "./SearchResults";
import { NewsSection } from "./NewsSection";

type TimeRange = "1D" | "1W" | "1M" | "1Y" | "3Y" | "5Y" | "10Y";

export const StockMarketSection = () => {
  const session = useSession();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTimeRange, setSelectedTimeRange] = useState<TimeRange>("1M");
  const [selectedStock, setSelectedStock] = useState<string | null>(null);
  const [searchResults, setSearchResults] = useState<any[]>([]);

  // ... rest of your existing state management code ...

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
                  symbol={selectedStock || (favoriteStocks?.[0]?.symbol ?? "AAPL")}
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
      
      <NewsSection 
        symbol={selectedStock || (favoriteStocks?.[0]?.symbol ?? "AAPL")} 
      />
    </div>
  );
};

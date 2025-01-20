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

type TimeRange = "1D" | "1W" | "1M" | "1Y" | "3Y" | "5Y" | "10Y";

const StockMarketSection = () => {
  const session = useSession();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTimeRange, setSelectedTimeRange] = useState<TimeRange>("1M");
  const [selectedStock, setSelectedStock] = useState<string>("AAPL");
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

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    try {
      const response = await fetch(
        `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${searchQuery}&apikey=${import.meta.env.VITE_ALPHA_VANTAGE_API_KEY}`
      );
      const data = await response.json();

      if (data.bestMatches) {
        setSearchResults(data.bestMatches);
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: "No results found or API limit reached",
        });
      }
    } catch (error) {
      console.error("Search error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to search stocks",
      });
    }
  };

  const addToFavorites = async (symbol: string, companyName: string) => {
    if (!session?.user?.id) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please login to add favorites",
      });
      return;
    }

    try {
      const { error } = await supabase.from("favorite_stocks").insert([
        {
          user_id: session.user.id,
          symbol,
          company_name: companyName,
        },
      ]);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Added ${symbol} to favorites`,
      });
      refetchFavorites();
    } catch (error) {
      console.error("Error adding favorite:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add to favorites",
      });
    }
  };

  const removeFromFavorites = async (id: string) => {
    try {
      const { error } = await supabase
        .from("favorite_stocks")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Removed from favorites",
      });
      refetchFavorites();
    } catch (error) {
      console.error("Error removing favorite:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to remove from favorites",
      });
    }
  };

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
    </div>
  );
};

export default StockMarketSection;
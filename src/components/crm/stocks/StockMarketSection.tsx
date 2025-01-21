import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ChartSection } from "./ChartSection";
import { NewsSection } from "./NewsSection";
import { TrendingStocks } from "./TrendingStocks";
import { getFavorites, addFavorite, removeFavorite } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

type TimeRange = "1D" | "1W" | "1M" | "1Y";

export const StockMarketSection = () => {
  const [selectedTimeRange, setSelectedTimeRange] = useState<TimeRange>("1M");
  const [symbol, setSymbol] = useState("AAPL");
  const [favorites, setFavorites] = useState<Array<{ id: string; symbol: string; company_name: string }>>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      setIsLoading(true);
      const data = await getFavorites();
      setFavorites(data || []);
    } catch (error) {
      console.error('Error fetching favorites:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to fetch favorites",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToFavorites = async (symbol: string, companyName: string) => {
    try {
      const data = await addFavorite(symbol, companyName);
      setFavorites([...favorites, data]);
      toast({
        title: "Success",
        description: "Added to favorites",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to add to favorites",
        variant: "destructive",
      });
    }
  };

  const handleRemoveFromFavorites = async (id: string) => {
    try {
      await removeFavorite(id);
      setFavorites(favorites.filter(fav => fav.id !== id));
      toast({
        title: "Success",
        description: "Removed from favorites",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to remove from favorites",
        variant: "destructive",
      });
    }
  };

  const handleTimeRangeChange = (range: TimeRange) => {
    setSelectedTimeRange(range);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="md:col-span-2 space-y-4">
        <Card>
          <CardContent className="p-6">
            <ChartSection
              symbol={symbol}
              selectedTimeRange={selectedTimeRange}
              onTimeRangeChange={handleTimeRangeChange}
              onSymbolChange={setSymbol}
            />
          </CardContent>
        </Card>
        <NewsSection symbol={symbol} />
      </div>
      <div>
        <TrendingStocks
          onSelect={setSymbol}
          favorites={favorites}
          onAddToFavorites={handleAddToFavorites}
          onRemoveFromFavorites={handleRemoveFromFavorites}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};
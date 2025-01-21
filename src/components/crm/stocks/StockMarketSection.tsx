import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ChartSection } from "./ChartSection";
import { NewsSection } from "./NewsSection";
import { TrendingStocks } from "./TrendingStocks";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

type TimeRange = "1D" | "1W" | "1M" | "1Y";

export const StockMarketSection = () => {
  const [selectedTimeRange, setSelectedTimeRange] = useState<TimeRange>("1M");
  const [symbol, setSymbol] = useState("AAPL");
  const [favorites, setFavorites] = useState<Array<{ id: string; symbol: string; company_name: string }>>([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('stock_favorites')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;
      setFavorites(data || []);
    } catch (error) {
      console.error('Error fetching favorites:', error);
      toast({
        title: "Error",
        description: "Failed to fetch favorites",
        variant: "destructive",
      });
    }
  };

  const handleAddToFavorites = async (symbol: string, companyName: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Error",
          description: "Please login to add favorites",
          variant: "destructive",
        });
        return;
      }

      const { data, error } = await supabase
        .from('stock_favorites')
        .insert([
          { user_id: user.id, symbol, company_name: companyName }
        ])
        .select()
        .single();

      if (error) throw error;
      
      setFavorites([...favorites, data]);
      toast({
        title: "Success",
        description: "Added to favorites",
      });
    } catch (error) {
      console.error('Error adding favorite:', error);
      toast({
        title: "Error",
        description: "Failed to add to favorites",
        variant: "destructive",
      });
    }
  };

  const handleRemoveFromFavorites = async (id: string) => {
    try {
      const { error } = await supabase
        .from('stock_favorites')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setFavorites(favorites.filter(fav => fav.id !== id));
      toast({
        title: "Success",
        description: "Removed from favorites",
      });
    } catch (error) {
      console.error('Error removing favorite:', error);
      toast({
        title: "Error",
        description: "Failed to remove from favorites",
        variant: "destructive",
      });
    }
  };

  const handleTimeRangeChange = (range: string) => {
    setSelectedTimeRange(range as TimeRange);
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
        />
      </div>
    </div>
  );
};

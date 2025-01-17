import { useState, useEffect } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import StockChart from "./StockChart";  // Changed from { StockChart }
import { TrendingStocks } from "./TrendingStocks";
import { SearchResults } from "./SearchResults";

type TimeRange = "1D" | "1W" | "1M" | "1Y" | "3Y" | "5Y" | "10Y";

export const StockMarketSection = () => {
  const session = useSession();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTimeRange, setSelectedTimeRange] = useState<TimeRange>("1M");
  const [selectedStock, setSelectedStock] = useState<string | null>(null);
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

  // Set up real-time subscription for favorite stocks
  useEffect(() => {
    if (!session?.user?.id) return;

    const channel = supabase
      .channel('favorite-stocks-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'favorite_stocks',
          filter: `user_id=eq.${session.user.id}`,
        },
        () => {
          refetchFavorites();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [session?.user?.id, refetchFavorites]);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    try {
      const response = await fetch(
        `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${searchQuery}&apikey=${import.meta.env.VITE_ALPHA_VANTAGE_API_KEY}`
      );
      const data = await response.json();
      
      if (data.bestMatches) {
        setSearchResults(data.bestMatches);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to search stocks. Please try again.",
        variant: "destructive",
      });
    }
  };

  const addToFavorites = async (symbol: string, companyName: string) => {
    if (!session?.user?.id) {
      toast({
        title: "Authentication Required",
        description: "Please log in to add stocks to favorites.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase.from("favorite_stocks").insert({
        user_id: session.user.id,
        symbol,
        company_name: companyName,
      });

      if (error) {
        if (error.message.includes('User cannot have more than 10 favorite stocks')) {
          toast({
            title: "Limit Reached",
            description: "You can only add up to 10 favorite stocks.",
            variant: "destructive",
          });
        } else {
          throw error;
        }
        return;
      }

      toast({
        title: "Success",
        description: "Stock added to favorites.",
      });
      
      refetchFavorites();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add stock to favorites.",
        variant: "destructive",
      });
    }
  };

  const removeFromFavorites = async (stockId: string) => {
    try {
      const { error } = await supabase
        .from("favorite_stocks")
        .delete()
        .eq("id", stockId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Stock removed from favorites.",
      });
      
      refetchFavorites();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove stock from favorites.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Stock Market</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Search stocks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
            <Button onClick={handleSearch}>Search</Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2">
              <StockChart
                symbol={selectedStock || (favoriteStocks?.[0]?.symbol ?? "AAPL")}
                timeRange={selectedTimeRange}
              />
              <Tabs
                value={selectedTimeRange}
                onValueChange={(value) => setSelectedTimeRange(value as TimeRange)}
                className="mt-4"
              >
                <TabsList className="grid grid-cols-7 w-full">
                  <TabsTrigger value="1D">1D</TabsTrigger>
                  <TabsTrigger value="1W">1W</TabsTrigger>
                  <TabsTrigger value="1M">1M</TabsTrigger>
                  <TabsTrigger value="1Y">1Y</TabsTrigger>
                  <TabsTrigger value="3Y">3Y</TabsTrigger>
                  <TabsTrigger value="5Y">5Y</TabsTrigger>
                  <TabsTrigger value="10Y">10Y</TabsTrigger>
                </TabsList>
              </Tabs>
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
  );
};
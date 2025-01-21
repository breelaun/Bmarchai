import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Plus, X } from "lucide-react";
import { TrendingStocksProps } from "@/types/stock";

export const TrendingStocks = ({ 
  onSelect, 
  favorites,
  onAddToFavorites,
  onRemoveFromFavorites,
  isLoading 
}: TrendingStocksProps) => {
  const [trending, setTrending] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        // For demo purposes, we'll use some popular tech stocks
        setTrending([
          { symbol: "AAPL", name: "Apple Inc." },
          { symbol: "MSFT", name: "Microsoft Corporation" },
          { symbol: "GOOGL", name: "Alphabet Inc." },
          { symbol: "AMZN", name: "Amazon.com Inc." },
          { symbol: "META", name: "Meta Platforms Inc." },
        ]);
      } catch (error) {
        console.error("Error fetching trending stocks:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrending();
  }, []);

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-[200px]">
          <Loader2 className="h-8 w-8 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Trending & Favorites</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {/* Favorites Section */}
          {favorites.map((stock) => (
            <div
              key={stock.id}
              className="flex items-center justify-between p-2 bg-primary/5 rounded-lg"
            >
              <Button
                variant="ghost"
                className="flex-1 justify-start h-auto py-1"
                onClick={() => onSelect(stock.symbol)}
              >
                <div className="text-left">
                  <span className="font-bold block">{stock.symbol}</span>
                  <span className="text-sm text-muted-foreground">{stock.company_name}</span>
                </div>
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onRemoveFromFavorites(stock.id)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}

          {/* Trending Section */}
          {trending.map((stock) => {
            const isFavorite = favorites.some(f => f.symbol === stock.symbol);
            return (
              <div
                key={stock.symbol}
                className="flex items-center justify-between p-2 hover:bg-muted rounded-lg"
              >
                <Button
                  variant="ghost"
                  className="flex-1 justify-start h-auto py-1"
                  onClick={() => onSelect(stock.symbol)}
                >
                  <div className="text-left">
                    <span className="font-bold block">{stock.symbol}</span>
                    <span className="text-sm text-muted-foreground">{stock.name}</span>
                  </div>
                </Button>
                {!isFavorite && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onAddToFavorites(stock.symbol, stock.name)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

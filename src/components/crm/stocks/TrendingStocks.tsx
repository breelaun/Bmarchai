import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface TrendingStocksProps {
  onSelect: (symbol: string) => void;
}

export const TrendingStocks = ({ onSelect }: TrendingStocksProps) => {
  const [trending, setTrending] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        // For demo purposes, we'll use some popular tech stocks
        // In a real app, you'd want to fetch actual trending stocks
        setTrending([
          { symbol: "AAPL", name: "Apple Inc." },
          { symbol: "MSFT", name: "Microsoft Corporation" },
          { symbol: "GOOGL", name: "Alphabet Inc." },
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
      <CardHeader>
        <CardTitle className="text-lg">Trending Stocks</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {trending.map((stock) => (
            <Button
              key={stock.symbol}
              variant="outline"
              className="w-full justify-start"
              onClick={() => onSelect(stock.symbol)}
            >
              <span className="font-bold">{stock.symbol}</span>
              <span className="ml-2 text-muted-foreground">{stock.name}</span>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
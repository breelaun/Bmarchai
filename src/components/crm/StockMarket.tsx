import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useQuery } from "@tanstack/react-query";
import { fetchStockData } from "@/pages/api/stock-data";
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";
import { Bell, Plus, X, TrendingUp, TrendingDown, CandlestickChart, LineChart as LineChartIcon } from "lucide-react";

interface WatchlistItem {
  symbol: string;
  alertPrice: number | null;
}

interface StockStats {
  high: number;
  low: number;
  volume: number;
  priceChange: number;
  priceChangePercent: number;
}

export const StockMarket = () => {
  const { toast } = useToast();
  const [symbol, setSymbol] = useState("AAPL");
  const [inputSymbol, setInputSymbol] = useState("AAPL");
  const [timeRange, setTimeRange] = useState("1M");
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [alertPrice, setAlertPrice] = useState<string>("");
  const [chartType, setChartType] = useState<"line" | "candlestick">("line");
  const [stats, setStats] = useState<StockStats>({
    high: 0,
    low: 0,
    volume: 0,
    priceChange: 0,
    priceChangePercent: 0
  });

  const getDateRange = () => {
    const end = new Date();
    const start = new Date();
    
    switch (timeRange) {
      case "1D":
        start.setDate(end.getDate() - 1);
        break;
      case "1W":
        start.setDate(end.getDate() - 7);
        break;
      case "1M":
        start.setMonth(end.getMonth() - 1);
        break;
      case "1Y":
        start.setFullYear(end.getFullYear() - 1);
        break;
    }
    
    return {
      startDate: start.toISOString().split('T')[0],
      endDate: end.toISOString().split('T')[0]
    };
  };

  const { data: stockData, isLoading } = useQuery({
    queryKey: ['stock', symbol, timeRange],
    queryFn: () => {
      const { startDate, endDate } = getDateRange();
      return fetchStockData(symbol, startDate, endDate);
    },
    select: (data) => {
      if (!data?.results) return [];
      
      const prices = data.results.map((item: any) => item.c);
      const volumes = data.results.map((item: any) => item.v);
      const firstPrice = prices[0];
      const lastPrice = prices[prices.length - 1];
      
      setStats({
        high: Math.max(...prices),
        low: Math.min(...prices),
        volume: volumes.reduce((a: number, b: number) => a + b, 0),
        priceChange: lastPrice - firstPrice,
        priceChangePercent: ((lastPrice - firstPrice) / firstPrice) * 100
      });

      return data.results.map((item: any) => ({
        date: new Date(item.t).toLocaleDateString(),
        price: item.c,
        high: item.h,
        low: item.l,
        open: item.o,
        close: item.c,
        volume: item.v
      }));
    },
    retry: 1,
    staleTime: 30000 // Cache for 30 seconds
  });

  const handleSearch = () => {
    if (!inputSymbol) {
      toast({
        title: "Error",
        description: "Please enter a stock symbol",
        variant: "destructive"
      });
      return;
    }
    setSymbol(inputSymbol.toUpperCase());
  };

  const addToWatchlist = () => {
    if (watchlist.length >= 3) {
      toast({
        title: "Watchlist full",
        description: "You can only watch up to 3 stocks at a time.",
        variant: "destructive"
      });
      return;
    }
    
    if (!watchlist.find(item => item.symbol === symbol)) {
      setWatchlist([...watchlist, { symbol, alertPrice: null }]);
      toast({
        title: "Added to watchlist",
        description: `${symbol} has been added to your watchlist.`
      });
    }
  };

  const removeFromWatchlist = (symbolToRemove: string) => {
    setWatchlist(watchlist.filter(item => item.symbol !== symbolToRemove));
    toast({
      title: "Removed from watchlist",
      description: `${symbolToRemove} has been removed from your watchlist.`
    });
  };

  const setAlert = () => {
    const price = parseFloat(alertPrice);
    if (isNaN(price)) {
      toast({
        title: "Invalid price",
        description: "Please enter a valid number for the alert price.",
        variant: "destructive"
      });
      return;
    }

    setWatchlist(watchlist.map(item => 
      item.symbol === symbol 
        ? { ...item, alertPrice: price }
        : item
    ));

    toast({
      title: "Alert set",
      description: `You will be notified when ${symbol} reaches $${price}.`
    });
    setAlertPrice("");
  };

  useEffect(() => {
    if (stockData && stockData.length > 0) {
      const currentPrice = stockData[stockData.length - 1].price;
      watchlist.forEach(item => {
        if (item.alertPrice && 
            ((item.symbol === symbol) && 
             (currentPrice >= item.alertPrice))) {
          toast({
            title: "Price Alert!",
            description: `${item.symbol} has reached your target price of $${item.alertPrice}!`
          });
        }
      });
    }
  }, [stockData, watchlist, symbol, toast]);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Stock Market</CardTitle>
        <div className="flex flex-col gap-4">
          <div className="flex gap-2">
            <Input
              placeholder="Enter stock symbol (e.g., AAPL)"
              value={inputSymbol}
              onChange={(e) => setInputSymbol(e.target.value)}
              className="max-w-[200px]"
            />
            <Button onClick={handleSearch}>Search</Button>
            <Button variant="outline" onClick={addToWatchlist}>
              <Plus className="mr-2 h-4 w-4" />
              Watch
            </Button>
            <Button
              variant="outline"
              onClick={() => setChartType(chartType === "line" ? "candlestick" : "line")}
            >
              {chartType === "line" ? 
                <CandlestickChart className="mr-2 h-4 w-4" /> :
                <LineChartIcon className="mr-2 h-4 w-4" />
              }
              {chartType === "line" ? "Candlestick" : "Line"}
            </Button>
          </div>

          <div className="flex gap-4 items-center">
            <div className="flex gap-2">
              {["1D", "1W", "1M", "1Y"].map((range) => (
                <Button
                  key={range}
                  variant={timeRange === range ? "default" : "outline"}
                  onClick={() => setTimeRange(range)}
                  size="sm"
                >
                  {range}
                </Button>
              ))}
            </div>

            {!isLoading && stockData && stockData.length > 0 && (
              <div className="flex gap-4 ml-4">
                <Badge variant="outline" className="text-green-500">
                  <TrendingUp className="mr-1 h-4 w-4" />
                  High: ${stats.high.toFixed(2)}
                </Badge>
                <Badge variant="outline" className="text-red-500">
                  <TrendingDown className="mr-1 h-4 w-4" />
                  Low: ${stats.low.toFixed(2)}
                </Badge>
                <Badge variant="outline">
                  Vol: {(stats.volume / 1000000).toFixed(1)}M
                </Badge>
                <Badge 
                  variant="outline"
                  className={stats.priceChange >= 0 ? "text-green-500" : "text-red-500"}
                >
                  {stats.priceChange >= 0 ? "+" : ""}
                  {stats.priceChangePercent.toFixed(2)}%
                </Badge>
              </div>
            )}
          </div>

          {watchlist.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {watchlist.map((item) => (
                <Badge key={item.symbol} variant="secondary" className="flex items-center gap-2">
                  {item.symbol}
                  {item.alertPrice && (
                    <Bell className="h-3 w-3" />
                  )}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => removeFromWatchlist(item.symbol)}
                  />
                </Badge>
              ))}
            </div>
          )}

          <div className="flex gap-2">
            <Input
              type="number"
              placeholder="Set price alert"
              value={alertPrice}
              onChange={(e) => setAlertPrice(e.target.value)}
              className="max-w-[150px]"
            />
            <Button variant="outline" onClick={setAlert}>
              <Bell className="mr-2 h-4 w-4" />
              Set Alert
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="h-[400px] flex items-center justify-center">
            Loading...
          </div>
        ) : !stockData || stockData.length === 0 ? (
          <div className="h-[400px] flex items-center justify-center">
            No data available
          </div>
        ) : (
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              {chartType === "line" ? (
                <LineChart data={stockData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis domain={['auto', 'auto']} />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="price" 
                    stroke="#3b82f6" 
                    dot={false}
                    isAnimationActive={false}
                  />
                </LineChart>
              ) : (
                <LineChart data={stockData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis domain={['auto', 'auto']} />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="high" 
                    stroke="#22c55e" 
                    dot={false}
                    isAnimationActive={false}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="low" 
                    stroke="#ef4444" 
                    dot={false}
                    isAnimationActive={false}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="close" 
                    stroke="#3b82f6" 
                    dot={false}
                    isAnimationActive={false}
                  />
                </LineChart>
              )}
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StockMarket;
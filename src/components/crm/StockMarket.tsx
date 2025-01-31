import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell, Plus, Search, X } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface WatchlistItem {
  symbol: string;
  alertPrice: number | null;
}

interface StockMarketProps {
  defaultSymbol?: string;
}

const API_KEY = import.meta.env.VITE_POLYGON_API_KEY;

const fetchStockData = async (symbol: string, startDate: string, endDate: string) => {
  // Using Polygon.io API
  const url = `https://api.polygon.io/v2/aggs/ticker/${symbol}/range/1/day/${startDate}/${endDate}?apiKey=${API_KEY}`;
  
  const response = await fetch(url);
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error || 'Failed to fetch stock data');
  }
  
  if (data.status === "ERROR") {
    throw new Error(data.error || 'API Error occurred');
  }
  
  return data;
};

export const StockMarket = ({ defaultSymbol = "AAPL" }: StockMarketProps) => {
  const { toast } = useToast();
  const [symbol, setSymbol] = useState(defaultSymbol);
  const [inputSymbol, setInputSymbol] = useState(defaultSymbol);
  const [timeRange, setTimeRange] = useState("1M"); // 1D, 1W, 1M, 1Y
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [alertPrice, setAlertPrice] = useState<string>("");

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
    queryFn: async () => {
      const { startDate, endDate } = getDateRange();
      const data = await fetchStockData(symbol, startDate, endDate);
      
      if (!data.results) {
        throw new Error('No data available for this symbol');
      }
      
      return data.results.map((item: any) => ({
        date: new Date(item.t).toLocaleDateString(),
        price: item.c,
        volume: item.v,
        high: item.h,
        low: item.l,
        open: item.o
      }));
    },
    retry: 1,
    meta: {
      onError: (error: Error) => {
        toast({
          title: "Error",
          description: error.message || "Failed to fetch stock data",
          variant: "destructive"
        });
      }
    }
  });

  const handleSearch = () => {
    if (!inputSymbol) return;
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

  const getStockStats = () => {
    if (!stockData || stockData.length === 0) return null;
    
    const latest = stockData[stockData.length - 1];
    const first = stockData[0];
    const change = latest.price - first.price;
    const changePercent = (change / first.price) * 100;
    
    return {
      price: latest.price,
      change,
      changePercent,
      high: Math.max(...stockData.map(d => d.high)),
      low: Math.min(...stockData.map(d => d.low)),
    };
  };

  const stats = getStockStats();

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
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <Button onClick={handleSearch} disabled={isLoading}>
              <Search className="mr-2 h-4 w-4" />
              Search
            </Button>
            <Button variant="outline" onClick={addToWatchlist}>
              <Plus className="mr-2 h-4 w-4" />
              Watch
            </Button>
          </div>
          
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

          {watchlist.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {watchlist.map((item) => (
                <Badge 
                  key={item.symbol} 
                  variant="secondary" 
                  className="flex items-center gap-2 py-1 px-2"
                >
                  {item.symbol}
                  {item.alertPrice && (
                    <Bell 
                      className="h-3 w-3" 
                      aria-label={`Alert: $${item.alertPrice}`}
                    />
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

          {stats && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-2 border rounded">
                <div className="text-sm text-muted-foreground">Current</div>
                <div className="text-lg font-semibold">${stats.price.toFixed(2)}</div>
              </div>
              <div className="text-center p-2 border rounded">
                <div className="text-sm text-muted-foreground">Change</div>
                <div className={`text-lg font-semibold ${stats.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {stats.change >= 0 ? '+' : ''}{stats.change.toFixed(2)} ({stats.changePercent.toFixed(2)}%)
                </div>
              </div>
              <div className="text-center p-2 border rounded">
                <div className="text-sm text-muted-foreground">High</div>
                <div className="text-lg font-semibold">${stats.high.toFixed(2)}</div>
              </div>
              <div className="text-center p-2 border rounded">
                <div className="text-sm text-muted-foreground">Low</div>
                <div className="text-lg font-semibold">${stats.low.toFixed(2)}</div>
              </div>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="h-[400px] flex items-center justify-center">
            Loading...
          </div>
        ) : (
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stockData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date"
                  tick={{ fontSize: 12 }}
                  interval="preserveStartEnd"
                />
                <YAxis 
                  domain={['auto', 'auto']}
                  tick={{ fontSize: 12 }}
                />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="price" 
                  stroke="#3b82f6" 
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StockMarket;
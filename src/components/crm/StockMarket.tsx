import React, { useEffect, useState } from 'react';
import { useSession } from '@supabase/auth-helpers-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Star, Trash2 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface StockData {
  symbol: string;
  companyName: string;
  latestPrice: number;
  change: number;
  changePercent: number;
}

interface HistoricalData {
  date: string;
  close: number;
}

const DEFAULT_STOCK = 'AAPL';

const StockMarket = () => {
  const session = useSession();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentStock, setCurrentStock] = useState<StockData | null>(null);
  const [historicalData, setHistoricalData] = useState<HistoricalData[]>([]);
  const [favorites, setFavorites] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (session?.user?.id) {
      fetchFavorites();
    }
    fetchStock(DEFAULT_STOCK);
  }, [session?.user?.id]);

  const fetchHistoricalData = async (symbol: string) => {
    try {
      const endDate = new Date();
      const startDate = new Date();
      startDate.setMonth(startDate.getMonth() - 1);

      const response = await fetch(
        `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1d&range=1mo`
      );
      const data = await response.json();

      if (data.chart.result) {
        const timestamps = data.chart.result[0].timestamp;
        const quotes = data.chart.result[0].indicators.quote[0];

        const historicalPrices = timestamps.map((timestamp: number, index: number) => ({
          date: new Date(timestamp * 1000).toLocaleDateString(),
          close: Number(quotes.close[index].toFixed(2))
        }));

        setHistoricalData(historicalPrices);
      }
    } catch (error) {
      console.error('Error fetching historical data:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch historical stock data',
        variant: 'destructive',
      });
    }
  };

  const fetchStockQuote = async (symbol: string) => {
    try {
      const response = await fetch(
        `https://query1.finance.yahoo.com/v6/finance/quote?symbols=${symbol}`
      );
      const data = await response.json();

      if (data.quoteResponse?.result?.[0]) {
        const quote = data.quoteResponse.result[0];
        return {
          symbol: quote.symbol,
          companyName: quote.longName || quote.shortName,
          latestPrice: quote.regularMarketPrice,
          change: quote.regularMarketChange,
          changePercent: quote.regularMarketChangePercent,
        };
      }
      throw new Error('Stock not found');
    } catch (error) {
      throw new Error('Failed to fetch stock quote');
    }
  };

  const fetchStock = async (symbol: string) => {
    setIsLoading(true);
    try {
      const stockData = await fetchStockQuote(symbol);
      setCurrentStock(stockData);
      await fetchHistoricalData(symbol);
    } catch (error) {
      console.error('Error fetching stock:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch stock data',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchFavorites = async () => {
    try {
      const { data, error } = await supabase
        .from('favorite_stocks')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Fetch current prices for all favorites
      if (data) {
        const updatedFavorites = await Promise.all(
          data.map(async (favorite) => {
            try {
              const quote = await fetchStockQuote(favorite.symbol);
              return {
                ...favorite,
                currentPrice: quote.latestPrice,
                change: quote.change,
                changePercent: quote.changePercent,
              };
            } catch (error) {
              return favorite;
            }
          })
        );
        setFavorites(updatedFavorites);
      }
    } catch (error) {
      console.error('Error fetching favorites:', error);
      toast({
        title: 'Error',
        description: 'Failed to load favorite stocks',
        variant: 'destructive',
      });
    }
  };

  const handleSearch = () => {
    if (!searchTerm) return;
    fetchStock(searchTerm.toUpperCase());
  };

  const addToFavorites = async (stock: StockData) => {
    if (!session?.user?.id) {
      toast({
        title: 'Error',
        description: 'Please login to add favorites',
        variant: 'destructive',
      });
      return;
    }

    if (favorites.length >= 5) {
      toast({
        title: 'Error',
        description: 'Maximum of 5 favorite stocks allowed',
        variant: 'destructive',
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('favorite_stocks')
        .insert({
          symbol: stock.symbol,
          company_name: stock.companyName,
          user_id: session.user.id,
        });

      if (error) throw error;
      fetchFavorites();
      toast({
        title: 'Success',
        description: 'Stock added to favorites',
      });
    } catch (error) {
      console.error('Error adding favorite:', error);
      toast({
        title: 'Error',
        description: 'Failed to add stock',
        variant: 'destructive',
      });
    }
  };

  const removeFromFavorites = async (id: string) => {
    try {
      const { error } = await supabase
        .from('favorite_stocks')
        .delete()
        .eq('id', id);

      if (error) throw error;
      fetchFavorites();
      toast({
        title: 'Success',
        description: 'Stock removed from favorites',
      });
    } catch (error) {
      console.error('Error removing favorite:', error);
      toast({
        title: 'Error',
        description: 'Failed to remove stock',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Stock Market</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              placeholder="Search stocks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <Button onClick={handleSearch} disabled={isLoading}>
              <Search className="h-4 w-4" />
            </Button>
          </div>

          {currentStock && (
            <div className="mt-4">
              <div className="p-4 border rounded-lg">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-semibold text-lg">
                      {currentStock.symbol} - {currentStock.companyName}
                    </h3>
                    <p className="text-2xl font-bold">
                      ${currentStock.latestPrice.toFixed(2)}
                    </p>
                    <p
                      className={
                        currentStock.change >= 0 ? 'text-green-500' : 'text-red-500'
                      }
                    >
                      {currentStock.change > 0 ? '+' : ''}
                      {currentStock.change.toFixed(2)} (
                      {currentStock.changePercent.toFixed(2)}%)
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => addToFavorites(currentStock)}
                  >
                    <Star className="h-4 w-4" />
                  </Button>
                </div>

                {/* Stock Chart */}
                <div className="h-64 w-full mt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={historicalData}>
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
                        dataKey="close"
                        stroke="#8884d8"
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Favorite Stocks ({favorites.length}/5)</CardTitle>
        </CardHeader>
        <CardContent>
          {favorites.length === 0 ? (
            <p className="text-center text-muted-foreground py-4">
              No favorite stocks yet. Add some from the search results!
            </p>
          ) : (
            <div className="space-y-2">
              {favorites.map((favorite) => (
                <div
                  key={favorite.id}
                  className="flex items-center justify-between p-2 border rounded-lg"
                >
                  <div className="flex-1">
                    <p className="font-medium">{favorite.symbol}</p>
                    <p className="text-sm text-muted-foreground">
                      {favorite.company_name}
                    </p>
                  </div>
                  {favorite.currentPrice && (
                    <div className="text-right mr-4">
                      <p className="font-medium">
                        ${favorite.currentPrice.toFixed(2)}
                      </p>
                      <p
                        className={
                          favorite.change >= 0 ? 'text-green-500' : 'text-red-500'
                        }
                      >
                        {favorite.change > 0 ? '+' : ''}
                        {favorite.change.toFixed(2)} (
                        {favorite.changePercent.toFixed(2)}%)
                      </p>
                    </div>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeFromFavorites(favorite.id)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default StockMarket;

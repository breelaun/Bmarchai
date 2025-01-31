import React, { useEffect, useState } from 'react';
import { useSession } from '@supabase/auth-helpers-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Star, Trash2 } from 'lucide-react';

interface StockData {
  symbol: string;
  companyName: string;
  latestPrice: number;
  change: number;
  changePercent: number;
}

const DEFAULT_STOCK = 'AAPL'; // Default stock to show on load

const StockMarket = () => {
  const session = useSession();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentStock, setCurrentStock] = useState<StockData | null>(null);
  const [favorites, setFavorites] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (session?.user?.id) {
      fetchFavorites();
    }
    fetchStock(DEFAULT_STOCK); // Load default stock chart on mount
  }, [session?.user?.id]);

  const fetchFavorites = async () => {
    try {
      const { data, error } = await supabase
        .from('favorite_stocks')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setFavorites(data || []);
    } catch (error) {
      console.error('Error fetching favorites:', error);
      toast({
        title: 'Error',
        description: 'Failed to load favorite stocks',
        variant: 'destructive',
      });
    }
  };

  const fetchStock = async (symbol: string) => {
    setIsLoading(true);
    try {
      // Mock API call - replace with real stock API
      const mockData: StockData = {
        symbol,
        companyName: 'Sample Company',
        latestPrice: 150.50,
        change: 2.50,
        changePercent: 1.67,
      };
      setCurrentStock(mockData);
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

  const handleSearch = () => {
    if (!searchTerm) return;
    fetchStock(searchTerm.toUpperCase());
  };

  const addToFavorites = async (stock: StockData) => {
    if (!session?.user?.id) {
      toast({ title: 'Error', description: 'Please login to add favorites', variant: 'destructive' });
      return;
    }
    try {
      const { error } = await supabase
        .from('favorite_stocks')
        .insert({ symbol: stock.symbol, company_name: stock.companyName, user_id: session.user.id });

      if (error) throw error;
      fetchFavorites();
      toast({ title: 'Success', description: 'Stock added to favorites' });
    } catch (error) {
      console.error('Error adding favorite:', error);
      toast({ title: 'Error', description: 'Failed to add stock', variant: 'destructive' });
    }
  };

  const removeFromFavorites = async (id: string) => {
    try {
      const { error } = await supabase.from('favorite_stocks').delete().eq('id', id);
      if (error) throw error;
      fetchFavorites();
      toast({ title: 'Success', description: 'Stock removed from favorites' });
    } catch (error) {
      console.error('Error removing favorite:', error);
      toast({ title: 'Error', description: 'Failed to remove stock', variant: 'destructive' });
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

          {/* Stock Chart - Always Visible */}
          {currentStock && (
            <div className="mt-4 p-4 border rounded-lg">
              <h3 className="font-semibold">{currentStock.symbol} - {currentStock.companyName}</h3>
              <p className="text-lg font-bold">${currentStock.latestPrice}</p>
              <p className={currentStock.change >= 0 ? 'text-green-500' : 'text-red-500'}>
                {currentStock.change > 0 ? '+' : ''}{currentStock.change} ({currentStock.changePercent}%)
              </p>
              <Button variant="ghost" size="icon" onClick={() => addToFavorites(currentStock)}>
                <Star className="h-4 w-4" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Favorite Stocks */}
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
                <div key={favorite.id} className="flex items-center justify-between p-2 border rounded-lg">
                  <div>
                    <p className="font-medium">{favorite.symbol}</p>
                    <p className="text-sm text-muted-foreground">{favorite.company_name}</p>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => removeFromFavorites(favorite.id)}>
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

// src/components/crm/stocks/StockMarketSection.tsx
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import SearchBar from './SearchBar';
import SearchResults from './SearchResults';
import StockChart from './StockChart';
import TimeRangeSelector from './TimeRangeSelector';
import FavoriteStocks from './FavoriteStocks';
import TrendingStocks from './TrendingStocks';
import NewsSection from './NewsSection';

export const StockMarketSection = () => {
  const [selectedStock, setSelectedStock] = useState<string>('AAPL');
  const [timeRange, setTimeRange] = useState<string>('1Y');

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Stock Market Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <SearchBar onStockSelect={setSelectedStock} />
            <TimeRangeSelector value={timeRange} onChange={setTimeRange} />
            <StockChart symbol={selectedStock} timeRange={timeRange} />
          </CardContent>
        </Card>
        <NewsSection symbol={selectedStock} />
      </div>
      <div className="space-y-6">
        <FavoriteStocks onSelect={setSelectedStock} />
        <TrendingStocks onSelect={setSelectedStock} />
        <SearchResults onSelect={setSelectedStock} />
      </div>
    </div>
  );
};

// src/components/crm/stocks/SearchBar.tsx
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

interface SearchBarProps {
  onStockSelect: (symbol: string) => void;
}

const SearchBar = ({ onStockSelect }: SearchBarProps) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query) onStockSelect(query.toUpperCase());
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
      <Input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Enter stock symbol (e.g. AAPL)"
        className="flex-1"
      />
      <Button type="submit">
        <Search className="h-4 w-4 mr-2" />
        Search
      </Button>
    </form>
  );
};

export default SearchBar;

// src/components/crm/stocks/TimeRangeSelector.tsx
import { Button } from '@/components/ui/button';

interface TimeRangeSelectorProps {
  value: string;
  onChange: (range: string) => void;
}

const TimeRangeSelector = ({ value, onChange }: TimeRangeSelectorProps) => {
  const ranges = [
    { label: '1D', value: '1D' },
    { label: '1W', value: '1W' },
    { label: '1M', value: '1M' },
    { label: '3M', value: '3M' },
    { label: '1Y', value: '1Y' },
    { label: '5Y', value: '5Y' },
  ];

  return (
    <div className="flex gap-2 mb-4">
      {ranges.map((range) => (
        <Button
          key={range.value}
          variant={value === range.value ? 'default' : 'outline'}
          onClick={() => onChange(range.value)}
          size="sm"
        >
          {range.label}
        </Button>
      ))}
    </div>
  );
};

export default TimeRangeSelector;

// src/components/crm/stocks/FavoriteStocks.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface FavoriteStocksProps {
  onSelect: (symbol: string) => void;
}

const FavoriteStocks = ({ onSelect }: FavoriteStocksProps) => {
  const favorites = [
    { symbol: 'AAPL', name: 'Apple Inc.' },
    { symbol: 'MSFT', name: 'Microsoft Corporation' },
    { symbol: 'GOOGL', name: 'Alphabet Inc.' },
    { symbol: 'AMZN', name: 'Amazon.com Inc.' },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Favorites</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {favorites.map((stock) => (
            <button
              key={stock.symbol}
              onClick={() => onSelect(stock.symbol)}
              className="w-full text-left p-2 hover:bg-muted rounded-md transition-colors"
            >
              <div className="font-medium">{stock.symbol}</div>
              <div className="text-sm text-muted-foreground">{stock.name}</div>
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default FavoriteStocks;

// src/components/crm/stocks/TrendingStocks.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface TrendingStocksProps {
  onSelect: (symbol: string) => void;
}

const TrendingStocks = ({ onSelect }: TrendingStocksProps) => {
  const trending = [
    { symbol: 'NVDA', name: 'NVIDIA Corporation', change: 2.5 },
    { symbol: 'TSLA', name: 'Tesla, Inc.', change: -1.8 },
    { symbol: 'META', name: 'Meta Platforms Inc.', change: 1.2 },
    { symbol: 'AMD', name: 'Advanced Micro Devices', change: -0.8 },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Trending</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {trending.map((stock) => (
            <button
              key={stock.symbol}
              onClick={() => onSelect(stock.symbol)}
              className="w-full text-left p-2 hover:bg-muted rounded-md transition-colors"
            >
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-medium">{stock.symbol}</div>
                  <div className="text-sm text-muted-foreground">{stock.name}</div>
                </div>
                <div className={`flex items-center ${stock.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {stock.change >= 0 ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingDown className="h-4 w-4 mr-1" />}
                  {Math.abs(stock.change)}%
                </div>
              </div>
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TrendingStocks;

// src/components/crm/stocks/NewsSection.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ExternalLink } from 'lucide-react';

interface NewsSectionProps {
  symbol: string;
}

const NewsSection = ({ symbol }: NewsSectionProps) => {
  // This would typically fetch real news data
  const news = [
    {
      id: 1,
      title: `Latest news about ${symbol}`,
      source: 'Financial Times',
      url: '#',
      time: '2 hours ago',
    },
    {
      id: 2,
      title: `${symbol} quarterly earnings report`,
      source: 'Reuters',
      url: '#',
      time: '4 hours ago',
    },
    // Add more news items
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Latest News</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {news.map((item) => (
            <a
              key={item.id}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block p-3 hover:bg-muted rounded-md transition-colors"
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-medium">{item.title}</div>
                  <div className="text-sm text-muted-foreground">
                    {item.source} • {item.time}
                  </div>
                </div>
                <ExternalLink className="h-4 w-4 flex-shrink-0" />
              </div>
            </a>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default NewsSection;

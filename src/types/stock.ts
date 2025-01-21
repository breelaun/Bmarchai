export type TimeRange = "1D" | "1W" | "1M" | "1Y";

export interface StockData {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
}

export interface NewsItem {
  title: string;
  url: string;
  publishedAt: string;
  source: {
    name: string;
  };
  summary: string;
}

export interface ChartData {
  labels: string[];
  prices: number[];
}

export interface StockChartProps {
  symbol: string;
  timeRange: TimeRange;
}

export interface TrendingStocksProps {
  onSelect: (symbol: string) => void;
  favorites: Array<{ id: string; symbol: string; company_name: string }>;
  onAddToFavorites: (symbol: string, companyName: string) => Promise<void>;
  onRemoveFromFavorites: (id: string) => Promise<void>;
  isLoading: boolean;
}
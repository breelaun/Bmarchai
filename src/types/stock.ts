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

export interface TimeRange {
  start: string;
  end: string;
}

export interface ChartData {
  labels: string[];
  prices: number[];
}

export interface StockChartProps {
  symbol: string;
}
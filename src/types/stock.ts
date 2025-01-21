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

export type TimeRange = "1D" | "1W" | "1M" | "1Y";

export interface ChartData {
  labels: string[];
  prices: number[];
}

export interface StockChartProps {
  symbol: string;
  timeRange: TimeRange;
}
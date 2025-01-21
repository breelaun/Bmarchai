// Basic types for stock data
export type TimeRange = "1D" | "1W" | "1M" | "1Y";

// Props interfaces
export interface StockChartProps {
  symbol: string;
  timeRange: TimeRange;
}

export interface ChartSectionProps {
  symbol: string;
  selectedTimeRange: TimeRange;
  onTimeRangeChange: (range: TimeRange) => void;
  onSymbolChange: (symbol: string) => void;
}

// Data structure interfaces
export interface StockDataPoint {
  date: string;
  price: number;
}

export interface APIResponse {
  "Time Series (5min)"?: { [key: string]: StockValues };
  "Time Series (Daily)"?: { [key: string]: StockValues };
  "Weekly Time Series"?: { [key: string]: StockValues };
  "Error Message"?: string;
  "Note"?: string;
}

export interface StockValues {
  "1. open": string;
  "2. high": string;
  "3. low": string;
  "4. close": string;
  "5. volume": string;
}

// Error handling
export interface StockError {
  message: string;
  code?: string;
}

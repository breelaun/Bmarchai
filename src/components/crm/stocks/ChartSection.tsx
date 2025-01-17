import StockChart from "./StockChart";
import { TimeRangeSelector } from "./TimeRangeSelector";

type TimeRange = "1D" | "1W" | "1M" | "1Y" | "3Y" | "5Y" | "10Y";

interface ChartSectionProps {
  symbol: string;
  selectedTimeRange: TimeRange;
  onTimeRangeChange: (value: TimeRange) => void;
}

export const ChartSection = ({ 
  symbol, 
  selectedTimeRange, 
  onTimeRangeChange 
}: ChartSectionProps) => {
  return (
    <div>
      <StockChart
        symbol={symbol}
        timeRange={selectedTimeRange}
      />
      <TimeRangeSelector
        selectedTimeRange={selectedTimeRange}
        onTimeRangeChange={onTimeRangeChange}
      />
    </div>
  );
};
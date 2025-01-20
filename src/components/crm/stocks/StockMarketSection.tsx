import StockChart from "./StockChart";
import { TimeRangeSelector } from "./TimeRangeSelector";
import { NewsSection } from "./NewsSection";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

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
  const scrollToNews = () => {
    const newsSection = document.getElementById('news-section');
    if (newsSection) {
      newsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="space-y-4">
      <StockChart
        symbol={symbol}
        timeRange={selectedTimeRange}
      />
      <TimeRangeSelector
        selectedTimeRange={selectedTimeRange}
        onTimeRangeChange={onTimeRangeChange}
      />
      <Button 
        variant="ghost" 
        onClick={scrollToNews}
        className="w-full text-sm text-muted-foreground hover:text-primary flex items-center gap-2 py-1"
      >
        View latest {symbol} news <ChevronDown className="h-4 w-4" />
      </Button>
    </div>
  );
};

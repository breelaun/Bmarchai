import { StockChart } from "./StockChart";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

interface ChartSectionProps {
  symbol: string;
  selectedTimeRange: string;
  onTimeRangeChange: (range: string) => void;
  onSymbolChange: (symbol: string) => void;
}

export const ChartSection = ({
  symbol,
  selectedTimeRange,
  onTimeRangeChange,
  onSymbolChange,
}: ChartSectionProps) => {
  const [inputSymbol, setInputSymbol] = useState(symbol);

  const handleSymbolSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSymbolChange(inputSymbol.toUpperCase());
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSymbolSubmit} className="flex gap-2">
        <Input
          value={inputSymbol}
          onChange={(e) => setInputSymbol(e.target.value)}
          placeholder="Enter stock symbol"
          className="max-w-[200px]"
        />
        <Button type="submit">Update</Button>
      </form>
      
      <div className="flex gap-2">
        {["1D", "1W", "1M", "1Y"].map((range) => (
          <Button
            key={range}
            variant={selectedTimeRange === range ? "default" : "outline"}
            onClick={() => onTimeRangeChange(range)}
          >
            {range}
          </Button>
        ))}
      </div>

      <StockChart symbol={symbol} timeRange={selectedTimeRange} />
    </div>
  );
};
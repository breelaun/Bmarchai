import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ChartSection } from "./ChartSection";

type TimeRange = "1D" | "1W" | "1M" | "1Y";

export const StockMarketSection = () => {
  const [selectedTimeRange, setSelectedTimeRange] = useState<TimeRange>("1M");
  const [symbol, setSymbol] = useState("AAPL");

  const handleTimeRangeChange = (range: string) => {
    setSelectedTimeRange(range as TimeRange);
  };

  return (
    <Card>
      <CardContent className="p-6">
        <ChartSection
          symbol={symbol}
          selectedTimeRange={selectedTimeRange}
          onTimeRangeChange={handleTimeRangeChange}
          onSymbolChange={setSymbol}
        />
      </CardContent>
    </Card>
  );
};
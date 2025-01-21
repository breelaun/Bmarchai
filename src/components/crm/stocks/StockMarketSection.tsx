import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ChartSection } from "./ChartSection";
import { TimeRange } from "@/types/stock";

export const StockMarketSection = () => {
  const [selectedTimeRange, setSelectedTimeRange] = useState<TimeRange>("1M");
  const [symbol, setSymbol] = useState("AAPL");

  const handleTimeRangeChange = (range: TimeRange) => {
    setSelectedTimeRange(range);
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
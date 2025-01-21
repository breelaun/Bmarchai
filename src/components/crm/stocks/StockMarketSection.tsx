import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ChartSection } from "./ChartSection";

type TimeRange = "1D" | "1W" | "1M" | "1Y" | "3Y" | "5Y" | "10Y";

export const StockMarketSection = () => {
  const [selectedTimeRange, setSelectedTimeRange] = useState<TimeRange>("1M");
  const [symbol, setSymbol] = useState("AAPL");

  return (
    <Card>
      <CardContent className="p-6">
        <ChartSection
          symbol={symbol}
          selectedTimeRange={selectedTimeRange}
          onTimeRangeChange={setSelectedTimeRange}
        />
      </CardContent>
    </Card>
  );
};
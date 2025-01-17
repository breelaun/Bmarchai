import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

type TimeRange = "1D" | "1W" | "1M" | "1Y" | "3Y" | "5Y" | "10Y";

interface TimeRangeSelectorProps {
  selectedTimeRange: TimeRange;
  onTimeRangeChange: (value: TimeRange) => void;
}

export const TimeRangeSelector = ({ selectedTimeRange, onTimeRangeChange }: TimeRangeSelectorProps) => {
  return (
    <Tabs
      value={selectedTimeRange}
      onValueChange={(value) => onTimeRangeChange(value as TimeRange)}
      className="mt-4"
    >
      <TabsList className="grid grid-cols-7 w-full">
        <TabsTrigger value="1D">1D</TabsTrigger>
        <TabsTrigger value="1W">1W</TabsTrigger>
        <TabsTrigger value="1M">1M</TabsTrigger>
        <TabsTrigger value="1Y">1Y</TabsTrigger>
        <TabsTrigger value="3Y">3Y</TabsTrigger>
        <TabsTrigger value="5Y">5Y</TabsTrigger>
        <TabsTrigger value="10Y">10Y</TabsTrigger>
      </TabsList>
    </Tabs>
  );
};
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { format } from "date-fns";

interface StockChartProps {
  symbol: string;
  timeRange: string;
}

const getTimeSeriesFunction = (timeRange: string) => {
  switch (timeRange) {
    case "1D":
      return "TIME_SERIES_INTRADAY";
    case "1W":
    case "1M":
      return "TIME_SERIES_DAILY";
    default:
      return "TIME_SERIES_WEEKLY";
  }
};

const getInterval = (timeRange: string) => {
  if (timeRange === "1D") return "&interval=5min";
  return "";
};

const getDataKey = (timeRange: string) => {
  switch (timeRange) {
    case "1D":
      return "Time Series (5min)";
    case "1W":
    case "1M":
      return "Time Series (Daily)";
    default:
      return "Weekly Time Series";
  }
};

const filterDataByTimeRange = (data: any[], timeRange: string) => {
  const now = new Date();
  const filtered = data.filter(item => {
    const itemDate = new Date(item.date);
    switch (timeRange) {
      case "1D":
        return itemDate >= new Date(now.setDate(now.getDate() - 1));
      case "1W":
        return itemDate >= new Date(now.setDate(now.getDate() - 7));
      case "1M":
        return itemDate >= new Date(now.setMonth(now.getMonth() - 1));
      case "1Y":
        return itemDate >= new Date(now.setFullYear(now.getFullYear() - 1));
      case "3Y":
        return itemDate >= new Date(now.setFullYear(now.getFullYear() - 3));
      case "5Y":
        return itemDate >= new Date(now.setFullYear(now.getFullYear() - 5));
      case "10Y":
        return itemDate >= new Date(now.setFullYear(now.getFullYear() - 10));
      default:
        return true;
    }
  });
  return filtered;
};

const StockChart = ({ symbol, timeRange }: StockChartProps) => {
  const [data, setData] = useState<{ date: string; price: number; }[]>([]);
  const [averagePrice, setAveragePrice] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStockData = async () => {
      setLoading(true);
      setError(null);
      try {
        const function_name = getTimeSeriesFunction(timeRange);
        const interval = getInterval(timeRange);
        const response = await fetch(
          `https://www.alphavantage.co/query?function=${function_name}&symbol=${symbol}${interval}&apikey=${import.meta.env.KUH2RAIUOSQITTNR}`
        );
        const result = await response.json();

        if (result["Error Message"]) {
          throw new Error(result["Error Message"]);
        }

        const timeSeriesData = result[getDataKey(timeRange)];
        if (!timeSeriesData) {
          throw new Error("No data available");
        }

        const processedData = Object.entries(timeSeriesData).map(([date, values]: [string, any]) => ({
          date,
          price: parseFloat(values["4. close"])
        })).reverse();

        const filteredData = filterDataByTimeRange(processedData, timeRange);
        setData(filteredData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch stock data");
        console.error("Error fetching stock data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStockData();
  }, [symbol, timeRange]);

  useEffect(() => {
    if (data.length > 0) {
      const avg = data.reduce((sum, item) => sum + item.price, 0) / data.length;
      setAveragePrice(Number(avg.toFixed(2)));
    }
  }, [data]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <Card className="bg-background/95 backdrop-blur-sm border shadow-lg">
          <CardContent className="p-3">
            <p className="font-semibold">{format(new Date(label), "PPP")}</p>
            <p className="text-primary">
              ${Number(payload[0].value).toFixed(2)}
            </p>
          </CardContent>
        </Card>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-[400px] text-destructive">
          {error}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>{symbol} Price History</span>
          <span className="text-sm text-muted-foreground">
            Avg: ${averagePrice}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="hsl(var(--primary))"
                    stopOpacity={0.3}
                  />
                  <stop
                    offset="95%"
                    stopColor="hsl(var(--primary))"
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                className="stroke-muted/30"
              />
              <XAxis
                dataKey="date"
                tickFormatter={(date) => format(new Date(date), "MMM d")}
                className="text-xs"
              />
              <YAxis
                domain={["dataMin - 1", "dataMax + 1"]}
                className="text-xs"
                tickFormatter={(value) => `$${value}`}
              />
              <Tooltip content={<CustomTooltip />} />
              <ReferenceLine
                y={averagePrice}
                stroke="hsl(var(--primary))"
                strokeDasharray="3 3"
                label={{
                  value: "Average",
                  position: "right",
                  className: "text-xs text-primary fill-primary",
                }}
              />
              <Area
                type="monotone"
                dataKey="price"
                stroke="hsl(var(--primary))"
                fillOpacity={1}
                fill="url(#colorPrice)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default StockChart;

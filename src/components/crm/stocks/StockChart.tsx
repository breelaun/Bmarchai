import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer,
  CartesianGrid,
  ReferenceLine 
} from "recharts";
import { Loader2 } from "lucide-react";
import { format } from "date-fns";

interface StockChartProps {
  symbol: string;
  timeRange: string;
}

export const StockChart = ({ symbol, timeRange }: StockChartProps) => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [previousClose, setPreviousClose] = useState<number | null>(null);

  useEffect(() => {
    const fetchStockData = async () => {
      setLoading(true);
      try {
        let interval = "60min";
        let function_name = "TIME_SERIES_INTRADAY";

        switch (timeRange) {
          case "1D":
            interval = "5min";
            function_name = "TIME_SERIES_INTRADAY";
            break;
          case "1W":
            interval = "60min";
            function_name = "TIME_SERIES_INTRADAY";
            break;
          case "1M":
          case "1Y":
          case "3Y":
          case "5Y":
          case "10Y":
            function_name = "TIME_SERIES_DAILY";
            break;
        }

        const response = await fetch(
          `https://www.alphavantage.co/query?function=${function_name}&symbol=${symbol}&interval=${interval}&apikey=${import.meta.env.VITE_ALPHA_VANTAGE_API_KEY}`
        );
        
        const result = await response.json();
        
        // Transform the data for the chart
        const timeSeriesKey = Object.keys(result).find(key => key.includes("Time Series"));
        if (timeSeriesKey) {
          const transformedData = Object.entries(result[timeSeriesKey]).map(([date, values]: [string, any]) => ({
            date,
            value: parseFloat(values["4. close"]),
          }));

          // Set previous close for reference line
          if (transformedData.length > 0) {
            setPreviousClose(transformedData[0].value);
          }

          setData(transformedData.reverse());
        }
      } catch (error) {
        console.error("Error fetching stock data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (symbol) {
      fetchStockData();
    }
  }, [symbol, timeRange]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border border-border p-2 rounded-lg shadow-lg">
          <p className="text-sm font-medium">
            {format(new Date(label), "PPp")}
          </p>
          <p className="text-sm text-muted-foreground">
            Price: ${payload[0].value.toFixed(2)}
          </p>
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <Card>
      <CardContent className="p-4">
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                tickFormatter={(date) => format(new Date(date), "MMM d")}
              />
              <YAxis 
                domain={['auto', 'auto']}
                tickFormatter={(value) => `$${value.toFixed(2)}`}
              />
              <Tooltip content={<CustomTooltip />} />
              {previousClose && (
                <ReferenceLine 
                  y={previousClose} 
                  stroke="#888" 
                  strokeDasharray="3 3" 
                  label={{ value: 'Previous Close', position: 'right' }} 
                />
              )}
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="#3b82f6" 
                dot={false}
                strokeWidth={2}
                animationDuration={500}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
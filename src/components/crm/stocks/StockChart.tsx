import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Loader2 } from "lucide-react";

interface StockChartProps {
  symbol: string;
  timeRange: string;
}

export const StockChart = ({ symbol, timeRange }: StockChartProps) => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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
          setData(transformedData);
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
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="#3b82f6" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
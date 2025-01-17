import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  data: {
    date: string;
    price: number;
  }[];
  symbol: string;
}

const StockChart = ({ data, symbol }: StockChartProps) => {
  const [averagePrice, setAveragePrice] = useState<number>(0);

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
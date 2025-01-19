import { useEffect, useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import {
  ComposedChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Scatter,
  Bar,
} from "recharts";
import { format, fromUnixTime } from "date-fns";

interface StockChartProps {
  symbol: string;
  timeRange: string;
}

interface NewsItem {
  datetime: number;
  headline: string;
  url: string;
  summary: string;
}

interface PriceData {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  hasNews?: boolean;
  newsCount?: number;
}

const StockChart = ({ symbol, timeRange }: StockChartProps) => {
  const [data, setData] = useState<PriceData[]>([]);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    const connectWebSocket = () => {
      // Close existing connection if any
      if (ws.current) {
        ws.current.close();
      }

      // Create new WebSocket connection
      ws.current = new WebSocket('wss://ws.finnhub.io?token=' + import.meta.env.VITE_FINNHUB_API_KEY);

      ws.current.onopen = () => {
        console.log('WebSocket Connected');
        // Subscribe to the symbol
        if (ws.current) {
          ws.current.send(JSON.stringify({
            'type': 'subscribe',
            'symbol': symbol
          }));
        }
      };

      ws.current.onmessage = (event) => {
        const message = JSON.parse(event.data);
        
        if (message.type === 'trade') {
          // Update the latest price data
          const trade = message.data[0];
          setData(prevData => {
            const newData = [...prevData];
            const lastIndex = newData.length - 1;
            
            if (lastIndex >= 0) {
              newData[lastIndex] = {
                ...newData[lastIndex],
                close: trade.p,
                high: Math.max(newData[lastIndex].high, trade.p),
                low: Math.min(newData[lastIndex].low, trade.p),
                volume: newData[lastIndex].volume + trade.v
              };
            }
            
            return newData;
          });
        }
      };

      ws.current.onerror = (error) => {
        console.error('WebSocket Error:', error);
        setError('WebSocket connection error');
      };

      ws.current.onclose = () => {
        console.log('WebSocket Disconnected');
      };
    };

    const fetchInitialData = async () => {
      setLoading(true);
      setError(null);
      try {
        const now = Math.floor(Date.now() / 1000);
        const oneMonthAgo = now - (30 * 24 * 60 * 60);

        const response = await fetch(
          `https://finnhub.io/api/v1/stock/candle?symbol=${symbol}&resolution=D&from=${oneMonthAgo}&to=${now}`,
          {
            headers: {
              'X-Finnhub-Token': import.meta.env.VITE_FINNHUB_API_KEY
            }
          }
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch data: ${response.statusText}`);
        }

        const data = await response.json();

        if (data.s === 'no_data') {
          throw new Error('No data available for this symbol');
        }

        const processedData = data.t.map((timestamp: number, index: number) => ({
          date: format(fromUnixTime(timestamp), 'yyyy-MM-dd'),
          open: data.o[index],
          high: data.h[index],
          low: data.l[index],
          close: data.c[index],
          volume: data.v[index],
        }));

        setData(processedData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch data");
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
    connectWebSocket();

    // Cleanup function
    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, [symbol]);

  // Rest of your component remains the same (CustomTooltip, renderBar, etc.)
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const priceData = payload[0].payload;
      const isGreen = priceData.close > priceData.open;
      
      return (
        <Card className="bg-gray-900/95 backdrop-blur-sm border border-gray-800 shadow-lg max-w-md">
          <CardContent className="p-3 space-y-2">
            <p className="font-semibold text-gray-300">
              {format(new Date(priceData.date), "PPP")}
            </p>
            <div className="space-y-1 text-sm">
              <p className="text-white">
                Open: <span className="text-gray-300">${priceData.open.toFixed(2)}</span>
              </p>
              <p className="text-white">
                Close: <span className={`${isGreen ? 'text-[#26a69a]' : 'text-[#ef5350]'}`}>
                  ${priceData.close.toFixed(2)}
                </span>
              </p>
              <p className="text-white">
                High: <span className="text-gray-300">${priceData.high.toFixed(2)}</span>
              </p>
              <p className="text-white">
                Low: <span className="text-gray-300">${priceData.low.toFixed(2)}</span>
              </p>
            </div>
          </CardContent>
        </Card>
      );
    }
    return null;
  };

  const renderBar = (props: any) => {
    const { fill, x, y, width, height } = props;
    const isGreen = props.close > props.open;
    return (
      <g>
        <rect
          x={x}
          y={y}
          width={width}
          height={height}
          fill={isGreen ? "#26a69a" : "#ef5350"}
        />
      </g>
    );
  };

  if (loading) {
    return (
      <Card className="bg-gray-900 border-gray-800">
        <CardContent className="flex items-center justify-center h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-[#f7bd00]" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="bg-gray-900 border-gray-800">
        <CardContent className="flex items-center justify-center h-[400px] text-red-500">
          {error}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gray-900 border-gray-800">
      <CardHeader>
        <CardTitle className="flex justify-between items-center text-white">
          <span>{symbol}</span>
          <span className={`text-sm ${
            data[data.length - 1]?.close > data[data.length - 1]?.open
              ? 'text-[#26a69a]'
              : 'text-[#ef5350]'
          }`}>
            ${data[data.length - 1]?.close.toFixed(2)}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={data}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#2e2e2e"
              />
              <XAxis
                dataKey="date"
                tickFormatter={(date) => format(new Date(date), "MMM d")}
                stroke="#666666"
              />
              <YAxis
                domain={["dataMin", "dataMax"]}
                stroke="#666666"
                tickFormatter={(value) => `$${value}`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                dataKey="close"
                fill="#26a69a"
                shape={renderBar}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default StockChart;

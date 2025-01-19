import { useEffect, useState } from "react";
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
import { format } from "date-fns";

interface StockChartProps {
  symbol: string;
  timeRange: string;
}

interface NewsItem {
  date: string;
  title: string;
  url: string;
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

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch stock data
        const priceResponse = await fetch(
          `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${import.meta.env.KUH2RAIUOSQITTNR}`
        );
        const priceData = await priceResponse.json();

        // Fetch news data
        const newsResponse = await fetch(
          `https://api.newdata.io/v1/news/company?symbol=${symbol}&apikey=${import.meta.env.pub_65893031f0b7b52587ee043e4a9359e7cf604}`
        );
        const newsData = await newsResponse.json();

        // Process price data
        const timeSeriesData = priceData["Time Series (Daily)"];
        const processedPriceData = Object.entries(timeSeriesData).map(([date, values]: [string, any]) => ({
          date,
          open: parseFloat(values["1. open"]),
          high: parseFloat(values["2. high"]),
          low: parseFloat(values["3. low"]),
          close: parseFloat(values["4. close"]),
          volume: parseFloat(values["5. volume"]),
        })).reverse();

        // Process news data and merge with price data
        const newsItems = newsData.data.map((item: any) => ({
          date: format(new Date(item.published_at), "yyyy-MM-dd"),
          title: item.title,
          url: item.url,
        }));

        // Add news indicators to price data
        const enrichedData = processedPriceData.map(pricePoint => {
          const dayNews = newsItems.filter(news => news.date === pricePoint.date);
          return {
            ...pricePoint,
            hasNews: dayNews.length > 0,
            newsCount: dayNews.length,
          };
        });

        setData(enrichedData);
        setNews(newsItems);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch data");
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [symbol, timeRange]);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const priceData = payload[0].payload;
      const newsForDay = news.filter(n => n.date === priceData.date);
      
      return (
        <Card className="bg-gray-900/95 backdrop-blur-sm border border-gray-800 shadow-lg">
          <CardContent className="p-3 space-y-2">
            <p className="font-semibold text-gray-300">
              {format(new Date(priceData.date), "PPP")}
            </p>
            <div className="space-y-1 text-sm">
              <p className="text-white">Open: <span className="text-gray-300">${priceData.open.toFixed(2)}</span></p>
              <p className="text-white">High: <span className="text-gray-300">${priceData.high.toFixed(2)}</span></p>
              <p className="text-white">Low: <span className="text-gray-300">${priceData.low.toFixed(2)}</span></p>
              <p className="text-white">Close: <span className="text-gray-300">${priceData.close.toFixed(2)}</span></p>
            </div>
            {newsForDay.length > 0 && (
              <div className="border-t border-gray-700 mt-2 pt-2">
                <p className="text-[#f7bd00] font-semibold mb-1">News:</p>
                {newsForDay.map((item, i) => (
                  <a
                    key={i}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-sm text-gray-300 hover:text-[#f7bd00] truncate"
                  >
                    {item.title}
                  </a>
                ))}
              </div>
            )}
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
          <span className="text-sm text-[#f7bd00]">
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
              {/* News indicators */}
              <Scatter
                dataKey="high"
                shape={(props: any) => {
                  const { cx, cy } = props;
                  return props.payload.hasNews ? (
                    <circle
                      cx={cx}
                      cy={cy - 15}
                      r={4}
                      fill="#f7bd00"
                    />
                  ) : null;
                }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default StockChart;

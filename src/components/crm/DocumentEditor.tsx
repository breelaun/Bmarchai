import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { 
  ComposedChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Scatter,
  Bar,
} from 'recharts';
import axios from 'axios';
import { useToast } from '@/components/ui/use-toast';

interface StockChartProps {
  symbol: string;
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

interface NewsItem {
  datetime: number;
  headline: string;
  url: string;
  summary: string;
}

const StockChart = ({ symbol }: StockChartProps) => {
  const [data, setData] = useState<PriceData[]>([]);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Calculate date range
        const now = Math.floor(Date.now() / 1000);
        const oneMonthAgo = now - (30 * 24 * 60 * 60);

        const apiKey = import.meta.env.VITE_FINNHUB_API_KEY;
        if (!apiKey) {
          throw new Error('API key is not configured');
        }

        const headers = {
          'X-Finnhub-Token': apiKey
        };

        // Fetch both price and news data in parallel
        const [priceResponse, newsResponse] = await Promise.all([
          axios.get(
            `https://finnhub.io/api/v1/stock/candle?symbol=${symbol}&resolution=D&from=${oneMonthAgo}&to=${now}`,
            { headers }
          ),
          axios.get(
            `https://finnhub.io/api/v1/company-news?symbol=${symbol}&from=${new Date(oneMonthAgo * 1000).toISOString().split('T')[0]}&to=${new Date(now * 1000).toISOString().split('T')[0]}`,
            { headers }
          )
        ]);

        if (priceResponse.status !== 200 || newsResponse.status !== 200) {
          throw new Error("API request failed");
        }

        const priceData = priceResponse.data;
        const newsData = newsResponse.data;

        if (priceData.s === 'no_data') {
          throw new Error("No price data available");
        }

        // Process price data
        const processedPriceData = priceData.t.map((timestamp: number, index: number) => ({
          date: new Date(timestamp * 1000).toISOString().split('T')[0],
          open: priceData.o[index],
          high: priceData.h[index],
          low: priceData.l[index],
          close: priceData.c[index],
          volume: priceData.v[index],
        }));

        // Process news data
        const newsItems = newsData.map((item: any) => ({
          datetime: item.datetime,
          headline: item.headline,
          url: item.url,
          summary: item.summary
        }));

        // Add news indicators to price data
        const enrichedData = processedPriceData.map(pricePoint => {
          const dayNews = newsItems.filter(news => 
            new Date(news.datetime * 1000).toISOString().split('T')[0] === pricePoint.date
          );
          return {
            ...pricePoint,
            hasNews: dayNews.length > 0,
            newsCount: dayNews.length,
          };
        });

        setData(enrichedData);
        setNews(newsItems);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to fetch data";
        setError(errorMessage);
        toast({
          variant: "destructive",
          title: "Error",
          description: errorMessage,
        });
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [symbol, toast]);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const priceData = payload[0].payload;
      const newsForDay = news.filter(n => 
        new Date(n.datetime * 1000).toISOString().split('T')[0] === priceData.date
      );
      const isGreen = priceData.close > priceData.open;
      
      return (
        <Card className="bg-gray-900/95 backdrop-blur-sm border border-gray-800 shadow-lg max-w-md">
          <CardContent className="p-3 space-y-2">
            <p className="font-semibold text-gray-300">
              {new Date(priceData.date).toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' })}
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
            {newsForDay.length > 0 && (
              <div className="border-t border-gray-700 mt-2 pt-2">
                <p className="text-[#f7bd00] font-semibold mb-1">News:</p>
                {newsForDay.map((item, i) => (
                  <div key={i} className="mb-2">
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-sm text-gray-300 hover:text-[#f7bd00] font-medium"
                    >
                      {item.headline}
                    </a>
                    <p className="text-xs text-gray-400 mt-1 line-clamp-2">{item.summary}</p>
                  </div>
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
    const { x, y, width, height } = props;
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
              <CartesianGrid strokeDasharray="3 3" stroke="#2e2e2e" />
              <XAxis
                dataKey="date"
                tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
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
                      opacity={0.8}
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

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
import { format, fromUnixTime, subDays } from "date-fns";

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

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Calculate date range - using current date and 30 days ago
        const endDate = new Date();
        const startDate = subDays(endDate, 30);
        
        const startTimestamp = Math.floor(startDate.getTime() / 1000);
        const endTimestamp = Math.floor(endDate.getTime() / 1000);

        // Set up headers for Finnhub API
        const headers = {
          'Content-Type': 'application/json',
          'X-Finnhub-Token': import.meta.env.VITE_FINNHUB_API_KEY
        };

        // Fetch both price and news data in parallel
        const [priceResponse, newsResponse] = await Promise.all([
          fetch(
            `https://finnhub.io/api/v1/stock/candle?symbol=${symbol}&resolution=D&from=${startTimestamp}&to=${endTimestamp}`,
            { headers }
          ),
          fetch(
            `https://finnhub.io/api/v1/company-news?symbol=${symbol}&from=${format(startDate, 'yyyy-MM-dd')}&to=${format(endDate, 'yyyy-MM-dd')}`,
            { headers }
          )
        ]);

        if (!priceResponse.ok) {
          throw new Error(`Price data fetch failed: ${priceResponse.statusText}`);
        }

        if (!newsResponse.ok) {
          throw new Error(`News data fetch failed: ${newsResponse.statusText}`);
        }

        const [priceData, newsData] = await Promise.all([
          priceResponse.json(),
          newsResponse.json()
        ]);

        if (priceData.error) {
          throw new Error(priceData.error);
        }

        // Process price data
        const processedPriceData = priceData.t.map((timestamp: number, index: number) => ({
          date: format(fromUnixTime(timestamp), 'yyyy-MM-dd'),
          open: priceData.o[index],
          high: priceData.h[index],
          low: priceData.l[index],
          close: priceData.c[index],
          volume: priceData.v[index],
        }));

        // Process news data
        const newsItems = Array.isArray(newsData) ? newsData.map((item: any) => ({
          datetime: item.datetime,
          headline: item.headline,
          url: item.url,
          summary: item.summary
        })) : [];

        // Add news indicators to price data
        const enrichedData = processedPriceData.map(pricePoint => {
          const dayNews = newsItems.filter(news => 
            format(fromUnixTime(news.datetime), 'yyyy-MM-dd') === pricePoint.date
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
        setError(err instanceof Error ? err.message : "Failed to fetch data");
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [symbol, timeRange]);

  // Rest of the component remains the same...
  
  // ... CustomTooltip, renderBar, and render logic remains unchanged

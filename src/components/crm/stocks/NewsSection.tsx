import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, ExternalLink } from "lucide-react";
import { format, parseISO } from "date-fns";

interface NewsItem {
  title: string;
  url: string;
  publishedAt: string;
  source: {
    name: string;
  };
  summary: string;
}

interface NewsSectionProps {
  symbol: string;
}

export const NewsSection = ({ symbol }: NewsSectionProps) => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `https://www.alphavantage.co/query?function=NEWS_SENTIMENT&tickers=${symbol}&apikey=${import.meta.env.VITE_ALPHA_VANTAGE_API_KEY}`
        );
        const data = await response.json();
        
        if (data.feed) {
          setNews(data.feed.slice(0, 5).map((item: any) => ({
            title: item.title,
            url: item.url,
            publishedAt: item.time_published,
            source: { name: item.source },
            summary: item.summary
          })));
        }
      } catch (err) {
        setError("Failed to fetch news");
        console.error("Error fetching news:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [symbol]);

  const formatPublishedDate = (dateString: string) => {
    try {
      // Alpha Vantage format: YYYYMMDDTHHMMSS
      const year = dateString.slice(0, 4);
      const month = dateString.slice(4, 6);
      const day = dateString.slice(6, 8);
      const hour = dateString.slice(9, 11);
      const minute = dateString.slice(11, 13);
      const second = dateString.slice(13, 15);
      
      const isoString = `${year}-${month}-${day}T${hour}:${minute}:${second}Z`;
      return format(new Date(isoString), "MMM d, yyyy");
    } catch (err) {
      console.error("Error formatting date:", err);
      return "Date unavailable";
    }
  };

  if (loading) {
    return (
      <Card className="mt-4 bg-white dark:bg-gray-900">
        <CardContent className="flex items-center justify-center h-[200px]">
          <Loader2 className="h-8 w-8 animate-spin text-[#f7bd00]" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="mt-4 bg-white dark:bg-gray-900">
        <CardContent className="flex items-center justify-center h-[200px] text-red-500">
          {error}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mt-4 bg-white dark:bg-gray-900">
      <CardHeader>
        <CardTitle className="text-lg">Latest {symbol} News</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {news.map((item, index) => (
            <div
              key={index}
              className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <div className="flex justify-between items-start gap-4">
                <div>
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-[#f7bd00] hover:underline inline-flex items-center gap-2"
                  >
                    {item.title}
                    <ExternalLink className="h-4 w-4" />
                  </a>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {item.source.name} • {formatPublishedDate(item.publishedAt)}
                  </p>
                  <p className="mt-2 text-sm line-clamp-2">{item.summary}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
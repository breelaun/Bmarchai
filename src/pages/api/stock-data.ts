// src/pages/api/stocks/[...route].ts
import type { NextApiRequest, NextApiResponse } from 'next';

// Types
interface StockData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
}

interface NewsItem {
  id: string;
  title: string;
  source: string;
  url: string;
  publishedAt: string;
}

// API key validation
if (!process.env.POLYGON_API_KEY) {
  throw new Error('POLYGON_API_KEY environment variable is not set');
}

// Helper function to format date range
const getDateRange = (timeRange: string) => {
  const end = new Date();
  const start = new Date();

  switch (timeRange) {
    case '1D':
      start.setDate(end.getDate() - 1);
      break;
    case '1W':
      start.setDate(end.getDate() - 7);
      break;
    case '1M':
      start.setMonth(end.getMonth() - 1);
      break;
    case '3M':
      start.setMonth(end.getMonth() - 3);
      break;
    case '1Y':
      start.setFullYear(end.getFullYear() - 1);
      break;
    case '5Y':
      start.setFullYear(end.getFullYear() - 5);
      break;
    default:
      start.setFullYear(end.getFullYear() - 1);
  }

  return {
    start: start.toISOString().split('T')[0],
    end: end.toISOString().split('T')[0],
  };
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { route } = req.query;
  
  if (!Array.isArray(route)) {
    return res.status(400).json({ error: 'Invalid route' });
  }

  const [endpoint, ...params] = route;

  switch (endpoint) {
    case 'price':
      return handlePriceData(req, res);
    case 'news':
      return handleNewsData(req, res);
    case 'trending':
      return handleTrendingData(req, res);
    default:
      return res.status(404).json({ error: 'Endpoint not found' });
  }
}

async function handlePriceData(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { symbol, timeRange = '1Y' } = req.query;

  if (!symbol) {
    return res.status(400).json({ error: 'Symbol is required' });
  }

  const { start, end } = getDateRange(timeRange as string);

  try {
    const url = new URL(`https://api.polygon.io/v2/aggs/ticker/${symbol}/range/1/day/${start}/${end}`);
    url.searchParams.append('adjusted', 'true');
    url.searchParams.append('sort', 'asc');
    url.searchParams.append('apiKey', process.env.POLYGON_API_KEY!);

    const response = await fetch(url.toString());
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to fetch stock data');
    }

    // Cache for 5 minutes
    res.setHeader('Cache-Control', 's-maxage=300');
    return res.status(200).json(data);

  } catch (error) {
    console.error('Stock API error:', error);
    return res.status(500).json({
      error: error instanceof Error ? error.message : 'Failed to fetch stock data'
    });
  }
}

async function handleNewsData(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { symbol } = req.query;

  if (!symbol) {
    return res.status(400).json({ error: 'Symbol is required' });
  }

  try {
    // You would typically fetch from a news API here
    // For now, returning mock data
    const news: NewsItem[] = [
      {
        id: '1',
        title: `Latest news about ${symbol}`,
        source: 'Financial Times',
        url: '#',
        publishedAt: new Date().toISOString(),
      },
      // Add more mock news items
    ];

    // Cache for 5 minutes
    res.setHeader('Cache-Control', 's-maxage=300');
    return res.status(200).json({ news });

  } catch (error) {
    console.error('News API error:', error);
    return res.status(500).json({
      error: error instanceof Error ? error.message : 'Failed to fetch news data'
    });
  }
}

async function handleTrendingData(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // You would typically fetch real trending data here
    // For now, returning mock data
    const trending: StockData[] = [
      {
        symbol: 'NVDA',
        name: 'NVIDIA Corporation',
        price: 456.78,
        change: 12.34,
        changePercent: 2.5,
      },
      // Add more mock trending stocks
    ];

    // Cache for 5 minutes
    res.setHeader('Cache-Control', 's-maxage=300');
    return res.status(200).json({ trending });

  } catch (error) {
    console.error('Trending API error:', error);
    return res.status(500).json({
      error: error instanceof Error ? error.message : 'Failed to fetch trending data'
    });
  }
}

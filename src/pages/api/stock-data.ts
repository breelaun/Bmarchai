import { supabase } from "@/integrations/supabase/client";

interface StockResponse {
  results?: any[];
  error?: string;
}

export async function fetchStockData(symbol: string, startDate?: string, endDate?: string): Promise<StockResponse> {
  if (!symbol) {
    throw new Error('Stock symbol is required');
  }

  try {
    const apiKey = import.meta.env.VITE_POLYGON_API_KEY;
    if (!apiKey) {
      console.error('Polygon API key not configured');
      return { results: [] };
    }

    // Construct API URL
    const url = new URL(`https://api.polygon.io/v2/aggs/ticker/${symbol}/range/1/day/${startDate || '2023-01-01'}/${endDate || '2023-12-31'}`);
    
    url.searchParams.append('adjusted', 'true');
    url.searchParams.append('sort', 'asc');
    url.searchParams.append('apiKey', apiKey);

    // Fetch stock data
    const response = await fetch(url.toString());
    if (!response.ok) {
      console.error('Failed to fetch stock data:', await response.text());
      return { results: [] };
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Stock API error:', error);
    return { results: [] };
  }
}
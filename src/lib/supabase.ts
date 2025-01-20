// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error('Missing Supabase environment variables');
}

// Create Supabase client with service role for API routes
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      persistSession: false,
    }
  }
);

// src/pages/api/stock-data.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { supabaseAdmin } from '@/lib/supabase';

interface StockResponse {
  results?: any[];
  error?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<StockResponse>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { symbol, startDate, endDate } = req.query;

  if (!symbol) {
    return res.status(400).json({ error: 'Stock symbol is required' });
  }

  try {
    // First, try to get the API key from Supabase
    const { data: apiKeyData, error: apiKeyError } = await supabaseAdmin
      .from('api_keys')
      .select('key')
      .eq('service', 'polygon')
      .single();

    if (apiKeyError || !apiKeyData) {
      throw new Error('Failed to retrieve API key');
    }

    // Construct API URL
    const url = new URL(`https://api.polygon.io/v2/aggs/ticker/${symbol}/range/1/day/${startDate || '2023-01-01'}/${endDate || '2023-12-31'}`);
    
    url.searchParams.append('adjusted', 'true');
    url.searchParams.append('sort', 'asc');
    url.searchParams.append('apiKey', apiKeyData.key);

    // Fetch stock data
    const response = await fetch(url.toString());
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to fetch stock data');
    }

    // Store the request in Supabase for logging/tracking
    await supabaseAdmin
      .from('api_requests')
      .insert({
        symbol: symbol as string,
        start_date: startDate as string,
        end_date: endDate as string,
        status: response.status,
        user_id: req.headers['x-user-id'] // If you're tracking user requests
      });

    // Cache the response
    res.setHeader('Cache-Control', 's-maxage=300');
    return res.status(200).json(data);

  } catch (error) {
    console.error('Stock API error:', error);
    return res.status(500).json({
      error: error instanceof Error ? error.message : 'Failed to fetch stock data'
    });
  }
}

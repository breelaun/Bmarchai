import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { 
  ComposedChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import axios from 'axios';

interface StockChartProps {
  symbol: string;
}

interface PriceData {
  date: string;
  close: number;
}

const StockChart = ({ symbol }: StockChartProps) => {
  const [data, setData] = useState<PriceData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const apiKey = import.meta.env.VITE_ALPHAVANTAGE_API_KEY;
        
        // Fetch daily time series data
        const priceResponse = await axios.get(`https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${apiKey}`);
        const priceData = priceResponse.data['Time Series (Daily)'];
        
        // Process price data
        const processedData = Object.entries(priceData).map(([date, priceInfo]: [string, any]) => ({
          date,
          close: parseFloat(priceInfo['4. close']),
        }));

        setData(processedData.slice(0, 30)); // Last 30 days for simplicity

      } catch (err) {
        setError('Error fetching data');
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [symbol]);

  if (loading) {
    return (
      <Card className="bg-gray-800 border-gray-700 text-gray-300">
        <CardContent className="flex items-center justify-center h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="bg-gray-800 border-gray-700 text-red-500">
        <CardContent className="flex items-center justify-center h-[400px]">
          {error}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gray-800 border-gray-700 text-gray-300">
      <CardHeader>
        <CardTitle>{symbol}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#444" />
              <XAxis 
                dataKey="date"
                tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                stroke="#666"
              />
              <YAxis 
                domain={['dataMin', 'dataMax']}
                tickFormatter={(value) => `$${value.toFixed(2)}`}
                stroke="#666"
              />
              <Tooltip 
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <Card className="bg-gray-700 p-2 border border-gray-600">
                        <p className="text-sm">{payload[0].payload.date}</p>
                        <p className="text-sm">Close: ${payload[0].value.toFixed(2)}</p>
                      </Card>
                    );
                  }
                  return null;
                }}
              />
              <Area 
                type="monotone" 
                dataKey="close" 
                stroke="#8884d8" 
                fill="#8884d8"
                fillOpacity={0.3}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default StockChart;

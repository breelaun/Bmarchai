import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface StockData {
  labels: string[];
  prices: number[];
}

const StockChart: React.FC = () => {
  const [symbol, setSymbol] = useState<string>('AAPL');
  const [stockData, setStockData] = useState<StockData>({ labels: [], prices: [] });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const { toast } = useToast();
  
  const fetchStockData = async (stockSymbol: string) => {
    setIsLoading(true);
    setError('');
    
    try {
      const response = await fetch(
        `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${stockSymbol}&apikey=${import.meta.env.VITE_ALPHA_VANTAGE_API_KEY}`
      );
      
      const data = await response.json();
      
      if (data['Time Series (Daily)']) {
        const timeSeriesData = data['Time Series (Daily)'];
        const dates = Object.keys(timeSeriesData).slice(0, 30).reverse();
        const prices = dates.map(date => parseFloat(timeSeriesData[date]['4. close']));
        
        setStockData({
          labels: dates,
          prices: prices
        });

        toast({
          title: "Success",
          description: "Stock data loaded successfully",
        });
      } else {
        throw new Error(data.Note || 'No data found for the provided symbol');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch stock data';
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStockData(symbol);
  }, []);

  const chartData = {
    labels: stockData.labels,
    datasets: [
      {
        label: `${symbol} Stock Price`,
        data: stockData.prices,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
        backgroundColor: 'rgba(75, 192, 192, 0.1)',
        fill: true,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: `${symbol} Stock Price History`,
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Date',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Price (USD)',
        },
      },
    },
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Stock Chart</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-4 mb-6">
          <Input
            type="text"
            value={symbol}
            onChange={(e) => setSymbol(e.target.value.toUpperCase())}
            placeholder="Enter stock symbol"
            className="max-w-xs"
          />
          <Button
            onClick={() => fetchStockData(symbol)}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading
              </>
            ) : (
              'Fetch Data'
            )}
          </Button>
        </div>
        
        {error && (
          <div className="text-red-500 mb-4">{error}</div>
        )}
        
        <div className="h-[400px] relative">
          {stockData.labels.length > 0 && (
            <Line data={chartData} options={chartOptions} />
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default StockChart;
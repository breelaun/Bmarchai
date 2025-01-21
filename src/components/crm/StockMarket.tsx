import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useQuery } from "@tanstack/react-query";
import { fetchStockData } from "@/pages/api/stock-data";

export const StockMarket = () => {
  const [symbol, setSymbol] = useState("AAPL");
  const [inputSymbol, setInputSymbol] = useState("AAPL");

  const { data: stockData, isLoading } = useQuery({
    queryKey: ['stock', symbol],
    queryFn: () => fetchStockData(symbol),
    select: (data) => {
      if (!data.results) return [];
      return data.results.map((item: any) => ({
        date: new Date(item.t).toLocaleDateString(),
        price: item.c
      }));
    }
  });

  const handleSearch = () => {
    setSymbol(inputSymbol.toUpperCase());
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Stock Market</CardTitle>
        <div className="flex gap-2">
          <Input
            placeholder="Enter stock symbol (e.g., AAPL)"
            value={inputSymbol}
            onChange={(e) => setInputSymbol(e.target.value)}
            className="max-w-[200px]"
          />
          <Button onClick={handleSearch}>Search</Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="h-[400px] flex items-center justify-center">
            Loading...
          </div>
        ) : (
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stockData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="price" stroke="#3b82f6" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StockMarket;
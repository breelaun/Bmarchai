import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { format } from "date-fns";
import { StatCards } from "./components/StatCards";
import { TopProducts } from "./components/TopProducts";
import { VideoAnalytics } from "./components/VideoAnalytics";
import { FinancialOverview } from "./components/FinancialOverview";

const AnalyticsDashboard = () => {
  const [timeframe, setTimeframe] = useState<'once' | 'daily' | 'weekly' | 'monthly' | 'yearly'>('monthly');

  const { data: salesData, isLoading: loadingSales } = useQuery({
    queryKey: ['sales-analytics'],
    queryFn: async () => {
      const { data: sales, error } = await supabase
        .from('sales_transactions')
        .select(`
          amount,
          products (name),
          created_at
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return sales;
    },
  });

  const { data: customerCount, isLoading: loadingCustomers } = useQuery({
    queryKey: ['customer-count'],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('crm_clients')
        .select('*', { count: 'exact', head: true });

      if (error) throw error;
      return count || 0;
    },
  });

  const { data: topProducts, isLoading: loadingProducts } = useQuery({
    queryKey: ['top-products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('sales_transactions')
        .select(`
          product_id,
          products (name)
        `)
        .not('product_id', 'is', null);

      if (error) throw error;

      const productCounts = data.reduce((acc: any, curr) => {
        const productName = curr.products?.name;
        if (productName) {
          acc[productName] = (acc[productName] || 0) + 1;
        }
        return acc;
      }, {});

      return Object.entries(productCounts)
        .map(([name, count]) => ({ name, count }))
        .sort((a: any, b: any) => b.count - a.count)
        .slice(0, 5);
    },
  });

  const { data: videoAnalytics, isLoading: loadingVideos } = useQuery({
    queryKey: ['video-analytics'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('video_analytics')
        .select('*')
        .order('view_count', { ascending: false })
        .limit(5);

      if (error) throw error;
      return data;
    },
  });

  const { data: financialData, isLoading: loadingFinancial } = useQuery({
    queryKey: ['financial-data', timeframe],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('financial_transactions')
        .select('*')
        .order('date', { ascending: true });

      if (error) throw error;
      return data;
    },
  });

  const totalRevenue = salesData?.reduce((sum, sale) => sum + Number(sale.amount), 0) || 0;

  const processFinancialData = () => {
    if (!financialData) return [];

    const groupedData = financialData.reduce((acc: any, transaction) => {
      const date = format(new Date(transaction.date), 'yyyy-MM-dd');
      if (!acc[date]) {
        acc[date] = {
          date,
          earned: 0,
          spent: 0,
          balance: 0,
        };
      }
      
      if (transaction.type === 'earned') {
        acc[date].earned += Number(transaction.amount);
        acc[date].balance += Number(transaction.amount);
      } else {
        acc[date].spent += Number(transaction.amount);
        acc[date].balance -= Number(transaction.amount);
      }
      
      return acc;
    }, {});

    return Object.values(groupedData);
  };

  if (loadingSales || loadingCustomers || loadingProducts || loadingVideos || loadingFinancial) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const chartData = processFinancialData();

  return (
    <div className="space-y-6">
      <StatCards 
        customerCount={customerCount}
        totalRevenue={totalRevenue}
        salesCount={salesData?.length || 0}
        videoCount={videoAnalytics?.length || 0}
      />

      <div className="grid gap-4 md:grid-cols-2">
        <TopProducts products={topProducts} />
        <VideoAnalytics videos={videoAnalytics} />
        <FinancialOverview 
          timeframe={timeframe}
          setTimeframe={setTimeframe}
          chartData={chartData}
        />
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
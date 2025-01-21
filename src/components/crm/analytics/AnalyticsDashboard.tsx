import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCards } from "./components/StatCards";
import { FinancialOverview } from "./components/FinancialOverview";
import { TopProducts } from "./components/TopProducts";
import { VideoAnalytics } from "./components/VideoAnalytics";
import { supabase } from "@/integrations/supabase/client";

export const AnalyticsDashboard = () => {
  const [timeframe, setTimeframe] = useState<'once' | 'daily' | 'weekly' | 'monthly' | 'yearly'>('monthly');
  const [stats, setStats] = useState({
    customerCount: 0,
    totalRevenue: 0,
    salesCount: 0,
    videoCount: 0
  });
  const [chartData, setChartData] = useState<Array<{
    date: string;
    earned: number;
    spent: number;
    balance: number;
  }>>([]);
  const [products, setProducts] = useState<Array<{
    name: string;
    count: number;
  }>>([]);
  const [videos, setVideos] = useState<Array<{
    id: string;
    title: string;
    watch_time_seconds: number;
    view_count: number;
  }>>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch customer count
        const { count: customerCount } = await supabase
          .from('crm_clients')
          .select('*', { count: 'exact' });

        // Fetch total revenue
        const { data: salesData } = await supabase
          .from('sales_transactions')
          .select('amount');
        const totalRevenue = salesData?.reduce((sum, sale) => sum + (sale.amount || 0), 0) || 0;

        // Fetch active deals count
        const { count: salesCount } = await supabase
          .from('sales_transactions')
          .select('*', { count: 'exact' })
          .eq('status', 'completed');

        // Fetch video count
        const { count: videoCount } = await supabase
          .from('video_analytics')
          .select('*', { count: 'exact' });

        setStats({
          customerCount: customerCount || 0,
          totalRevenue,
          salesCount: salesCount || 0,
          videoCount: videoCount || 0
        });

        // Fetch financial data for chart
        const { data: financialData } = await supabase
          .from('financial_transactions')
          .select('*')
          .order('date', { ascending: true });

        if (financialData) {
          const processedData = financialData.reduce((acc: any[], transaction) => {
            const date = transaction.date;
            const existingEntry = acc.find(entry => entry.date === date);

            if (existingEntry) {
              if (transaction.type === 'earned') {
                existingEntry.earned += transaction.amount;
              } else {
                existingEntry.spent += transaction.amount;
              }
              existingEntry.balance = existingEntry.earned - existingEntry.spent;
            } else {
              acc.push({
                date,
                earned: transaction.type === 'earned' ? transaction.amount : 0,
                spent: transaction.type === 'spent' ? transaction.amount : 0,
                balance: transaction.type === 'earned' ? transaction.amount : -transaction.amount
              });
            }
            return acc;
          }, []);

          setChartData(processedData);
        }

        // Fetch top products
        const { data: productsData } = await supabase
          .from('products')
          .select(`
            id,
            name,
            sales_transactions(amount)
          `);

        if (productsData) {
          const processedProducts = productsData.map(product => ({
            name: product.name,
            count: product.sales_transactions?.length || 0
          }));
          setProducts(processedProducts);
        }

        // Fetch video analytics
        const { data: videosData } = await supabase
          .from('video_analytics')
          .select('*');

        if (videosData) {
          const processedVideos = videosData.map(video => ({
            id: video.video_id,
            title: video.title,
            watch_time_seconds: video.watch_time_seconds || 0,
            view_count: video.view_count || 0
          }));
          setVideos(processedVideos);
        }
      } catch (error) {
        console.error('Error fetching analytics data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="space-y-4">
      <StatCards 
        customerCount={stats.customerCount}
        totalRevenue={stats.totalRevenue}
        salesCount={stats.salesCount}
        videoCount={stats.videoCount}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FinancialOverview 
          timeframe={timeframe}
          setTimeframe={setTimeframe}
          chartData={chartData}
        />
        <TopProducts products={products} />
      </div>
      <VideoAnalytics videos={videos} />
    </div>
  );
};

export default AnalyticsDashboard;
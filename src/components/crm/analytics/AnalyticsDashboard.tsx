import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Users, DollarSign, ShoppingBag, Video } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

const AnalyticsDashboard = () => {
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

      // Count occurrences of each product
      const productCounts = data.reduce((acc: any, curr) => {
        const productName = curr.products?.name;
        if (productName) {
          acc[productName] = (acc[productName] || 0) + 1;
        }
        return acc;
      }, {});

      // Convert to array and sort
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

  const totalRevenue = salesData?.reduce((sum, sale) => sum + Number(sale.amount), 0) || 0;

  if (loadingSales || loadingCustomers || loadingProducts || loadingVideos) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{customerCount}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenue.toFixed(2)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Deals</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{salesData?.length || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Videos</CardTitle>
            <Video className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{videoAnalytics?.length || 0}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Top Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topProducts}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Most Watched Videos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {videoAnalytics?.map((video) => (
                <div key={video.id} className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">{video.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {Math.floor(video.watch_time_seconds / 60)} minutes watched
                    </p>
                  </div>
                  <div className="text-sm font-medium">{video.view_count} views</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
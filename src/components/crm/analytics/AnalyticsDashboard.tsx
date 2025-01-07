import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Users, DollarSign, ShoppingBag, Video, Plus } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend
} from 'recharts';
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { format } from "date-fns";

const AnalyticsDashboard = () => {
  const [timeframe, setTimeframe] = useState<'daily' | 'weekly' | 'monthly' | 'yearly'>('monthly');
  const { toast } = useToast();

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

  const handleAddTransaction = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    
    try {
      const { error } = await supabase
        .from('financial_transactions')
        .insert({
          type: formData.get('type'),
          amount: Number(formData.get('amount')),
          description: formData.get('description'),
          date: formData.get('date'),
          recurring: formData.get('recurring') === 'true',
          timeframe: formData.get('timeframe'),
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Transaction added successfully",
      });
      
      form.reset();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

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

        <Card className="col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Financial Overview</CardTitle>
            <div className="flex items-center gap-4">
              <Select value={timeframe} onValueChange={(value: any) => setTimeframe(value)}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select timeframe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>
              
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Plus className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Transaction</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleAddTransaction} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="type">Type</Label>
                      <Select name="type" defaultValue="spent">
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="earned">Earned</SelectItem>
                          <SelectItem value="spent">Spent</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="amount">Amount</Label>
                      <Input
                        id="amount"
                        name="amount"
                        type="number"
                        step="0.01"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Input
                        id="description"
                        name="description"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="date">Date</Label>
                      <Input
                        id="date"
                        name="date"
                        type="date"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="recurring">Recurring</Label>
                      <Select name="recurring" defaultValue="false">
                        <SelectTrigger>
                          <SelectValue placeholder="Is this recurring?" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="true">Yes</SelectItem>
                          <SelectItem value="false">No</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="timeframe">Timeframe</Label>
                      <Select name="timeframe" defaultValue="monthly">
                        <SelectTrigger>
                          <SelectValue placeholder="Select timeframe" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="daily">Daily</SelectItem>
                          <SelectItem value="weekly">Weekly</SelectItem>
                          <SelectItem value="monthly">Monthly</SelectItem>
                          <SelectItem value="yearly">Yearly</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <Button type="submit" className="w-full">Add Transaction</Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="earned" stroke="#4ade80" name="Earned" />
                  <Line type="monotone" dataKey="spent" stroke="#f43f5e" name="Spent" />
                  <Line type="monotone" dataKey="balance" stroke="#3b82f6" name="Balance" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;

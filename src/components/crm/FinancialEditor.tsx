import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { 
  Save, Download, Upload, BarChart2, PieChart, LineChart,
  TrendingUp, Activity
} from 'lucide-react';
import {
  LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer
} from 'recharts';
import { supabase } from "@/integrations/supabase/client";
import { useSession } from '@supabase/auth-helpers-react';

type FinancialEntry = {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  date: string;
};

const FinancialEditor = () => {
  const session = useSession();
  const { toast } = useToast();
  const [selectedTemplate, setSelectedTemplate] = useState('standard');
  const [entries, setEntries] = useState<FinancialEntry[]>([]);
  const [entryType, setEntryType] = useState<'income' | 'expense'>('income');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('other');
  const [date, setDate] = useState('');
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    if (session) {
      fetchEntries();
    }
  }, [session]);

  const fetchEntries = async () => {
    const { data, error } = await supabase
      .from('financial_entries')
      .select('*')
      .order('date', { ascending: false });

    if (error) {
      toast({
        title: "Error fetching entries",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    // Transform the data to ensure type safety
    const transformedData = (data || []).map(entry => ({
      id: entry.id,
      type: entry.type as 'income' | 'expense',
      amount: entry.amount,
      category: entry.category,
      date: entry.date
    }));

    setEntries(transformedData);
    processChartData(transformedData);
  };

  const processChartData = (data: FinancialEntry[]) => {
    const monthlyData = data.reduce((acc: any, entry: any) => {
      const month = new Date(entry.date).toLocaleString('default', { month: 'short' });
      if (!acc[month]) {
        acc[month] = { name: month, income: 0, expense: 0 };
      }
      if (entry.type === 'income') {
        acc[month].income += Number(entry.amount);
      } else {
        acc[month].expense += Number(entry.amount);
      }
      return acc;
    }, {});

    setChartData(Object.values(monthlyData));
  };

  const handleAddEntry = async () => {
    if (!amount || !date || !session) return;
    
    const newEntry = {
      user_id: session.user.id,
      type: entryType,
      amount: parseFloat(amount),
      category,
      date,
    };
    
    const { error } = await supabase
      .from('financial_entries')
      .insert(newEntry);

    if (error) {
      toast({
        title: "Error adding entry",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Entry added successfully",
      description: "Your financial entry has been saved.",
    });
    
    // Reset form and refresh entries
    setAmount('');
    setCategory('other');
    setDate('');
    fetchEntries();
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Here you would implement the file parsing logic
    // For now, we'll just show a success message
    toast({
      title: "File uploaded",
      description: "Your financial data is being processed.",
    });
  };

  const handleDownload = () => {
    // Convert entries to CSV
    const csvContent = entries.map(entry => 
      `${entry.date},${entry.type},${entry.category},${entry.amount}`
    ).join('\n');

    const blob = new Blob([`Date,Type,Category,Amount\n${csvContent}`], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'financial_records.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-4 space-y-6">
      <Card className="bg-background border-border">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Financial Records</CardTitle>
            <div className="flex gap-2">
              <Select
                value={selectedTemplate}
                onValueChange={setSelectedTemplate}
              >
                <SelectTrigger className="w-[200px] bg-secondary">
                  <SelectValue placeholder="Select Template" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="standard">Standard</SelectItem>
                  <SelectItem value="business">Business</SelectItem>
                  <SelectItem value="personal">Personal</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon" onClick={handleDownload}>
                <Download className="h-4 w-4" />
              </Button>
              <label htmlFor="file-upload">
                <Button variant="outline" size="icon" asChild>
                  <div>
                    <Upload className="h-4 w-4" />
                    <input
                      id="file-upload"
                      type="file"
                      accept=".csv"
                      className="hidden"
                      onChange={handleFileUpload}
                    />
                  </div>
                </Button>
              </label>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="entry" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="entry">New Entry</TabsTrigger>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="reports">Reports</TabsTrigger>
            </TabsList>

            <TabsContent value="entry" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Type</label>
                  <Select value={entryType} onValueChange={(value: 'income' | 'expense') => setEntryType(value)}>
                    <SelectTrigger className="bg-secondary">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="income">Income</SelectItem>
                      <SelectItem value="expense">Expense</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Amount</label>
                  <Input 
                    type="number" 
                    placeholder="0.00" 
                    className="bg-secondary"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Category</label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger className="bg-secondary">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="salary">Salary</SelectItem>
                      <SelectItem value="investment">Investment</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Date</label>
                  <Input 
                    type="date" 
                    className="bg-secondary"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />
                </div>
              </div>
              <Button className="w-full" onClick={handleAddEntry}>Add Entry</Button>

              {entries.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-4">Recent Entries</h3>
                  <div className="space-y-2">
                    {entries.map((entry) => (
                      <div 
                        key={entry.id}
                        className={`p-4 rounded-lg border ${
                          entry.type === 'income' ? 'border-green-500/20 bg-green-500/10' : 'border-red-500/20 bg-red-500/10'
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <span className="font-medium capitalize">{entry.type}</span>
                            <span className="text-sm text-muted-foreground ml-2">({entry.category})</span>
                          </div>
                          <span className={`font-semibold ${
                            entry.type === 'income' ? 'text-green-500' : 'text-red-500'
                          }`}>
                            {entry.type === 'income' ? '+' : '-'}${Number(entry.amount).toFixed(2)}
                          </span>
                        </div>
                        <div className="text-sm text-muted-foreground mt-1">
                          {new Date(entry.date).toLocaleDateString()}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="overview">
              <Card>
                <CardContent className="pt-6">
                  <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsLineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="income" stroke="#4ade80" name="Income" />
                        <Line type="monotone" dataKey="expense" stroke="#ef4444" name="Expense" />
                      </RechartsLineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reports">
              <Card>
                <CardContent>
                  <div className="space-y-4">
                    <Button variant="outline" className="w-full gap-2" onClick={handleDownload}>
                      <Download className="h-4 w-4" />
                      Download Financial Report
                    </Button>
                    <label htmlFor="report-upload" className="w-full">
                      <Button variant="outline" className="w-full gap-2" asChild>
                        <div>
                          <Upload className="h-4 w-4" />
                          Upload Financial Report
                          <input
                            id="report-upload"
                            type="file"
                            accept=".csv,.xlsx,.xls"
                            className="hidden"
                            onChange={handleFileUpload}
                          />
                        </div>
                      </Button>
                    </label>
                    <Button variant="outline" className="w-full gap-2">
                      <BarChart2 className="h-4 w-4" />
                      Generate Monthly Report
                    </Button>
                    <Button variant="outline" className="w-full gap-2">
                      <PieChart className="h-4 w-4" />
                      Generate Category Report
                    </Button>
                    <Button variant="outline" className="w-full gap-2">
                      <TrendingUp className="h-4 w-4" />
                      Generate Trend Analysis
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default FinancialEditor;

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { 
  Save, Download, BarChart2, PieChart, LineChart,
  TrendingUp, Activity
} from 'lucide-react';
import {
  LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer
} from 'recharts';

type FinancialEntry = {
  type: 'income' | 'expense';
  amount: number;
  category: string;
  date: string;
};

const FinancialEditor = () => {
  const [selectedTemplate, setSelectedTemplate] = useState('standard');
  const [entries, setEntries] = useState<FinancialEntry[]>([]);
  const [entryType, setEntryType] = useState<'income' | 'expense'>('income');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('other');
  const [date, setDate] = useState('');

  // Sample data for the chart
  const data = [
    { name: 'Jan', income: 4000, expense: 2400 },
    { name: 'Feb', income: 3000, expense: 1398 },
    { name: 'Mar', income: 2000, expense: 9800 },
    { name: 'Apr', income: 2780, expense: 3908 },
    { name: 'May', income: 1890, expense: 4800 },
    { name: 'Jun', income: 2390, expense: 3800 },
  ];

  const handleAddEntry = () => {
    if (!amount || !date) return;
    
    const newEntry: FinancialEntry = {
      type: entryType,
      amount: parseFloat(amount),
      category,
      date,
    };
    
    setEntries([...entries, newEntry]);
    
    // Reset form
    setAmount('');
    setCategory('other');
    setDate('');
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
              <Button variant="outline" size="icon">
                <Save className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
                <Download className="h-4 w-4" />
              </Button>
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

              {/* Display Entries */}
              {entries.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-4">Recent Entries</h3>
                  <div className="space-y-2">
                    {entries.map((entry, index) => (
                      <div 
                        key={index}
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
                            {entry.type === 'income' ? '+' : '-'}${entry.amount.toFixed(2)}
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
                      <RechartsLineChart data={data}>
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
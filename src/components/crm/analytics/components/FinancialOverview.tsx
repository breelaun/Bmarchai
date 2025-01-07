import { Plus } from "lucide-react";
import { format } from "date-fns";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ChartDataPoint {
  date: string;
  earned: number;
  spent: number;
  balance: number;
}

interface FinancialOverviewProps {
  timeframe: 'once' | 'daily' | 'weekly' | 'monthly' | 'yearly';
  setTimeframe: (value: 'once' | 'daily' | 'weekly' | 'monthly' | 'yearly') => void;
  chartData: ChartDataPoint[];
}

export const FinancialOverview = ({ timeframe, setTimeframe, chartData }: FinancialOverviewProps) => {
  const { toast } = useToast();

  const handleAddTransaction = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    
    try {
      const { error } = await supabase
        .from('financial_transactions')
        .insert({
          type: formData.get('type') as string,
          amount: Number(formData.get('amount')),
          description: formData.get('description') as string,
          date: formData.get('date') as string,
          recurring: formData.get('recurring') === 'true',
          timeframe: formData.get('timeframe') as string,
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

  return (
    <Card className="col-span-2">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Financial Overview</CardTitle>
        <div className="flex items-center gap-4">
          <Select value={timeframe} onValueChange={(value: any) => setTimeframe(value)}>
            <SelectTrigger className="w-[180px] bg-black">
              <SelectValue placeholder="Select timeframe" />
            </SelectTrigger>
            <SelectContent className="bg-black">
              <SelectItem value="once">Once</SelectItem>
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
            <DialogContent className="bg-black">
              <DialogHeader>
                <DialogTitle>Add Transaction</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAddTransaction} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="type">Type</Label>
                  <Select name="type" defaultValue="spent">
                    <SelectTrigger className="bg-black">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent className="bg-black">
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
                    className="bg-black"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    name="description"
                    required
                    className="bg-black"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    name="date"
                    type="date"
                    required
                    className="bg-black"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="recurring">Recurring</Label>
                  <Select name="recurring" defaultValue="false">
                    <SelectTrigger className="bg-black">
                      <SelectValue placeholder="Is this recurring?" />
                    </SelectTrigger>
                    <SelectContent className="bg-black">
                      <SelectItem value="true">Yes</SelectItem>
                      <SelectItem value="false">No</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="timeframe">Timeframe</Label>
                  <Select name="timeframe" defaultValue="monthly">
                    <SelectTrigger className="bg-black">
                      <SelectValue placeholder="Select timeframe" />
                    </SelectTrigger>
                    <SelectContent className="bg-black">
                      <SelectItem value="once">Once</SelectItem>
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
  );
};
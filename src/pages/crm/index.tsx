import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSession } from "@supabase/auth-helpers-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ClientList from "@/components/crm/ClientList";
import TaskList from "@/components/crm/TaskList";
import StockMarket from "@/components/crm/StockMarket";
import AnalyticsDashboard from "@/components/crm/analytics/AnalyticsDashboard";
import { useToast } from "@/components/ui/use-toast";

const CRM = () => {
  const [activeTab, setActiveTab] = useState("clients");
  const session = useSession();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!session) {
      toast({
        title: "Authentication Required",
        description: "Please log in to access the CRM.",
        variant: "destructive",
      });
      navigate("/login");
    }
  }, [session, navigate, toast]);

  if (!session) {
    return null; // Prevent flash of content while redirecting
  }

  return (
    <div className="container mx-auto py-6 space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>CRM Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="clients">Clients</TabsTrigger>
              <TabsTrigger value="tasks">Tasks</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="stocks">Stocks</TabsTrigger>
            </TabsList>
            <TabsContent value="clients">
              <ClientList />
            </TabsContent>
            <TabsContent value="tasks">
              <TaskList />
            </TabsContent>
            <TabsContent value="analytics">
              <AnalyticsDashboard />
            </TabsContent>
            <TabsContent value="stocks">
              <StockMarket defaultSymbol="AAPL" />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default CRM;
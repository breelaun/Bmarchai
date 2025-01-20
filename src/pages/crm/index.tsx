import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2 } from "lucide-react";
import ClientList from "@/components/crm/ClientList";
import TaskList from "@/components/crm/TaskList";
import AnalyticsDashboard from "@/components/crm/analytics/AnalyticsDashboard";
import DocumentEditor from "@/components/crm/DocumentEditor";
import FinancialEditor from "@/components/crm/FinancialEditor";
import { StockMarketSection } from "@/components/crm/stocks/StockMarketSection";

const CRMPage = () => {
  const session = useSession();
  const supabase = useSupabaseClient();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          navigate("/login");
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        navigate("/login");
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [supabase, navigate]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!session) return null;

  return (
    <div className="container mx-auto py-8 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">CRM Dashboard</h1>
      <Tabs defaultValue="analytics" className="h-[calc(100vh-12rem)]">
        <TabsList className="mb-4">
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="clients">Clients</TabsTrigger>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="stocks">Stocks</TabsTrigger>
          <TabsTrigger value="docs">Docs</TabsTrigger>
          <TabsTrigger value="finance">Finance</TabsTrigger>
        </TabsList>
        <ScrollArea className="h-full rounded-md border">
          <div className="p-4">
            <TabsContent value="analytics" className="mt-0">
              <AnalyticsDashboard />
            </TabsContent>
            <TabsContent value="clients" className="mt-0">
              <ClientList />
            </TabsContent>
            <TabsContent value="tasks" className="mt-0">
              <TaskList />
            </TabsContent>
            <TabsContent value="stocks" className="mt-0">
              <StockMarketSection />
            </TabsContent>
            <TabsContent value="docs" className="mt-0">
              <DocumentEditor />
            </TabsContent>
            <TabsContent value="finance" className="mt-0">
              <FinancialEditor />
            </TabsContent>
          </div>
        </ScrollArea>
      </Tabs>
    </div>
  );
};

export default CRMPage;

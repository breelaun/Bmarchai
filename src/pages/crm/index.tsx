import { useSession } from "@supabase/auth-helpers-react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import ClientList from "@/components/crm/ClientList";
import TaskList from "@/components/crm/TaskList";
import AnalyticsDashboard from "@/components/crm/analytics/AnalyticsDashboard";
import { StockMarketSection } from "@/components/crm/stocks/StockMarketSection";
import DocumentEditor from "@/components/crm/DocumentEditor";
import FinancialEditor from "@/components/crm/FinancialEditor";

const CRMPage = () => {
  const session = useSession();
  const navigate = useNavigate();

  useEffect(() => {
    if (!session) {
      navigate("/login");
    }
  }, [session, navigate]);

  if (!session) return null;

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">CRM Dashboard</h1>
      <Tabs defaultValue="analytics" className="min-h-[calc(100vh-8rem)]">
        <TabsList>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="clients">Clients</TabsTrigger>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="stocks">Stocks</TabsTrigger>
          <TabsTrigger value="docs">Docs</TabsTrigger>
          <TabsTrigger value="finance">Finance</TabsTrigger>
        </TabsList>
        <ScrollArea className="h-full rounded-md">
          <TabsContent value="analytics" className="mt-0 p-4">
            <AnalyticsDashboard />
          </TabsContent>
          <TabsContent value="clients" className="mt-0 p-4">
            <ClientList />
          </TabsContent>
          <TabsContent value="tasks" className="mt-0 p-4">
            <TaskList />
          </TabsContent>
          <TabsContent value="stocks" className="mt-0 p-4">
            <StockMarketSection />
          </TabsContent>
          <TabsContent value="docs" className="mt-0 p-4">
            <DocumentEditor />
          </TabsContent>
          <TabsContent value="finance" className="mt-0 p-4">
            <FinancialEditor />
          </TabsContent>
        </ScrollArea>
      </Tabs>
    </div>
  );
};

export default CRMPage;
import { useSession } from "@supabase/auth-helpers-react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import ClientList from "@/components/crm/ClientList";
import TaskList from "@/components/crm/TaskList";
import AnalyticsDashboard from "@/components/crm/analytics/AnalyticsDashboard";
import { StockMarketSection } from "@/components/crm/stocks/StockMarketSection";
import DocumentEditor from "@/components/crm/DocumentEditor";
import FinancialEditor from "@/components/crm/FinancialEditor";

const CRMPage = () => {
  const session = useSession();
  const navigate = useNavigate();

  useEffect(() => {
    if (!session) {
      navigate("/login");
    }
  }, [session, navigate]);

  if (!session) return null;

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">CRM Dashboard</h1>
      <Tabs defaultValue="analytics" className="min-h-[calc(100vh-8rem)]">
        <TabsList>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="clients">Clients</TabsTrigger>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="stocks">Stocks</TabsTrigger>
          <TabsTrigger value="docs">Docs</TabsTrigger>
          <TabsTrigger value="finance">Finance</TabsTrigger>
        </TabsList>
        <ScrollArea className="h-full rounded-md">
          <TabsContent value="analytics" className="mt-0 p-4">
            <AnalyticsDashboard />
          </TabsContent>
          <TabsContent value="clients" className="mt-0 p-4">
            <ClientList />
          </TabsContent>
          <TabsContent value="tasks" className="mt-0 p-4">
            <TaskList />
          </TabsContent>
          <TabsContent value="stocks" className="mt-0 p-4">
            <StockMarketSection />
          </TabsContent>
          <TabsContent value="docs" className="mt-0 p-4">
            <DocumentEditor />
          </TabsContent>
          <TabsContent value="finance" className="mt-0 p-4">
            <FinancialEditor />
          </TabsContent>
        </ScrollArea>
      </Tabs>
    </div>
  );
};

export default CRMPage;

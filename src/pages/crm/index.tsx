import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import StockMarket from "@/components/crm/StockMarket";
import TaskList from "@/components/crm/TaskList";
import ClientList from "@/components/crm/ClientList";
import TeamCalendar from "@/components/crm/TeamCalendar";
import AnalyticsDashboard from "@/components/crm/analytics/AnalyticsDashboard";

const CRMPage = () => {
  return (
    <div className="container mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-bold">CRM Dashboard</h1>
      
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="clients">Clients</TabsTrigger>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="calendar">Calendar</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="market">Market</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="p-4">
              <ClientList />
            </Card>
            <Card className="p-4">
              <TaskList />
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="clients">
          <ClientList />
        </TabsContent>

        <TabsContent value="tasks">
          <TaskList />
        </TabsContent>

        <TabsContent value="calendar">
          <TeamCalendar />
        </TabsContent>

        <TabsContent value="analytics">
          <AnalyticsDashboard />
        </TabsContent>

        <TabsContent value="market">
          <StockMarket defaultSymbol="AAPL" />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CRMPage;
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ClientList from "@/components/crm/ClientList";
import TaskList from "@/components/crm/TaskList";
import StockMarket from "@/components/crm/StockMarket";
import AnalyticsDashboard from "@/components/crm/analytics/AnalyticsDashboard";

const CRM = () => {
  const [activeTab, setActiveTab] = useState("clients");

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
              <StockMarket symbol="AAPL" />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default CRM;
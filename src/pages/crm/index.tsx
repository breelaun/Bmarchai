import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ClientList from "@/components/crm/ClientList";
import TaskList from "@/components/crm/TaskList";
import StockMarket from "@/components/crm/StockMarket";
import DocumentEditor from "@/components/crm/DocumentEditor";

const CRMPage = () => {
  const [activeTab, setActiveTab] = useState("clients");

  return (
    <div className="container mx-auto p-4 space-y-4">
      <h1 className="text-3xl font-bold">CRM Dashboard</h1>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="clients">Clients</TabsTrigger>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="stocks">Stocks</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
        </TabsList>

        <TabsContent value="clients">
          <ClientList />
        </TabsContent>

        <TabsContent value="tasks">
          <TaskList />
        </TabsContent>

        <TabsContent value="stocks">
          <StockMarket defaultSymbol="AAPL" />
        </TabsContent>

        <TabsContent value="documents">
          <DocumentEditor />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CRMPage;
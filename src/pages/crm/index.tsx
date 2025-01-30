import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ClientList from "@/components/crm/ClientList";
import TaskList from "@/components/crm/TaskList";
import { TeamsList } from "@/components/crm/teams/TeamsList";
import AnalyticsDashboard from "@/components/crm/analytics/AnalyticsDashboard";
import TrainingDashboard from "@/components/crm/training/TrainingDashboard";
import DocumentEditor from "@/components/crm/DocumentEditor";
import FinancialEditor from "@/components/crm/FinancialEditor";
import { StockMarket } from "@/components/crm/StockMarket";
import { GymDashboard } from "@/components/crm/gym/GymDashboard";
import { ContactProfile } from "@/components/crm/contacts/ContactProfile";

const CRMPage = () => {
  return (
    <div className="container mx-auto py-6">
      <Tabs defaultValue="clients">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
          <TabsTrigger value="clients">Clients</TabsTrigger>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="teams">Teams</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="training">Training</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="financial">Financial</TabsTrigger>
          <TabsTrigger value="stocks">Stocks</TabsTrigger>
          <TabsTrigger value="gym">Gym</TabsTrigger>
          <TabsTrigger value="contacts">Contacts</TabsTrigger>
        </TabsList>

        <TabsContent value="clients">
          <ClientList />
        </TabsContent>

        <TabsContent value="tasks">
          <TaskList />
        </TabsContent>

        <TabsContent value="teams">
          <TeamsList />
        </TabsContent>

        <TabsContent value="analytics">
          <AnalyticsDashboard />
        </TabsContent>

        <TabsContent value="training">
          <TrainingDashboard />
        </TabsContent>

        <TabsContent value="documents">
          <DocumentEditor />
        </TabsContent>

        <TabsContent value="financial">
          <FinancialEditor />
        </TabsContent>

        <TabsContent value="stocks">
          <StockMarket defaultSymbol="AAPL" />
        </TabsContent>

        <TabsContent value="gym">
          <GymDashboard />
        </TabsContent>

        <TabsContent value="contacts">
          <ContactProfile clientId="default" />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CRMPage;
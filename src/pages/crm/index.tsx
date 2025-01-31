import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import StockMarket from "@/components/crm/StockMarket";
import { TaskList } from "@/components/crm/tasks/TaskList";
import { LeadPipeline } from "@/components/crm/pipeline/LeadPipeline";
import { ContactProfile } from "@/components/crm/contacts/ContactProfile";
import GymDashboard from "@/components/crm/gym/GymDashboard";
import TrainingDashboard from "@/components/crm/training/TrainingDashboard";
import { TeamsList } from "@/components/crm/teams/TeamsList";

export default function CRMPage() {
  return (
    <div className="container mx-auto py-8">
      <Tabs defaultValue="stocks" className="space-y-6">
        <TabsList>
          <TabsTrigger value="stocks">Stocks</TabsTrigger>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="pipeline">Pipeline</TabsTrigger>
          <TabsTrigger value="contacts">Contacts</TabsTrigger>
          <TabsTrigger value="gym">Gym</TabsTrigger>
          <TabsTrigger value="training">Training</TabsTrigger>
          <TabsTrigger value="teams">Teams</TabsTrigger>
        </TabsList>

        <TabsContent value="stocks">
          <StockMarket />
        </TabsContent>

        <TabsContent value="tasks">
          <TaskList />
        </TabsContent>

        <TabsContent value="pipeline">
          <LeadPipeline />
        </TabsContent>

        <TabsContent value="contacts">
          <ContactProfile clientId="default" />
        </TabsContent>

        <TabsContent value="gym">
          <GymDashboard />
        </TabsContent>

        <TabsContent value="training">
          <TrainingDashboard />
        </TabsContent>

        <TabsContent value="teams">
          <TeamsList />
        </TabsContent>
      </Tabs>
    </div>
  );
}
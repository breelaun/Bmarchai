import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ClientList from "@/components/crm/ClientList";
import TaskList from "@/components/crm/TaskList";
import { TeamsList } from "@/components/crm/teams/TeamsList";
import { AnalyticsDashboard } from "@/components/crm/analytics/AnalyticsDashboard";

const CRMPage = () => {
  return (
    <div className="container py-6">
      <Tabs defaultValue="clients">
        <TabsList>
          <TabsTrigger value="clients">Clients</TabsTrigger>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="teams">Teams</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
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
      </Tabs>
    </div>
  );
};

export default CRMPage;
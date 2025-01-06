import { useSession } from "@supabase/auth-helpers-react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import ClientList from "@/components/crm/ClientList";
import TaskList from "@/components/crm/TaskList";

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
      <Tabs defaultValue="clients" className="h-[calc(100vh-12rem)]">
        <TabsList>
          <TabsTrigger value="clients">Clients</TabsTrigger>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
        </TabsList>
        <ScrollArea className="h-full rounded-md">
          <TabsContent value="clients" className="mt-0 p-4">
            <ClientList />
          </TabsContent>
          <TabsContent value="tasks" className="mt-0 p-4">
            <TaskList />
          </TabsContent>
        </ScrollArea>
      </Tabs>
    </div>
  );
};

export default CRMPage;
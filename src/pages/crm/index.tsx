import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ClientList from "@/components/crm/ClientList";
import TaskList from "@/components/crm/TaskList";
import { TeamsList } from "@/components/crm/teams/TeamsList";
import AnalyticsDashboard from "@/components/crm/analytics/AnalyticsDashboard";
import TrainingDashboard from "@/components/crm/training/TrainingDashboard";
import DocumentEditor from "@/components/crm/DocumentEditor";
import FinancialEditor from "@/components/crm/FinancialEditor";
import { StockMarket } from "@/components/crm/StockMarket";
import GymDashboard from "@/components/crm/gym/GymDashboard";
import { ContactProfile } from "@/components/crm/contacts/ContactProfile";
import { Users, ListTodo, Users2, BarChart3, Dumbbell, FileText, DollarSign, TrendingUp, Building2, UserCircle2 } from "lucide-react";

const CRMPage = () => {
  return (
    <div className="container mx-auto p-4 md:p-6 min-h-screen bg-background">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gradient mb-2">CRM Dashboard</h1>
        <p className="text-muted-foreground">Manage your business relationships and data</p>
      </div>

      <Tabs defaultValue="clients" className="space-y-6">
        <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-lg py-4 border-b">
          <TabsList className="grid grid-cols-2 md:grid-cols-5 lg:grid-cols-10 gap-2 h-auto">
            <TabsTrigger value="clients" className="flex items-center gap-2 data-[state=active]:bg-primary/20">
              <Users className="h-4 w-4" />
              <span className="hidden md:inline">Clients</span>
            </TabsTrigger>
            <TabsTrigger value="tasks" className="flex items-center gap-2 data-[state=active]:bg-primary/20">
              <ListTodo className="h-4 w-4" />
              <span className="hidden md:inline">Tasks</span>
            </TabsTrigger>
            <TabsTrigger value="teams" className="flex items-center gap-2 data-[state=active]:bg-primary/20">
              <Users2 className="h-4 w-4" />
              <span className="hidden md:inline">Teams</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2 data-[state=active]:bg-primary/20">
              <BarChart3 className="h-4 w-4" />
              <span className="hidden md:inline">Analytics</span>
            </TabsTrigger>
            <TabsTrigger value="training" className="flex items-center gap-2 data-[state=active]:bg-primary/20">
              <Dumbbell className="h-4 w-4" />
              <span className="hidden md:inline">Training</span>
            </TabsTrigger>
            <TabsTrigger value="documents" className="flex items-center gap-2 data-[state=active]:bg-primary/20">
              <FileText className="h-4 w-4" />
              <span className="hidden md:inline">Documents</span>
            </TabsTrigger>
            <TabsTrigger value="financial" className="flex items-center gap-2 data-[state=active]:bg-primary/20">
              <DollarSign className="h-4 w-4" />
              <span className="hidden md:inline">Financial</span>
            </TabsTrigger>
            <TabsTrigger value="stocks" className="flex items-center gap-2 data-[state=active]:bg-primary/20">
              <TrendingUp className="h-4 w-4" />
              <span className="hidden md:inline">Stocks</span>
            </TabsTrigger>
            <TabsTrigger value="gym" className="flex items-center gap-2 data-[state=active]:bg-primary/20">
              <Building2 className="h-4 w-4" />
              <span className="hidden md:inline">Gym</span>
            </TabsTrigger>
            <TabsTrigger value="contacts" className="flex items-center gap-2 data-[state=active]:bg-primary/20">
              <UserCircle2 className="h-4 w-4" />
              <span className="hidden md:inline">Contacts</span>
            </TabsTrigger>
          </TabsList>
        </div>

        <div className="mt-4">
          <TabsContent value="clients" className="space-y-4">
            <ClientList />
          </TabsContent>

          <TabsContent value="tasks" className="space-y-4">
            <TaskList />
          </TabsContent>

          <TabsContent value="teams" className="space-y-4">
            <TeamsList />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <AnalyticsDashboard />
          </TabsContent>

          <TabsContent value="training" className="space-y-4">
            <TrainingDashboard />
          </TabsContent>

          <TabsContent value="documents" className="space-y-4">
            <DocumentEditor />
          </TabsContent>

          <TabsContent value="financial" className="space-y-4">
            <FinancialEditor />
          </TabsContent>

          <TabsContent value="stocks" className="space-y-4">
            <StockMarket defaultSymbol="AAPL" />
          </TabsContent>

          <TabsContent value="gym" className="space-y-4">
            <GymDashboard />
          </TabsContent>

          <TabsContent value="contacts" className="space-y-4">
            <ContactProfile clientId="default" />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default CRMPage;
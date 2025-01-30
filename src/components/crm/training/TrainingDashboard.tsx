import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Calendar, DollarSign, ClipboardList, Loader2, UserPlus } from "lucide-react";
import { TrainersList } from "./TrainersList";
import { SessionsList } from "./SessionsList";
import { ProgressTracking } from "./ProgressTracking";

const TrainingDashboard = () => {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["training-stats"],
    queryFn: async () => {
      const [trainersCount, sessionsCount] = await Promise.all([
        supabase.from("gym_trainers").select("*", { count: "exact" }),
        supabase.from("trainer_sessions").select("*", { count: "exact" }),
      ]);

      return {
        trainers: trainersCount.count || 0,
        sessions: sessionsCount.count || 0,
      };
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Trainers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.trainers}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Sessions</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.sessions}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$0</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Progress Reports</CardTitle>
            <ClipboardList className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="trainers" className="space-y-4">
        <TabsList>
          <TabsTrigger value="trainers">Trainers</TabsTrigger>
          <TabsTrigger value="sessions">Sessions</TabsTrigger>
          <TabsTrigger value="progress">Progress Tracking</TabsTrigger>
        </TabsList>

        <TabsContent value="trainers">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold">Trainers</h2>
            <Button>
              <UserPlus className="h-4 w-4 mr-2" />
              Add Trainer
            </Button>
          </div>
          <TrainersList />
        </TabsContent>

        <TabsContent value="sessions">
          <SessionsList />
        </TabsContent>

        <TabsContent value="progress">
          <ProgressTracking />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TrainingDashboard;
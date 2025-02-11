
import { useSession } from "@supabase/auth-helpers-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";
import SessionCard from "@/components/sessions/SessionCard";
import CompletedSessions from "@/components/sessions/CompletedSessions";
import type { SessionWithVendor } from "@/types/session";

const SessionsPage = () => {
  const session = useSession();

  const { data: userSessions, isLoading: loadingUserSessions } = useQuery({
    queryKey: ['user-sessions'],
    queryFn: async () => {
      if (!session?.user?.id) return [];
      const { data, error } = await supabase
        .from('session_participants')
        .select(`
          sessions (
            id,
            name,
            description,
            start_time,
            duration,
            max_participants,
            completed_at,
            status,
            recording_id,
            vendor_profiles (
              business_name,
              profiles (
                username
              )
            )
          )
        `)
        .eq('user_id', session.user.id);

      if (error) throw error;
      
      return (data?.map(sp => sp.sessions) || []).flat().filter(Boolean) as SessionWithVendor[];
    },
    enabled: !!session?.user?.id
  });

  const { data: upcomingSessions, isLoading: loadingUpcoming } = useQuery({
    queryKey: ['upcoming-sessions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('sessions')
        .select(`
          id,
          name,
          description,
          start_time,
          duration,
          max_participants,
          completed_at,
          status,
          recording_id,
          vendor_profiles (
            business_name,
            profiles (
              username
            )
          )
        `)
        .gte('start_time', new Date().toISOString())
        .is('completed_at', null)
        .order('start_time', { ascending: true });

      if (error) throw error;
      return data as SessionWithVendor[];
    }
  });

  const completedSessions = userSessions?.filter(s => s.status === 'completed') || [];
  const activeSessions = userSessions?.filter(s => s.status !== 'completed') || [];

  const renderLoading = () => (
    <div className="flex items-center justify-center p-8">
      <Loader2 className="h-8 w-8 animate-spin" />
    </div>
  );

  const renderEmptyState = (message: string) => (
    <Card>
      <CardContent className="py-8">
        <p className="text-center text-muted-foreground">{message}</p>
      </CardContent>
    </Card>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Sessions</h1>
      
      <Tabs defaultValue="upcoming" className="space-y-6">
        <TabsList>
          <TabsTrigger value="upcoming">All Upcoming Sessions</TabsTrigger>
          {session && <TabsTrigger value="my-sessions">My Sessions</TabsTrigger>}
        </TabsList>

        <TabsContent value="upcoming">
          {loadingUpcoming ? (
            renderLoading()
          ) : !upcomingSessions?.length ? (
            renderEmptyState("There are no upcoming sessions scheduled at the moment.")
          ) : (
            <div className="space-y-4">
              {upcomingSessions.map(session => (
                <SessionCard key={session.id} session={session} />
              ))}
            </div>
          )}
        </TabsContent>

        {session && (
          <TabsContent value="my-sessions">
            {loadingUserSessions ? (
              renderLoading()
            ) : activeSessions.length === 0 && completedSessions.length === 0 ? (
              renderEmptyState("You haven't joined any sessions yet.")
            ) : (
              <div className="space-y-4">
                {activeSessions.map(session => (
                  <SessionCard key={session.id} session={session} />
                ))}
                <CompletedSessions sessions={completedSessions} />
              </div>
            )}
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};

export default SessionsPage;

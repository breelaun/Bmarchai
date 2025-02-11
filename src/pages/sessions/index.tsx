
import { useSession } from "@supabase/auth-helpers-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UpcomingSessions from "@/components/sessions/UpcomingSessions";
import UserSessions from "@/components/sessions/UserSessions";
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

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Sessions</h1>
      
      <Tabs defaultValue="upcoming" className="space-y-6">
        <TabsList>
          <TabsTrigger value="upcoming">All Upcoming Sessions</TabsTrigger>
          {session && <TabsTrigger value="my-sessions">My Sessions</TabsTrigger>}
        </TabsList>

        <TabsContent value="upcoming">
          <UpcomingSessions 
            sessions={upcomingSessions} 
            isLoading={loadingUpcoming} 
          />
        </TabsContent>

        {session && (
          <TabsContent value="my-sessions">
            <UserSessions 
              sessions={userSessions} 
              isLoading={loadingUserSessions} 
            />
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};

export default SessionsPage;

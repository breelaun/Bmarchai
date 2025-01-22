import { useSession } from "@supabase/auth-helpers-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, Users } from "lucide-react";
import { formatToLocalTime } from "@/utils/timezone";

interface SessionWithVendor {
  id: string;
  name: string;
  description: string | null;
  start_time: string;
  duration: string;
  max_participants: number;
  vendor_profiles: {
    business_name: string;
    profiles: {
      username: string;
    }[];
  }[];
}

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
      
      return (data?.map(sp => sp.sessions) || []) as SessionWithVendor[];
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
          vendor_profiles (
            business_name,
            profiles (
              username
            )
          )
        `)
        .gte('start_time', new Date().toISOString())
        .order('start_time', { ascending: true });

      if (error) throw error;
      return data as SessionWithVendor[];
    }
  });

  const renderSessionCard = (session: SessionWithVendor) => (
    <Card key={session.id} className="mb-4">
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-2">{session.name}</h3>
        {session.description && (
          <p className="text-muted-foreground mb-3">{session.description}</p>
        )}
        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            {formatToLocalTime(session.start_time, 'UTC')}
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            {session.duration}
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            {session.max_participants} participants max
          </div>
        </div>
        <div className="mt-3 text-sm">
          Hosted by: {session.vendor_profiles[0]?.business_name || 
                     session.vendor_profiles[0]?.profiles[0]?.username || 
                     "Unknown Vendor"}
        </div>
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
          <div className="space-y-4">
            {loadingUpcoming ? (
              <div>Loading upcoming sessions...</div>
            ) : upcomingSessions?.length === 0 ? (
              <Card>
                <CardHeader>
                  <CardTitle>No Upcoming Sessions</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    There are no upcoming sessions scheduled at the moment.
                  </p>
                </CardContent>
              </Card>
            ) : (
              upcomingSessions?.map(renderSessionCard)
            )}
          </div>
        </TabsContent>

        {session && (
          <TabsContent value="my-sessions">
            <div className="space-y-4">
              {loadingUserSessions ? (
                <div>Loading your sessions...</div>
              ) : userSessions?.length === 0 ? (
                <Card>
                  <CardHeader>
                    <CardTitle>No Sessions Found</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      You haven't joined any sessions yet.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                userSessions?.map(renderSessionCard)
              )}
            </div>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};

export default SessionsPage;
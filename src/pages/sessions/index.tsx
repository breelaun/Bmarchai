
import { useSession } from "@supabase/auth-helpers-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, Users, ChevronDown, ChevronUp } from "lucide-react";
import { formatToLocalTime } from "@/utils/timezone";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface SessionWithVendor {
  id: string;
  name: string;
  description: string | null;
  start_time: string;
  duration: string;
  max_participants: number;
  completed_at: string | null;
  status: 'scheduled' | 'active' | 'completed' | 'cancelled';
  recording_id: string | null;
  vendor_profiles: Array<{
    business_name: string;
    profiles: Array<{
      username: string;
    }>;
  }>;
}

const SessionsPage = () => {
  const session = useSession();
  const [isCompletedOpen, setIsCompletedOpen] = useState(false);

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
        {session.status === 'completed' && session.recording_id && (
          <div className="mt-3">
            <Button variant="outline" size="sm">
              View Recording
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );

  const completedSessions = userSessions?.filter(s => s.status === 'completed') || [];
  const activeSessions = userSessions?.filter(s => s.status !== 'completed') || [];

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
              ) : activeSessions.length === 0 && completedSessions.length === 0 ? (
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
                <>
                  {activeSessions.map(renderSessionCard)}
                  
                  {completedSessions.length > 0 && (
                    <Collapsible
                      open={isCompletedOpen}
                      onOpenChange={setIsCompletedOpen}
                      className="space-y-2"
                    >
                      <CollapsibleTrigger asChild>
                        <Button
                          variant="ghost"
                          className="flex w-full justify-between p-4"
                        >
                          <span className="font-semibold">
                            Completed Sessions ({completedSessions.length})
                          </span>
                          {isCompletedOpen ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </Button>
                      </CollapsibleTrigger>
                      <CollapsibleContent className="space-y-2">
                        {completedSessions.map(renderSessionCard)}
                      </CollapsibleContent>
                    </Collapsible>
                  )}
                </>
              )}
            </div>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};

export default SessionsPage;

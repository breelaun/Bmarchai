import { useState, useEffect, useCallback } from 'react';
import { useSession } from "@supabase/auth-helpers-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, Users } from "lucide-react";
import { formatToLocalTime } from "@/utils/timezone";
import { Button } from "@/components/ui/button"; // Assuming you have this component
import { VideoPlayer, Chat, UserList } from "@/components/SessionComponents"; // New components to handle session specifics

interface Session {
  id: string;
  name: string;
  description: string | null;
  start_time: string;
  duration: string;
  max_participants: number;
  vendor_profiles: {
    business_name: string | null;
    profiles: {
      username: string | null;
    }
  };
  videos?: Array<{ url: string; order: number }>;
}

const SessionsPage = () => {
  const session = useSession();
  const [currentSession, setCurrentSession] = useState<Session | null>(null);
  const [isInSession, setIsInSession] = useState(false);
  const queryClient = useQueryClient();

  // ... existing query for user sessions ...

  // Query for session details including videos when entering a session
  const { data: sessionDetails, isLoading: loadingSessionDetails } = useQuery({
    queryKey: ['session-details', currentSession?.id],
    queryFn: async () => {
      if (!currentSession) return null;
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
          ),
          session_videos (url, order)
        `)
        .eq('id', currentSession.id)
        .single();

      if (error) throw error;
      return {
        ...data,
        videos: data.session_videos.sort((a: any, b: any) => a.order - b.order)
      } as Session;
    },
    enabled: !!currentSession
  });

  const startSession = useCallback((session: Session) => {
    setCurrentSession(session);
    setIsInSession(true);
  }, []);

  const endSession = useCallback(() => {
    setIsInSession(false);
    setCurrentSession(null);
  }, []);

  const renderSessionCard = (session: Session) => (
    <Card key={session.id} className="mb-4">
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-2">{session.name}</h3>
        {/* ... existing session card content ... */}
        <Button onClick={() => startSession(session)}>Join Session</Button>
      </CardContent>
    </Card>
  );

  // Render session interface
  if (isInSession && sessionDetails) {
    return (
      <div className="flex flex-col h-screen">
        <h1 className="text-3xl font-bold mb-8">Session: {sessionDetails.name}</h1>
        <div className="flex flex-1">
          <div className="w-3/4">
            <VideoPlayer videos={sessionDetails.videos || []} />
          </div>
          <div className="w-1/4 flex flex-col">
            <UserList session={sessionDetails} />
            <Chat session={sessionDetails} />
          </div>
        </div>
        <Button onClick={endSession}>End Session</Button>
      </div>
    );
  }

  // ... rest of the component for listing sessions ...

};

export default SessionsPage;

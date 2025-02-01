import React from 'react';
import { Video, Plus } from 'lucide-react';
import { useSession } from '@supabase/auth-helpers-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import type { Session } from '@/types/session';
import CreateSessionDialog from './CreateSessionDialog';

interface LiveSessionsProps {
  sessions: Session[];
}

const LiveSessions = ({ sessions }: LiveSessionsProps) => {
  const session = useSession();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const joinSession = useMutation({
    mutationFn: async (sessionData: Session) => {
      if (!session?.user?.id) throw new Error('Not authenticated');

      if (sessionData.session_type === 'paid') {
        // Create Stripe checkout session
        const response = await supabase.functions.invoke('create-session-checkout', {
          body: { sessionId: sessionData.id, userId: session.user.id }
        });

        if (response.error) throw response.error;
        
        // Redirect to Stripe checkout
        window.location.href = response.data.url;
        return;
      }

      // For free sessions, directly add participant
      const { error } = await supabase
        .from('session_participants')
        .insert({
          session_id: sessionData.id,
          user_id: session.user.id,
          has_completed: false
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
      toast({
        title: "Success",
        description: "Successfully joined the session",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between px-2">
        <h3 className="text-sm font-semibold">Live Sessions</h3>
      </div>
      <CreateSessionDialog />
      <div className="space-y-1">
        {sessions.map((session) => (
          <div
            key={session.id}
            className="flex items-center justify-between px-2 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:bg-accent rounded-md"
          >
            <div className="flex items-center space-x-2">
              <Video className="h-4 w-4" />
              <div className="flex-1 truncate">
                <p className="font-medium truncate">{session.name}</p>
                <p className="text-xs text-muted-foreground truncate">
                  {session.vendor_profiles?.[0]?.business_name || 'Unknown Vendor'}
                </p>
              </div>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => joinSession.mutate(session)}
              disabled={joinSession.isPending}
            >
              {session.session_type === 'paid' ? `Join ($${session.price})` : 'Join Free'}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LiveSessions;
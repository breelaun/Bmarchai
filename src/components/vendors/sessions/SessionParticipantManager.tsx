import React from 'react';
import { useSession } from '@supabase/auth-helpers-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import type { Session } from '@/types/session';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { formatToLocalTime } from "@/utils/timezone";

interface SessionParticipantManagerProps {
  sessionId: string;
  participants: Session['session_participants'];
}

const SessionParticipantManager = ({ sessionId, participants }: SessionParticipantManagerProps) => {
  const session = useSession();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const confirmPayment = useMutation({
    mutationFn: async ({ participantId, notes }: { participantId: string; notes?: string }) => {
      const { error } = await supabase
        .from('session_participants')
        .update({
          payment_status: 'completed',
          payment_confirmed_at: new Date().toISOString(),
          payment_confirmed_by: session?.user?.id,
          payment_notes: notes
        })
        .eq('id', participantId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
      toast({
        title: "Payment confirmed",
        description: "The participant's payment has been marked as confirmed.",
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
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Session Participants</h3>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Participant</TableHead>
            <TableHead>Payment Method</TableHead>
            <TableHead>Payment Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {participants?.map((participant) => (
            <TableRow key={participant.user_id}>
              <TableCell>
                {participant.profiles?.username || 'Anonymous'}
              </TableCell>
              <TableCell>
                <Badge variant={participant.payment_method === 'cash' ? 'secondary' : 'default'}>
                  {participant.payment_method === 'cash' ? 'Cash' : 'Card'}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge 
                  variant={
                    participant.payment_status === 'completed' 
                      ? 'default' 
                      : participant.payment_status === 'pending' 
                        ? 'secondary' 
                        : 'destructive'
                  }
                >
                  {participant.payment_status}
                </Badge>
              </TableCell>
              <TableCell>
                {participant.payment_method === 'cash' && participant.payment_status === 'pending' && (
                  <Button
                    size="sm"
                    onClick={() => confirmPayment.mutate({ participantId: participant.user_id })}
                    disabled={confirmPayment.isPending}
                  >
                    Confirm Payment
                  </Button>
                )}
                {participant.payment_confirmed_at && (
                  <span className="text-sm text-muted-foreground">
                    Confirmed at {formatToLocalTime(participant.payment_confirmed_at, 'PPp')}
                  </span>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default SessionParticipantManager;
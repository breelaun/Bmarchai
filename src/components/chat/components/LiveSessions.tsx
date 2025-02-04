import React from 'react';
import { Video, Plus } from 'lucide-react';
import { useSession } from '@supabase/auth-helpers-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import type { Session } from '@/types/session';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from '@/components/ui/label';

interface LiveSessionsProps {
  sessions: Session[];
}

const LiveSessions = ({ sessions }: LiveSessionsProps) => {
  const session = useSession();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedPaymentMethod, setSelectedPaymentMethod] = React.useState<'card' | 'cash'>('card');

  const joinSession = useMutation({
    mutationFn: async (sessionData: Session) => {
      if (!session?.user?.id) throw new Error('Not authenticated');

      if (sessionData.session_type === 'paid') {
        if (selectedPaymentMethod === 'card') {
          // Calculate platform fee (3%) for card payments
          const platformFeePercentage = 0.03;
          const platformFeeAmount = sessionData.price * platformFeePercentage;
          const totalAmount = sessionData.price + platformFeeAmount;

          // Create Stripe checkout session with platform fee
          const response = await supabase.functions.invoke('create-session-checkout', {
            body: { 
              sessionId: sessionData.id, 
              userId: session.user.id,
              platformFee: platformFeeAmount,
              totalAmount: totalAmount
            }
          });

          if (response.error) throw response.error;
          
          // Redirect to Stripe checkout
          window.location.href = response.data.url;
          return;
        } else {
          // For cash payments, create participant record with pending status
          const { error } = await supabase
            .from('session_participants')
            .insert({
              session_id: sessionData.id,
              user_id: session.user.id,
              payment_method: 'cash',
              payment_status: 'pending',
              has_completed: false
            });

          if (error) throw error;
        }
      } else {
        // For free sessions, directly add participant
        const { error } = await supabase
          .from('session_participants')
          .insert({
            session_id: sessionData.id,
            user_id: session.user.id,
            has_completed: false,
            payment_method: 'card',
            payment_status: 'completed'
          });

        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
      toast({
        title: "Success",
        description: selectedPaymentMethod === 'cash' 
          ? "Session joined successfully. Please arrange cash payment with the vendor."
          : "Successfully joined the session",
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

  const handleJoinSession = (sessionData: Session) => {
    if (sessionData.session_type === 'paid') {
      setShowPaymentDialog(true);
      setSelectedSession(sessionData);
    } else {
      joinSession.mutate(sessionData);
    }
  };

  const [showPaymentDialog, setShowPaymentDialog] = React.useState(false);
  const [selectedSession, setSelectedSession] = React.useState<Session | null>(null);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between px-2">
        <h3 className="text-sm font-semibold">Live Sessions</h3>
      </div>
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
              onClick={() => handleJoinSession(session)}
              disabled={joinSession.isPending}
            >
              {session.session_type === 'paid' ? `Join ($${session.price})` : 'Join Free'}
            </Button>
          </div>
        ))}
      </div>

      <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Select Payment Method</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Payment Method</Label>
              <Select
                value={selectedPaymentMethod}
                onValueChange={(value: 'card' | 'cash') => setSelectedPaymentMethod(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select payment method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="card">
                    Card (${selectedSession?.price} + 3% platform fee)
                  </SelectItem>
                  <SelectItem value="cash">Cash (${selectedSession?.price})</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button 
              className="w-full" 
              onClick={() => {
                if (selectedSession) {
                  joinSession.mutate(selectedSession);
                  setShowPaymentDialog(false);
                }
              }}
            >
              Confirm
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LiveSessions;

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { UserPlus, UserCheck, Loader2 } from "lucide-react";

interface AddContactButtonProps {
  targetUserId: string;
  onRequestSent?: () => void;
}

const AddContactButton = ({ targetUserId, onRequestSent }: AddContactButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [requestStatus, setRequestStatus] = useState<'none' | 'pending' | 'accepted'>('none');
  const { toast } = useToast();

  useEffect(() => {
    checkExistingRequest();
  }, [targetUserId]);

  const checkExistingRequest = async () => {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user?.user?.id) return;

      const { data: existingRequest, error } = await supabase
        .from('contacts')
        .select('*')
        .or(`requester_id.eq.${targetUserId},receiver_id.eq.${targetUserId}`)
        .eq('status', 'accepted')
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error checking contact request:', error);
        return;
      }

      if (existingRequest) {
        setRequestStatus('accepted');
        return;
      }

      const { data: pendingRequest, error: pendingError } = await supabase
        .from('contacts')
        .select('*')
        .or(`requester_id.eq.${targetUserId},receiver_id.eq.${targetUserId}`)
        .eq('status', 'pending')
        .single();

      if (pendingError && pendingError.code !== 'PGRST116') {
        console.error('Error checking pending request:', pendingError);
        return;
      }

      setRequestStatus(pendingRequest ? 'pending' : 'none');
    } catch (error) {
      console.error('Error in checkExistingRequest:', error);
    }
  };

  const sendContactRequest = async () => {
    setIsLoading(true);
    try {
      const { data: user } = await supabase.auth.getUser();
      
      if (!user?.user?.id) {
        toast({
          title: "Error",
          description: "You must be logged in to send contact requests",
          variant: "destructive",
        });
        return;
      }

      const { data, error } = await supabase
        .from('contacts')
        .insert([
          {
            requester_id: user.user.id,
            receiver_id: targetUserId,
            status: 'pending'
          }
        ])
        .select()
        .single();

      if (error) {
        console.error('Error sending contact request:', error);
        toast({
          title: "Error",
          description: "Failed to send contact request",
          variant: "destructive",
        });
        return;
      }

      setRequestStatus('pending');
      toast({
        title: "Success",
        description: "Contact request sent",
      });

      if (onRequestSent) {
        onRequestSent();
      }
    } catch (error) {
      console.error('Error in sendContactRequest:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (requestStatus === 'accepted') {
    return (
      <Button variant="outline" disabled>
        <UserCheck className="h-4 w-4 mr-2" />
        Connected
      </Button>
    );
  }

  if (requestStatus === 'pending') {
    return (
      <Button variant="outline" disabled>
        <UserCheck className="h-4 w-4 mr-2" />
        Request Sent
      </Button>
    );
  }

  return (
    <Button
      onClick={sendContactRequest}
      disabled={isLoading}
      variant="outline"
      size="sm"
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
      ) : (
        <UserPlus className="h-4 w-4 mr-2" />
      )}
      Add Contact
    </Button>
  );
};

export default AddContactButton;
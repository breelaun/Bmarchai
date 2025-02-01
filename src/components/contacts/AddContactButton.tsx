import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { UserPlus } from "lucide-react";

interface AddContactButtonProps {
  targetUserId: string;
  onRequestSent?: () => void;
}

const AddContactButton = ({ targetUserId, onRequestSent }: AddContactButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [hasRequested, setHasRequested] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    checkExistingRequest();
  }, [targetUserId]);

  const checkExistingRequest = async () => {
    try {
      console.log('Checking existing request for target user:', targetUserId);
      
      const { data: existingRequest, error } = await supabase
        .from('contacts')
        .select('*')
        .or(`requester_id.eq.${targetUserId},receiver_id.eq.${targetUserId}`)
        .single();

      if (error) {
        console.error('Error checking contact request:', error);
        return;
      }

      console.log('Existing request check result:', existingRequest);
      setHasRequested(!!existingRequest);
    } catch (error) {
      console.error('Error in checkExistingRequest:', error);
    }
  };

  const sendContactRequest = async () => {
    setIsLoading(true);
    console.log('Sending contact request to:', targetUserId);

    try {
      const { data: user } = await supabase.auth.getUser();
      
      if (!user?.user?.id) {
        console.error('No authenticated user found');
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

      console.log('Contact request sent successfully:', data);
      setHasRequested(true);
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

  if (hasRequested) {
    return (
      <Button variant="outline" disabled>
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
      <UserPlus className="h-4 w-4 mr-2" />
      Add Contact
    </Button>
  );
};

export default AddContactButton;
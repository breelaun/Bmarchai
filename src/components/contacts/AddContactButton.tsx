import { useState } from "react";
import { Button } from "@/components/ui/button";
import { UserPlus, UserCheck } from "lucide-react";
import { useSession } from "@supabase/auth-helpers-react";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface AddContactButtonProps {
  targetUserId: string;
  className?: string;
}

const AddContactButton = ({ targetUserId, className = "" }: AddContactButtonProps) => {
  const session = useSession();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);

  const { data: contactStatus } = useQuery({
    queryKey: ['contact-status', targetUserId],
    queryFn: async () => {
      if (!session?.user?.id || !targetUserId || targetUserId === 'profile') return null;
      
      const { data, error } = await supabase
        .from('contacts')
        .select('*')
        .or(`requester_id.eq.${session.user.id},receiver_id.eq.${session.user.id}`)
        .or(`requester_id.eq.${targetUserId},receiver_id.eq.${targetUserId}`)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data;
    },
    enabled: !!session?.user?.id && !!targetUserId && targetUserId !== 'profile' && session.user.id !== targetUserId
  });

  const addContact = useMutation({
    mutationFn: async () => {
      if (!session?.user?.id || !targetUserId || targetUserId === 'profile') {
        throw new Error('Invalid user IDs');
      }
      
      const { error } = await supabase
        .from('contacts')
        .insert({
          requester_id: session.user.id,
          receiver_id: targetUserId,
          status: 'pending'
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contact-status', targetUserId] });
      toast({
        title: "Contact request sent",
        description: "They will be notified of your request.",
      });
    },
    onError: (error) => {
      console.error('Error adding contact:', error);
      toast({
        title: "Error",
        description: "Failed to send contact request. Please try again.",
        variant: "destructive",
      });
    }
  });

  if (!session?.user?.id || session.user.id === targetUserId || targetUserId === 'profile') {
    return null;
  }

  const handleAddContact = async () => {
    setIsLoading(true);
    try {
      await addContact.mutateAsync();
    } finally {
      setIsLoading(false);
    }
  };

  const getButtonState = () => {
    if (!contactStatus) {
      return {
        icon: <UserPlus className="h-4 w-4 mr-2" />,
        text: "Add Contact",
        onClick: handleAddContact,
        disabled: false
      };
    }

    switch (contactStatus.status) {
      case 'accepted':
        return {
          icon: <UserCheck className="h-4 w-4 mr-2" />,
          text: "Contact",
          disabled: true
        };
      case 'pending':
        return {
          icon: <UserPlus className="h-4 w-4 mr-2" />,
          text: "Request Pending",
          disabled: true
        };
      default:
        return {
          icon: <UserPlus className="h-4 w-4 mr-2" />,
          text: "Add Contact",
          onClick: handleAddContact,
          disabled: false
        };
    }
  };

  const buttonState = getButtonState();

  return (
    <Button
      variant="outline"
      size="sm"
      className={className}
      onClick={buttonState.onClick}
      disabled={buttonState.disabled || isLoading}
    >
      {buttonState.icon}
      {buttonState.text}
    </Button>
  );
};

export default AddContactButton;
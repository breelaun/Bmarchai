import { Button } from "@/components/ui/button";
import { MessageSquare, UserPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useQuery } from "@tanstack/react-query";

interface SendMessageButtonProps {
  recipientId: string;
  className?: string;
}

const SendMessageButton = ({ recipientId, className }: SendMessageButtonProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const { data: contactStatus } = useQuery({
    queryKey: ['contact-status', recipientId],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data, error } = await supabase
        .from('contacts')
        .select('status')
        .or(`requester_id.eq.${user.id},receiver_id.eq.${user.id}`)
        .or(`requester_id.eq.${recipientId},receiver_id.eq.${recipientId}`)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data?.status;
    },
  });

  const handleAddContact = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please log in to add contacts",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from('contacts')
        .insert({
          requester_id: user.id,
          receiver_id: recipientId,
          status: 'pending'
        });

      if (error) throw error;

      toast({
        title: "Contact Request Sent",
        description: "Your contact request has been sent successfully.",
      });
    } catch (error: any) {
      console.error('Error sending contact request:', error);
      toast({
        title: "Error",
        description: "Failed to send contact request. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleClick = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please log in to send messages",
          variant: "destructive",
        });
        return;
      }

      // Check if a channel already exists between these users
      const { data: existingChannel } = await supabase
        .from('chat_channels')
        .select('id')
        .eq('owner_id', user.id)
        .eq('is_public', false)
        .contains('active_products', [])
        .single();

      if (existingChannel) {
        navigate(`/chat?channel=${existingChannel.id}`);
        return;
      }

      // Create a new channel
      const { data: newChannel, error: channelError } = await supabase
        .from('chat_channels')
        .insert({
          owner_id: user.id,
          name: 'Direct Message',
          is_public: false,
          channel_type: 'chat',
        })
        .select()
        .single();

      if (channelError) throw channelError;

      // Add both users as members
      await supabase.from('chat_members').insert([
        {
          channel_id: newChannel.id,
          user_id: user.id,
          role: 'admin'
        },
        {
          channel_id: newChannel.id,
          user_id: recipientId,
          role: 'member'
        }
      ]);

      navigate(`/chat?channel=${newChannel.id}`);
    } catch (error) {
      console.error('Error creating chat:', error);
      toast({
        title: "Error",
        description: "Failed to create chat. Please try again.",
        variant: "destructive",
      });
    }
  };

  const showAddContact = !contactStatus || contactStatus === 'blocked';
  const isContactPending = contactStatus === 'pending';

  return (
    <div className="flex gap-2">
      <Button 
        onClick={handleClick} 
        variant="outline"
        size="sm"
        className={className}
      >
        <MessageSquare className="h-4 w-4 mr-2" />
        Send Message
      </Button>
      
      {showAddContact && (
        <Button
          onClick={handleAddContact}
          variant="outline"
          size="sm"
          className={className}
        >
          <UserPlus className="h-4 w-4 mr-2" />
          Add Contact
        </Button>
      )}
      
      {isContactPending && (
        <Button
          variant="outline"
          size="sm"
          className={className}
          disabled
        >
          <UserPlus className="h-4 w-4 mr-2" />
          Contact Request Pending
        </Button>
      )}
    </div>
  );
};

export default SendMessageButton;
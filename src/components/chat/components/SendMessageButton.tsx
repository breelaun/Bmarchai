import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface SendMessageButtonProps {
  recipientId: string;
  className?: string;
}

const SendMessageButton = ({ recipientId, className }: SendMessageButtonProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();

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

  return (
    <Button 
      onClick={handleClick} 
      variant="outline"
      size="sm"
      className={className}
    >
      <MessageSquare className="h-4 w-4 mr-2" />
      Send Message
    </Button>
  );
};

export default SendMessageButton;
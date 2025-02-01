import { useToast } from "@/components/ui/use-toast";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const AddContactButton = ({ userId }: { userId: string }) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: existingContact } = useQuery({
    queryKey: ['contact', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('contacts')
        .select('*')
        .or(`requester_id.eq.${userId},receiver_id.eq.${userId}`)
        .eq('status', 'accepted')
        .maybeSingle();

      if (error) throw error;
      return data;
    },
  });

  const handleAddContact = async () => {
    if (existingContact) {
      toast({
        title: "Contact Already Exists",
        description: "You are already connected with this user.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('contacts')
        .insert({
          requester_id: userId,
          receiver_id: userId, // Replace with the actual receiver ID
          status: 'pending',
        });

      if (error) throw error;

      toast({
        title: "Contact Request Sent",
        description: "You have sent a contact request.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <button onClick={handleAddContact}>
      Add Contact
    </button>
  );
};

export default AddContactButton;

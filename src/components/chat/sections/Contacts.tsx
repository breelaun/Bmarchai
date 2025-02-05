import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Contacts = () => {
  const { data: contacts = [] } = useQuery({
    queryKey: ['contacts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('contacts')
        .select(`
          *,
          receiver:profiles!contacts_receiver_id_fkey(username, avatar_url),
          requester:profiles!contacts_requester_id_fkey(username, avatar_url)
        `)
        .eq('status', 'accepted');
      
      if (error) throw error;
      return data;
    }
  });

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-lg font-semibold">Contacts</h2>
      <div className="space-y-2">
        {contacts.map((contact) => (
          <div key={contact.id} className="flex items-center gap-3 p-3 rounded-lg bg-accent/50">
            <Avatar className="h-10 w-10">
              <AvatarImage src={contact.receiver.avatar_url} />
              <AvatarFallback>
                {contact.receiver.username?.[0]?.toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{contact.receiver.username}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Contacts;
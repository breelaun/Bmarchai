import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { UserCheck, UserX } from "lucide-react";

interface ContactRequest {
  id: string;
  requester_id: string;
  receiver_id: string;
  profiles: {
    username: string;
    full_name: string;
    avatar_url: string;
  };
}

const Requests = () => {
  const { toast } = useToast();
  const { data: pendingRequests = [], refetch } = useQuery({
    queryKey: ['pending-contacts'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user?.id) return [];

      const { data, error } = await supabase
        .from('contacts')
        .select(`
          id,
          requester_id,
          receiver_id,
          profiles!contacts_requester_id_fkey (
            username,
            full_name,
            avatar_url
          )
        `)
        .eq('receiver_id', user.id)
        .eq('status', 'pending');

      if (error) throw error;
      
      // Transform the data to match the ContactRequest interface
      const transformedData = data ? data.map(item => ({
        id: item.id,
        requester_id: item.requester_id,
        receiver_id: item.receiver_id,
        profiles: {
          username: item.profiles.username,
          full_name: item.profiles.full_name,
          avatar_url: item.profiles.avatar_url
        }
      })) : [];

      return transformedData as ContactRequest[];
    },
  });

  const handleRequest = async (contactId: string, accept: boolean) => {
    try {
      const { error } = await supabase
        .from('contacts')
        .update({ status: accept ? 'accepted' : 'rejected' })
        .eq('id', contactId);

      if (error) throw error;

      toast({
        title: accept ? "Contact request accepted" : "Contact request rejected",
        description: accept ? "You are now connected" : "The request has been rejected",
      });

      refetch();
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to process contact request",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-lg font-semibold">Contact Requests</h2>
      {pendingRequests.length === 0 ? (
        <p className="text-center text-muted-foreground py-4">
          No pending contact requests
        </p>
      ) : (
        <div className="space-y-3">
          {pendingRequests.map((request) => (
            <div 
              key={request.id} 
              className="flex items-center justify-between p-3 rounded-lg bg-accent/50"
            >
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={request.profiles.avatar_url || ''} />
                  <AvatarFallback>
                    {request.profiles.username[0]?.toUpperCase() || '?'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">
                    {request.profiles.full_name || request.profiles.username || 'Unknown User'}
                  </p>
                  {request.profiles.username && (
                    <p className="text-sm text-muted-foreground">
                      @{request.profiles.username}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex space-x-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleRequest(request.id, true)}
                >
                  <UserCheck className="h-4 w-4 mr-1" />
                  Accept
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleRequest(request.id, false)}
                  className="text-destructive hover:text-destructive"
                >
                  <UserX className="h-4 w-4 mr-1" />
                  Reject
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Requests;
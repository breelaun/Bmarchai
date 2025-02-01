import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2, UserCheck, UserX } from "lucide-react";

interface Profile {
  username: string | null;
  full_name: string | null;
  avatar_url: string | null;
}

interface PendingRequest {
  id: string;
  requester_id: string;
  receiver_id: string;
  status: string;
  profiles: Profile;
}

const ContactRequests = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: pendingRequests = [], isLoading } = useQuery<PendingRequest[]>({
    queryKey: ['pending-contacts'],
    queryFn: async () => {
      const { data: user } = await supabase.auth.getUser();
      if (!user?.user?.id) return [];

      const { data, error } = await supabase
        .from('contacts')
        .select(`
          id,
          requester_id,
          receiver_id,
          status,
          profiles:requester_id (
            username,
            full_name,
            avatar_url
          )
        `)
        .eq('receiver_id', user.user.id)
        .eq('status', 'pending')
        .returns<PendingRequest[]>();

      if (error) {
        console.error('Error fetching contact requests:', error);
        throw error;
      }

      return data || [];
    },
  });

  const handleRequest = useMutation({
    mutationFn: async ({ contactId, accept }: { contactId: string; accept: boolean }) => {
      const { error } = await supabase
        .from('contacts')
        .update({ 
          status: accept ? 'accepted' : 'blocked' 
        })
        .eq('id', contactId);

      if (error) throw error;
    },
    onSuccess: (_, { accept }) => {
      queryClient.invalidateQueries({ queryKey: ['pending-contacts'] });
      toast({
        title: accept ? "Contact request accepted" : "Contact request rejected",
        description: accept ? "You are now connected" : "The request has been rejected",
      });
    },
    onError: (error) => {
      console.error('Error handling contact request:', error);
      toast({
        title: "Error",
        description: "Failed to process contact request",
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Contact Requests</CardTitle>
      </CardHeader>
      <CardContent>
        {pendingRequests.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            No pending contact requests
          </p>
        ) : (
          <div className="space-y-4">
            {pendingRequests.map((request) => (
              <div 
                key={request.id} 
                className="flex items-center justify-between p-3 border rounded-lg bg-card"
              >
                <div className="flex items-center space-x-3">
                  {request.profiles?.avatar_url && (
                    <img 
                      src={request.profiles.avatar_url} 
                      alt={request.profiles?.username || 'User'} 
                      className="w-10 h-10 rounded-full"
                    />
                  )}
                  <div>
                    <p className="font-medium">
                      {request.profiles?.full_name || request.profiles?.username || 'Unknown User'}
                    </p>
                    {request.profiles?.username && (
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
                    onClick={() => handleRequest.mutate({ contactId: request.id, accept: true })}
                  >
                    <UserCheck className="h-4 w-4 mr-1" />
                    Accept
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleRequest.mutate({ contactId: request.id, accept: false })}
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
      </CardContent>
    </Card>
  );
};

export default ContactRequests;
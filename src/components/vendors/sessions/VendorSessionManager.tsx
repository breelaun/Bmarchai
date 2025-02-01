import React, { useState } from 'react';
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Users, Plus, Edit2, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { formatToLocalTime } from "@/utils/timezone";
import SessionForm from "./SessionForm";
import SessionParticipantManager from "./SessionParticipantManager";
import { Session } from "@/types/session";

const VendorSessionManager = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingSession, setEditingSession] = useState<Session | null>(null);
  const { toast } = useToast();

  const { data: sessions, isLoading } = useQuery({
    queryKey: ['vendor-sessions'],
    queryFn: async () => {
      const { data: user } = await supabase.auth.getUser();
      if (!user?.user?.id) return [];

      const { data, error } = await supabase
        .from('sessions')
        .select(`
          *,
          session_participants (
            id,
            user_id,
            has_completed,
            rating,
            tip_amount,
            payment_method,
            payment_status,
            payment_confirmed_at,
            payment_confirmed_by,
            payment_notes,
            profiles (
              username,
              avatar_url
            )
          )
        `)
        .eq('vendor_id', user.user.id)
        .order('start_time', { ascending: true });

      if (error) throw error;
      return data;
    },
  });

  const handleDelete = async (sessionId: string) => {
    try {
      const { error } = await supabase
        .from('sessions')
        .delete()
        .eq('id', sessionId);

      if (error) throw error;

      toast({
        title: "Session deleted",
        description: "The session has been successfully deleted.",
      });
    } catch (error) {
      console.error('Error deleting session:', error);
      toast({
        title: "Error",
        description: "Failed to delete session. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return <div>Loading sessions...</div>;
  }

  return (
    <div className="space-y-6">
      {showForm || editingSession ? (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold">
              {editingSession ? "Edit Session" : "Create New Session"}
            </h2>
            <Button 
              variant="outline" 
              onClick={() => {
                setShowForm(false);
                setEditingSession(null);
              }}
            >
              Cancel
            </Button>
          </div>
          <SessionForm 
            onSuccess={() => {
              setShowForm(false);
              setEditingSession(null);
            }}
            initialData={editingSession}
          />
        </div>
      ) : (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Your Sessions
              </CardTitle>
              <Button onClick={() => setShowForm(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Create Session
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {sessions?.map((session) => (
                <Card key={session.id} className="hover:bg-accent/5">
                  <CardContent className="p-4">
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <h3 className="font-semibold">{session.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {session.description}
                          </p>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {formatToLocalTime(session.start_time, 'PPp')}
                            </span>
                            <span className="flex items-center gap-1">
                              <Users className="h-4 w-4" />
                              {session.session_participants?.length || 0}/{session.max_participants} participants
                            </span>
                            <span>
                              {session.session_type === 'paid' ? 
                                `$${session.price}` : 
                                'Free'}
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setEditingSession(session)}
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleDelete(session.id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </div>
                      
                      {session.session_participants && session.session_participants.length > 0 && (
                        <SessionParticipantManager 
                          sessionId={session.id}
                          participants={session.session_participants}
                        />
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
              {!sessions?.length && (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No sessions scheduled</p>
                  <Button onClick={() => setShowForm(true)} className="mt-4">
                    Create Your First Session
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default VendorSessionManager;
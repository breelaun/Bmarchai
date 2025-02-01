import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Users, Plus, Edit2, Trash2, TrendingUp } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { formatToLocalTime } from "@/utils/timezone";
import SessionForm from "./SessionForm";
import { useState } from "react";
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
            user_id,
            has_completed,
            rating,
            tip_amount
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

  const calculateSessionStats = (session: Session) => {
    const participants = session.session_participants || [];
    const totalParticipants = participants.length;
    const completedCount = participants.filter(p => p.has_completed).length;
    const totalRating = participants.reduce((sum, p) => sum + (p.rating || 0), 0);
    const averageRating = totalParticipants > 0 ? totalRating / totalParticipants : 0;
    const totalTips = participants.reduce((sum, p) => sum + (p.tip_amount || 0), 0);

    return {
      totalParticipants,
      completedCount,
      averageRating: averageRating.toFixed(1),
      totalTips: totalTips.toFixed(2),
      completionRate: totalParticipants > 0 
        ? ((completedCount / totalParticipants) * 100).toFixed(0) 
        : '0'
    };
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
              {sessions?.map((session) => {
                const stats = calculateSessionStats(session);
                return (
                  <Card key={session.id} className="hover:bg-accent/5">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <h3 className="font-semibold">{session.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {session.description}
                          </p>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {formatToLocalTime(session.start_time, 'UTC')}
                            </span>
                            <span className="flex items-center gap-1">
                              <Users className="h-4 w-4" />
                              {stats.totalParticipants}/{session.max_participants} participants
                            </span>
                            <span>
                              {session.session_type === 'paid' ? 
                                `$${session.price}` : 
                                'Free'}
                            </span>
                          </div>
                          <div className="mt-4 grid grid-cols-3 gap-4">
                            <div className="bg-secondary/20 p-3 rounded-lg">
                              <p className="text-sm font-medium">Completion Rate</p>
                              <p className="text-lg font-semibold">{stats.completionRate}%</p>
                            </div>
                            <div className="bg-secondary/20 p-3 rounded-lg">
                              <p className="text-sm font-medium">Average Rating</p>
                              <p className="text-lg font-semibold">⭐ {stats.averageRating}</p>
                            </div>
                            <div className="bg-secondary/20 p-3 rounded-lg">
                              <p className="text-sm font-medium">Total Tips</p>
                              <p className="text-lg font-semibold">${stats.totalTips}</p>
                            </div>
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
                    </CardContent>
                  </Card>
                );
              })}
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
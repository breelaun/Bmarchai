import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Calendar, Clock, User, ClipboardList } from "lucide-react";

export const SessionsList = () => {
  const { data: sessions, isLoading } = useQuery({
    queryKey: ["trainer-sessions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("trainer_sessions")
        .select(`
          *,
          trainer:trainer_id (
            id,
            user_id,
            user:user_id (
              full_name
            )
          ),
          member:member_id (
            id,
            user_id,
            user:user_id (
              full_name
            )
          )
        `)
        .order("session_date", { ascending: true });

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Training Sessions</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {sessions?.map((session) => (
          <Card 
            key={session.id}
            className="hover:border-primary/50 transition-colors"
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                {new Date(session.session_date).toLocaleDateString()}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Trainer:</span>{" "}
                {session.trainer?.user?.full_name}
              </div>

              <div className="flex items-center gap-2 text-sm">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Client:</span>{" "}
                {session.member?.user?.full_name}
              </div>

              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Duration:</span>{" "}
                {session.duration}
              </div>

              {session.notes && (
                <div className="flex items-center gap-2 text-sm">
                  <ClipboardList className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Notes:</span> {session.notes}
                </div>
              )}

              <Badge 
                variant={session.status === 'completed' ? 'default' : 'secondary'}
                className="mt-2"
              >
                {session.status}
              </Badge>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
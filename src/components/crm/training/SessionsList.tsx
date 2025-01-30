import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Calendar } from "lucide-react";

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
            profiles:user_id (
              full_name
            )
          ),
          member:member_id (
            id,
            user_id,
            profiles:user_id (
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
          <Card key={session.id}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                {new Date(session.session_date).toLocaleDateString()}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm">
                <span className="font-medium">Trainer:</span>{" "}
                {session.trainer?.profiles?.full_name}
              </p>
              <p className="text-sm">
                <span className="font-medium">Client:</span>{" "}
                {session.member?.profiles?.full_name}
              </p>
              <p className="text-sm">
                <span className="font-medium">Duration:</span>{" "}
                {session.duration}
              </p>
              <p className="text-sm">
                <span className="font-medium">Status:</span>{" "}
                <span className="capitalize">{session.status}</span>
              </p>
              {session.notes && (
                <p className="text-sm">
                  <span className="font-medium">Notes:</span> {session.notes}
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
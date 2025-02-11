
import { Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import SessionCard from "./SessionCard";
import CompletedSessions from "./CompletedSessions";
import type { SessionWithVendor } from "@/types/session";

interface UserSessionsProps {
  sessions: SessionWithVendor[] | undefined;
  isLoading: boolean;
}

const UserSessions = ({ sessions, isLoading }: UserSessionsProps) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const activeSessions = sessions?.filter(s => s.status !== 'completed') || [];
  const completedSessions = sessions?.filter(s => s.status === 'completed') || [];

  if (activeSessions.length === 0 && completedSessions.length === 0) {
    return (
      <Card>
        <CardContent className="py-8">
          <p className="text-center text-muted-foreground">
            You haven't joined any sessions yet.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {activeSessions.map(session => (
        <SessionCard key={session.id} session={session} />
      ))}
      <CompletedSessions sessions={completedSessions} />
    </div>
  );
};

export default UserSessions;

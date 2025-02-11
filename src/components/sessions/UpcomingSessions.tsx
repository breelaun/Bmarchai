
import { Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import SessionCard from "./SessionCard";
import type { SessionWithVendor } from "@/types/session";

interface UpcomingSessionsProps {
  sessions: SessionWithVendor[] | undefined;
  isLoading: boolean;
}

const UpcomingSessions = ({ sessions, isLoading }: UpcomingSessionsProps) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!sessions?.length) {
    return (
      <Card>
        <CardContent className="py-8">
          <p className="text-center text-muted-foreground">
            There are no upcoming sessions scheduled at the moment.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {sessions.map(session => (
        <SessionCard key={session.id} session={session} />
      ))}
    </div>
  );
};

export default UpcomingSessions;

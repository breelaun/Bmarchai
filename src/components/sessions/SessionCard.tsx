
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Users } from "lucide-react";
import { formatToLocalTime } from "@/utils/timezone";
import type { SessionWithVendor } from "@/types/session";

interface SessionCardProps {
  session: SessionWithVendor;
}

const SessionCard = ({ session }: SessionCardProps) => {
  return (
    <Card className="mb-4">
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-2">{session.name}</h3>
        {session.description && (
          <p className="text-muted-foreground mb-3">{session.description}</p>
        )}
        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            {formatToLocalTime(session.start_time, 'UTC')}
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            {session.duration}
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            {session.max_participants} participants max
          </div>
        </div>
        <div className="mt-3 text-sm">
          Hosted by: {session.vendor_profiles[0]?.business_name || 
                     session.vendor_profiles[0]?.profiles[0]?.username || 
                     "Unknown Vendor"}
        </div>
        {session.status === 'completed' && session.recording_id && (
          <div className="mt-3">
            <Button variant="outline" size="sm">
              View Recording
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SessionCard;

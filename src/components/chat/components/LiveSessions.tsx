import React from 'react';
import { Video } from 'lucide-react';
import type { Session } from '@/types/session';
import CreateSessionDialog from './CreateSessionDialog';

interface LiveSessionsProps {
  sessions: Session[];
}

const LiveSessions = ({ sessions }: LiveSessionsProps) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between px-2">
        <h3 className="text-sm font-semibold">Live Sessions</h3>
      </div>
      <CreateSessionDialog />
      <div className="space-y-1">
        {sessions.map((session) => (
          <div
            key={session.id}
            className="flex items-center space-x-2 px-2 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:bg-accent rounded-md cursor-pointer"
          >
            <Video className="h-4 w-4" />
            <div className="flex-1 truncate">
              <p className="font-medium truncate">{session.name}</p>
              <p className="text-xs text-muted-foreground truncate">
                {session.vendor_profiles?.[0]?.business_name || 'Unknown Vendor'}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LiveSessions;
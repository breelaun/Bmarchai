import React from 'react';
import { Video } from 'lucide-react';
import type { Session } from '@/types/session';

interface LiveSessionsProps {
  sessions: Session[];
}

const LiveSessions = ({ sessions }: LiveSessionsProps) => {
  return (
    <div className="space-y-1">
      <h3 className="px-2 text-sm font-medium text-muted-foreground">Live Sessions</h3>
      {sessions.map((session) => (
        <div 
          key={session.id}
          className="flex items-center space-x-2 px-2 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:bg-accent rounded-md cursor-pointer"
        >
          <Video className="h-4 w-4" />
          <span>{session.name}</span>
        </div>
      ))}
    </div>
  );
};

export default LiveSessions;
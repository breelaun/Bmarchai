import React from 'react';
import MessageArea from '../components/MessageArea';
import LiveSessions from '../components/LiveSessions';

interface MessagesProps {
  channelId: string;
  userId: string;
  sessions: any[];
}

const Messages = ({ channelId, userId, sessions }: MessagesProps) => {
  return (
    <div className="flex flex-col h-full">
      <LiveSessions sessions={sessions} />
      <MessageArea 
        channelId={channelId}
        userId={userId}
      />
    </div>
  );
};

export default Messages;
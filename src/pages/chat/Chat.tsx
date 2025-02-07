
import React from 'react';
import { Card } from "@/components/ui/card";
import Messages from '@/components/chat/sections/Messages';

const ChatPage = () => {
  return (
    <div className="container mx-auto p-4 pt-20">
      <Card className="p-4">
        <Messages channelId="" userId="" sessions={[]} />
      </Card>
    </div>
  );
};

export default ChatPage;

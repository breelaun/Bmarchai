import React, { useState, useEffect } from 'react';
import Grid from './Grid';
import Controls from './Controls';
import MessageArea from './components/MessageArea';
import LiveSessions from './components/LiveSessions';
import ChannelList from './components/ChannelList';
import SidebarActions from './components/SidebarActions';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { MessageSquare } from 'lucide-react';
import type { Session } from '@/types/session';

const ChatLayout = () => {
  const [selectedChannel, setSelectedChannel] = useState<string | null>(null);
  const [session, setSession] = useState<any>(null);

  // ... keep all your existing query hooks ...

  return (
    <div className="h-[calc(100vh-4rem)] flex">
      {/* Fixed-width Sidebar */}
      <div className="w-64 bg-background border-r flex flex-col">
        {/* Sidebar Content */}
        <div className="flex flex-col space-y-4 p-4 overflow-y-auto">
          {/* Menu Items */}
          <div className="flex items-center space-x-3 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-accent rounded-md cursor-pointer">
            <MessageSquare className="h-5 w-5 flex-shrink-0" />
            <span>Chat</span>
          </div>
          
          <LiveSessions sessions={sessions} />
          
          <ChannelList 
            channels={channels}
            selectedChannel={selectedChannel}
            onSelectChannel={setSelectedChannel}
          />

          <SidebarActions 
            pendingRequests={pendingRequests.length}
            onlineUsers={onlineUsers.length}
          />
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 bg-background flex flex-col">
        <MessageArea 
          channelId={selectedChannel || ''}
          userId={session?.session?.user?.id || ''}
        />
        <div className="w-full">
          <Controls />
        </div>
      </div>
    </div>
  );
};

export default ChatLayout;

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

  const { data: channels = [] } = useQuery({
    queryKey: ['channels'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('chat_channels')
        .select('*, chat_members(*)')
        .order('created_at', { ascending: true });
      if (error) throw error;
      return data;
    }
  });

  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data);
    };
    getSession();
  }, []);

  return (
    <div className="h-[calc(100vh-4rem)] flex">
      {/* Sidebar with vertical menu */}
      <div className="w-16 bg-background border-r flex flex-col items-center py-4 space-y-6">
        <div className="transform rotate-180 [writing-mode:vertical-rl] text-muted-foreground text-lg font-bold">
          Chat
        </div>
        <div className="transform rotate-180 [writing-mode:vertical-rl] text-muted-foreground text-lg font-bold">
          Entertainment
        </div>
        <div className="transform rotate-180 [writing-mode:vertical-rl] text-muted-foreground text-lg font-bold">
          CRM
        </div>
        <div className="transform rotate-180 [writing-mode:vertical-rl] text-muted-foreground text-lg font-bold">
          Blogs
        </div>
        <div className="transform rotate-180 [writing-mode:vertical-rl] text-muted-foreground text-lg font-bold">
          Admin
        </div>
        <div className="transform rotate-180 [writing-mode:vertical-rl] text-muted-foreground text-lg font-bold">
          Vendors
        </div>
        <div className="transform rotate-180 [writing-mode:vertical-rl] text-muted-foreground text-lg font-bold">
          Profile
        </div>
      </div>
      
      {/* Main chat content */}
      <div className="flex-1 bg-background flex flex-col">
        <MessageArea channelId={selectedChannel || ''} userId={session?.session?.user?.id || ''} />
        <Controls />
      </div>
    </div>
  );
};

export default ChatLayout;

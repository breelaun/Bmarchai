import React, { useState, useEffect } from 'react';
import Grid from './Grid';
import Controls from './Controls';
import MessageArea from './components/MessageArea';
import LiveSessions from './components/LiveSessions';
import ChannelList from './components/ChannelList';
import SidebarActions from './components/SidebarActions';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { MessageSquare, ChevronLeft, ChevronRight } from 'lucide-react';
import type { Session } from '@/types/session';

const ChatLayout = () => {
  const [selectedChannel, setSelectedChannel] = useState<string | null>(null);
  const [session, setSession] = useState<any>(null);
  const [isExpanded, setIsExpanded] = useState(true);

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

  const { data: sessions = [] } = useQuery({
    queryKey: ['sessions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('sessions')
        .select(`
          *,
          vendor_profiles (
            business_name,
            profiles (
              username
            )
          )
        `)
        .eq('status', 'scheduled')
        .order('start_time', { ascending: true });
      
      if (error) throw error;
      return data as Session[];
    }
  });

  const { data: pendingRequests = [] } = useQuery({
    queryKey: ['pending-contacts'],
    queryFn: async () => {
      const { data: user } = await supabase.auth.getUser();
      if (!user?.user?.id) return [];

      const { data, error } = await supabase
        .from('contacts')
        .select(`
          id,
          requester_id,
          receiver_id,
          status,
          profiles!contacts_profiles_requester_fk (
            username,
            full_name,
            avatar_url
          )
        `)
        .eq('receiver_id', user.user.id)
        .eq('status', 'pending');

      if (error) throw error;
      return data || [];
    },
  });

  const { data: onlineUsers = [] } = useQuery({
    queryKey: ['online-users'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .limit(10);
      
      if (error) throw error;
      return data || [];
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
      <div className={`bg-background transition-all duration-300 flex flex-col relative ${isExpanded ? 'w-64' : 'w-16'}`}>
        <div className="absolute -right-3 top-2 z-10">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="rounded-full p-1 bg-background shadow-md hover:bg-accent"
          >
            {isExpanded ? (
              <ChevronLeft className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </button>
        </div>
        
        <div className="flex flex-col space-y-4 p-4">
          <div className="flex items-center space-x-2 px-2 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:bg-accent rounded-md cursor-pointer">
            <MessageSquare className="h-4 w-4 flex-shrink-0" />
            {isExpanded && <span>Chat</span>}
          </div>
          
          <LiveSessions sessions={sessions} isExpanded={isExpanded} />
          
          <ChannelList 
            channels={channels}
            selectedChannel={selectedChannel}
            onSelectChannel={setSelectedChannel}
            isExpanded={isExpanded}
          />

          <SidebarActions 
            pendingRequests={pendingRequests.length}
            onlineUsers={onlineUsers.length}
            isExpanded={isExpanded}
          />
        </div>
      </div>
      
      <div className="flex-1 bg-background flex flex-col">
        <MessageArea 
          channelId={selectedChannel || ''}
          userId={session?.session?.user?.id || ''}
        />
        <Controls />
      </div>
    </div>
  );
};

export default ChatLayout;

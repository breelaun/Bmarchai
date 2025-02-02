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
    <div className="h-[calc(100vh-4rem)]">
      <Grid>
        <div className="col-span-1 bg-background border-r flex">
          <div className="writing-mode-vertical-rl rotate-270 h-auto py-4 flex items-center justify-center bg-black text-white hover:bg-accent hover:text-foreground transition-colors duration-200">
            <MessageSquare className="h-4 w-4 rotate-270 mb-2" />
            <span className="text-sm">Chat</span>
          </div>
          
          <div className="flex-1 flex flex-col space-y-4 p-4">
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
        <div className="col-span-11 bg-background flex flex-col">
          <MessageArea 
            channelId={selectedChannel || ''}
            userId={session?.session?.user?.id || ''}
          />
          <Controls />
        </div>
      </Grid>
    </div>
  );
};

export default ChatLayout;

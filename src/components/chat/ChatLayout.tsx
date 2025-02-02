import React, { useState, useEffect } from 'react';
import Grid from './Grid';
import Controls from './Controls';
import MessageArea from './components/MessageArea';
import LiveSessions from './components/LiveSessions';
import ChannelList from './components/ChannelList';
import SidebarActions from './components/SidebarActions';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { MessageSquare, Plus, Users, Settings } from 'lucide-react';
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

  const MenuItem = ({ icon: Icon, text }: { icon: any, text: string }) => (
    <div className="group flex flex-col items-center mb-8 cursor-pointer">
      <Icon className="h-5 w-5 text-muted-foreground group-hover:text-foreground mb-2" />
      <div className="rotate-180 [writing-mode:vertical-rl] text-sm text-muted-foreground group-hover:text-foreground whitespace-nowrap">
        {text}
      </div>
    </div>
  );

  return (
    <div className="h-[calc(100vh-4rem)] flex">
      {/* Primary Vertical Navigation */}
      <div className="w-16 bg-background border-r flex flex-col items-center py-6">
        <MenuItem icon={Plus} text="New Session" />
        <MenuItem icon={MessageSquare} text="Chats" />
        <MenuItem icon={Users} text="Contacts" />
        <MenuItem icon={Settings} text="Settings" />
      </div>

      {/* Secondary Navigation & Content */}
      <div className="flex-1 flex">
        {/* Secondary Sidebar */}
        <div className="w-60 border-r bg-background">
          <div className="flex flex-col space-y-4 p-4">
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

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col bg-background">
          <MessageArea 
            channelId={selectedChannel || ''}
            userId={session?.session?.user?.id || ''}
          />
          <Controls />
        </div>
      </div>
    </div>
  );
};

export default ChatLayout;

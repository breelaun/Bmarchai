import React, { useState, useEffect } from 'react';
import Grid from './Grid';
import Controls from './Controls';
import ServerList from './components/ServerList';
import ChannelList from './components/ChannelList';
import MessageArea from './components/MessageArea';
import MembersList from './components/MembersList';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { MessageSquare, Bell } from 'lucide-react';

const ChatLayout = () => {
  const [selectedChannel, setSelectedChannel] = useState<string | null>(null);
  const [session, setSession] = useState<any>(null);
  
  const { data: channels = [] } = useQuery({
    queryKey: ['channels'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('chat_channels')
        .select('*')
        .order('created_at', { ascending: true });
      
      if (error) throw error;
      return data;
    }
  });

  const { data: members = [] } = useQuery({
    queryKey: ['channel-members', selectedChannel],
    queryFn: async () => {
      if (!selectedChannel) return [];
      
      const { data, error } = await supabase
        .from('chat_members')
        .select(`
          *,
          profiles (*)
        `)
        .eq('channel_id', selectedChannel);
      
      if (error) throw error;
      return data;
    },
    enabled: !!selectedChannel
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
          profiles:requester_id (
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

  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data);
    };
    getSession();
  }, []);

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col">
      <Grid>
        <div className="col-span-1 bg-background border-r">
          <div className="flex flex-col space-y-4 p-4">
            <div className="flex items-center space-x-2 px-2 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:bg-accent rounded-md cursor-pointer">
              <MessageSquare className="h-4 w-4" />
              <span>Chat</span>
            </div>
            <div className="flex items-center justify-between space-x-2 px-2 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:bg-accent rounded-md cursor-pointer">
              <div className="flex items-center space-x-2">
                <Bell className="h-4 w-4" />
                <span>Requests</span>
              </div>
              {pendingRequests.length > 0 && (
                <span className="bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-full">
                  {pendingRequests.length}
                </span>
              )}
            </div>
          </div>
          <ServerList 
            channels={channels}
            selectedChannel={selectedChannel}
            onChannelSelect={setSelectedChannel}
          />
        </div>
        <div className="col-span-2 bg-background border-r">
          <ChannelList 
            channels={channels}
            selectedChannel={selectedChannel}
            onChannelSelect={setSelectedChannel}
          />
        </div>
        <div className="col-span-6 bg-background flex flex-col">
          <MessageArea 
            channelId={selectedChannel || ''}
            userId={session?.session?.user?.id || ''}
          />
          <Controls />
        </div>
        <div className="col-span-3 bg-background border-l">
          <MembersList 
            members={members}
            session={session?.session}
          />
        </div>
      </Grid>
    </div>
  );
};

export default ChatLayout;
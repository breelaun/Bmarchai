import React, { useState, useEffect } from 'react';
import Grid from './Grid';
import Controls from './Controls';
import ServerList from './components/ServerList';
import ChannelList from './components/ChannelList';
import MessageArea from './components/MessageArea';
import MembersList from './components/MembersList';
import ContactRequests from '../contacts/ContactRequests';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

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
          <ServerList 
            channels={channels}
            selectedChannel={selectedChannel}
            onChannelSelect={setSelectedChannel}
          />
        </div>
        <div className="col-span-2 bg-background border-r flex flex-col">
          <div className="flex-1 overflow-y-auto">
            <ChannelList 
              channels={channels}
              selectedChannel={selectedChannel}
              onChannelSelect={setSelectedChannel}
            />
          </div>
          <div className="p-4 border-t">
            <ContactRequests />
          </div>
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
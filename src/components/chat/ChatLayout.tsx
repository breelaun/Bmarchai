import React, { useState, useEffect } from 'react';
import Grid from './Grid';
import Controls from './Controls';
import MessageArea from './components/MessageArea';
import LiveSessions from './components/LiveSessions';
import ChannelList from './components/ChannelList';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Plus } from 'lucide-react';
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

  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data);
    };
    getSession();
  }, []);

  return (
    <div className="h-[calc(100vh-4rem)] flex">
      {/* Primary Vertical Navigation */}
      <div className="w-16 bg-background border-r flex flex-col items-center py-6 space-y-6">
        {/* Create Session Button */}
        <button className="border border-gray-300 p-2 rounded-md">
          <Plus className="h-6 w-6" />
        </button>
        
        {/* Vertical Menu Items */}
        <div className="flex flex-col space-y-8">
          {['Chat', 'Contacts', 'Online'].map((item) => (
            <div
              key={item}
              className="text-sm font-medium transform rotate-90 whitespace-nowrap"
            >
              {item}
            </div>
          ))}
        </div>
      </div>
      
      {/* Main Content Grid */}
      <Grid>
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

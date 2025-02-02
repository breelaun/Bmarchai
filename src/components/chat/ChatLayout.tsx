import React, { useState, useEffect } from 'react';
import Grid from './Grid';
import Controls from './Controls';
import MessageArea from './components/MessageArea';
import LiveSessions from './components/LiveSessions';
import ChannelList from './components/ChannelList';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { MessageSquare, Users } from 'lucide-react';
import type { Session } from '@/types/session';

const ChatLayout = () => {
  const [selectedChannel, setSelectedChannel] = useState<string | null>(null);
  const [session, setSession] = useState<any>(null);
  const [showSessionForm, setShowSessionForm] = useState(false);

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
      <div className="w-16 bg-background border-r flex flex-col items-center py-6 space-y-4">
        <button 
          className="border px-2 py-1 rounded-2xl [writing-mode:vertical-lr] rotate-180" 
          onClick={() => setShowSessionForm(!showSessionForm)}
        >
          + Session
        </button>
        <span className="[writing-mode:vertical-lr] rotate-180">ʇɐɥƆ</span>
        <span className="[writing-mode:vertical-lr] rotate-180">sʇɔɐʇuoƆ</span>
        <span className="[writing-mode:vertical-lr] rotate-180">ǝuıluO</span>
      </div>
      <Grid>
        <div className="col-span-11 bg-background flex flex-col">
          {showSessionForm && <LiveSessions />}
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

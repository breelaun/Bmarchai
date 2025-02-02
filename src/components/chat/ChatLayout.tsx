import React, { useState, useEffect } from 'react';
import Grid from './Grid';
import Controls from './Controls';
import MessageArea from './components/MessageArea';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const ChatLayout = () => {
  const [selectedChannel, setSelectedChannel] = useState<string | null>(null);
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data);
    };
    getSession();
  }, []);

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

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col">
      <Grid>
        {/* Sidebar Navigation */}
        <div className="col-span-1 bg-background border-r flex flex-col items-center py-6 space-y-8">
          <button className="border border-muted-foreground px-4 py-2 rounded-md hover:bg-accent">
            + Create Session
          </button>
          <div className="text-sm cursor-pointer hover:text-foreground">Chats</div>
          <div className="text-sm cursor-pointer hover:text-foreground">Contacts</div>
          <div className="text-sm cursor-pointer hover:text-foreground">Online</div>
        </div>
        
        {/* Main Chat Area */}
        <div className="col-span-11 bg-background flex flex-col">
          <MessageArea channelId={selectedChannel || ''} userId={session?.session?.user?.id || ''} />
          
          {/* Bottom Control Panel (Full Width) */}
          <div className="w-full border-t">
            <Controls />
          </div>
        </div>
      </Grid>
    </div>
  );
};

export default ChatLayout;

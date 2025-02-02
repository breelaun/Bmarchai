import React, { useState, useEffect } from 'react';
import Grid from './Grid';
import Controls from './Controls';
import MessageArea from './components/MessageArea';
import LiveSessions from './components/LiveSessions';
import ChannelList from './components/ChannelList';
import SessionForm from './components/SessionForm';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { MessageSquare, Users, Plus, Settings, Bell } from 'lucide-react';
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

  const MenuItem = ({ icon: Icon, text, onClick }: { icon: any; text: string; onClick?: () => void }) => (
    <div 
      className="group flex flex-col items-center py-4 cursor-pointer hover:bg-accent/50 transition-colors w-full"
      onClick={onClick}
    >
      <Icon className="h-5 w-5 text-muted-foreground group-hover:text-foreground mb-2" />
      <span className="rotate-180 [writing-mode:vertical-lr] text-sm text-muted-foreground group-hover:text-foreground whitespace-nowrap">
        {text}
      </span>
    </div>
  );

  return (
    <div className="h-[calc(100vh-4rem)] flex">
      {/* Primary Vertical Navigation */}
      <div className="w-16 bg-background border-r flex flex-col justify-between">
        <div className="flex flex-col">
          <MenuItem 
            icon={Plus} 
            text="New Session" 
            onClick={() => setShowSessionForm(true)}
          />
          <MenuItem icon={MessageSquare} text="Chat" />
          <MenuItem icon={Users} text="Contacts" />
          <MenuItem icon={Bell} text="Notifications" />
        </div>
        <div className="mb-4">
          <MenuItem icon={Settings} text="Settings" />
        </div>
      </div>

      {/* Main Content Area with Grid */}
      <Grid>
        <div className="col-span-11 bg-background flex flex-col">
          <div className="flex-1 flex overflow-hidden">
            {/* Secondary Sidebar */}
            {selectedChannel && (
              <div className="w-60 border-r bg-background">
                <div className="flex flex-col h-full">
                  <LiveSessions sessions={sessions} />
                  <ChannelList 
                    channels={channels}
                    selectedChannel={selectedChannel}
                    onSelectChannel={setSelectedChannel}
                  />
                </div>
              </div>
            )}

            {/* Chat Area */}
            <div className="flex-1 flex flex-col">
              {showSessionForm && <SessionForm onClose={() => setShowSessionForm(false)} />}
              <div className="flex-1 overflow-auto">
                <MessageArea 
                  channelId={selectedChannel || ''}
                  userId={session?.session?.user?.id || ''}
                />
              </div>
              <div className="w-full border-t">
                <div className="max-w-[1200px] mx-auto">
                  <Controls />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Grid>
    </div>
  );
};

export default ChatLayout;

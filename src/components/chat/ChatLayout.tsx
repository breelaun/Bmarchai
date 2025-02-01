import React, { useState, useEffect } from 'react';
import Grid from './Grid';
import Controls from './Controls';
import MessageArea from './components/MessageArea';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { MessageSquare, Bell, Users, Hash, Video } from 'lucide-react';
import { Session } from '@/types/session';

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
    <div className="h-[calc(100vh-4rem)] flex flex-col">
      <Grid>
        <div className="col-span-1 bg-background border-r">
          <div className="flex flex-col space-y-4 p-4">
            <div className="flex items-center space-x-2 px-2 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:bg-accent rounded-md cursor-pointer">
              <MessageSquare className="h-4 w-4" />
              <span>Chat</span>
            </div>
            
            <div className="space-y-1">
              <h3 className="px-2 text-sm font-medium text-muted-foreground">Live Sessions</h3>
              {sessions.map((session) => (
                <div 
                  key={session.id}
                  className="flex items-center space-x-2 px-2 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:bg-accent rounded-md cursor-pointer"
                >
                  <Video className="h-4 w-4" />
                  <span>{session.name}</span>
                </div>
              ))}
            </div>

            <div className="space-y-1">
              <h3 className="px-2 text-sm font-medium text-muted-foreground">Channels</h3>
              {channels.map((channel) => (
                <div 
                  key={channel.id}
                  onClick={() => setSelectedChannel(channel.id)}
                  className={`flex items-center space-x-2 px-2 py-1.5 text-sm ${
                    selectedChannel === channel.id 
                      ? 'text-foreground bg-accent' 
                      : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                  } rounded-md cursor-pointer`}
                >
                  <Hash className="h-4 w-4" />
                  <span>{channel.name}</span>
                </div>
              ))}
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

            <div className="flex items-center justify-between space-x-2 px-2 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:bg-accent rounded-md cursor-pointer">
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4" />
                <span>Online</span>
              </div>
              {onlineUsers.length > 0 && (
                <span className="bg-green-500 text-white text-xs px-2 py-0.5 rounded-full">
                  {onlineUsers.length}
                </span>
              )}
            </div>
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
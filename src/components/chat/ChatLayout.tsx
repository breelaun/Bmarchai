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

  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data);
    };
    getSession();
  }, []);

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-16 bg-black text-white flex flex-col items-center py-4 space-y-4">
        <div className="transform rotate-90 whitespace-nowrap">+ Session</div>
        <div className="transform rotate-90 whitespace-nowrap">Chats</div>
        <div className="transform rotate-90 whitespace-nowrap">Contacts</div>
        <div className="transform rotate-90 whitespace-nowrap">Settings</div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 bg-black text-white flex flex-col">
        <div className="flex-1">Chat Area</div>
        <div className="bg-yellow-600 p-2 flex items-center">
          <input type="text" className="flex-1 bg-transparent border-none outline-none text-white" placeholder="Type a message..." />
          <button className="bg-yellow-500 px-4 py-2 ml-2">Send</button>
        </div>
      </div>
    </div>
  );
};

export default ChatLayout;


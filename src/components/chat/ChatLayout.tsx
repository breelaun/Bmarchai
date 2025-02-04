import React, { useState, useEffect } from 'react';
import Grid from './Grid';
import Controls from './Controls';
import MessageArea from './components/MessageArea';
import LiveSessions from './components/LiveSessions';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import CreateSessionDialog from './components/CreateSessionDialog';

const ChatLayout = () => {
  const [selectedChannel, setSelectedChannel] = useState<string | null>(null);
  const [session, setSession] = useState<any>(null);
  const { toast } = useToast();

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

  // Function to handle menu item clicks
  const handleMenuClick = async (action: string) => {
    switch (action) {
      case 'chat':
        // Already in chat view
        break;
      case 'contacts':
        const { data: contacts } = await supabase
          .from('contacts')
          .select('*')
          .or(`requester_id.eq.${session?.user?.id},receiver_id.eq.${session?.user?.id}`);
        console.log('Contacts:', contacts);
        break;
      case 'online':
        // Would need real-time presence data
        console.log('Online users feature');
        break;
      case 'messages':
        const { data: messages } = await supabase
          .from('chat_messages')
          .select('*')
          .eq('sender_id', session?.user?.id);
        console.log('Messages:', messages);
        break;
      case 'settings':
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session?.user?.id)
          .single();
        console.log('Profile settings:', profile);
        break;
    }
  };

  return (
    <div className="h-screen flex flex-col md:flex-row">
      <div className="w-full md:w-16 bg-background border-r flex flex-col">
        <div className="flex-1 overflow-x-hidden">
          <div className="flex flex-row md:flex-col items-center space-x-4 md:space-x-0 md:space-y-4 p-2 overflow-x-auto scrollbar-hide">
            <button 
              onClick={() => handleMenuClick('chat')}
              className="text-xs md:[writing-mode:vertical-lr] md:-rotate-180 whitespace-nowrap font-sans hover:text-primary transition-colors"
            >
              Chat
            </button>
            <button 
              onClick={() => handleMenuClick('contacts')}
              className="text-xs md:[writing-mode:vertical-lr] md:-rotate-180 whitespace-nowrap font-sans hover:text-primary transition-colors"
            >
              Contacts
            </button>
            <button 
              onClick={() => handleMenuClick('online')}
              className="text-xs md:[writing-mode:vertical-lr] md:-rotate-180 whitespace-nowrap font-sans hover:text-primary transition-colors"
            >
              Online
            </button>
            <button 
              onClick={() => handleMenuClick('messages')}
              className="text-xs md:[writing-mode:vertical-lr] md:-rotate-180 whitespace-nowrap font-sans hover:text-primary transition-colors"
            >
              Messages
            </button>
            <button 
              onClick={() => handleMenuClick('settings')}
              className="text-xs md:[writing-mode:vertical-lr] md:-rotate-180 whitespace-nowrap font-sans hover:text-primary transition-colors"
            >
              Settings
            </button>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="text-xs md:[writing-mode:vertical-lr] md:-rotate-180 whitespace-nowrap font-sans hover:text-primary transition-colors">
                  + Session
                </Button>
              </DialogTrigger>
              <CreateSessionDialog />
            </Dialog>
          </div>
        </div>
      </div>
      <Grid className="flex-1">
        <div className="col-span-full md:col-span-11 bg-background flex flex-col">
          <LiveSessions sessions={sessions} />
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
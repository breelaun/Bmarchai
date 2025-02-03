import React, { useState, useEffect } from 'react';
import Grid from './Grid';
import Controls from './Controls';
import MessageArea from './components/MessageArea';
import LiveSessions from './components/LiveSessions';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import SessionCreationForm from './components/SessionCreationForm';

const ChatLayout = () => {
  const [selectedChannel, setSelectedChannel] = useState<string | null>(null);
  const [session, setSession] = useState<any>(null);
  const [showSessionForm, setShowSessionForm] = useState(false);
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

  const handleCreateSession = async (sessionData: any) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Error",
          description: "You must be logged in to create a session",
          variant: "destructive"
        });
        return;
      }

      const { data, error } = await supabase
        .from('sessions')
        .insert([{
          ...sessionData,
          vendor_id: user.id,
          status: 'scheduled'
        }])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Success",
        description: "Session created successfully",
      });

      setShowSessionForm(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data);
    };
    getSession();
  }, []);

  return (
    <div className="h-screen flex flex-col md:flex-row">
      <div className="w-full md:w-16 bg-background border-r flex flex-col">
        <Dialog open={showSessionForm} onOpenChange={setShowSessionForm}>
          <DialogTrigger asChild>
            <button 
              className="px-2 py-1 bg-transparent hover:bg-accent/10 transition-colors duration-200 flex-shrink-0 m-2 md:m-6 text-sm"
            >
              + Session
            </button>
          </DialogTrigger>
          <SessionCreationForm 
            onSubmit={handleCreateSession}
            onClose={() => setShowSessionForm(false)}
          />
        </Dialog>
        <div className="flex-1 overflow-x-hidden">
          <div className="flex flex-row md:flex-col items-center space-x-4 md:space-x-0 md:space-y-4 p-2 overflow-x-auto scrollbar-hide">
            <span className="text-xs md:[writing-mode:vertical-lr] md:-rotate-180 whitespace-nowrap font-sans">Chat</span>
            <span className="text-xs md:[writing-mode:vertical-lr] md:-rotate-180 whitespace-nowrap font-sans">Contacts</span>
            <span className="text-xs md:[writing-mode:vertical-lr] md:-rotate-180 whitespace-nowrap font-sans">Online</span>
            <span className="text-xs md:[writing-mode:vertical-lr] md:-rotate-180 whitespace-nowrap font-sans">Messages</span>
            <span className="text-xs md:[writing-mode:vertical-lr] md:-rotate-180 whitespace-nowrap font-sans">Settings</span>
            <span className="text-xs md:[writing-mode:vertical-lr] md:-rotate-180 whitespace-nowrap font-sans">Profile</span>
            <span className="text-xs md:[writing-mode:vertical-lr] md:-rotate-180 whitespace-nowrap font-sans">Help</span>
            <span className="text-xs md:[writing-mode:vertical-lr] md:-rotate-180 whitespace-nowrap font-sans">About</span>
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
          <Controls className="w-full" />
        </div>
      </Grid>
    </div>
  );
};

export default ChatLayout;


Claude can make mistakes. Please double-check responses.

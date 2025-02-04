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
    <div className="h-[calc(100vh-4rem)] flex flex-col md:flex-row">
      <div className="w-full md:w-16 bg-black border-r flex md:flex-col justify-between md:justify-start items-center md:items-stretch p-2 md:p-0">
        <Dialog open={showSessionForm} onOpenChange={setShowSessionForm}>
          <DialogTrigger asChild>
            <button 
              className="border px-2 py-1 rounded-2xl md:[writing-mode:vertical-lr] md:rotate-180 flex-shrink-0 md:m-6 text-sm"
            >
              + Session
            </button>
          </DialogTrigger>
          <SessionCreationForm 
            onSubmit={handleCreateSession}
            onClose={() => setShowSessionForm(false)}
          />
        </Dialog>
        <div className="flex md:flex-col items-center md:items-stretch gap-4 md:gap-0 md:flex-1 md:overflow-y-auto md:py-4 scrollbar-hide">
          <div className="flex md:flex-col items-center space-x-4 md:space-x-0 md:space-y-4">
            <span className="md:[writing-mode:vertical-lr] md:-rotate-180 font-poppins text-sm">Chat</span>
            <span className="md:[writing-mode:vertical-lr] md:-rotate-180 font-poppins text-sm">Contacts</span>
            <span className="md:[writing-mode:vertical-lr] md:-rotate-180 font-poppins text-sm">Online</span>
            <span className="md:[writing-mode:vertical-lr] md:-rotate-180 font-poppins text-sm">Messages</span>
            <span className="md:[writing-mode:vertical-lr] md:-rotate-180 font-poppins text-sm">Settings</span>
            <span className="md:[writing-mode:vertical-lr] md:-rotate-180 font-poppins text-sm">Profile</span>
            <span className="md:[writing-mode:vertical-lr] md:-rotate-180 font-poppins text-sm">Help</span>
            <span className="md:[writing-mode:vertical-lr] md:-rotate-180 font-poppins text-sm">About</span>
          </div>
        </div>
      </div>
      <Grid>
        <div className="col-span-11 bg-background flex flex-col">
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
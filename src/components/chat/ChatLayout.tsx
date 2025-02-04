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
    <div className="h-[calc(100vh-4rem)] flex">
      <div className="w-16 bg-background border-r flex flex-col">
        <Dialog open={showSessionForm} onOpenChange={setShowSessionForm}>
          <DialogTrigger asChild>
            <button 
              className="border px-2 py-1 rounded-2xl [writing-mode:vertical-lr] rotate-180 flex-shrink-0 m-6"
            >
              + Session
            </button>
          </DialogTrigger>
          <SessionCreationForm 
            onSubmit={handleCreateSession}
            onClose={() => setShowSessionForm(false)}
          />
        </Dialog>
        <div className="flex-1 overflow-y-auto py-4">
          <div className="flex flex-col items-center space-y-4">
            <span className="[writing-mode:vertical-lr] -rotate-180">Chat</span>
            <span className="[writing-mode:vertical-lr] -rotate-180">Contacts</span>
            <span className="[writing-mode:vertical-lr] -rotate-180">Online</span>
            {/* Added more items to demonstrate scrolling */}
            <span className="[writing-mode:vertical-lr] -rotate-180">Messages</span>
            <span className="[writing-mode:vertical-lr] -rotate-180">Settings</span>
            <span className="[writing-mode:vertical-lr] -rotate-180">Profile</span>
            <span className="[writing-mode:vertical-lr] -rotate-180">Help</span>
            <span className="[writing-mode:vertical-lr] -rotate-180">About</span>
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

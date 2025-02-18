
import React, { useState } from 'react';
import Grid from './Grid';
import Controls from './Controls';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { useSession } from '@supabase/auth-helpers-react';
import SessionCreationForm from './components/SessionCreationForm';
import { Video, Laptop, ShoppingBag, Settings2 } from "lucide-react";
import { cn } from "@/lib/utils";
import Messages from './sections/Messages';
import LiveSession from './components/LiveSession';
import { Channel, SessionFormData, SessionType } from './types';
import { Form } from '@/components/ui/form';
import { useForm } from 'react-hook-form';

const ChatLayout = () => {
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);
  const [showSessionForm, setShowSessionForm] = useState(false);
  const [activeSessionType, setActiveSessionType] = useState<SessionType>('live');
  const { toast } = useToast();
  const session = useSession();
  const queryClient = useQueryClient();
  const form = useForm<SessionFormData>();

  const createSession = useMutation({
    mutationFn: async (data: SessionFormData) => {
      if (!session?.user?.id) throw new Error('Not authenticated');

      const { data: newSession, error } = await supabase
        .from('sessions')
        .insert({
          vendor_id: session.user.id,
          name: data.name,
          description: data.description,
          session_type: data.sessionFormat,
          start_time: new Date().toISOString(),
          duration: data.duration + ' minutes',
          price: data.sessionType === 'paid' ? data.price : 0,
          max_participants: 20,
          status: 'scheduled',
          camera_config: data.cameraConfig,
          embed_url: data.embedUrl
        })
        .select()
        .single();

      if (error) throw error;
      return newSession;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
      setShowSessionForm(false);
      toast({
        title: "Success",
        description: "Session created successfully",
      });
      form.reset();
    },
    onError: (error) => {
      console.error('Error creating session:', error);
      toast({
        title: "Error",
        description: "Failed to create session. Please try again.",
        variant: "destructive"
      });
    }
  });

  const { data: sessions = [], isLoading } = useQuery({
    queryKey: ['sessions', activeSessionType],
    queryFn: async () => {
      if (!session?.user?.id) return [];
      
      if (activeSessionType === 'completed') {
        const { data, error } = await supabase
          .from('completed_sessions')
          .select(`
            *,
            vendor_profiles!inner (
              business_name,
              profiles (
                username
              )
            )
          `)
          .eq('vendor_id', session.user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;
        return data;
      }

      const { data, error } = await supabase
        .from('sessions')
        .select(`
          *,
          vendor_profiles!inner (
            business_name,
            profiles (
              username
            )
          )
        `)
        .eq('vendor_id', session.user.id)
        .eq('status', 'scheduled')
        .eq('session_type', activeSessionType)
        .order('start_time', { ascending: true });

      if (error) throw error;
      return data;
    },
    enabled: !!session?.user?.id
  });

  const sessionTypes = [
    { id: 'live' as const, label: 'Live', icon: Video },
    { id: 'embed' as const, label: 'Embed', icon: Laptop },
    { id: 'product' as const, label: 'Product', icon: ShoppingBag },
    { id: 'completed' as const, label: 'Completed Sessions', icon: Settings2 }
  ];

  const getEmptyStateMessage = (type: SessionType) => {
    switch (type) {
      case 'live':
        return "No live sessions created yet. Create your first live streaming session!";
      case 'embed':
        return "No embed sessions created yet. Create your first embedded content session!";
      case 'product':
        return "No product sessions created yet. Create your first product showcase session!";
      case 'completed':
        return "No completed sessions yet.";
      default:
        return "No sessions found.";
    }
  };

  const getSessionTypeTitle = (type: SessionType) => {
    switch (type) {
      case 'live':
        return "Live Sessions";
      case 'embed':
        return "Embed Sessions";
      case 'product':
        return "Product Sessions";
      case 'completed':
        return "Completed Sessions";
      default:
        return "Sessions";
    }
  };

  const handleSubmit = async (data: SessionFormData) => {
    createSession.mutate(data);
  };

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-row">
      <div className="w-16 min-w-16 bg-black border-r flex flex-col justify-start items-stretch p-0">
        <Dialog open={showSessionForm} onOpenChange={setShowSessionForm}>
          <DialogTrigger asChild>
            <button 
              className="border px-2 py-1 m-2 rounded-2xl text-sm hover:bg-primary/20 transition-colors"
            >
              + Session
            </button>
          </DialogTrigger>
          <Form {...form}>
            <SessionCreationForm 
              onSubmit={handleSubmit}
              onClose={() => setShowSessionForm(false)}
              form={form}
            />
          </Form>
        </Dialog>
        <div className="flex flex-col items-stretch flex-1 overflow-y-auto py-4 scrollbar-hide">
          <div className="flex flex-col items-stretch space-y-4">
            {sessionTypes.map((type) => {
              const Icon = type.icon;
              return (
                <button
                  key={type.id}
                  onClick={() => setActiveSessionType(type.id as SessionType)}
                  className={cn(
                    "flex flex-col items-center justify-center px-4 py-2 space-y-1 transition-colors hover:bg-primary/20",
                    activeSessionType === type.id && "bg-primary/20"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span className="[writing-mode:vertical-lr] -rotate-180 font-poppins text-sm text-center">
                    {type.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
      <Grid>
        <div className="col-span-11 bg-background flex flex-col">
          <div className="p-4 space-y-4">
            <h2 className="text-lg font-semibold">{getSessionTypeTitle(activeSessionType)}</h2>
            {isLoading ? (
              <p>Loading sessions...</p>
            ) : sessions.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">{getEmptyStateMessage(activeSessionType)}</p>
                <button 
                  className="mt-4 text-primary hover:underline"
                  onClick={() => setShowSessionForm(true)}
                >
                  Create {activeSessionType} session
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                {sessions.map((session) => (
                  <div
                    key={session.id}
                    className="p-4 border rounded-lg hover:bg-accent/50 cursor-pointer"
                    onClick={() => setSelectedChannel({ 
                      id: session.id,
                      name: session.name,
                      description: session.description,
                      is_public: true,
                      owner_id: session.vendor_id,
                      channel_type: 'video_stream',
                      created_at: session.created_at,
                      updated_at: session.updated_at
                    })}
                  >
                    <h3 className="font-medium">{session.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      Scheduled for: {new Date(session.start_time).toLocaleString()}
                    </p>
                    {session.description && (
                      <p className="text-sm mt-2 text-muted-foreground line-clamp-2">
                        {session.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
          {selectedChannel && <LiveSession channel={selectedChannel} />}
          <Controls />
        </div>
      </Grid>
    </div>
  );
};

export default ChatLayout;

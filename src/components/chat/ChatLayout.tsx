
import React, { useState } from 'react';
import Grid from './Grid';
import Controls from './Controls';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { useSession } from '@supabase/auth-helpers-react';
import SessionCreationForm from './components/SessionCreationForm';
import { Video, Laptop, ShoppingBag, Settings2 } from "lucide-react";
import { cn } from "@/lib/utils";
import Messages from './sections/Messages';
import LiveSession from './components/LiveSession';
import { Channel } from './types';

type SessionType = 'live' | 'embed' | 'product' | 'custom';

const ChatLayout = () => {
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);
  const [showSessionForm, setShowSessionForm] = useState(false);
  const [activeSessionType, setActiveSessionType] = useState<SessionType>('live');
  const { toast } = useToast();
  const session = useSession();

  const { data: sessions = [], isLoading } = useQuery({
    queryKey: ['sessions', activeSessionType],
    queryFn: async () => {
      if (!session?.user?.id) return [];
      
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
    { id: 'live', label: 'Live', icon: Video },
    { id: 'embed', label: 'Embed', icon: Laptop },
    { id: 'product', label: 'Product', icon: ShoppingBag },
    { id: 'custom', label: 'Custom', icon: Settings2 }
  ];

  const getEmptyStateMessage = (type: SessionType) => {
    switch (type) {
      case 'live':
        return "No live sessions created yet. Create your first live streaming session!";
      case 'embed':
        return "No embed sessions created yet. Create your first embedded content session!";
      case 'product':
        return "No product sessions created yet. Create your first product showcase session!";
      default:
        return "No custom sessions created yet. Create your first custom session!";
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
      default:
        return "Custom Sessions";
    }
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
          <SessionCreationForm 
            onSubmit={() => {
              setShowSessionForm(false);
              toast({
                title: "Success",
                description: "Session created successfully",
              });
            }}
            onClose={() => setShowSessionForm(false)}
          />
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
                    onClick={() => setSelectedChannel({ id: session.id } as Channel)}
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

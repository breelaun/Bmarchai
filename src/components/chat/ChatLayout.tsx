import React, { useState, useEffect } from 'react';
import Grid from './Grid';
import Controls from './Controls';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import SessionCreationForm from './components/SessionCreationForm';
import { MessageCircle, Users, UserCircle, Settings, HelpCircle, Info, Mail } from "lucide-react";
import { cn } from "@/lib/utils";
import Messages from './sections/Messages';
import Contacts from './sections/Contacts';

type MenuSection = 'chat' | 'contacts' | 'online' | 'messages' | 'settings' | 'profile' | 'help' | 'about';

const ChatLayout = () => {
  const [selectedChannel, setSelectedChannel] = useState<string | null>(null);
  const [session, setSession] = useState<any>(null);
  const [showSessionForm, setShowSessionForm] = useState(false);
  const [activeSection, setActiveSection] = useState<MenuSection>('chat');
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

  const handleMenuClick = (section: MenuSection) => {
    setActiveSection(section);
    toast({
      title: `${section.charAt(0).toUpperCase() + section.slice(1)}`,
      description: `Switched to ${section} section`,
    });
  };

  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data);
    };
    getSession();
  }, []);

  const menuItems = [
    { id: 'chat', label: 'Chat', icon: MessageCircle },
    { id: 'contacts', label: 'Contacts', icon: Users },
    { id: 'online', label: 'Online', icon: UserCircle },
    { id: 'messages', label: 'Messages', icon: Mail },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'help', label: 'Help', icon: HelpCircle },
    { id: 'about', label: 'About', icon: Info }
  ];

  const renderContent = () => {
    switch (activeSection) {
      case 'chat':
        return (
          <Messages 
            channelId={selectedChannel || ''} 
            userId={session?.session?.user?.id || ''} 
            sessions={sessions}
          />
        );
      case 'contacts':
        return <Contacts />;
      default:
        return (
          <div className="flex items-center justify-center h-full">
            <p className="text-muted-foreground">
              {activeSection.charAt(0).toUpperCase() + activeSection.slice(1)} section coming soon...
            </p>
          </div>
        );
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
            onSubmit={handleCreateSession}
            onClose={() => setShowSessionForm(false)}
          />
        </Dialog>
        <div className="flex flex-col items-stretch flex-1 overflow-y-auto py-4 scrollbar-hide">
          <div className="flex flex-col items-stretch space-y-4">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => handleMenuClick(item.id as MenuSection)}
                  className={cn(
                    "flex flex-col items-center justify-center px-4 py-2 space-y-1 transition-colors hover:bg-primary/20",
                    activeSection === item.id && "bg-primary/20"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span className="[writing-mode:vertical-lr] -rotate-180 font-poppins text-sm text-center">
                    {item.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
      <Grid>
        <div className="col-span-11 bg-background flex flex-col">
          {renderContent()}
          <Controls />
        </div>
      </Grid>
    </div>
  );
};

export default ChatLayout;
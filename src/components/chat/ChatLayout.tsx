import React, { useState, useEffect } from 'react';
import Grid from './Grid';
import Controls from './Controls';
import MessageArea from './components/MessageArea';
import LiveSessions from './components/LiveSessions';
import ChannelList from './components/ChannelList';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { MessageSquare, Users } from 'lucide-react';
import type { Session } from '@/types/session';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/components/ui/use-toast";
import { Switch } from "@/components/ui/switch";

const ChatLayout = () => {
  const [selectedChannel, setSelectedChannel] = useState<string | null>(null);
  const [session, setSession] = useState<any>(null);
  const [showSessionForm, setShowSessionForm] = useState(false);
  const { toast } = useToast();

  // Form states
  const [sessionType, setSessionType] = useState<'free' | 'paid'>('free');
  const [sessionPrice, setSessionPrice] = useState<number>(0);
  const [sessionName, setSessionName] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [sessionFormat, setSessionFormat] = useState<'live' | 'embed' | 'product'>('live');

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

  const handleCreateSession = async () => {
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

      // Ensure price is always a valid number
      const finalPrice = sessionType === 'paid' ? sessionPrice : 0;

      const { data, error } = await supabase
        .from('sessions')
        .insert([
          {
            name: sessionName,
            vendor_id: user.id,
            session_type: sessionType,
            price: finalPrice,
            status: 'scheduled',
            is_private: isPrivate,
            format: sessionFormat,
            // Add required fields with default values
            start_time: new Date().toISOString(),
            duration: '1 hour'
          }
        ])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Success",
        description: "Session created successfully",
      });

      // Reset form
      setSessionName('');
      setSessionType('free');
      setSessionPrice(0);
      setIsPrivate(false);
      setSessionFormat('live');
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
      {/* Primary Vertical Navigation */}
      <div className="w-16 bg-background border-r flex flex-col items-center py-6 space-y-4">
        <Dialog>
          <DialogTrigger asChild>
            <button 
              className="border px-2 py-1 rounded-2xl [writing-mode:vertical-lr] rotate-180"
            >
              + Session
            </button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create New Session</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="sessionName">Session Name</Label>
                <Input
                  id="sessionName"
                  value={sessionName}
                  onChange={(e) => setSessionName(e.target.value)}
                  placeholder="Enter session name"
                />
              </div>
              
              <div className="grid gap-2">
                <Label>Session Type</Label>
                <RadioGroup value={sessionType} onValueChange={(value: 'free' | 'paid') => setSessionType(value)}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="free" id="free" />
                    <Label htmlFor="free">Free Session</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="paid" id="paid" />
                    <Label htmlFor="paid">Paid Session</Label>
                  </div>
                </RadioGroup>
              </div>

              {sessionType === 'paid' && (
                <div className="grid gap-2">
                  <Label htmlFor="price">Price (USD)</Label>
                  <Input
                    id="price"
                    type="number"
                    value={sessionPrice}
                    onChange={(e) => setSessionPrice(Number(e.target.value))}
                    min={0}
                    step={0.01}
                  />
                </div>
              )}

              <div className="flex items-center space-x-2">
                <Switch
                  checked={isPrivate}
                  onCheckedChange={setIsPrivate}
                  id="private"
                />
                <Label htmlFor="private">Private Session</Label>
              </div>

              <div className="grid gap-2">
                <Label>Session Format</Label>
                <RadioGroup value={sessionFormat} onValueChange={(value: 'live' | 'embed' | 'product') => setSessionFormat(value)}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="live" id="live" />
                    <Label htmlFor="live">Live Stream</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="embed" id="embed" />
                    <Label htmlFor="embed">Embedded Content</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="product" id="product" />
                    <Label htmlFor="product">Product Showcase</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
            <Button onClick={handleCreateSession}>Create Session</Button>
          </DialogContent>
        </Dialog>
        <span className="[writing-mode:vertical-lr] -rotate-180">Chat</span>
        <span className="[writing-mode:vertical-lr] -rotate-180">Contacts</span>
        <span className="[writing-mode:vertical-lr] -rotate-180">Online</span>
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
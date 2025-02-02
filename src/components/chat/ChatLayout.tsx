import React, { useState, useEffect } from 'react';
import { useSession } from "@supabase/auth-helpers-react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/components/ui/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { MessageSquare, Users, Package, Hash, Settings, Home } from 'lucide-react';
import { Button } from "@/components/ui/button";

import Grid from './Grid';
import Controls from './Controls';
import MessageArea from './components/MessageArea';
import ServerList from "./components/ServerList";
import ChannelList from "./components/ChannelList";
import UserProfile from "./components/UserProfile";
import MessageList from "./components/MessageList";
import MessageInput from "./components/MessageInput";
import MembersList from "./components/MembersList";
import ProductsList from "./components/ProductsList";
import type { Session, Channel, Message } from '@/types';

const ChatLayout = () => {
  const session = useSession();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  
  // State Management
  const [selectedChannel, setSelectedChannel] = useState<string | null>(null);
  const [showSessionForm, setShowSessionForm] = useState(false);
  const [channels, setChannels] = useState<Channel[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [showMembers, setShowMembers] = useState(!isMobile);
  const [channelMembers, setChannelMembers] = useState<any[]>([]);
  const [activeGradient, setActiveGradient] = useState(0);

  // Gradient definitions
  const gradients = [
    'bg-gradient-to-br from-black via-[#1a1a1a] to-[#1B1500]',
    'bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460]',
    'bg-gradient-to-br from-[#333333] via-[#1a1a1a] to-[#f7bd00]'
  ];

  // Gradient rotation effect
  useEffect(() => {
    const gradientInterval = setInterval(() => {
      setActiveGradient((prev) => (prev + 1) % gradients.length);
    }, 10000);

    return () => clearInterval(gradientInterval);
  }, []);

  // Fetch initial channels
  useEffect(() => {
    if (!session?.user?.id) return;
    fetchChannels();
  }, [session?.user?.id]);

  const fetchChannels = async () => {
    try {
      const { data: channelsData, error: channelsError } = await supabase
        .from("chat_channels")
        .select("*")
        .order('created_at', { ascending: true });

      if (channelsError) throw channelsError;
      setChannels(channelsData);
      if (channelsData.length > 0 && !selectedChannel) {
        setSelectedChannel(channelsData[0].id);
      }
    } catch (error: any) {
      console.error("Error fetching channels:", error);
      toast({
        title: "Error",
        description: "Failed to load channels",
        variant: "destructive",
      });
    }
  };

  // Real-time message subscription
  useEffect(() => {
    if (!selectedChannel || !session?.user?.id || isSubscribed) return;

    const channel = supabase
      .channel("chat-updates")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "chat_messages",
          filter: `channel_id=eq.${selectedChannel}`,
        },
        (payload) => {
          console.log("Real-time update:", payload);
          fetchMessages();
        }
      )
      .subscribe();

    setIsSubscribed(true);

    return () => {
      supabase.removeChannel(channel);
      setIsSubscribed(false);
    };
  }, [selectedChannel, session?.user?.id, isSubscribed]);

  const fetchMessages = async () => {
    if (!selectedChannel) return;
    
    const { data, error } = await supabase
      .from("chat_messages")
      .select(`
        *,
        sender:sender_id (
          username,
          avatar_url
        )
      `)
      .eq("channel_id", selectedChannel)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error fetching messages:", error);
      return;
    }

    setMessages(data);
  };
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`h-[calc(100vh-4rem)] relative ${gradients[activeGradient]}`}
    >
      {/* Glassmorphic Overlay */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-xl" />

      <div className="relative z-10 flex h-full">
        {/* Primary Vertical Navigation */}
        <motion.div 
          initial={{ x: -100 }}
          animate={{ x: 0 }}
          className="w-16 bg-white/10 backdrop-blur-lg flex flex-col items-center py-6 space-y-6"
        >
          <button 
            className="border border-white/20 px-2 py-1 rounded-2xl rotate-180 [writing-mode:vertical-lr] text-white hover:bg-white/10 transition-colors"
            onClick={() => setShowSessionForm(true)}
          >
            + Session
          </button>
          
          <Button variant="ghost" className="p-2 rounded-xl bg-black/10 hover:bg-black/20">
            <Home className="h-6 w-6 text-white" />
          </Button>

          <span className="rotate-180 [writing-mode:vertical-lr] text-white/60">Chat</span>
          
          {channels.map((channel) => (
            <Button
              key={channel.id}
              variant="ghost"
              className={`p-2 rounded-xl hover:bg-black/20 ${
                selectedChannel === channel.id ? 'bg-black/30' : 'bg-black/10'
              }`}
              onClick={() => setSelectedChannel(channel.id)}
            >
              <MessageSquare className="h-6 w-6 text-white" />
            </Button>
          ))}
          
          <span className="rotate-180 [writing-mode:vertical-lr] text-white/60">Contacts</span>
          <span className="rotate-180 [writing-mode:vertical-lr] text-white/60">Online</span>
          
          <div className="mt-auto">
            <Button variant="ghost" className="p-2 rounded-xl bg-black/10 hover:bg-black/20">
              <Settings className="h-6 w-6 text-white" />
            </Button>
          </div>
        </motion.div>

        <Grid>
          <div className="col-span-11 flex flex-col">
            {/* Session Form Modal */}
            <AnimatePresence>
              {showSessionForm && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="absolute inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
                >
                  <SessionForm onClose={() => setShowSessionForm(false)} />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Message Area */}
            <div className="flex-1 overflow-hidden">
              <MessageArea 
                channelId={selectedChannel || ''}
                userId={session?.user?.id || ''}
                messages={messages}
              />
            </div>
            
            {/* Enhanced Controls */}
            <div className="p-4 bg-white/10 backdrop-blur-lg">
              <div className="flex items-center space-x-4">
                <Button variant="ghost" className="p-2 rounded-xl bg-black/10 hover:bg-black/20">
                  <Paperclip className="h-5 w-5 text-white" />
                </Button>
                <Button variant="ghost" className="p-2 rounded-xl bg-black/10 hover:bg-black/20">
                  <Image className="h-5 w-5 text-white" />
                </Button>
                <Button variant="ghost" className="p-2 rounded-xl bg-black/10 hover:bg-black/20">
                  <Package className="h-5 w-5 text-white" />
                </Button>
                <div className="flex-1">
                  <Controls />
                </div>
              </div>
            </div>
          </div>
        </Grid>
      </div>
    </motion.div>
  );
};

export default ChatLayout;

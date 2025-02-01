import React, { useEffect, useState } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import type { Channel, Message } from "./types";

import LeftSidebar from "./components/LeftSidebar";
import ChatHeader from "./components/ChatHeader";
import MessageArea from "./components/MessageArea";
import MessageInput from "./components/MessageInput";

const ChatLayout = () => {
  const session = useSession();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [channels, setChannels] = useState<Channel[]>([]);
  const [selectedChannel, setSelectedChannel] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageInput, setMessageInput] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [showSidebar, setShowSidebar] = useState(!isMobile);

  // Fetch channels that user has access to
  useEffect(() => {
    if (!session?.user?.id) return;
    fetchChannels();
  }, [session?.user?.id]);

  const fetchChannels = async () => {
    try {
      const { data: channelsData, error: channelsError } = await supabase
        .from("chat_channels")
        .select("*, chat_members!inner(*)")
        .or(`is_public.eq.true,owner_id.eq.${session?.user?.id},chat_members.user_id.eq.${session?.user?.id}`);

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

  // Subscribe to messages for selected channel
  useEffect(() => {
    if (!selectedChannel || !session?.user?.id || isSubscribed) return;

    const fetchMessages = async () => {
      const { data: messagesData, error: messagesError } = await supabase
        .from("chat_messages")
        .select(`
          *,
          sender:profiles!chat_messages_sender_id_fkey (
            username,
            avatar_url
          )
        `)
        .eq("channel_id", selectedChannel)
        .order("created_at", { ascending: true });

      if (messagesError) throw messagesError;
      setMessages(messagesData || []);
    };

    fetchMessages();

    // Set up real-time subscription
    const channel = supabase
      .channel(`chat-${selectedChannel}`)
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

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim() || !selectedChannel || !session?.user?.id) return;

    try {
      const { error } = await supabase.from("chat_messages").insert({
        channel_id: selectedChannel,
        sender_id: session.user.id,
        content: messageInput.trim(),
      });

      if (error) throw error;
      setMessageInput("");
    } catch (error: any) {
      toast({
        title: "Error sending message",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex h-screen bg-gradient-to-br from-gray-900 to-gray-800"
    >
      <LeftSidebar 
        channels={channels}
        selectedChannel={selectedChannel}
        setSelectedChannel={setSelectedChannel}
        showSidebar={showSidebar}
      />

      <div className="flex-1 flex flex-col">
        <ChatHeader 
          channels={channels}
          selectedChannel={selectedChannel}
          isMobile={isMobile}
          showSidebar={showSidebar}
          setShowSidebar={setShowSidebar}
        />

        <MessageArea messages={messages} />

        <MessageInput
          messageInput={messageInput}
          setMessageInput={setMessageInput}
          handleSendMessage={handleSendMessage}
        />
      </div>
    </motion.div>
  );
};

export default ChatLayout;
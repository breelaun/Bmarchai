import React, { useEffect, useState } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Menu, Hash, Users } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";

import ServerList from "./components/ServerList";
import ChannelList from "./components/ChannelList";
import UserProfile from "./components/UserProfile";
import MessageList from "./components/MessageList";
import MessageInput from "./components/MessageInput";
import MembersList from "./components/MembersList";
import type { Channel, Message } from "./types";

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
  const [showMembers, setShowMembers] = useState(!isMobile);

  useEffect(() => {
    if (!session?.user?.id) return;
    fetchChannels();
  }, [session?.user?.id]);

  const fetchChannels = async () => {
    try {
      const { data: channelsData, error: channelsError } = await supabase
        .from("chat_channels")
        .select("*")
        .or(`is_public.eq.true,owner_id.eq.${session?.user?.id}`);

      if (channelsError) throw channelsError;

      setChannels(channelsData);
      if (channelsData.length > 0) {
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

  useEffect(() => {
    if (!selectedChannel || !session?.user?.id || isSubscribed) return;

    const fetchMessages = async () => {
      const { data: messagesData, error: messagesError } = await supabase
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

      if (messagesError) throw messagesError;
      setMessages(messagesData);
    };

    fetchMessages();

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

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim() || !selectedChannel || !session?.user?.id) return;

    const { error } = await supabase.from("chat_messages").insert({
      channel_id: selectedChannel,
      sender_id: session.user.id,
      content: messageInput.trim(),
    });

    if (error) {
      toast({
        title: "Error sending message",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    setMessageInput("");
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] bg-[#313338] mt-16">
      <ServerList
        channels={channels}
        selectedChannel={selectedChannel}
        onChannelSelect={setSelectedChannel}
        isMobile={isMobile}
        showSidebar={showSidebar}
      />
      <ChannelList
        channels={channels}
        selectedChannel={selectedChannel}
        onChannelSelect={setSelectedChannel}
        isMobile={isMobile}
        showSidebar={showSidebar}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col bg-[#313338] relative">
        {/* Channel Header */}
        <div className="h-12 border-b border-[#1F2023] flex items-center justify-between px-4">
          {isMobile && (
            <Button
              variant="ghost"
              size="icon"
              className="mr-2"
              onClick={() => setShowSidebar(!showSidebar)}
            >
              <Menu className="h-5 w-5" />
            </Button>
          )}
          <div className="flex items-center space-x-2">
            <Hash className="w-5 h-5 text-[#949BA4]" />
            <h3 className="font-semibold text-white">
              {channels.find((c) => c.id === selectedChannel)?.name || "Select a channel"}
            </h3>
          </div>
          <div className="flex items-center space-x-2">
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-[#949BA4] hover:text-white"
              onClick={() => setShowMembers(!showMembers)}
            >
              <Users className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <MessageList messages={messages} />
        <MessageInput
          messageInput={messageInput}
          setMessageInput={setMessageInput}
          handleSendMessage={handleSendMessage}
        />
      </div>

      <MembersList
        session={session}
        isMobile={isMobile}
        showMembers={showMembers}
      />
    </div>
  );
};

export default ChatLayout;
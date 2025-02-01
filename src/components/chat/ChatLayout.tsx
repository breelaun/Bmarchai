import React, { useEffect, useState } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Menu, Hash, Users, Package, ChevronLeft, MessageSquare, Settings, Home, Sparkles } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { motion, AnimatePresence } from "framer-motion";

import ServerList from "./components/ServerList";
import ChannelList from "./components/ChannelList";
import UserProfile from "./components/UserProfile";
import MessageList from "./components/MessageList";
import MessageInput from "./components/MessageInput";
import MembersList from "./components/MembersList";
import ProductsList from "./components/ProductsList";
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
  const [showProducts, setShowProducts] = useState(!isMobile);
  const [channelMembers, setChannelMembers] = useState<any[]>([]);
  const [channelProducts, setChannelProducts] = useState<any[]>([]);
  const [activeGradient, setActiveGradient] = useState(0);

  const gradients = [
    'bg-gradient-to-br from-black via-[#000000] to-[#000000]',
    'bg-gradient-to-br from-[#00030b] to-[#00030b]',
    'bg-gradient-to-br from-[#00081f] to-[#00081f]',
    'bg-gradient-to-br from-[#000e32] to-[#000e32]',
    'bg-gradient-to-br from-[#001346] to-[#001346]',
    'bg-gradient-to-br from-[#001959] to-[#001959]',
    'bg-gradient-to-br from-[#001E6D] to-[#001E6D]',
    'bg-gradient-to-br from-[#001959] to-[#001959]',
    'bg-gradient-to-br from-[#001346] to-[#001346]',
    'bg-gradient-to-br from-[#000e32] to-[#000e32]',
    'bg-gradient-to-br from-[#00081f] to-[#00081f]',
    
  ];

  useEffect(() => {
    const gradientInterval = setInterval(() => {
      setActiveGradient((prev) => (prev + 1) % gradients.length);
    }, 10000);

    return () => clearInterval(gradientInterval);
  }, []);

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
    if (!selectedChannel) return;
    fetchChannelMembers();
  }, [selectedChannel]);

  const fetchChannelMembers = async () => {
    try {
      const { data: membersData, error: membersError } = await supabase
        .from("chat_members")
        .select(`
          *,
          profiles:user_id (
            username,
            avatar_url
          )
        `)
        .eq("channel_id", selectedChannel);

      if (membersError) throw membersError;
      setChannelMembers(membersData);
    } catch (error) {
      console.error("Error fetching channel members:", error);
    }
  };

  useEffect(() => {
    if (!selectedChannel) return;
    fetchChannelProducts();
  }, [selectedChannel]);

  const fetchChannelProducts = async () => {
    try {
      const { data: productsData, error: productsError } = await supabase
        .from("chat_channel_products")
        .select(`
          *,
          products (
            id,
            name,
            description,
            price,
            image_url
          )
        `)
        .eq("channel_id", selectedChannel);

      if (productsError) throw productsError;
      setChannelProducts(productsData);
    } catch (error) {
      console.error("Error fetching channel products:", error);
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
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`relative flex h-screen ${gradients[activeGradient]} overflow-hidden`}
    >
      {/* Glassmorphic Overlay */}
      <div className="absolute inset-0 bg-black/60" />

      {/* Main Content */}
      <div className="relative z-10 flex w-full">
        {/* Left Sidebar - Server Navigation */}
        <motion.div 
          initial={{ x: -100 }}
          animate={{ x: 0 }}
          className={`${showSidebar ? 'w-20' : 'w-0'} bg-white/10 backdrop-blur-lg border-r border-white/20 transition-all duration-300 flex flex-col items-center py-4 space-y-6`}
        >
          <Button variant="ghost" className="p-2 rounded-xl bg-black/10 hover:bg-black/20">
            <Home className="h-6 w-6 text-white" />
          </Button>
          
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
          
          <div className="mt-auto">
            <Button variant="ghost" className="p-2 rounded-xl bg-black/10 hover:bg-black/20">
              <Settings className="h-6 w-6 text-white" />
            </Button>
          </div>
        </motion.div>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="h-16 bg-white/10 backdrop-blur-lg border-b border-white/20 flex items-center justify-between px-6"
          >
            <div className="flex items-center space-x-4">
              {isMobile && (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setShowSidebar(!showSidebar)}
                  className="bg-black/10 hover:bg-black/20"
                >
                  {showSidebar ? <ChevronLeft className="h-5 w-5 text-white" /> : <Menu className="h-5 w-5 text-white" />}
                </Button>
              )}
              <div className="flex items-center space-x-2">
                <Hash className="h-5 w-5 text-white" />
                <h3 className="font-semibold text-white text-lg">
                  {channels.find((c) => c.id === selectedChannel)?.name || "Select a channel"}
                </h3>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                className="rounded-xl hover:bg-black/20 bg-black/10"
                onClick={() => setShowProducts(!showProducts)}
              >
                <Package className="h-5 w-5 text-white" />
              </Button>
              <Button
                variant="ghost"
                className="rounded-xl hover:bg-black/20 bg-black/10"
                onClick={() => setShowMembers(!showMembers)}
              >
                <Users className="h-5 w-5 text-white" />
              </Button>
            </div>
          </motion.div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto">
            <AnimatePresence>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="flex items-start space-x-3 hover:bg-white/5 p-3 rounded-lg transition-colors"
                >
                  <img
                    src={message.sender?.avatar_url || "/api/placeholder/32/32"}
                    alt="avatar"
                    className="w-8 h-8 rounded-full"
                  />
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-white">
                        {message.sender?.username || "Anonymous"}
                      </span>
                      <span className="text-xs text-white/60">
                        {new Date(message.created_at).toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="text-white/80 mt-1">{message.content}</p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Message Input */}
          <div className="p-4 bg-white/10 backdrop-blur-lg border-t border-white/20">
            <form onSubmit={handleSendMessage} className="flex items-center space-x-3">
              <input
                type="text"
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 bg-black/20 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-white/20 placeholder-white/50"
              />
              <Button 
                type="submit"
                className="bg-white/10 hover:bg-white/20 text-white rounded-xl px-6 py-3"
              >
                Send
              </Button>
            </form>
          </div>
        </div>

        {/* Right Sidebar - Members & Products */}
        <div 
          className={`${
            (showMembers || showProducts) ? 'w-64' : 'w-0'
          } bg-white/10 backdrop-blur-lg border-l border-white/20 transition-all duration-300 overflow-hidden`}
        >
          {showMembers && (
            <MembersList
              members={channelMembers}
              session={session}
              isMobile={isMobile}
              showMembers={showMembers}
              showSidebar={showSidebar}
            />
          )}
          {showProducts && (
            <ProductsList
              products={channelProducts}
              session={session}
              isMobile={isMobile}
              showProducts={showProducts}
              channelId={selectedChannel}
              showSidebar={showSidebar}
            />
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ChatLayout;

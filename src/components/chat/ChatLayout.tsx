import React, { useEffect, useState } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Menu, Hash, Users, Package, ChevronLeft, MessageSquare, Settings, Home, Sparkles, Send, Plus } from "lucide-react";
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
    'bg-gradient-to-br from-black via-[#1a1a1a] to-[#2d2d2d]',
    'bg-gradient-to-br from-[#f7bd00] via-[#1a1a1a] to-black',
    'bg-gradient-to-br from-[#333333] via-[#1a1a1a] to-[#f7bd00]'
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
    fetchChannelProducts();
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
      console.error("Error fetching members:", error);
    }
  };

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
      console.error("Error fetching products:", error);
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
      <div className="absolute inset-0 bg-black/40 backdrop-blur-xl" />

      {/* Main Content */}
      <div className="relative z-10 flex w-full">
        {/* Sidebar */}
        <motion.div 
          initial={{ x: -100 }}
          animate={{ x: 0 }}
          className={`${showSidebar ? 'w-20' : 'w-0'} 
            bg-black/30 backdrop-blur-lg border-r border-[#f7bd00]/20 
            transition-all duration-300 flex flex-col items-center py-4 space-y-6`}
        >
          {channels.map((channel) => (
            <Button
              key={channel.id}
              variant="ghost"
              className={`p-2 rounded-xl hover:bg-[#f7bd00]/20 transition-colors duration-300
                ${selectedChannel === channel.id ? 'bg-[#f7bd00]/30' : 'bg-black/20'}`}
              onClick={() => setSelectedChannel(channel.id)}
            >
              <MessageSquare className="h-6 w-6 text-[#f7bd00]" />
            </Button>
          ))}
          
          <Button 
            variant="ghost" 
            className="p-2 rounded-xl bg-black/20 hover:bg-[#f7bd00]/20 mt-auto"
          >
            <Plus className="h-6 w-6 text-[#f7bd00]" />
          </Button>
        </motion.div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="h-16 bg-black/30 backdrop-blur-lg border-b border-[#f7bd00]/20 
                     flex items-center justify-between px-6"
          >
            <div className="flex items-center space-x-4">
              {isMobile && (
                <Button 
                  variant="ghost"
                  className="p-2 rounded-xl bg-black/20 hover:bg-[#f7bd00]/20"
                  onClick={() => setShowSidebar(!showSidebar)}
                >
                  {showSidebar ? <ChevronLeft className="h-5 w-5 text-[#f7bd00]" /> : 
                               <Menu className="h-5 w-5 text-[#f7bd00]" />}
                </Button>
              )}
              <div className="flex items-center space-x-2">
                <Hash className="h-5 w-5 text-[#f7bd00]" />
                <h3 className="font-semibold text-[#f7bd00] text-lg">
                  {channels.find((c) => c.id === selectedChannel)?.name || "Select a channel"}
                </h3>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                className="p-2 rounded-xl bg-black/20 hover:bg-[#f7bd00]/20"
                onClick={() => setShowProducts(!showProducts)}
              >
                <Package className="h-5 w-5 text-[#f7bd00]" />
              </Button>
              <Button
                variant="ghost"
                className="p-2 rounded-xl bg-black/20 hover:bg-[#f7bd00]/20"
                onClick={() => setShowMembers(!showMembers)}
              >
                <Users className="h-5 w-5 text-[#f7bd00]" />
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
                  className="bg-black/20 hover:bg-[#f7bd00]/10 transition-all p-4 
                           border-b border-[#f7bd00]/10"
                >
                  <div className="flex items-start space-x-3">
                    <img
                      src={message.sender?.avatar_url || "/api/placeholder/32/32"}
                      alt="avatar"
                      className="w-10 h-10 rounded-full bg-[#f7bd00]/20"
                    />
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-[#f7bd00]">
                          {message.sender?.username || "Anonymous"}
                        </span>
                        <span className="text-xs text-gray-400">
                          {new Date(message.created_at).toLocaleTimeString()}
                        </span>
                      </div>
                      <p className="text-gray-300 mt-1">{message.content}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Message Input */}
          <div className="p-4 bg-black/30 border-t border-[#f7bd00]/20">
            <form onSubmit={handleSendMessage} className="flex items-center space-x-3">
              <input
                type="text"
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 bg-black/20 text-white rounded-xl px-4 py-3 
                         border border-[#f7bd00]/20 focus:border-[#f7bd00]/50 
                         focus:outline-none focus:ring-1 focus:ring-[#f7bd00]/50
                         placeholder-gray-500"
              />
              <Button 
                type="submit"
                className="bg-[#f7bd00] hover:bg-[#f7bd00]/80 text-black 
                         rounded-xl px-6 py-3 flex items-center space-x-2"
              >
                <Send className="h-5 w-5" />
                <span>Send</span>
              </Button>
            </form>
          </div>
        </div>

        {/* Right Sidebar - Members & Products */}
        <div 
          className={`${
            (showMembers || showProducts) ? 'w-64' : 'w-0'
          } bg-black/30 backdrop-blur-lg border-l border-[#f7bd00]/20 
             transition-all duration-300 overflow-hidden`}
        >
          {showMembers && (
            <div className="p-4">
              <h3 className="text-[#f7bd00] font-semibold mb-4">Members</h3>
              {channelMembers.map((member) => (
                <div 
                  key={member.user_id}
                  className="flex items-center space-x-3 p-2 hover:bg-[#f7bd00]/10 
                           rounded-lg transition-colors"
                >
                  <img
                    src={member.profiles?.avatar_url || "/api/placeholder/32/32"}
                    alt="avatar"
                    className="w-8 h-8 rounded-full bg-[#f7bd00]/20"
                  />
                  <span className="text-gray-300">
                    {member.profiles?.username || "Anonymous"}
                  </span>
                </div>
              ))}
            </div>
          )}
          
          {showProducts && (
            <div className="p-4">
              <h3 className="text-[#f7bd00] font-semibold mb-4">Products</h3>
              {channelProducts.map((product) => (
                <div 
                  key={product.id}
                  className="p-3 hover:bg-[#f7bd00]/10 rounded-lg 
                           border border-[#f7bd00]/20 mb-3"
                >
                  <h4 className="text-[#f7bd00] font-medium">
                    {product.products.name}
                  </h4>
                  <p className="text-gray-400 text-sm">
                    {product.products.description}
                  </p>
                  <span className="text-[#f7bd00] font-bold mt-2 block">
                    ${product.products.price}
                  </span>
                </div>
              )

export default ChatLayout;

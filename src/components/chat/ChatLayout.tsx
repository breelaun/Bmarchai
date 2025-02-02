import React, { useState, useEffect } from 'react';
import { useIsMobile } from "@/hooks/use-mobile";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { SidebarProvider } from "@/components/ui/sidebar";
import type { Channel, Message } from "./types";

import LeftSidebar from "./components/LeftSidebar";
import ChatHeader from "./components/ChatHeader";
import MessageArea from "./components/MessageArea";

// Define gradients array
const gradients = [
  'bg-gradient-to-r from-gray-900 to-gray-800',
  'bg-gradient-to-r from-blue-900 to-blue-800',
  'bg-gradient-to-r from-purple-900 to-purple-800'
];

const ChatLayout = () => {
  const isMobile = useIsMobile();
  const [showSidebar, setShowSidebar] = useState(!isMobile);
  const [channels, setChannels] = useState<Channel[]>([]);
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);
  const [messageInput, setMessageInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [activeGradient, setActiveGradient] = useState(0);

  const fetchChannels = async () => {
    // Fetch channels from the API
    const response = await fetch('/api/channels');
    const data = await response.json();
    setChannels(data);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    // Send message logic
    const newMessage = { content: messageInput, channelId: selectedChannel?.id };
    await fetch('/api/messages', {
      method: 'POST',
      body: JSON.stringify(newMessage),
    });
    setMessageInput("");
    fetchMessages();
  };

  const fetchMessages = async () => {
    if (selectedChannel) {
      const response = await fetch(`/api/messages?channelId=${selectedChannel.id}`);
      const data = await response.json();
      setMessages(data);
    }
  };

  useEffect(() => {
    fetchChannels();
  }, []);

  useEffect(() => {
    if (selectedChannel) {
      fetchMessages();
    }
  }, [selectedChannel]);

  return (
    <SidebarProvider>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className={`relative flex h-screen ${gradients[activeGradient]} overflow-hidden`}
      >
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
        
        <div className="relative z-10 flex w-full">
          <LeftSidebar 
            channels={channels}
            selectedChannel={selectedChannel}
            setSelectedChannel={setSelectedChannel}
            showSidebar={showSidebar}
            onChannelCreated={fetchChannels}
          />

          <div className="flex-1 flex flex-col">
            <ChatHeader 
              channels={channels}
              selectedChannel={selectedChannel}
              isMobile={isMobile}
              showSidebar={showSidebar}
              setShowSidebar={setShowSidebar}
            />

            <MessageArea 
              channelId={selectedChannel?.id || ''}
              userId={selectedChannel?.owner_id || ''}
            />

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
                  variant="ghost"
                  className="bg-white/10 hover:bg-white/20 text-white rounded-xl px-6 py-3"
                >
                  Send
                </Button>
              </form>
            </div>
          </div>
        </div>
      </motion.div>
    </SidebarProvider>
  );
};

export default ChatLayout;

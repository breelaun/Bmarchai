import React, { useState, useEffect } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { SidebarProvider } from "@/components/ui/sidebar";
import LeftSidebar from "./components/LeftSidebar";
import MessageArea from "./components/MessageArea";
import MessageInput from "./components/MessageInput";
import type { Channel } from "./types";

const ChatLayout = () => {
  const session = useSession();
  const [channels, setChannels] = useState<Channel[]>([]);
  const [selectedChannel, setSelectedChannel] = useState<string | null>(null);
  const [showSidebar, setShowSidebar] = useState(true);

  useEffect(() => {
    fetchChannels();
  }, []);

  const fetchChannels = async () => {
    if (!session?.user?.id) return;
    
    console.log('Fetching channels for user:', session.user.id);
    const { data, error } = await supabase
      .from("chat_channels")
      .select("*")
      .or(`is_public.eq.true,owner_id.eq.${session.user.id}`)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error fetching channels:", error);
      return;
    }

    console.log('Fetched channels:', data);
    setChannels(data);
    if (data.length > 0 && !selectedChannel) {
      setSelectedChannel(data[0].id);
    }
  };

  if (!session) {
    return <div>Please log in to access the chat.</div>;
  }

  return (
    <SidebarProvider defaultOpen>
      <div className="flex h-screen bg-[#1E1F22] text-white">
        <LeftSidebar
          channels={channels}
          selectedChannel={selectedChannel}
          setSelectedChannel={setSelectedChannel}
          showSidebar={showSidebar}
          onChannelCreated={fetchChannels}
        />
        
        <div className="flex-1 flex flex-col">
          {selectedChannel && (
            <>
              <div className="flex-1 overflow-y-auto">
                <MessageArea 
                  channelId={selectedChannel} 
                  userId={session.user.id} 
                />
              </div>
              <MessageInput 
                channelId={selectedChannel} 
                userId={session.user.id} 
              />
            </>
          )}
        </div>
      </div>
    </SidebarProvider>
  );
};

export default ChatLayout;
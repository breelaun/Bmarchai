import React from "react";
import { Button } from "@/components/ui/button";
import { Menu, Hash, ChevronLeft } from "lucide-react";
import type { Channel } from "../types";

interface ChatHeaderProps {
  channels: Channel[];
  selectedChannel: string | null;
  isMobile: boolean;
  showSidebar: boolean;
  setShowSidebar: (show: boolean) => void;
}

const ChatHeader = ({ channels, selectedChannel, isMobile, showSidebar, setShowSidebar }: ChatHeaderProps) => {
  return (
    <div className="h-16 bg-white/10 backdrop-blur-lg border-b border-white/20 flex items-center justify-between px-6">
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
    </div>
  );
};

export default ChatHeader;
import React from 'react';
import { Button } from "@/components/ui/button";
import { MessageSquare, Hash, Plus } from "lucide-react";
import type { Channel } from '../types';

interface ServerListProps {
  channels: Channel[];
  selectedChannel: string | null;
  onChannelSelect: (channelId: string) => void;
  isMobile?: boolean;
  showSidebar?: boolean;
}

const ServerList = ({ channels, selectedChannel, onChannelSelect, isMobile, showSidebar }: ServerListProps) => {
  return (
    <div className={`${isMobile ? (showSidebar ? 'absolute left-0 z-20' : 'hidden') : ''} w-[72px] bg-[#1E1F22] flex flex-col items-center py-3 space-y-2 h-full`}>
      <Button
        variant="ghost"
        size="icon"
        className="rounded-full bg-[#313338] hover:bg-primary text-white"
      >
        <MessageSquare className="w-5 h-5" />
      </Button>
      <div className="w-8 h-[2px] bg-[#35363C] rounded-lg my-2" />
      {channels.map((channel) => (
        <Button
          key={channel.id}
          variant="ghost"
          size="icon"
          className="rounded-full bg-[#313338] hover:bg-primary text-white"
          onClick={() => onChannelSelect(channel.id)}
        >
          <Hash className="w-5 h-5" />
        </Button>
      ))}
      <Button
        variant="ghost"
        size="icon"
        className="rounded-full bg-[#313338] hover:bg-emerald-600 text-emerald-500"
      >
        <Plus className="w-5 h-5" />
      </Button>
    </div>
  );
};

export default ServerList;
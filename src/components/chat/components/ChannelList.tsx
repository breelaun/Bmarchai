import React from 'react';
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Hash } from "lucide-react";
import type { Channel } from '../types';

interface ChannelListProps {
  channels: Channel[];
  selectedChannel: string | null;
  onChannelSelect: (channelId: string) => void;
  isMobile?: boolean;
  showSidebar?: boolean;
}

const ChannelList = ({ channels, selectedChannel, onChannelSelect, isMobile, showSidebar }: ChannelListProps) => {
  return (
    <div className={`${isMobile ? (showSidebar ? 'absolute left-[72px] z-20' : 'hidden') : ''} w-60 bg-[#2B2D31] flex flex-col h-full`}>
      <div className="p-4 border-b border-[#1F2023] shadow">
        <h2 className="font-semibold text-white">Channels</h2>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-[2px]">
          {channels.map((channel) => (
            <Button
              key={channel.id}
              variant={selectedChannel === channel.id ? "secondary" : "ghost"}
              className="w-full justify-start text-[#949BA4] hover:text-white"
              onClick={() => onChannelSelect(channel.id)}
            >
              <Hash className="w-4 h-4 mr-2" />
              {channel.name}
            </Button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default ChannelList;
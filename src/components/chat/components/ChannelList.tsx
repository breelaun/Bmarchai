import React from 'react';
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Hash } from "lucide-react";
import type { Channel } from '../types';

interface ChannelListProps {
  channels: Channel[];
  selectedChannel: string | null;
  onChannelSelect: (channelId: string) => void;
}

const ChannelList = ({ channels, selectedChannel, onChannelSelect }: ChannelListProps) => {
  return (
    <div className="w-60 bg-gray-900/50 backdrop-blur-lg border-r border-white/10 flex flex-col h-full">
      <div className="p-4 border-b border-white/10">
        <h2 className="font-semibold text-white">Channels</h2>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-[2px]">
          {channels.map((channel) => (
            <Button
              key={channel.id}
              variant={selectedChannel === channel.id ? "secondary" : "ghost"}
              className={`w-full justify-start text-white/70 hover:text-white ${
                selectedChannel === channel.id ? 'bg-white/10' : ''
              }`}
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
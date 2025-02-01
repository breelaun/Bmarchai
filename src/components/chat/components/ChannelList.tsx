import React from 'react';
import { Hash } from 'lucide-react';

interface Channel {
  id: string;
  name: string;
}

interface ChannelListProps {
  channels: Channel[];
  selectedChannel: string | null;
  onSelectChannel: (id: string) => void;
}

const ChannelList = ({ channels, selectedChannel, onSelectChannel }: ChannelListProps) => {
  return (
    <div className="space-y-1">
      <h3 className="px-2 text-sm font-medium text-muted-foreground">Channels</h3>
      {channels.map((channel) => (
        <div 
          key={channel.id}
          onClick={() => onSelectChannel(channel.id)}
          className={`flex items-center space-x-2 px-2 py-1.5 text-sm ${
            selectedChannel === channel.id 
              ? 'text-foreground bg-accent' 
              : 'text-muted-foreground hover:text-foreground hover:bg-accent'
          } rounded-md cursor-pointer`}
        >
          <Hash className="h-4 w-4" />
          <span>{channel.name}</span>
        </div>
      ))}
    </div>
  );
};

export default ChannelList;
import React from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import type { Message } from '../types';

interface MessageListProps {
  messages: Message[];
}

const MessageList = ({ messages }: MessageListProps) => {
  return (
    <ScrollArea className="flex-1 p-4">
      <div className="space-y-4">
        {messages.map((message) => (
          <div key={message.id} className="flex items-start gap-3 group">
            <Avatar className="h-10 w-10 shrink-0">
              <AvatarImage src={message.sender?.avatar_url} />
              <AvatarFallback>
                {message.sender?.username?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline gap-2 flex-wrap">
                <span className="font-medium text-white">
                  {message.sender?.username}
                </span>
                <span className="text-xs text-[#949BA4]">
                  {new Date(message.created_at).toLocaleTimeString()}
                </span>
              </div>
              <p className="text-[#DBDEE1] break-words">{message.content}</p>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
};

export default MessageList;
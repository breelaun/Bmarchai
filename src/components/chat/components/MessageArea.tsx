import React from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from 'date-fns';
import type { Message } from '../types';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface MessageAreaProps {
  messages: Message[];
  currentUserId?: string;
}

const MessageArea = ({ messages, currentUserId }: MessageAreaProps) => {
  return (
    <ScrollArea className="flex-1 p-4">
      <div className="space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex items-start gap-3 ${
              message.sender_id === currentUserId ? 'flex-row-reverse' : ''
            }`}
          >
            <Avatar className="w-8 h-8">
              <AvatarImage src={message.sender?.avatar_url} />
              <AvatarFallback>
                {message.sender?.username?.[0]?.toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
            <div className={`flex flex-col ${
              message.sender_id === currentUserId ? 'items-end' : ''
            }`}>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-white">
                  {message.sender?.username}
                </span>
                <span className="text-xs text-gray-400">
                  {format(new Date(message.created_at), 'HH:mm')}
                </span>
              </div>
              <div className={`mt-1 rounded-lg px-4 py-2 max-w-md ${
                message.sender_id === currentUserId
                  ? 'bg-emerald-500 text-white'
                  : 'bg-gray-800 text-white/90'
              }`}>
                {message.content}
              </div>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
};

export default MessageArea;
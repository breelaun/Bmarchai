import React from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";

interface MessageInputProps {
  messageInput: string;
  setMessageInput: (value: string) => void;
  handleSendMessage: (e: React.FormEvent) => void;
}

const MessageInput = ({
  messageInput,
  setMessageInput,
  handleSendMessage,
}: MessageInputProps) => {
  return (
    <form onSubmit={handleSendMessage} className="p-4 border-t border-white/10 bg-gray-900/50">
      <div className="flex gap-2">
        <Input
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 bg-gray-800 border-gray-700 text-white"
        />
        <Button 
          type="submit" 
          size="icon"
          className="bg-emerald-500 hover:bg-emerald-600"
          disabled={!messageInput.trim()}
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </form>
  );
};

export default MessageInput;
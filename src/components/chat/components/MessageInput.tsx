import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusCircle, Gift, ImagePlus, Smile } from "lucide-react";

interface MessageInputProps {
  messageInput: string;
  setMessageInput: (value: string) => void;
  handleSendMessage: (e: React.FormEvent) => void;
}

const MessageInput = ({ messageInput, setMessageInput, handleSendMessage }: MessageInputProps) => {
  return (
    <div className="p-4">
      <form onSubmit={handleSendMessage} className="relative">
        <Input
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
          placeholder="Message #general"
          className="bg-[#383A40] border-none text-white placeholder:text-[#949BA4] pr-32"
        />
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
          <Button type="button" variant="ghost" size="icon" className="text-[#949BA4] hover:text-white hidden sm:inline-flex">
            <PlusCircle className="h-5 w-5" />
          </Button>
          <Button type="button" variant="ghost" size="icon" className="text-[#949BA4] hover:text-white hidden sm:inline-flex">
            <Gift className="h-5 w-5" />
          </Button>
          <Button type="button" variant="ghost" size="icon" className="text-[#949BA4] hover:text-white">
            <ImagePlus className="h-5 w-5" />
          </Button>
          <Button type="button" variant="ghost" size="icon" className="text-[#949BA4] hover:text-white">
            <Smile className="h-5 w-5" />
          </Button>
        </div>
      </form>
    </div>
  );
};

export default MessageInput;
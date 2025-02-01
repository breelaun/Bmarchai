import React from 'react';
import { Button } from "@/components/ui/button";
import { Send, Paperclip, Image } from "lucide-react";

const Controls = () => {
  return (
    <div className="controls flex items-center gap-2 bg-card p-4 rounded-lg shadow-sm">
      <Button variant="ghost" size="icon">
        <Paperclip className="h-5 w-5" />
      </Button>
      <Button variant="ghost" size="icon">
        <Image className="h-5 w-5" />
      </Button>
      <input
        type="text"
        placeholder="Type a message..."
        className="flex-1 bg-background rounded-md px-3 py-2"
      />
      <Button>
        <Send className="h-5 w-5 mr-2" />
        Send
      </Button>
    </div>
  );
};

export default Controls;
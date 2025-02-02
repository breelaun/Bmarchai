import React from 'react';
import { Button } from "@/components/ui/button";
import { Send, Paperclip, Image, Package } from "lucide-react";

const Controls = () => {
  return (
    <div className="w-full border-t bg-background p-4">
      <div className="controls flex items-center gap-2 max-w-6xl mx-auto">
        <Button variant="ghost" size="icon">
          <Paperclip className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon">
          <Image className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon">
          <Package className="h-5 w-5" />
        </Button>
        <input
          type="text"
          placeholder="Type a message..."
          className="flex-1 bg-accent/50 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <Button>
          <Send className="h-5 w-5 mr-2" />
          Send
        </Button>
      </div>
    </div>
  );
};

export default Controls;

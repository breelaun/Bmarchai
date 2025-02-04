import React from 'react';
import { Button } from "@/components/ui/button";
import { Send, Paperclip, Image, Package } from "lucide-react";

const Controls = () => {
  return (
    <div className="w-full border-t bg-background p-2 sm:p-4">
      <div className="controls flex flex-wrap sm:flex-nowrap items-center gap-2 max-w-6xl mx-auto">
        <div className="flex gap-2 w-full sm:w-auto order-2 sm:order-1">
          <Button variant="ghost" size="icon" className="hidden sm:inline-flex">
            <Paperclip className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="hidden sm:inline-flex">
            <Image className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="hidden sm:inline-flex">
            <Package className="h-5 w-5" />
          </Button>
        </div>
        <input
          type="text"
          placeholder="Type a message..."
          className="flex-1 bg-accent/50 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary order-1 sm:order-2"
        />
        <Button className="w-full sm:w-auto order-3">
          <Send className="h-5 w-5 mr-2" />
          Send
        </Button>
      </div>
    </div>
  );
};

export default Controls;
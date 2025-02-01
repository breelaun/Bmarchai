import React from "react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Home, MessageSquare, Users, Package, Settings, Sparkles, Info } from "lucide-react";
import { motion } from "framer-motion";
import type { Channel } from "../types";

interface LeftSidebarProps {
  channels: Channel[];
  selectedChannel: string | null;
  setSelectedChannel: (id: string) => void;
  showSidebar: boolean;
}

const LeftSidebar = ({ channels, selectedChannel, setSelectedChannel, showSidebar }: LeftSidebarProps) => {
  return (
    <motion.div 
      initial={{ x: -100 }}
      animate={{ x: 0 }}
      className={`${showSidebar ? 'w-20' : 'w-0'} bg-white/10 backdrop-blur-lg border-r border-white/20 transition-all duration-300 flex flex-col items-center py-4 space-y-6`}
    >
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" className="p-2 rounded-xl bg-black/10 hover:bg-black/20">
              <Home className="h-6 w-6 text-white" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Home</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {channels.map((channel) => (
        <TooltipProvider key={channel.id}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                className={`p-2 rounded-xl hover:bg-black/20 ${
                  selectedChannel === channel.id ? 'bg-black/30' : 'bg-black/10'
                }`}
                onClick={() => setSelectedChannel(channel.id)}
              >
                <MessageSquare className="h-6 w-6 text-white" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{channel.name}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ))}

      <div className="mt-auto space-y-4">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" className="p-2 rounded-xl bg-black/10 hover:bg-black/20">
                <Users className="h-6 w-6 text-white" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Members</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" className="p-2 rounded-xl bg-black/10 hover:bg-black/20">
                <Package className="h-6 w-6 text-white" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Products</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" className="p-2 rounded-xl bg-black/10 hover:bg-black/20">
                <Settings className="h-6 w-6 text-white" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Settings</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </motion.div>
  );
};

export default LeftSidebar;
import React from "react";
import { 
  Sidebar, 
  SidebarContent,
  SidebarHeader,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter
} from "@/components/ui/sidebar";
import { MessageSquare, Users, Plus, Settings } from "lucide-react";
import { motion } from "framer-motion";
import type { Channel } from "../types";
import CreateChannelDialog from "./CreateChannelDialog";
import { useSession } from "@supabase/auth-helpers-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface LeftSidebarProps {
  channels: Channel[];
  selectedChannel: string | null;
  setSelectedChannel: (id: string) => void;
  showSidebar: boolean;
  onChannelCreated: () => void;
}

const LeftSidebar = ({ 
  channels, 
  selectedChannel, 
  setSelectedChannel, 
  showSidebar,
  onChannelCreated 
}: LeftSidebarProps) => {
  const session = useSession();

  return (
    <motion.div 
      initial={{ x: -100 }}
      animate={{ x: 0 }}
      className="h-full"
    >
      <Sidebar>
        <SidebarHeader className="p-4 border-b border-white/10">
          <h2 className="font-semibold text-white">Chat Channels</h2>
        </SidebarHeader>
        
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Channels</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {channels.map((channel) => (
                  <SidebarMenuItem key={channel.id}>
                    <SidebarMenuButton
                      isActive={selectedChannel === channel.id}
                      onClick={() => setSelectedChannel(channel.id)}
                      tooltip={channel.name}
                    >
                      <MessageSquare className="h-4 w-4" />
                      <span>{channel.name}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
                <SidebarMenuItem>
                  <CreateChannelDialog onChannelCreated={onChannelCreated} />
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup>
            <SidebarGroupLabel>Quick Actions</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton tooltip="Members">
                    <Users className="h-4 w-4" />
                    <span>Members</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton tooltip="Settings">
                    <Settings className="h-4 w-4" />
                    <span>Settings</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className="p-4 border-t border-white/10">
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={session?.user?.user_metadata?.avatar_url} />
              <AvatarFallback>
                {session?.user?.email?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="text-sm text-white font-medium">
                {session?.user?.email?.split("@")[0]}
              </p>
              <p className="text-xs text-[#949BA4]">Online</p>
            </div>
          </div>
        </SidebarFooter>
      </Sidebar>
    </motion.div>
  );
};

export default LeftSidebar;
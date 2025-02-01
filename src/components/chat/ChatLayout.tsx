import React, { useState, useEffect } from 'react';
import Grid from './Grid';
import Controls from './Controls';
import MessageArea from './components/MessageArea';
import MembersList from './components/MembersList';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { MessageSquare, Bell, Users, Hash, ChevronRight, ChevronLeft, Paperclip, Image, Package, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tooltip } from '@/components/ui/tooltip';

const ChatLayout = ({
  channels,
  pendingRequests,
  onlineUsers,
  selectedChannel,
  setSelectedChannel,
  session
}) => {
  const [isNavExpanded, setIsNavExpanded] = useState(false);
  const [activeSection, setActiveSection] = useState('chat'); // chat, requests, online

  const NavButton = ({ icon: Icon, label, badge, onClick }) => (
    <Tooltip content={label} side="right" disabled={isNavExpanded}>
      <Button
        variant="ghost"
        className={`w-full flex items-center justify-start gap-3 p-2 text-gray-400 hover:text-white hover:bg-gray-800
          ${activeSection === label.toLowerCase() ? 'bg-gray-800 text-white' : ''}`}
        onClick={onClick}
      >
        <Icon className="h-5 w-5" style={{ color: '#f7bd00' }} />
        {isNavExpanded && (
          <span className="flex-1 text-left">{label}</span>
        )}
        {badge && isNavExpanded && (
          <span className="bg-primary px-2 py-0.5 rounded-full text-xs">
            {badge}
          </span>
        )}
      </Button>
    </Tooltip>
  );

  return (
    <div className="h-screen flex bg-gray-900">
      {/* Collapsible Navigation */}
      <div className={`
        flex flex-col
        ${isNavExpanded ? 'w-64' : 'w-16'}
        transition-all duration-300
        bg-gray-900 border-r border-gray-800
      `}>
        <div className="p-3 flex justify-end border-b border-gray-800">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsNavExpanded(!isNavExpanded)}
          >
            {isNavExpanded ? 
              <ChevronLeft className="h-4 w-4 text-gray-400" /> :
              <ChevronRight className="h-4 w-4 text-gray-400" />
            }
          </Button>
        </div>

        <ScrollArea className="flex-1 px-2 py-4">
          <div className="space-y-2">
            <NavButton
              icon={MessageSquare}
              label="Chat"
              onClick={() => setActiveSection('chat')}
            />
            <NavButton
              icon={Bell}
              label="Requests"
              badge={pendingRequests.length}
              onClick={() => setActiveSection('requests')}
            />
            <NavButton
              icon={Users}
              label="Online"
              badge={onlineUsers.length}
              onClick={() => setActiveSection('online')}
            />

            {activeSection === 'chat' && isNavExpanded && (
              <div className="mt-4 pl-2 space-y-1">
                {channels.map((channel) => (
                  <Button
                    key={channel.id}
                    variant="ghost"
                    className={`w-full justify-start gap-2 text-sm ${
                      selectedChannel === channel.id 
                        ? 'bg-gray-800 text-white' 
                        : 'text-gray-400 hover:text-white hover:bg-gray-800'
                    }`}
                    onClick={() => setSelectedChannel(channel.id)}
                  >
                    <Hash className="h-4 w-4" />
                    <span className="truncate">{channel.name}</span>
                  </Button>
                ))}
              </div>
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        <div className="flex-1 overflow-hidden">
          {activeSection === 'chat' && (
            <MessageArea channelId={selectedChannel} userId={session?.user?.id} />
          )}
          {activeSection === 'requests' && (
            <div className="p-4">
              <h2 className="text-xl font-bold mb-4">Pending Requests</h2>
              {/* Requests content */}
            </div>
          )}
          {activeSection === 'online' && (
            <div className="p-4">
              <h2 className="text-xl font-bold mb-4">Online Users</h2>
              {/* Online users content */}
            </div>
          )}
        </div>

        {/* Enhanced Controls */}
        <div className="border-t border-gray-800 p-4 bg-gray-900">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon">
                <Paperclip className="h-5 w-5 text-gray-400" />
              </Button>
              <Button variant="ghost" size="icon">
                <Image className="h-5 w-5 text-gray-400" />
              </Button>
              <Button variant="ghost" size="icon">
                <Package className="h-5 w-5 text-gray-400" />
              </Button>
            </div>
            <input
              type="text"
              className="flex-1 bg-gray-800 text-white rounded-md px-4 py-2"
              placeholder="Type your message..."
            />
            <Button>
              <Send className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatLayout;

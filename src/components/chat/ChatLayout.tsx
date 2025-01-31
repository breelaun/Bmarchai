import React, { useEffect, useState } from 'react';
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Menu, Hash, Users, Package, Home, MessageSquare, Settings, ChevronLeft } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";

const ChatLayout = () => {
  // ... keeping existing state and functions from your original code ...

  return (
    <div className="flex h-screen bg-[#1a1b1e]">
      {/* Left Sidebar - Server Navigation */}
      <div className={`${showSidebar ? 'w-20' : 'w-0'} bg-[#141517] transition-all duration-300 flex flex-col items-center py-4 space-y-6`}>
        <Button variant="ghost" className="p-2 rounded-xl bg-[#2d2f34] hover:bg-[#3f4147]">
          <Home className="h-6 w-6 text-[#a6adb7]" />
        </Button>
        
        {channels.map((channel) => (
          <Button
            key={channel.id}
            variant="ghost"
            className={`p-2 rounded-xl hover:bg-[#3f4147] ${
              selectedChannel === channel.id ? 'bg-[#3f4147]' : 'bg-[#2d2f34]'
            }`}
            onClick={() => setSelectedChannel(channel.id)}
          >
            <MessageSquare className="h-6 w-6 text-[#a6adb7]" />
          </Button>
        ))}
        
        <div className="mt-auto">
          <Button variant="ghost" className="p-2 rounded-xl bg-[#2d2f34] hover:bg-[#3f4147]">
            <Settings className="h-6 w-6 text-[#a6adb7]" />
          </Button>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="h-16 bg-[#1e1f23] border-b border-[#2d2f34] flex items-center justify-between px-6">
          <div className="flex items-center space-x-4">
            {isMobile && (
              <Button variant="ghost" size="icon" onClick={() => setShowSidebar(!showSidebar)}>
                {showSidebar ? <ChevronLeft className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            )}
            <div className="flex items-center space-x-2">
              <Hash className="h-5 w-5 text-[#a6adb7]" />
              <h3 className="font-semibold text-white text-lg">
                {channels.find((c) => c.id === selectedChannel)?.name || "Select a channel"}
              </h3>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              className="rounded-xl hover:bg-[#3f4147] bg-[#2d2f34]"
              onClick={() => setShowProducts(!showProducts)}
            >
              <Package className="h-5 w-5 text-[#a6adb7]" />
            </Button>
            <Button
              variant="ghost"
              className="rounded-xl hover:bg-[#3f4147] bg-[#2d2f34]"
              onClick={() => setShowMembers(!showMembers)}
            >
              <Users className="h-5 w-5 text-[#a6adb7]" />
            </Button>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className="flex items-start space-x-3 hover:bg-[#2d2f34] p-3 rounded-lg transition-colors"
            >
              <img
                src={message.sender?.avatar_url || "/api/placeholder/32/32"}
                alt="avatar"
                className="w-8 h-8 rounded-full"
              />
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-medium text-white">
                    {message.sender?.username || "Anonymous"}
                  </span>
                  <span className="text-xs text-[#a6adb7]">
                    {new Date(message.created_at).toLocaleTimeString()}
                  </span>
                </div>
                <p className="text-[#e3e5e8] mt-1">{message.content}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Message Input */}
        <div className="p-4 bg-[#1e1f23] border-t border-[#2d2f34]">
          <form onSubmit={handleSendMessage} className="flex items-center space-x-3">
            <input
              type="text"
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 bg-[#2d2f34] text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#5865f2] placeholder-[#a6adb7]"
            />
            <Button 
              type="submit"
              className="bg-[#5865f2] hover:bg-[#4752c4] text-white rounded-xl px-6 py-3"
            >
              Send
            </Button>
          </form>
        </div>
      </div>

      {/* Right Sidebar - Members & Products */}
      <div 
        className={`${
          (showMembers || showProducts) ? 'w-64' : 'w-0'
        } bg-[#1e1f23] border-l border-[#2d2f34] transition-all duration-300 overflow-hidden`}
      >
        <div className="p-4">
          <h4 className="text-lg font-semibold text-white mb-4">
            {showMembers ? 'Members' : 'Products'}
          </h4>
          {showMembers && (
            <div className="space-y-3">
              {channelMembers.map((member) => (
                <div key={member.id} className="flex items-center space-x-3">
                  <img
                    src={member.profiles?.avatar_url || "/api/placeholder/32/32"}
                    alt="avatar"
                    className="w-8 h-8 rounded-full"
                  />
                  <span className="text-[#e3e5e8]">
                    {member.profiles?.username || "Anonymous"}
                  </span>
                </div>
              ))}
            </div>
          )}
          {showProducts && (
            <div className="space-y-3">
              {channelProducts.map((product) => (
                <div key={product.id} className="p-3 bg-[#2d2f34] rounded-lg">
                  <img
                    src={product.products?.image_url || "/api/placeholder/200/100"}
                    alt={product.products?.name}
                    className="w-full h-24 object-cover rounded-md mb-2"
                  />
                  <h5 className="text-white font-medium">
                    {product.products?.name}
                  </h5>
                  <p className="text-[#a6adb7] text-sm">
                    ${product.products?.price}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatLayout;

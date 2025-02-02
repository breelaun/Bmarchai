import React, { useState, useEffect } from 'react';
import { useSession } from "@supabase/auth-helpers-react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/components/ui/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { MessageSquare, Users, Package, Settings, Home, Paperclip, Image } from 'lucide-react';
import { Button } from "@/components/ui/button";

import Grid from './Grid';
import Controls from './Controls';
import MessageArea from './components/MessageArea';
import SessionForm from './components/SessionForm';
import type { Session, Channel, Message } from '@/types';

const ChatLayout = () => {
  // ... (keep all the existing state and effects)

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`h-[calc(100vh-4rem)] relative ${gradients[activeGradient]}`}
    >
      {/* Glassmorphic Overlay */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-xl" />

      <div className="relative z-10 flex h-full">
        {/* Primary Vertical Navigation */}
        <motion.div 
          initial={{ x: -100 }}
          animate={{ x: 0 }}
          className="w-16 bg-white/10 backdrop-blur-lg flex flex-col items-center py-6 space-y-6"
        >
          <button 
            className="border border-white/20 px-2 py-1 rounded-2xl rotate-180 [writing-mode:vertical-lr] text-white hover:bg-white/10 transition-colors"
            onClick={() => setShowSessionForm(true)}
          >
            + Session
          </button>
          
          <Button variant="ghost" className="p-2 rounded-xl bg-black/10 hover:bg-black/20">
            <Home className="h-6 w-6 text-white" />
          </Button>

          <span className="rotate-180 [writing-mode:vertical-lr] text-white/60">Chat</span>
          
          {channels.map((channel) => (
            <Button
              key={channel.id}
              variant="ghost"
              className={`p-2 rounded-xl hover:bg-black/20 ${
                selectedChannel === channel.id ? 'bg-black/30' : 'bg-black/10'
              }`}
              onClick={() => setSelectedChannel(channel.id)}
            >
              <MessageSquare className="h-6 w-6 text-white" />
            </Button>
          ))}
          
          <span className="rotate-180 [writing-mode:vertical-lr] text-white/60">Contacts</span>
          <span className="rotate-180 [writing-mode:vertical-lr] text-white/60">Online</span>
          
          <div className="mt-auto">
            <Button variant="ghost" className="p-2 rounded-xl bg-black/10 hover:bg-black/20">
              <Settings className="h-6 w-6 text-white" />
            </Button>
          </div>
        </motion.div>

        <Grid>
          <div className="col-span-11 flex flex-col">
            {/* Session Form Modal */}
            <AnimatePresence>
              {showSessionForm && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="absolute inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
                >
                  <SessionForm onClose={() => setShowSessionForm(false)} />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Message Area */}
            <div className="flex-1 overflow-hidden">
              <MessageArea 
                channelId={selectedChannel || ''}
                userId={session?.user?.id || ''}
                messages={messages}
              />
            </div>
            
            {/* Enhanced Controls */}
            <div className="p-4 bg-white/10 backdrop-blur-lg">
              <div className="flex items-center space-x-4">
                <Button variant="ghost" className="p-2 rounded-xl bg-black/10 hover:bg-black/20">
                  <Paperclip className="h-5 w-5 text-white" />
                </Button>
                <Button variant="ghost" className="p-2 rounded-xl bg-black/10 hover:bg-black/20">
                  <Image className="h-5 w-5 text-white" />
                </Button>
                <Button variant="ghost" className="p-2 rounded-xl bg-black/10 hover:bg-black/20">
                  <Package className="h-5 w-5 text-white" />
                </Button>
                <div className="flex-1">
                  <Controls />
                </div>
              </div>
            </div>
          </div>
        </Grid>
      </div>
    </motion.div>
  );
};

export default ChatLayout;

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Message } from "../types";

interface MessageAreaProps {
  messages: Message[];
}

const MessageArea = ({ messages }: MessageAreaProps) => {
  return (
    <div className="flex-1 overflow-y-auto">
      <AnimatePresence>
        {messages.map((message) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="bg-black/20 hover:bg-black/30 transition-all p-4 flex items-start space-x-3"
          >
            <img
              src={message.sender?.avatar_url || "/placeholder.svg"}
              alt="avatar"
              className="w-8 h-8 rounded-full"
            />
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-medium text-white">
                  {message.sender?.username || "Anonymous"}
                </span>
                <span className="text-xs text-white/60">
                  {new Date(message.created_at).toLocaleTimeString()}
                </span>
              </div>
              <p className="text-white/80 mt-1">{message.content}</p>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default MessageArea;
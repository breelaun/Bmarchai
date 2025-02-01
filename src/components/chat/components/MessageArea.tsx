import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Edit2, Trash2, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { Message } from "../types";

interface MessageAreaProps {
  messages: Message[];
  currentUserId?: string;
}

const MessageArea = ({ messages, currentUserId }: MessageAreaProps) => {
  const { toast } = useToast();
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");

  const handleEdit = async (messageId: string, newContent: string) => {
    try {
      const { error } = await supabase
        .from("chat_messages")
        .update({ content: newContent, is_edited: true })
        .eq("id", messageId);

      if (error) throw error;
      setEditingMessageId(null);
      toast({
        title: "Message updated",
        description: "Your message has been successfully updated.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to update message",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (messageId: string) => {
    try {
      const { error } = await supabase
        .from("chat_messages")
        .delete()
        .eq("id", messageId);

      if (error) throw error;
      toast({
        title: "Message deleted",
        description: "Your message has been successfully deleted.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to delete message",
        variant: "destructive",
      });
    }
  };

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
            className="bg-black/20 hover:bg-black/30 transition-all p-4 flex items-start space-x-3 relative group"
          >
            <img
              src={message.sender?.avatar_url || "/placeholder.svg"}
              alt="avatar"
              className="w-8 h-8 rounded-full"
            />
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <span className="font-medium text-white">
                  {message.sender?.username || "Anonymous"}
                </span>
                <span className="text-xs text-white/60">
                  {new Date(message.created_at).toLocaleTimeString()}
                  {message.is_edited && " (edited)"}
                </span>
              </div>
              {editingMessageId === message.id ? (
                <div className="mt-2 flex items-center gap-2">
                  <input
                    type="text"
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="flex-1 bg-black/30 text-white rounded px-2 py-1"
                  />
                  <Button
                    size="sm"
                    onClick={() => handleEdit(message.id, editContent)}
                  >
                    Save
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setEditingMessageId(null)}
                  >
                    Cancel
                  </Button>
                </div>
              ) : (
                <p className="text-white/80 mt-1">{message.content}</p>
              )}
            </div>
            {currentUserId === message.sender_id && !editingMessageId && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <MoreVertical className="h-4 w-4 text-white/60" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem
                    onClick={() => {
                      setEditingMessageId(message.id);
                      setEditContent(message.content);
                    }}
                  >
                    <Edit2 className="h-4 w-4 mr-2" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleDelete(message.id)}>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default MessageArea;
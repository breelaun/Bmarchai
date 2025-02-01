import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Plus } from "lucide-react";
import { SidebarMenuButton } from "@/components/ui/sidebar";

const CreateChannelDialog = ({ onChannelCreated }: { onChannelCreated: () => void }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { data: channelData, error: channelError } = await supabase
        .from("chat_channels")
        .insert({
          name,
          description,
          is_public: isPublic,
          channel_type: "chat",
        })
        .select()
        .single();

      if (channelError) throw channelError;

      toast({
        title: "Channel created",
        description: "Your new channel has been created successfully.",
      });

      setIsOpen(false);
      setName("");
      setDescription("");
      setIsPublic(false);
      onChannelCreated();
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to create channel",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <SidebarMenuButton tooltip="Create Channel">
          <Plus className="h-4 w-4" />
          <span>Create Channel</span>
        </SidebarMenuButton>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-[#2B2D31] text-white border-[#1E1F22]">
        <DialogHeader>
          <DialogTitle>Create New Channel</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Channel Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter channel name"
              className="bg-[#383A40] border-[#1E1F22]"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter channel description"
              className="bg-[#383A40] border-[#1E1F22]"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="public"
              checked={isPublic}
              onCheckedChange={setIsPublic}
            />
            <Label htmlFor="public">Make channel public</Label>
          </div>
          <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700">
            Create Channel
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateChannelDialog;
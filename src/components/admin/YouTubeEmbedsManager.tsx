import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Trash2, Edit2 } from "lucide-react";

interface YouTubeEmbed {
  id: string;
  title: string;
  category: string;
  embed_type: 'channel' | 'playlist' | 'video';
  embed_id: string;
  active: boolean;
}

const YouTubeEmbedsManager = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [embedType, setEmbedType] = useState<'channel' | 'playlist' | 'video'>('video');
  const [embedId, setEmbedId] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);

  const { data: embeds = [] } = useQuery({
    queryKey: ["youtube-embeds"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("youtube_embeds")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data as YouTubeEmbed[];
    },
  });

  const addEmbed = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from("youtube_embeds")
        .insert([{
          title,
          category,
          embed_type: embedType,
          embed_id: embedId,
        }]);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["youtube-embeds"] });
      resetForm();
      toast({
        title: "Success",
        description: "YouTube embed added successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateEmbed = useMutation({
    mutationFn: async () => {
      if (!editingId) return;
      
      const { error } = await supabase
        .from("youtube_embeds")
        .update({
          title,
          category,
          embed_type: embedType,
          embed_id: embedId,
        })
        .eq('id', editingId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["youtube-embeds"] });
      resetForm();
      toast({
        title: "Success",
        description: "YouTube embed updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const toggleActive = useMutation({
    mutationFn: async ({ id, active }: { id: string; active: boolean }) => {
      const { error } = await supabase
        .from("youtube_embeds")
        .update({ active })
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["youtube-embeds"] });
      toast({
        title: "Success",
        description: "Status updated successfully",
      });
    },
  });

  const deleteEmbed = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("youtube_embeds")
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["youtube-embeds"] });
      toast({
        title: "Success",
        description: "YouTube embed deleted successfully",
      });
    },
  });

  const resetForm = () => {
    setTitle("");
    setCategory("");
    setEmbedType('video');
    setEmbedId("");
    setEditingId(null);
  };

  const handleEdit = (embed: YouTubeEmbed) => {
    setTitle(embed.title);
    setCategory(embed.category);
    setEmbedType(embed.embed_type);
    setEmbedId(embed.embed_id);
    setEditingId(embed.id);
  };

  const handleSubmit = () => {
    if (editingId) {
      updateEmbed.mutate();
    } else {
      addEmbed.mutate();
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">YouTube Embeds Manager</h2>
      
      <div className="space-y-4 p-4 border rounded-lg">
        <div className="grid gap-4">
          <Input
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Input
            placeholder="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
          <Select
            value={embedType}
            onValueChange={(value: 'channel' | 'playlist' | 'video') => setEmbedType(value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select embed type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="video">Video</SelectItem>
              <SelectItem value="playlist">Playlist</SelectItem>
              <SelectItem value="channel">Channel</SelectItem>
            </SelectContent>
          </Select>
          <Input
            placeholder="YouTube ID (video/playlist/channel ID)"
            value={embedId}
            onChange={(e) => setEmbedId(e.target.value)}
          />
          <div className="flex gap-2">
            <Button onClick={handleSubmit}>
              {editingId ? 'Update Embed' : 'Add Embed'}
            </Button>
            {editingId && (
              <Button variant="outline" onClick={resetForm}>
                Cancel
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {embeds.map((embed) => (
          <div
            key={embed.id}
            className="flex items-center justify-between p-4 border rounded-lg"
          >
            <div>
              <h4 className="font-medium">{embed.title}</h4>
              <p className="text-sm text-muted-foreground">
                Category: {embed.category}
              </p>
              <p className="text-sm text-muted-foreground">
                Type: {embed.embed_type}
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => toggleActive.mutate({ 
                  id: embed.id, 
                  active: !embed.active 
                })}
              >
                {embed.active ? 'Disable' : 'Enable'}
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleEdit(embed)}
              >
                <Edit2 className="h-4 w-4" />
              </Button>
              <Button
                variant="destructive"
                size="icon"
                onClick={() => deleteEmbed.mutate(embed.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default YouTubeEmbedsManager;
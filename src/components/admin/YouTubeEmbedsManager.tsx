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
import { YouTubeEmbedsList } from "./YouTubeEmbedsList";
import type { ArtsCategory, YouTubeEmbed } from "./types";

export const YouTubeEmbedsManager = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [title, setTitle] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [embedType, setEmbedType] = useState<'channel' | 'playlist' | 'video'>('video');
  const [embedId, setEmbedId] = useState("");
  const [endDate, setEndDate] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);

  // Fetch categories
  const { data: categories = [] } = useQuery({
    queryKey: ["arts-categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("arts_categories")
        .select("*")
        .order("name");
      
      if (error) throw error;
      return data as ArtsCategory[];
    },
  });

  // Fetch YouTube embeds
  const { data: embeds = [] } = useQuery({
    queryKey: ["youtube-embeds"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("youtube_embeds")
        .select("id, title, category_id, embed_type, embed_id, active, created_at")
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
          category_id: categoryId,
          embed_type: embedType,
          embed_id: embedId,
          end_date: endDate || null,
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
          category_id: categoryId,
          embed_type: embedType,
          embed_id: embedId,
          end_date: endDate || null,
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

  const resetForm = () => {
    setTitle("");
    setCategoryId("");
    setEmbedType('video');
    setEmbedId("");
    setEndDate("");
    setEditingId(null);
  };

  const handleEdit = (embed: YouTubeEmbed) => {
    setTitle(embed.title);
    setCategoryId(embed.category_id);
    setEmbedType(embed.embed_type);
    setEmbedId(embed.embed_id);
    setEndDate(embed.end_date || "");
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
          <Select
            value={categoryId}
            onValueChange={setCategoryId}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
          <Input
            type="datetime-local"
            placeholder="End date (optional)"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
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

      <YouTubeEmbedsList 
        embeds={embeds}
        onEdit={handleEdit}
      />
    </div>
  );
};

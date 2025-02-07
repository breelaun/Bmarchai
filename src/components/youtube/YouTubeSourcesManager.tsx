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
import type { ArtsCategory, YouTubeSource } from "./types";

export const YouTubeSourcesManager = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [sourceType, setSourceType] = useState<'channel' | 'playlist' | 'video'>('channel');
  const [sourceValue, setSourceValue] = useState("");
  const [categoryId, setCategoryId] = useState("");
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

  // Fetch YouTube sources
  const { data: sources = [] } = useQuery({
    queryKey: ["youtube-sources"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("youtube_sources")
        .select("*, arts_categories(name)")
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data as YouTubeSource[];
    },
  });

  const addSource = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from("youtube_sources")
        .insert([{
          type: sourceType,
          value: sourceValue,
          category_id: categoryId,
          active: true
        }]);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["youtube-sources"] });
      resetForm();
      toast({
        title: "Success",
        description: "YouTube source added successfully",
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

  const updateSource = useMutation({
    mutationFn: async () => {
      if (!editingId) return;
      
      const { error } = await supabase
        .from("youtube_sources")
        .update({
          type: sourceType,
          value: sourceValue,
          category_id: categoryId,
        })
        .eq('id', editingId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["youtube-sources"] });
      resetForm();
      toast({
        title: "Success",
        description: "YouTube source updated successfully",
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

  const deleteSource = useMutation({
    mutationFn: async (sourceId: string) => {
      const { error } = await supabase
        .from("youtube_sources")
        .delete()
        .eq("id", sourceId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["youtube-sources"] });
      toast({
        title: "Success",
        description: "YouTube source deleted successfully",
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
    setSourceType('channel');
    setSourceValue("");
    setCategoryId("");
    setEditingId(null);
  };

  const handleEdit = (source: YouTubeSource) => {
    setSourceType(source.type);
    setSourceValue(source.value);
    setCategoryId(source.category_id);
    setEditingId(source.id);
  };

  const handleSubmit = () => {
    if (editingId) {
      updateSource.mutate();
    } else {
      addSource.mutate();
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">YouTube Sources Manager</h2>
      
      <div className="space-y-4 p-4 border rounded-lg">
        <div className="grid gap-4">
          <Select
            value={sourceType}
            onValueChange={(value: 'channel' | 'playlist' | 'video') => setSourceType(value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select source type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="video">Video</SelectItem>
              <SelectItem value="playlist">Playlist</SelectItem>
              <SelectItem value="channel">Channel</SelectItem>
            </SelectContent>
          </Select>
          <Input
            placeholder="YouTube ID (video/playlist/channel ID)"
            value={sourceValue}
            onChange={(e) => setSourceValue(e.target.value)}
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
          <div className="flex gap-2">
            <Button onClick={handleSubmit}>
              {editingId ? 'Update Source' : 'Add Source'}
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
        <h3 className="text-xl font-semibold">Existing Sources</h3>
        {sources.map((source) => (
          <div 
            key={source.id} 
            className="flex items-center justify-between p-4 border rounded-lg"
          >
            <div>
              <p className="font-medium">{source.type}: {source.value}</p>
              <p className="text-sm text-muted-foreground">
                Category: {source.arts_categories?.name}
              </p>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="icon" 
                onClick={() => handleEdit(source)}
              >
                <Edit2 className="h-4 w-4" />
              </Button>
              <Button 
                variant="destructive" 
                size="icon" 
                onClick={() => deleteSource.mutate(source.id)}
              >
                <Trash className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

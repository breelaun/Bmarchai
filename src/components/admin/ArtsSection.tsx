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
import { Trash } from "lucide-react";

const ArtsSection = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [newCategory, setNewCategory] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [embedTitle, setEmbedTitle] = useState("");
  const [embedUrl, setEmbedUrl] = useState("");

  // Fetch categories
  const { data: categories = [] } = useQuery({
    queryKey: ["arts-categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("arts_categories")
        .select("*")
        .order("name");
      
      if (error) throw error;
      return data;
    },
  });

  // Fetch embeds
  const { data: embeds = [] } = useQuery({
    queryKey: ["arts-embeds"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("arts_embeds")
        .select("*, arts_categories(name)")
        .order("created_at");
      
      if (error) throw error;
      return data;
    },
  });

  // Add category mutation
  const addCategory = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from("arts_categories")
        .insert([{ name: newCategory }]);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["arts-categories"] });
      setNewCategory("");
      toast({
        title: "Success",
        description: "Category added successfully",
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

  // Add embed mutation
  const addEmbed = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from("arts_embeds")
        .insert([{
          category_id: selectedCategory,
          title: embedTitle,
          embed_url: embedUrl,
        }]);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["arts-embeds"] });
      setEmbedTitle("");
      setEmbedUrl("");
      toast({
        title: "Success",
        description: "Embed added successfully",
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

  // Delete embed mutation
  const deleteEmbed = useMutation({
    mutationFn: async (embedId: string) => {
      const { error } = await supabase
        .from("arts_embeds")
        .delete()
        .eq("id", embedId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["arts-embeds"] });
      toast({
        title: "Success",
        description: "Embed deleted successfully",
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

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold mb-4">Arts Management</h2>
        
        {/* Add Category */}
        <div className="flex gap-4 mb-6">
          <Input
            placeholder="New category name"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
          />
          <Button onClick={() => addCategory.mutate()}>Add Category</Button>
        </div>

        {/* Add Embed */}
        <div className="space-y-4 p-4 border rounded-lg">
          <h3 className="text-lg font-medium">Add New Embed</h3>
          <div className="grid gap-4">
            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
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
            <Input
              placeholder="Embed title"
              value={embedTitle}
              onChange={(e) => setEmbedTitle(e.target.value)}
            />
            <Input
              placeholder="Embed URL"
              value={embedUrl}
              onChange={(e) => setEmbedUrl(e.target.value)}
            />
            <Button onClick={() => addEmbed.mutate()}>Add Embed</Button>
          </div>
        </div>

        {/* Embeds List */}
        <div className="mt-8">
          <h3 className="text-lg font-medium mb-4">Current Embeds</h3>
          <div className="space-y-4">
            {embeds.map((embed) => (
              <div
                key={embed.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div>
                  <h4 className="font-medium">{embed.title}</h4>
                  <p className="text-sm text-muted-foreground">
                    Category: {embed.arts_categories?.name}
                  </p>
                </div>
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => deleteEmbed.mutate(embed.id)}
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArtsSection;
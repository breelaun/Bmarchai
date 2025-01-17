import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
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
import type { ArtsCategory, ArtsEmbed } from "./types";

interface EmbedFormProps {
  categories: ArtsCategory[];
  embedToEdit?: ArtsEmbed | null;
  onCancelEdit?: () => void;
}

export const EmbedForm = ({ categories, embedToEdit, onCancelEdit }: EmbedFormProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedCategory, setSelectedCategory] = useState("");
  const [embedTitle, setEmbedTitle] = useState("");
  const [embedUrl, setEmbedUrl] = useState("");
  const [endDate, setEndDate] = useState("");

  // Update form when embedToEdit changes
  useEffect(() => {
    if (embedToEdit) {
      setSelectedCategory(embedToEdit.category_id);
      setEmbedTitle(embedToEdit.title);
      setEmbedUrl(embedToEdit.embed_url);
      setEndDate(embedToEdit.end_date || "");
    }
  }, [embedToEdit]);

  const resetForm = () => {
    setSelectedCategory("");
    setEmbedTitle("");
    setEmbedUrl("");
    setEndDate("");
  };

  const addEmbed = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from("arts_embeds")
        .insert([{
          category_id: selectedCategory,
          title: embedTitle,
          embed_url: embedUrl,
          end_date: endDate || null,
        }]);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["arts-embeds"] });
      resetForm();
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

  const updateEmbed = useMutation({
    mutationFn: async () => {
      if (!embedToEdit) return;
      
      const { error } = await supabase
        .from("arts_embeds")
        .update({
          category_id: selectedCategory,
          title: embedTitle,
          embed_url: embedUrl,
          end_date: endDate || null,
        })
        .eq('id', embedToEdit.id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["arts-embeds"] });
      resetForm();
      onCancelEdit?.();
      toast({
        title: "Success",
        description: "Embed updated successfully",
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

  const handleSubmit = () => {
    if (embedToEdit) {
      updateEmbed.mutate();
    } else {
      addEmbed.mutate();
    }
  };

  const handleCancel = () => {
    resetForm();
    onCancelEdit?.();
  };

  return (
    <div className="space-y-4 p-4 border rounded-lg">
      <h3 className="text-lg font-medium">
        {embedToEdit ? 'Edit Embed' : 'Add New Embed'}
      </h3>
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
        <Input
          type="datetime-local"
          placeholder="End date (optional)"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
        <div className="flex gap-2">
          <Button onClick={handleSubmit}>
            {embedToEdit ? 'Update Embed' : 'Add Embed'}
          </Button>
          {embedToEdit && (
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

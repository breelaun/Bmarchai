import { useState } from "react";
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
  initialValues?: ArtsEmbed;
  mode: "create" | "edit";
  onSave: (embedData: ArtsEmbed) => void;
  onCancel?: () => void;
}

export const EmbedForm = ({ categories, initialValues, mode, onSave, onCancel }: EmbedFormProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedCategory, setSelectedCategory] = useState(initialValues?.category_id || "");
  const [embedTitle, setEmbedTitle] = useState(initialValues?.title || "");
  const [embedUrl, setEmbedUrl] = useState(initialValues?.embed_url || "");
  const [endDate, setEndDate] = useState(initialValues?.end_date || "");

  const mutation = useMutation({
    mutationFn: async () => {
      if (mode === "edit" && initialValues) {
        return supabase
          .from("arts_embeds")
          .update({
            category_id: selectedCategory,
            title: embedTitle,
            embed_url: embedUrl,
            end_date: endDate || null,
          })
          .eq("id", initialValues.id);
      } else {
        return supabase
          .from("arts_embeds")
          .insert([
            {
              category_id: selectedCategory,
              title: embedTitle,
              embed_url: embedUrl,
              end_date: endDate || null,
            }
          ]);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["arts-embeds"] });
      setEmbedTitle("");
      setEmbedUrl("");
      setEndDate("");
      setSelectedCategory("");
      onSave({
        ...initialValues,
        category_id: selectedCategory,
        title: embedTitle,
        embed_url: embedUrl,
        end_date: endDate || null,
      });
      toast({
        title: "Success",
        description: mode === "edit" ? "Embed updated successfully" : "Embed added successfully",
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
    mutation.mutate();
  };

  return (
    <div className="space-y-4 p-4 border rounded-lg">
      <h3 className="text-lg font-medium">{mode === "edit" ? "Edit Embed" : "Add New Embed"}</h3>
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
          <Button onClick={handleSubmit}>{mode === "edit" ? "Save Changes" : "Add Embed"}</Button>
          {mode === "edit" && onCancel && <Button variant="outline" onClick={onCancel}>Cancel</Button>}
        </div>
      </div>
    </div>
  );
};

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold mb-4">Arts Management</h2>
        
        <CategoryManager categories={categories} />
        <EmbedForm categories={categories} mode="create" />

        <div className="mt-8">
          <h3 className="text-lg font-medium mb-4">Current Embeds</h3>
          <EmbedsList embeds={embeds} onEdit={handleEditEmbed} />
        </div>
      </div>

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Embed</DialogTitle>
          </DialogHeader>
          {selectedEmbed && (
            <EmbedForm 
              categories={categories} 
              initialValues={selectedEmbed} 
              mode="edit" 
              onSave={handleSaveEdit} 
              onCancel={handleCloseModal}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ArtsSection;

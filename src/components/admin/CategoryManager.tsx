import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import type { ArtsCategory } from "./types";

interface CategoryManagerProps {
  categories: ArtsCategory[];
}

export const CategoryManager = ({ categories }: CategoryManagerProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [newCategory, setNewCategory] = useState("");

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

  return (
    <div className="flex gap-4 mb-6">
      <Input
        placeholder="New category name"
        value={newCategory}
        onChange={(e) => setNewCategory(e.target.value)}
      />
      <Button onClick={() => addCategory.mutate()}>Add Category</Button>
    </div>
  );
};
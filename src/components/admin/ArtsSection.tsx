import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { CategoryManager } from "./CategoryManager";
import { EmbedForm } from "./EmbedForm";
import { EmbedsList } from "./EmbedsList";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"; // Assuming you use a library like Radix UI or shadcn/ui for dialogs
import type { ArtsEmbed } from "./types";

const ArtsSection = () => {
  const [selectedEmbed, setSelectedEmbed] = useState<ArtsEmbed | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

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
  const { data: embeds = [], refetch: refetchEmbeds } = useQuery({
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

  const handleEditEmbed = (embed: ArtsEmbed) => {
    console.log('Editing:', embed);
    setSelectedEmbed(embed);
    setIsEditModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsEditModalOpen(false);
    setSelectedEmbed(null); // Reset selected embed when closing the modal
  };

  const handleSaveEdit = async (updatedEmbed: ArtsEmbed) => {
    // Here you would handle updating the embed in Supabase
    const { data, error } = await supabase
      .from("arts_embeds")
      .update(updatedEmbed)
      .eq("id", updatedEmbed.id);
    
    if (error) {
      console.error("Error updating embed:", error);
      // Handle error, perhaps show a toast or alert to the user
    } else {
      console.log("Embed updated successfully:", data);
      handleCloseModal();
      // Refetch to get the latest data from the server
      refetchEmbeds();
    }
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


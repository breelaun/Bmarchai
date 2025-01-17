// ArtsSection.tsx
import { useState } from 'react';
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { CategoryManager } from "./CategoryManager";
import { EmbedForm } from "./EmbedForm";
import { EmbedsList } from "./EmbedsList";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useArtsContext } from './ArtsContext'; // Import the context hook
import type { ArtsEmbed } from "./types";

const ArtsSection = () => {
  const { embeds, selectedEmbed, setSelectedEmbed, refetchEmbeds } = useArtsContext();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleEditEmbed = (embed: ArtsEmbed) => {
    console.log('Editing:', embed);
    setSelectedEmbed(embed);
    setIsEditModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsEditModalOpen(false);
    setSelectedEmbed(null);
  };

  const handleSaveEdit = async (updatedEmbed: ArtsEmbed) => {
    // Update logic here
    handleCloseModal();
    refetchEmbeds();
  };

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-semibold mb-4">Arts Management</h2>
      
      <CategoryManager />
      <EmbedForm mode="create" />

      <div className="mt-8">
        <h3 className="text-lg font-medium mb-4">Current Embeds</h3>
        <EmbedsList onEdit={handleEditEmbed} />
      </div>

      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Embed</DialogTitle>
          </DialogHeader>
          {selectedEmbed && (
            <EmbedForm 
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

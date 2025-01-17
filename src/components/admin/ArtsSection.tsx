import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { CategoryManager } from "./CategoryManager";
import { EmbedForm } from "./EmbedForm";
import { EmbedsList } from "./EmbedsList";
import type { ArtsEmbed } from "./types";

const ArtsSection = () => {
  const [selectedEmbed, setSelectedEmbed] = useState<ArtsEmbed | null>(null);

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

  const handleEditEmbed = (embed: ArtsEmbed) => {
    setSelectedEmbed(embed);
  };

  const handleCancelEdit = () => {
    setSelectedEmbed(null);
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold mb-4">Arts Management</h2>
        
        <CategoryManager categories={categories} />
        <EmbedForm 
          categories={categories} 
          embedToEdit={selectedEmbed}
          onCancelEdit={handleCancelEdit}
        />

        <div className="mt-8">
          <h3 className="text-lg font-medium mb-4">Current Embeds</h3>
          <EmbedsList embeds={embeds} onEdit={handleEditEmbed} />
        </div>
      </div>
    </div>
  );
};

export default ArtsSection;

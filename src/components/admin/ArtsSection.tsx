import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { CategoryManager } from "./CategoryManager";
import { EmbedForm } from "./EmbedForm";
import { EmbedsList } from "./EmbedsList";
import YouTubeEmbedsManager from "./YouTubeEmbedsManager";
import type { ArtsCategory, ArtsEmbed } from "./types";

const ArtsSection = () => {
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

  const { data: embeds = [] } = useQuery({
    queryKey: ["arts-embeds"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("arts_embeds")
        .select("*, arts_categories(name)")
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data as ArtsEmbed[];
    },
  });

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-4">Arts Categories</h2>
        <CategoryManager categories={categories} />
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">Arts Embeds</h2>
        <EmbedForm categories={categories} />
        <div className="mt-6">
          <EmbedsList embeds={embeds} onEdit={() => {}} />
        </div>
      </div>

      <div>
        <YouTubeEmbedsManager />
      </div>
    </div>
  );
};

export default ArtsSection;
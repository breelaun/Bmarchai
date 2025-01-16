import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ArtsPage = () => {
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

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Arts</h1>
      
      <Tabs defaultValue={categories[0]?.id} className="w-full">
        <TabsList className="w-full justify-start overflow-x-auto">
          {categories.map((category) => (
            <TabsTrigger key={category.id} value={category.id}>
              {category.name}
            </TabsTrigger>
          ))}
        </TabsList>

        {categories.map((category) => (
          <TabsContent key={category.id} value={category.id}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {embeds
                .filter((embed) => embed.category_id === category.id)
                .map((embed) => (
                  <div key={embed.id} className="border rounded-lg p-4">
                    <h3 className="font-medium mb-2">{embed.title}</h3>
                    <div className="aspect-video">
                      <iframe
                        src={embed.embed_url}
                        className="w-full h-full"
                        allowFullScreen
                        title={embed.title}
                      />
                    </div>
                  </div>
                ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default ArtsPage;
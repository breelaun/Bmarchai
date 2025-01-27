import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const AdminPage = () => {
  const { data: embeds, isLoading } = useQuery({
    queryKey: ['admin-embeds'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('arts_embeds')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <div className="grid gap-4">
        {embeds?.map((embed) => (
          <Card key={embed.id} className="p-4">
            <h2 className="font-semibold">{embed.title}</h2>
            <p className="text-sm text-muted-foreground">{embed.embed_url}</p>
            <div className="mt-2">
              <Button variant="outline" size="sm">
                Edit
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdminPage;
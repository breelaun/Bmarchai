import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Tool } from "lucide-react";

export const EquipmentList = () => {
  const { data: equipment, isLoading } = useQuery({
    queryKey: ["gym-equipment"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("gym_equipment")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Equipment</h2>
        <Button>
          <Tool className="h-4 w-4 mr-2" />
          Add Equipment
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {equipment?.map((item) => (
          <Card key={item.id}>
            <CardHeader>
              <CardTitle>{item.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Status: {item.status}
              </p>
              <p className="text-sm text-muted-foreground">
                Last Maintenance: {item.last_maintenance_date ? new Date(item.last_maintenance_date).toLocaleDateString() : 'N/A'}
              </p>
              <p className="text-sm text-muted-foreground">
                Next Maintenance: {item.next_maintenance_date ? new Date(item.next_maintenance_date).toLocaleDateString() : 'N/A'}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
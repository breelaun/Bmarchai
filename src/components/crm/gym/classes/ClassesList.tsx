import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarPlus, Loader2 } from "lucide-react";

export const ClassesList = () => {
  const { data: classes, isLoading } = useQuery({
    queryKey: ["gym-classes"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("gym_classes")
        .select(`
          *,
          profiles:instructor_id (
            full_name
          )
        `)
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
        <h2 className="text-2xl font-semibold">Classes</h2>
        <Button>
          <CalendarPlus className="h-4 w-4 mr-2" />
          Add Class
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {classes?.map((gymClass) => (
          <Card key={gymClass.id}>
            <CardHeader>
              <CardTitle>{gymClass.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Instructor: {gymClass.profiles?.full_name}
              </p>
              <p className="text-sm text-muted-foreground">
                Type: {gymClass.class_type}
              </p>
              <p className="text-sm text-muted-foreground">
                Capacity: {gymClass.capacity}
              </p>
              <p className="text-sm text-muted-foreground">
                Room: {gymClass.room}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
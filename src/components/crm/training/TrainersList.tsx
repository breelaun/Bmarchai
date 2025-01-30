import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export const TrainersList = () => {
  const { data: trainers, isLoading } = useQuery({
    queryKey: ["gym-trainers"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("gym_trainers")
        .select(`
          *,
          profiles:user_id (
            full_name,
            avatar_url
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
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {trainers?.map((trainer) => (
        <Card key={trainer.id}>
          <CardHeader>
            <CardTitle>{trainer.profiles?.full_name}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Status: {trainer.status}
            </p>
            <p className="text-sm text-muted-foreground">
              Rate: ${trainer.hourly_rate}/hour
            </p>
            {trainer.specializations && (
              <div>
                <p className="text-sm font-medium">Specializations:</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {trainer.specializations.map((spec: string) => (
                    <span
                      key={spec}
                      className="text-xs bg-secondary px-2 py-1 rounded-full"
                    >
                      {spec}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
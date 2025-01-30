import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, User, DollarSign, Award, Calendar } from "lucide-react";

export const TrainersList = () => {
  const { data: trainers, isLoading } = useQuery({
    queryKey: ["gym-trainers"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("gym_trainers")
        .select(`
          *,
          user:user_id (
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
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Trainers</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {trainers?.map((trainer) => (
          <Card key={trainer.id} className="hover:border-primary/50 transition-colors">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                {trainer.user?.full_name}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {trainer.specializations && trainer.specializations.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {trainer.specializations.map((spec: string, index: number) => (
                    <Badge key={index} variant="secondary">
                      {spec}
                    </Badge>
                  ))}
                </div>
              )}
              
              {trainer.hourly_rate && (
                <div className="flex items-center gap-2 text-sm">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <span>${trainer.hourly_rate}/hour</span>
                </div>
              )}

              {trainer.certification_details && (
                <div className="flex items-center gap-2 text-sm">
                  <Award className="h-4 w-4 text-muted-foreground" />
                  <span>
                    {Object.entries(trainer.certification_details)
                      .map(([key, value]) => `${key}: ${value}`)
                      .join(", ")}
                  </span>
                </div>
              )}

              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>
                  Joined {new Date(trainer.created_at).toLocaleDateString()}
                </span>
              </div>

              <Badge 
                variant={trainer.status === 'active' ? 'default' : 'secondary'}
                className="mt-2"
              >
                {trainer.status}
              </Badge>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, TrendingUp, Weight, Ruler, Calendar, ClipboardList } from "lucide-react";

export const ProgressTracking = () => {
  const { data: progressRecords, isLoading } = useQuery({
    queryKey: ["member-progress"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("member_progress")
        .select(`
          *,
          member:member_id (
            id,
            user_id,
            user:user_id (
              full_name
            )
          )
        `)
        .order("measurement_date", { ascending: false });

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
        <h2 className="text-2xl font-semibold">Progress Tracking</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {progressRecords?.map((record) => (
          <Card 
            key={record.id}
            className="hover:border-primary/50 transition-colors"
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                {record.member?.user?.full_name}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Date:</span>{" "}
                {new Date(record.measurement_date).toLocaleDateString()}
              </div>

              <div className="flex items-center gap-2 text-sm">
                <Weight className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Weight:</span>{" "}
                {record.weight} kg
              </div>

              {record.body_fat_percentage && (
                <div className="flex items-center gap-2 text-sm">
                  <Ruler className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Body Fat:</span>{" "}
                  {record.body_fat_percentage}%
                </div>
              )}

              {record.muscle_mass && (
                <div className="flex items-center gap-2 text-sm">
                  <Ruler className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Muscle Mass:</span>{" "}
                  {record.muscle_mass} kg
                </div>
              )}

              {record.notes && (
                <div className="flex items-center gap-2 text-sm">
                  <ClipboardList className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Notes:</span> {record.notes}
                </div>
              )}

              {record.measurements && (
                <div className="mt-2 text-sm">
                  <h4 className="font-medium mb-1">Additional Measurements:</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(record.measurements).map(([key, value]) => (
                      <div key={key}>
                        <span className="capitalize">{key}:</span>{" "}
                        <span className="text-muted-foreground">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
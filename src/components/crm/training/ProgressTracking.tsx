import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, TrendingUp } from "lucide-react";

export const ProgressTracking = () => {
  const { data: progress, isLoading } = useQuery({
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
        <h2 className="text-2xl font-semibold">Member Progress</h2>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {progress?.map((record) => (
          <Card key={record.id}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                {record.member?.user?.full_name}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm">
                <span className="font-medium">Date:</span>{" "}
                {new Date(record.measurement_date).toLocaleDateString()}
              </p>
              {record.weight && (
                <p className="text-sm">
                  <span className="font-medium">Weight:</span> {record.weight} kg
                </p>
              )}
              {record.body_fat_percentage && (
                <p className="text-sm">
                  <span className="font-medium">Body Fat:</span>{" "}
                  {record.body_fat_percentage}%
                </p>
              )}
              {record.muscle_mass && (
                <p className="text-sm">
                  <span className="font-medium">Muscle Mass:</span>{" "}
                  {record.muscle_mass} kg
                </p>
              )}
              {record.bmi && (
                <p className="text-sm">
                  <span className="font-medium">BMI:</span> {record.bmi}
                </p>
              )}
              {record.notes && (
                <p className="text-sm">
                  <span className="font-medium">Notes:</span> {record.notes}
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
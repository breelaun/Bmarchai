import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, UserCheck } from "lucide-react";

export const CheckInsList = () => {
  const { data: checkIns, isLoading } = useQuery({
    queryKey: ["gym-check-ins"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("member_check_ins")
        .select(`
          *,
          gym_members (
            user_id,
            profiles:user_id (
              full_name
            )
          )
        `)
        .order("check_in_time", { ascending: false });

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
        <h2 className="text-2xl font-semibold">Check-ins</h2>
        <Button>
          <UserCheck className="h-4 w-4 mr-2" />
          New Check-in
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {checkIns?.map((checkIn) => (
          <Card key={checkIn.id}>
            <CardHeader>
              <CardTitle>{checkIn.gym_members?.profiles?.full_name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Check-in: {new Date(checkIn.check_in_time).toLocaleString()}
              </p>
              {checkIn.check_out_time && (
                <p className="text-sm text-muted-foreground">
                  Check-out: {new Date(checkIn.check_out_time).toLocaleString()}
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
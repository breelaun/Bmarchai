import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, CreditCard } from "lucide-react";

export const MembershipPlans = () => {
  const { data: plans, isLoading } = useQuery({
    queryKey: ["membership-plans"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("membership_plans")
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
        <h2 className="text-2xl font-semibold">Membership Plans</h2>
        <Button>
          <CreditCard className="h-4 w-4 mr-2" />
          Add Plan
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {plans?.map((plan) => (
          <Card key={plan.id}>
            <CardHeader>
              <CardTitle>{plan.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Price: ${plan.price}
              </p>
              <p className="text-sm text-muted-foreground">
                Duration: {plan.duration}
              </p>
              <p className="text-sm text-muted-foreground">
                Frequency: {plan.frequency}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
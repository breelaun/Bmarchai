import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserPlus, Loader2 } from "lucide-react";

export const MembersList = () => {
  const { data: members, isLoading } = useQuery({
    queryKey: ["gym-members"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("gym_members")
        .select(`
          *,
          profiles:user_id (
            full_name,
            avatar_url
          ),
          membership_plans (
            name,
            price
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
        <h2 className="text-2xl font-semibold">Members</h2>
        <Button>
          <UserPlus className="h-4 w-4 mr-2" />
          Add Member
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {members?.map((member) => (
          <Card key={member.id}>
            <CardHeader>
              <CardTitle>{member.profiles?.full_name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Membership: {member.membership_plans?.name}
              </p>
              <p className="text-sm text-muted-foreground">
                Status: {member.status}
              </p>
              <p className="text-sm text-muted-foreground">
                Start Date: {new Date(member.start_date).toLocaleDateString()}
              </p>
              {member.end_date && (
                <p className="text-sm text-muted-foreground">
                  End Date: {new Date(member.end_date).toLocaleDateString()}
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
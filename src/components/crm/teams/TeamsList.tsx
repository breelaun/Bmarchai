import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Users, Calendar } from "lucide-react";
import { TeamForm } from "./TeamForm";
import { TeamMembersList } from "./TeamMembersList";
import TeamCalendar from "@/components/crm/TeamCalendar";

export const TeamsList = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<any>(null);

  const { data: teams = [], isLoading } = useQuery({
    queryKey: ["teams"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("teams")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Teams</h2>
        <Button onClick={() => setIsFormOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Team
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {teams.map((team) => (
          <Card key={team.id}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{team.name}</span>
                <span className="text-sm text-muted-foreground">{team.sport}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">{team.description}</p>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedTeam({ ...team, view: "members" })}
                >
                  <Users className="h-4 w-4 mr-2" />
                  Members
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedTeam({ ...team, view: "calendar" })}
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <TeamForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        initialData={selectedTeam}
      />

      {selectedTeam?.view === "members" && (
        <TeamMembersList
          teamId={selectedTeam.id}
          onClose={() => setSelectedTeam(null)}
        />
      )}

      {selectedTeam?.view === "calendar" && (
        <TeamCalendar
          teamId={selectedTeam.id}
          onClose={() => setSelectedTeam(null)}
        />
      )}
    </div>
  );
};
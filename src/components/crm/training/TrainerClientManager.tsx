import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, UserPlus, Users } from "lucide-react";

type TrainerClient = {
  id: string;
  client: {
    id: string;
    full_name: string;
    email: string;
  };
  start_date: string;
  status: string;
};

export const TrainerClientManager = () => {
  const [selectedTrainer, setSelectedTrainer] = useState<string>("");
  const [selectedClient, setSelectedClient] = useState<string>("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: trainers, isLoading: loadingTrainers } = useQuery({
    queryKey: ["gym-trainers"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("gym_trainers")
        .select("*")
        .eq("owner_id", (await supabase.auth.getUser()).data.user?.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const { data: availableClients, isLoading: loadingClients } = useQuery({
    queryKey: ["available-clients", selectedTrainer],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("gym_members")
        .select("*")
        .eq("owner_id", (await supabase.auth.getUser()).data.user?.id)
        .not("id", "in", (
          await supabase
            .from("trainer_clients")
            .select("client_id")
            .eq("trainer_id", selectedTrainer)
        ).data?.map(tc => tc.client_id) || []);

      if (error) throw error;
      return data;
    },
    enabled: !!selectedTrainer,
  });

  const { data: trainerClients, isLoading: loadingTrainerClients } = useQuery<TrainerClient[]>({
    queryKey: ["trainer-clients", selectedTrainer],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("trainer_clients")
        .select(`
          id,
          client:client_id (
            id,
            full_name,
            email
          ),
          start_date,
          status
        `)
        .eq("trainer_id", selectedTrainer)
        .eq("status", "active");

      if (error) throw error;
      return data as unknown as TrainerClient[];
    },
    enabled: !!selectedTrainer,
  });

  const assignClient = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("trainer_clients").insert({
        trainer_id: selectedTrainer,
        client_id: selectedClient,
      });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trainer-clients"] });
      queryClient.invalidateQueries({ queryKey: ["available-clients"] });
      toast({
        title: "Success",
        description: "Client assigned to trainer successfully",
      });
      setSelectedClient("");
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to assign client to trainer",
        variant: "destructive",
      });
      console.error("Error assigning client:", error);
    },
  });

  if (loadingTrainers) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Trainer Client Management
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Select Trainer</label>
          <Select
            value={selectedTrainer}
            onValueChange={setSelectedTrainer}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a trainer" />
            </SelectTrigger>
            <SelectContent>
              {trainers?.map((trainer) => (
                <SelectItem key={trainer.id} value={trainer.id}>
                  {trainer.full_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedTrainer && (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Assign New Client</label>
              <div className="flex gap-2">
                <Select
                  value={selectedClient}
                  onValueChange={setSelectedClient}
                >
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Select a client" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableClients?.map((client) => (
                      <SelectItem key={client.id} value={client.id}>
                        {client.full_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  onClick={() => assignClient.mutate()}
                  disabled={!selectedClient || assignClient.isPending}
                >
                  {assignClient.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <UserPlus className="h-4 w-4" />
                  )}
                  <span className="ml-2">Assign</span>
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-medium">Current Clients</h3>
              {loadingTrainerClients ? (
                <div className="flex items-center justify-center p-4">
                  <Loader2 className="h-4 w-4 animate-spin" />
                </div>
              ) : (
                <div className="space-y-2">
                  {trainerClients?.map((tc) => (
                    <div
                      key={tc.id}
                      className="flex items-center justify-between rounded-lg border p-3"
                    >
                      <div>
                        <span className="font-medium">{tc.client.full_name}</span>
                        <p className="text-sm text-muted-foreground">
                          {tc.client.email}
                        </p>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        Since {new Date(tc.start_date).toLocaleDateString()}
                      </span>
                    </div>
                  ))}
                  {!trainerClients?.length && (
                    <p className="text-sm text-muted-foreground">
                      No clients assigned yet
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
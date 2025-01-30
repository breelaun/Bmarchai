import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Plus, Loader2 } from "lucide-react";
import { TeamMemberForm } from "./TeamMemberForm";

interface TeamMembersListProps {
  teamId: string;
  onClose: () => void;
}

export const TeamMembersList = ({ teamId, onClose }: TeamMembersListProps) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: members = [], isLoading } = useQuery({
    queryKey: ["team-members", teamId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("team_members")
        .select("*")
        .eq("team_id", teamId)
        .order("role", { ascending: true });

      if (error) throw error;
      return data;
    },
  });

  const deleteMember = useMutation({
    mutationFn: async (memberId: string) => {
      const { error } = await supabase
        .from("team_members")
        .delete()
        .eq("id", memberId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["team-members", teamId] });
      toast({ title: "Team member removed successfully" });
    },
    onError: (error) => {
      toast({
        title: "Error removing team member",
        description: error.message,
        variant: "destructive",
      });
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
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle className="flex justify-between items-center">
            <span>Team Members</span>
            <Button onClick={() => setIsFormOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Member
            </Button>
          </DialogTitle>
        </DialogHeader>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Position</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {members.map((member) => (
              <TableRow key={member.id}>
                <TableCell>{member.full_name}</TableCell>
                <TableCell>{member.role}</TableCell>
                <TableCell>{member.status}</TableCell>
                <TableCell>{member.position}</TableCell>
                <TableCell>
                  <div className="text-sm">
                    <div>{member.contact_email}</div>
                    <div>{member.contact_phone}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => deleteMember.mutate(member.id)}
                    disabled={deleteMember.isPending}
                  >
                    Remove
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <TeamMemberForm
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          teamId={teamId}
        />
      </DialogContent>
    </Dialog>
  );
};
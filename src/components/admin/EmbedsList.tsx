import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Trash, Edit2 } from "lucide-react";
import type { ArtsEmbed } from "./types";

interface EmbedsListProps {
  embeds: ArtsEmbed[];
  onEdit: (embed: ArtsEmbed) => void;
}

export const EmbedsList = ({ embeds, onEdit }: EmbedsListProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const deleteEmbed = useMutation({
    mutationFn: async (embedId: string) => {
      const { error } = await supabase
        .from("arts_embeds")
        .delete()
        .eq("id", embedId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["arts-embeds"] });
      toast({
        title: "Success",
        description: "Embed deleted successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return (
    <div className="space-y-4">
      {embeds.map((embed) => (
        <div
          key={embed.id}
          className="flex items-center justify-between p-4 border rounded-lg"
        >
          <div>
            <h4 className="font-medium">{embed.title}</h4>
            <p className="text-sm text-muted-foreground">
              Category: {embed.arts_categories?.name}
            </p>
            {embed.end_date && (
              <p className="text-sm text-muted-foreground">
                Expires: {new Date(embed.end_date).toLocaleDateString()}
              </p>
            )}
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => onEdit(embed)}
            >
              <Edit2 className="h-4 w-4" />
            </Button>
            <Button
              variant="destructive"
              size="icon"
              onClick={() => deleteEmbed.mutate(embed.id)}
            >
              <Trash className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};
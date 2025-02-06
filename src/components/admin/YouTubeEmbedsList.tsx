import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Trash, Edit2, ChevronDown, ChevronUp } from "lucide-react";
import type { YouTubeEmbed } from "./types";

interface YouTubeEmbedsListProps {
  embeds: YouTubeEmbed[];
  onEdit: (embed: YouTubeEmbed) => void;
}

export const YouTubeEmbedsList = ({ embeds, onEdit }: YouTubeEmbedsListProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isExpanded, setIsExpanded] = useState(false);

  const deleteEmbed = useMutation({
    mutationFn: async (embedId: string) => {
      const { error } = await supabase
        .from("youtube_embeds")
        .delete()
        .eq("id", embedId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["youtube-embeds"] });
      toast({
        title: "Success",
        description: "YouTube embed deleted successfully",
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
      <div className="flex items-center justify-between p-4 border rounded-lg">
        <h3 className="text-lg font-semibold">
          YouTube Embeds ({embeds.length} items)
        </h3>
        <Button
          variant="ghost"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? (
            <>Collapse <ChevronUp className="ml-2" /></>
          ) : (
            <>Expand <ChevronDown className="ml-2" /></>
          )}
        </Button>
      </div>

      {isExpanded && (
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
                <p className="text-sm text-muted-foreground">
                  Type: {embed.embed_type}
                </p>
                {embed.end_date && (
                  <p className="text-sm text-muted-foreground">
                    Expires: {new Date(embed.end_date).toLocaleDateString()}
                  </p>
                )}
              </div>
              {/* ✅ Corrected YouTube Embed Handling */}
              <iframe
                width="100%"
                height="200"
                src={
                  embed.embed_type === "playlist"
                    ? `https://www.youtube.com/embed/videoseries?list=${embed.embed_id}`
                    : embed.embed_type === "channel"
                    ? `https://www.youtube.com/embed?src=${embed.embed_id}`
                    : `https://www.youtube.com/embed/${embed.embed_id}`
                }
                title={embed.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" size="icon" onClick={() => onEdit(embed)}>
                <Edit2 className="h-4 w-4" />
              </Button>
              <Button variant="destructive" size="icon" onClick={() => deleteEmbed.mutate(embed.id)}>
                <Trash className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
        </div>
      )}
    </div>
  );
};

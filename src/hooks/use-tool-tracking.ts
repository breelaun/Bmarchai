import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@supabase/auth-helpers-react";
import { useToast } from "@/hooks/use-toast";

export type ToolAction = {
  tool: string;
  action: string;
  metadata?: Record<string, any>;
};

export const useToolTracking = () => {
  const session = useSession();
  const { toast } = useToast();

  const trackToolUsage = async ({ tool, action, metadata = {} }: ToolAction) => {
    if (!session?.user) {
      console.warn("Tool usage tracking failed: No authenticated user");
      return;
    }

    try {
      const { error } = await supabase.from("tool_usage").insert({
        user_id: session.user.id,
        tool_name: tool,
        action,
        metadata,
      });

      if (error) {
        console.error("Failed to track tool usage:", error);
        toast({
          variant: "destructive",
          title: "Error tracking tool usage",
          description: error.message,
        });
      }
    } catch (error) {
      console.error("Error in trackToolUsage:", error);
    }
  };

  return { trackToolUsage };
};
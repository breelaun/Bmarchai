import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Activity, ArrowRight, CheckCircle2, Clock } from "lucide-react";
import { format } from "date-fns";

interface ActivityTimelineProps {
  clientId: string;
}

export function ActivityTimeline({ clientId }: ActivityTimelineProps) {
  const { data: activities, isLoading } = useQuery({
    queryKey: ['activities', clientId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('client_activities')
        .select('*')
        .eq('client_id', clientId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return <div>Loading activities...</div>;
  }

  const getIcon = (type: string) => {
    switch (type) {
      case 'stage_change':
        return <ArrowRight className="h-4 w-4" />;
      case 'task':
        return <CheckCircle2 className="h-4 w-4" />;
      case 'communication':
        return <Clock className="h-4 w-4" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          {activities?.map((activity) => (
            <div key={activity.id} className="flex items-start gap-4 border-b pb-4 last:border-0">
              <div className="mt-1 rounded-full bg-muted p-2">
                {getIcon(activity.type)}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">{activity.description}</h4>
                  <time className="text-sm text-muted-foreground">
                    {format(new Date(activity.created_at), 'MMM d, yyyy h:mm a')}
                  </time>
                </div>
                {activity.metadata && Object.keys(activity.metadata).length > 0 && (
                  <div className="mt-1 text-sm text-muted-foreground">
                    {Object.entries(activity.metadata).map(([key, value]) => (
                      <div key={key}>
                        <span className="font-medium">{key}: </span>
                        <span>{String(value)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
          {(!activities || activities.length === 0) && (
            <p className="text-center text-muted-foreground">No activities recorded yet.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
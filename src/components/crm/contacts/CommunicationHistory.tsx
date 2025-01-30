import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, Phone, Calendar, MessageSquare } from "lucide-react";
import { format } from "date-fns";

interface CommunicationHistoryProps {
  clientId: string;
}

export function CommunicationHistory({ clientId }: CommunicationHistoryProps) {
  const { data: communications, isLoading } = useQuery({
    queryKey: ['communications', clientId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('client_communications')
        .select('*')
        .eq('client_id', clientId)
        .order('date', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return <div>Loading communications...</div>;
  }

  const getIcon = (type: string) => {
    switch (type) {
      case 'email':
        return <Mail className="h-4 w-4" />;
      case 'phone':
        return <Phone className="h-4 w-4" />;
      case 'meeting':
        return <Calendar className="h-4 w-4" />;
      default:
        return <MessageSquare className="h-4 w-4" />;
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          {communications?.map((comm) => (
            <div key={comm.id} className="flex items-start gap-4 border-b pb-4 last:border-0">
              <div className="mt-1 rounded-full bg-muted p-2">
                {getIcon(comm.type)}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">{comm.subject || comm.type}</h4>
                  <time className="text-sm text-muted-foreground">
                    {format(new Date(comm.date), 'MMM d, yyyy h:mm a')}
                  </time>
                </div>
                {comm.content && (
                  <p className="mt-1 text-sm text-muted-foreground">{comm.content}</p>
                )}
              </div>
            </div>
          ))}
          {(!communications || communications.length === 0) && (
            <p className="text-center text-muted-foreground">No communications recorded yet.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
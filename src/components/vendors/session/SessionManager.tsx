import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, Users } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { formatToLocalTime } from '@/utils/timezone';

interface Session {
  id: string;
  name: string;
  description: string;
  start_time: string;
  duration: string;
  max_participants: number;
  vendor_id: string;
}

const SessionManager = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const { data: sessions, isLoading } = useQuery({
    queryKey: ['sessions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('sessions')
        .select('*')
        .order('start_time', { ascending: true });

      if (error) throw error;
      return data as Session[];
    },
  });

  if (isLoading) {
    return <div>Loading sessions...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Upcoming Sessions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {sessions?.map((session) => (
              <Card key={session.id} className="hover:bg-accent/5">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold">{session.name}</h3>
                      <p className="text-sm text-muted-foreground">{session.description}</p>
                      <div className="mt-2 flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {formatToLocalTime(session.start_time, 'UTC')}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          {session.max_participants} participants max
                        </span>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Manage
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
            {sessions?.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <p>No sessions scheduled</p>
                <Button className="mt-4">Create New Session</Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SessionManager;
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';
import { useForm } from 'react-hook-form';
import { Calendar as CalendarIcon, Loader2, Plus } from 'lucide-react';
import { format } from 'date-fns';

interface EventFormData {
  title: string;
  description?: string;
  start_time: Date;
  end_time: Date;
  all_day: boolean;
  category?: string;
}

const TeamCalendar = () => {
  const [isAddingEvent, setIsAddingEvent] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const form = useForm<EventFormData>();

  const { data: events, isLoading } = useQuery({
    queryKey: ['team-calendar-events'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('team_calendar_events')
        .select('*')
        .order('start_time', { ascending: true });

      if (error) throw error;
      return data;
    },
  });

  const createEvent = useMutation({
    mutationFn: async (data: EventFormData) => {
      const { error } = await supabase
        .from('team_calendar_events')
        .insert([{
          title: data.title,
          description: data.description,
          start_time: data.start_time,
          end_time: data.end_time,
          all_day: data.all_day,
          category: data.category,
        }]);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['team-calendar-events'] });
      setIsAddingEvent(false);
      form.reset();
      toast({
        title: "Event created",
        description: "The event has been added to the calendar.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create event. Please try again.",
        variant: "destructive",
      });
      console.error("Error creating event:", error);
    },
  });

  const onSubmit = (data: EventFormData) => {
    createEvent.mutate(data);
  };

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
        <h2 className="text-2xl font-semibold">Team Calendar</h2>
        <Dialog open={isAddingEvent} onOpenChange={setIsAddingEvent}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Event
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Event</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="start_time"
                    render={({ field: { value, onChange, ...field } }) => (
                      <FormItem>
                        <FormLabel>Start Time</FormLabel>
                        <FormControl>
                          <Input 
                            type="datetime-local" 
                            {...field}
                            value={value ? value.toISOString().slice(0, 16) : ''}
                            onChange={(e) => onChange(new Date(e.target.value))}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="end_time"
                    render={({ field: { value, onChange, ...field } }) => (
                      <FormItem>
                        <FormLabel>End Time</FormLabel>
                        <FormControl>
                          <Input 
                            type="datetime-local" 
                            {...field}
                            value={value ? value.toISOString().slice(0, 16) : ''}
                            onChange={(e) => onChange(new Date(e.target.value))}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="all_day"
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-2">
                      <FormLabel>All Day Event</FormLabel>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <Button type="submit" disabled={createEvent.isPending}>
                  {createEvent.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Create Event"
                  )}
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="p-4">
          <Calendar
            mode="single"
            selected={new Date()}
            className="rounded-md border"
          />
          <div className="mt-4 space-y-2">
            {events?.map((event) => (
              <div
                key={event.id}
                className="flex items-center justify-between p-2 rounded-lg border bg-card"
              >
                <div>
                  <p className="font-medium">{event.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(event.start_time), "PPP")}
                  </p>
                </div>
                {event.category && (
                  <span className="text-sm px-2 py-1 rounded-full bg-primary/10">
                    {event.category}
                  </span>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TeamCalendar;
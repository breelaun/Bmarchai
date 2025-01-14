import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSession } from '@supabase/auth-helpers-react';
import { useQueryClient } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface SessionFormData {
  name: string;
  description: string;
  start_time: string;
  duration: string;
  max_participants: number;
  price: number;
}

interface SessionFormProps {
  onSuccess?: () => void;
}

const SessionForm = ({ onSuccess }: SessionFormProps) => {
  const session = useSession();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<SessionFormData>();

  const onSubmit = async (data: SessionFormData) => {
    if (!session?.user?.id) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "You must be logged in to create sessions",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('sessions')
        .insert({
          vendor_id: session.user.id,
          name: data.name,
          description: data.description,
          start_time: data.start_time,
          duration: data.duration,
          max_participants: data.max_participants,
          price: data.price,
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Session created successfully",
      });

      queryClient.invalidateQueries({ queryKey: ['sessions'] });
      onSuccess?.();

    } catch (error: any) {
      console.error('Error creating session:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to create session",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="name">Session Name</Label>
            <Input
              id="name"
              {...register("name", { required: "Session name is required" })}
              placeholder="Enter session name"
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              {...register("description")}
              placeholder="Enter session description"
              className="h-32"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="start_time">Start Time</Label>
            <Input
              id="start_time"
              type="datetime-local"
              {...register("start_time", { required: "Start time is required" })}
            />
            {errors.start_time && (
              <p className="text-sm text-destructive">{errors.start_time.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="duration">Duration (in minutes)</Label>
            <Input
              id="duration"
              type="number"
              {...register("duration", { required: "Duration is required" })}
              placeholder="60"
            />
            {errors.duration && (
              <p className="text-sm text-destructive">{errors.duration.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="max_participants">Maximum Participants</Label>
            <Input
              id="max_participants"
              type="number"
              {...register("max_participants", { required: "Maximum participants is required" })}
              placeholder="20"
            />
            {errors.max_participants && (
              <p className="text-sm text-destructive">{errors.max_participants.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="price">Price</Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              {...register("price", { required: "Price is required" })}
              placeholder="0.00"
            />
            {errors.price && (
              <p className="text-sm text-destructive">{errors.price.message}</p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Creating Session..." : "Create Session"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default SessionForm;
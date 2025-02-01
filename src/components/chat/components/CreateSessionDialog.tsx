import React from 'react';
import { useForm } from 'react-hook-form';
import { useSession } from '@supabase/auth-helpers-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Calendar, Plus } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface SessionFormData {
  name: string;
  description: string;
  start_time: string;
  price: number;
  max_participants: number;
  session_type: 'free' | 'paid';
}

const CreateSessionDialog = () => {
  const session = useSession();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { register, handleSubmit, reset, formState: { errors } } = useForm<SessionFormData>();

  const createSession = useMutation({
    mutationFn: async (data: SessionFormData) => {
      if (!session?.user?.id) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('sessions')
        .insert({
          vendor_id: session.user.id,
          name: data.name,
          description: data.description,
          start_time: data.start_time,
          price: data.price,
          max_participants: data.max_participants,
          session_type: data.session_type,
          status: 'scheduled'
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
      toast({
        title: "Success",
        description: "Session created successfully",
      });
      reset();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: SessionFormData) => {
    createSession.mutate(data);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="w-full justify-start">
          <Plus className="h-4 w-4 mr-2" />
          Create Session
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Session</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="start_time">Start Time</Label>
            <div className="relative">
              <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="start_time"
                type="datetime-local"
                {...register("start_time", { required: "Start time is required" })}
                className="pl-10"
              />
            </div>
            {errors.start_time && (
              <p className="text-sm text-destructive">{errors.start_time.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="session_type">Session Type</Label>
            <select
              {...register("session_type")}
              className="w-full rounded-md border border-input bg-background px-3 py-2"
            >
              <option value="free">Free</option>
              <option value="paid">Paid</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="price">Price (in USD)</Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              {...register("price", { 
                valueAsNumber: true,
                validate: (value) => value >= 0 || "Price cannot be negative" 
              })}
              placeholder="0.00"
            />
            {errors.price && (
              <p className="text-sm text-destructive">{errors.price.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="max_participants">Maximum Participants</Label>
            <Input
              id="max_participants"
              type="number"
              {...register("max_participants", { 
                valueAsNumber: true,
                min: { value: 1, message: "Must allow at least 1 participant" },
                max: { value: 100, message: "Maximum 100 participants allowed" }
              })}
              placeholder="20"
            />
            {errors.max_participants && (
              <p className="text-sm text-destructive">{errors.max_participants.message}</p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={createSession.isPending}>
            {createSession.isPending ? "Creating..." : "Create Session"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateSessionDialog;
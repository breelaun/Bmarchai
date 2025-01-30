import { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

interface TeamFormProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: any;
}

export const TeamForm = ({ isOpen, onClose, initialData }: TeamFormProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const form = useForm({
    defaultValues: initialData || {
      name: "",
      sport: "",
      description: "",
    },
  });

  const createTeam = useMutation({
    mutationFn: async (data: any) => {
      const { error } = await supabase.from("teams").insert([data]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teams"] });
      toast({ title: "Team created successfully" });
      onClose();
      form.reset();
    },
    onError: (error) => {
      toast({
        title: "Error creating team",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: any) => {
    createTeam.mutate(data);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Edit Team" : "Create New Team"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Team Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="sport"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sport</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select sport" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="football">Football</SelectItem>
                      <SelectItem value="basketball">Basketball</SelectItem>
                      <SelectItem value="baseball">Baseball</SelectItem>
                      <SelectItem value="soccer">Soccer</SelectItem>
                      <SelectItem value="volleyball">Volleyball</SelectItem>
                      <SelectItem value="tennis">Tennis</SelectItem>
                      <SelectItem value="rugby">Rugby</SelectItem>
                      <SelectItem value="cricket">Cricket</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
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
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full"
              disabled={createTeam.isPending}
            >
              {createTeam.isPending && (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              )}
              {initialData ? "Update Team" : "Create Team"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
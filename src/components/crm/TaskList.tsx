import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Plus, Loader2, Calendar as CalendarIcon, ArrowRight } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useToast } from "@/components/ui/use-toast";

interface TaskFormData {
  title: string;
  description?: string;
  start_date?: Date;
  due_date?: Date;
  priority: 'low' | 'medium' | 'high';
  category?: string;
  dependent_on_task_id?: string;
}

const TaskList = () => {
  const [isAddingTask, setIsAddingTask] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const form = useForm<TaskFormData>();

  const { data: tasks, isLoading } = useQuery({
    queryKey: ['tasks'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('crm_tasks')
        .select(`
          *,
          dependencies:crm_task_dependencies(
            dependent_on_task:crm_tasks(id, title)
          )
        `)
        .order('due_date', { ascending: true });

      if (error) throw error;
      return data;
    },
  });

  const { data: availableTasks } = useQuery({
    queryKey: ['available-tasks'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('crm_tasks')
        .select('id, title')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const createTask = useMutation({
    mutationFn: async (data: TaskFormData) => {
      // First create the task
      const { data: task, error: taskError } = await supabase
        .from('crm_tasks')
        .insert([{
          title: data.title,
          description: data.description,
          start_date: data.start_date,
          due_date: data.due_date,
          priority: data.priority,
          category: data.category,
        }])
        .select()
        .single();

      if (taskError) throw taskError;

      // If there's a dependency, create it
      if (data.dependent_on_task_id) {
        const { error: depError } = await supabase
          .from('crm_task_dependencies')
          .insert([{
            task_id: task.id,
            dependent_on_task_id: data.dependent_on_task_id,
          }]);

        if (depError) throw depError;
      }

      return task;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      setIsAddingTask(false);
      form.reset();
      toast({
        title: "Task created",
        description: "The task has been created successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create task. Please try again.",
        variant: "destructive",
      });
      console.error("Error creating task:", error);
    },
  });

  const onSubmit = (data: TaskFormData) => {
    createTask.mutate(data);
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
        <h2 className="text-2xl font-semibold">Tasks</h2>
        <Dialog open={isAddingTask} onOpenChange={setIsAddingTask}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Task
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Task</DialogTitle>
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
                    name="start_date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Start Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                className={cn(
                                  "w-full pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) =>
                                date < new Date()
                              }
                            />
                          </PopoverContent>
                        </Popover>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="due_date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Due Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                className={cn(
                                  "w-full pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) =>
                                date < new Date()
                              }
                            />
                          </PopoverContent>
                        </Popover>
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="priority"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Priority</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select priority" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                        </SelectContent>
                      </Select>
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

                <FormField
                  control={form.control}
                  name="dependent_on_task_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Depends On</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select dependency" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {availableTasks?.map((task) => (
                            <SelectItem key={task.id} value={task.id}>
                              {task.title}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />

                <Button type="submit" disabled={createTask.isPending}>
                  {createTask.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Create Task"
                  )}
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {tasks?.map((task) => (
          <Card key={task.id}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{task.title}</span>
                {task.dependencies?.length > 0 && (
                  <div className="flex items-center text-sm text-muted-foreground">
                    Depends on: {task.dependencies[0].dependent_on_task.title}
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </div>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{task.description}</p>
              <div className="mt-2 space-y-1">
                {task.start_date && (
                  <p className="text-sm">
                    Start: {new Date(task.start_date).toLocaleDateString()}
                  </p>
                )}
                {task.due_date && (
                  <p className="text-sm">
                    Due: {new Date(task.due_date).toLocaleDateString()}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-sm px-2 py-1 rounded-full bg-primary/10 text-primary">
                  {task.priority}
                </span>
                {task.category && (
                  <span className="text-sm px-2 py-1 rounded-full bg-secondary/10 text-secondary">
                    {task.category}
                  </span>
                )}
                <span className="text-sm px-2 py-1 rounded-full bg-secondary/10 text-secondary">
                  {task.status}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default TaskList;
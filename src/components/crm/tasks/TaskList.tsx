import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { TaskForm, TaskFormData } from './TaskForm';
import { TaskCard } from './TaskCard';

const TaskList = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: tasks, isLoading } = useQuery({
    queryKey: ['tasks'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('crm_tasks')
        .select(`
          *,
          dependencies:crm_task_dependencies!crm_task_dependencies_task_id_fkey(
            dependent_on_task:crm_tasks!crm_task_dependencies_dependent_on_task_id_fkey(id, title)
          )
        `)
        .order('due_date', { ascending: true });

      if (error) throw error;
      return data;
    },
  });

  const createTask = useMutation({
    mutationFn: async (data: TaskFormData) => {
      const { data: task, error: taskError } = await supabase
        .from('crm_tasks')
        .insert([{
          title: data.title,
          description: data.description,
          due_date: data.due_date,
          priority: data.priority,
        }])
        .select()
        .single();

      if (taskError) throw taskError;

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
      toast({
        title: 'Task created',
        description: 'Your task has been created successfully.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to create task: ' + error.message,
        variant: 'destructive',
      });
    },
  });

  if (isLoading) {
    return <div>Loading tasks...</div>;
  }

  return (
    <div className="space-y-6">
      <TaskForm
        onSubmit={(data) => createTask.mutate(data)}
        existingTasks={tasks}
        isSubmitting={createTask.isPending}
      />
      <div className="space-y-4">
        {tasks?.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>
    </div>
  );
};

export default TaskList;
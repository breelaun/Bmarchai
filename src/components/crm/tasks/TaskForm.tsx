import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

export interface TaskFormData {
  title: string;
  description?: string;
  due_date?: string;
  priority?: string;
  dependent_on_task_id?: string;
}

interface TaskFormProps {
  onSubmit: (data: TaskFormData) => void;
  existingTasks?: Array<{ id: string; title: string }>;
  isSubmitting?: boolean;
}

export const TaskForm = ({ onSubmit, existingTasks, isSubmitting }: TaskFormProps) => {
  const { register, handleSubmit, reset } = useForm<TaskFormData>();

  const submitHandler = (data: TaskFormData) => {
    onSubmit(data);
    reset();
  };

  return (
    <form onSubmit={handleSubmit(submitHandler)} className="space-y-4">
      <div>
        <Input
          {...register('title')}
          placeholder="Task title"
          className="w-full"
        />
      </div>
      <div>
        <Textarea
          {...register('description')}
          placeholder="Task description"
          className="w-full"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Input
          {...register('due_date')}
          type="datetime-local"
          className="w-full"
        />
        <Select onValueChange={(value) => register('priority').onChange({ target: { value } })}>
          <SelectTrigger>
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="low">Low</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="high">High</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {existingTasks && existingTasks.length > 0 && (
        <Select onValueChange={(value) => register('dependent_on_task_id').onChange({ target: { value } })}>
          <SelectTrigger>
            <SelectValue placeholder="Depends on..." />
          </SelectTrigger>
          <SelectContent>
            {existingTasks.map((task) => (
              <SelectItem key={task.id} value={task.id}>
                {task.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Adding...' : 'Add Task'}
      </Button>
    </form>
  );
};
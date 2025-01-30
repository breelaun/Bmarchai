import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { TaskCard } from "./TaskCard";
import { TaskForm } from "./TaskForm";

export const TaskList = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<any>(null);

  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ['tasks'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('crm_tasks')
        .select(`
          *,
          client:crm_clients(id, name),
          dependencies:crm_task_dependencies!crm_task_dependencies_task_id_fkey(
            dependent_on_task:crm_tasks!crm_task_dependencies_dependent_on_task_id_fkey(id, title)
          )
        `)
        .order('due_date', { ascending: true });

      if (error) throw error;
      return data;
    },
  });

  const handleEdit = (task: any) => {
    setSelectedTask(task);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setSelectedTask(null);
    setIsFormOpen(false);
  };

  if (isLoading) {
    return <div>Loading tasks...</div>;
  }

  return (
    <div>
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-2xl font-bold">Tasks</h2>
        <Button onClick={() => setIsFormOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Task
        </Button>
      </div>

      <div className="space-y-4">
        {tasks.map((task: any) => (
          <TaskCard
            key={task.id}
            task={task}
            onEdit={handleEdit}
          />
        ))}
        {tasks.length === 0 && (
          <p className="text-center text-muted-foreground">
            No tasks found. Create one to get started!
          </p>
        )}
      </div>

      <TaskForm
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        initialData={selectedTask}
      />
    </div>
  );
};

export default TaskList;
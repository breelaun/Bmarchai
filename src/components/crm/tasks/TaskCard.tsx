import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { format } from "date-fns";
import { CalendarDays, Clock, Link as LinkIcon, Trash2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";

interface TaskCardProps {
  task: any;
  onEdit: (task: any) => void;
}

export const TaskCard = ({ task, onEdit }: TaskCardProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleStatusChange = async (checked: boolean) => {
    try {
      const { error } = await supabase
        .from('crm_tasks')
        .update({ status: checked ? 'completed' : 'pending' })
        .eq('id', task.id);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      
      toast({
        title: `Task ${checked ? 'completed' : 'reopened'}`,
        description: task.title,
      });
    } catch (error: any) {
      toast({
        title: "Error updating task status",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDelete = async () => {
    try {
      const { error } = await supabase
        .from('crm_tasks')
        .delete()
        .eq('id', task.id);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      
      toast({
        title: "Task deleted",
        description: task.title,
      });
    } catch (error: any) {
      toast({
        title: "Error deleting task",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="mb-4">
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <div className="flex items-start space-x-2">
          <Checkbox
            checked={task.status === 'completed'}
            onCheckedChange={handleStatusChange}
          />
          <div>
            <CardTitle className="text-base font-medium">
              {task.title}
            </CardTitle>
            {task.client && (
              <p className="text-sm text-muted-foreground">
                {task.client.name}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant={task.priority === 'high' ? 'destructive' : 'secondary'}>
            {task.priority}
          </Badge>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(task)}
          >
            <LinkIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleDelete}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {task.description && (
          <p className="text-sm text-muted-foreground mb-2">
            {task.description}
          </p>
        )}
        <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
          {task.due_date && (
            <div className="flex items-center gap-1">
              <CalendarDays className="h-4 w-4" />
              <span>Due {format(new Date(task.due_date), 'MMM d, yyyy')}</span>
            </div>
          )}
          {task.start_date && (
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>Starts {format(new Date(task.start_date), 'MMM d, yyyy')}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
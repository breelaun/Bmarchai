import React from 'react';
import { format } from 'date-fns';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, AlertTriangle } from 'lucide-react';

interface TaskCardProps {
  task: {
    id: string;
    title: string;
    description?: string;
    due_date?: string;
    priority?: string;
    dependencies?: Array<{
      dependent_on_task: {
        id: string;
        title: string;
      };
    }>;
  };
}

export const TaskCard = ({ task }: TaskCardProps) => {
  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="mb-4">
      <CardContent className="pt-6">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold">{task.title}</h3>
          {task.priority && (
            <Badge className={getPriorityColor(task.priority)}>
              {task.priority}
            </Badge>
          )}
        </div>
        {task.description && (
          <p className="text-gray-600 mb-2">{task.description}</p>
        )}
        <div className="flex items-center gap-4 text-sm text-gray-500">
          {task.due_date && (
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{format(new Date(task.due_date), 'PPp')}</span>
            </div>
          )}
          {task.dependencies && task.dependencies.length > 0 && (
            <div className="flex items-center gap-1">
              <AlertTriangle className="h-4 w-4" />
              <span>Depends on: {task.dependencies[0].dependent_on_task.title}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
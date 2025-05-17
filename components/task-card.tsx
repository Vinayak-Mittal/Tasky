'use client';

import { useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { PriorityBadge } from '@/components/ui/priority-badge';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2 } from 'lucide-react';
import { Task } from '@/lib/types';
import { motion } from '@/lib/motion';

interface TaskCardProps {
  task: Task;
  onComplete: (taskId: string, completed: boolean) => void;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
}

export function TaskCard({ task, onComplete, onEdit, onDelete }: TaskCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  const handleCheckboxChange = (checked: boolean) => {
    onComplete(task.id, checked);
  };

  return (
    <motion.div 
      className={`p-4 rounded-lg border ${task.completed ? 'bg-muted/50' : 'bg-card'} transition-all duration-300 relative`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      layout
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <div className="flex items-start gap-3">
        <Checkbox 
          checked={task.completed} 
          onCheckedChange={handleCheckboxChange}
          className="mt-1"
        />
        
        <div className="flex-1 space-y-2">
          <div className="flex items-center justify-between">
            <h3 className={`font-medium text-lg ${task.completed ? 'line-through text-muted-foreground' : ''}`}>
              {task.title}
            </h3>
            <PriorityBadge priority={task.priority} />
          </div>
          
          <p className={`text-sm ${task.completed ? 'text-muted-foreground/70 line-through' : 'text-muted-foreground'}`}>
            {task.description}
          </p>
          
          <div className="pt-2 flex justify-end gap-2 transition-opacity duration-200" 
            style={{ opacity: isHovered || task.completed ? 1 : 0 }}
          >
            {!task.completed && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEdit(task)}
                className="h-8 px-2"
              >
                <Pencil className="h-4 w-4 mr-1" />
                Edit
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDelete(task.id)}
              className="h-8 px-2 text-destructive hover:text-destructive-foreground hover:bg-destructive"
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Delete
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
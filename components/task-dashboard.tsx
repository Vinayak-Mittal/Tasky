'use client';

import { useState, useEffect } from 'react';
import { Task, Priority } from '@/lib/types';
import { getTasks, saveTasks, getCompletionRate } from '@/lib/task-storage';
import { TaskCard } from '@/components/task-card';
import { TaskForm } from '@/components/task-form';
import { ProgressBar } from '@/components/progress-bar';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, CheckCheck, Filter } from 'lucide-react';
import { motion } from '@/lib/motion';
import { 
  DropdownMenu, 
  DropdownMenuTrigger, 
  DropdownMenuContent, 
  DropdownMenuLabel,
  DropdownMenuSeparator, 
  DropdownMenuCheckboxItem 
} from '@/components/ui/dropdown-menu';

export function TaskDashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);
  const [activeTab, setActiveTab] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<Priority[]>(['low', 'medium', 'high']);
  
  useEffect(() => {
    // Load tasks from localStorage on component mount
    const storedTasks = getTasks();
    setTasks(storedTasks);
  }, []);
  
  const handleAddTask = (task: Task) => {
    const updatedTasks = [...tasks, task];
    setTasks(updatedTasks);
    saveTasks(updatedTasks);
    setShowForm(false);
  };
  
  const handleUpdateTask = (updatedTask: Task) => {
    const updatedTasks = tasks.map(task => 
      task.id === updatedTask.id ? updatedTask : task
    );
    
    setTasks(updatedTasks);
    saveTasks(updatedTasks);
    setEditingTask(undefined);
  };
  
  const handleToggleComplete = (taskId: string, completed: boolean) => {
    const updatedTasks = tasks.map(task => 
      task.id === taskId ? { ...task, completed } : task
    );
    
    setTasks(updatedTasks);
    saveTasks(updatedTasks);
  };
  
  const handleDeleteTask = (taskId: string) => {
    const updatedTasks = tasks.filter(task => task.id !== taskId);
    setTasks(updatedTasks);
    saveTasks(updatedTasks);
  };
  
  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setShowForm(false);
  };
  
  const completedTasks = tasks.filter(task => task.completed);
  const incompleteTasks = tasks.filter(task => !task.completed);
  
  const togglePriorityFilter = (priority: Priority) => {
    setPriorityFilter(current => 
      current.includes(priority)
        ? current.filter(p => p !== priority)
        : [...current, priority]
    );
  };
  
  // Filter tasks based on active tab and priority filters
  const getFilteredTasks = () => {
    let filteredTasks = tasks;
    
    // Filter by tab (all, active, completed)
    if (activeTab === 'active') {
      filteredTasks = incompleteTasks;
    } else if (activeTab === 'completed') {
      filteredTasks = completedTasks;
    }
    
    // Filter by priority
    filteredTasks = filteredTasks.filter(task => priorityFilter.includes(task.priority));
    
    // Sort by creation date (newest first)
    return [...filteredTasks].sort((a, b) => b.createdAt - a.createdAt);
  };
  
  const filteredTasks = getFilteredTasks();
  
  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Task Manager</h1>
          <p className="text-muted-foreground">
            Organize your tasks and boost your productivity
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-1.5">
                <Filter className="h-4 w-4" />
                <span className="hidden sm:inline">Filter</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Filter by priority</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem
                checked={priorityFilter.includes('low')}
                onCheckedChange={() => togglePriorityFilter('low')}
              >
                Low
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={priorityFilter.includes('medium')}
                onCheckedChange={() => togglePriorityFilter('medium')}
              >
                Medium
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={priorityFilter.includes('high')}
                onCheckedChange={() => togglePriorityFilter('high')}
              >
                High
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Button onClick={() => {
            setEditingTask(undefined);
            setShowForm(true);
          }}>
            <Plus className="h-4 w-4 mr-1.5" />
            Add Task
          </Button>
        </div>
      </header>
      
      <ProgressBar 
        value={completedTasks.length} 
        total={tasks.length}
      />
      
      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3 mb-4">
          <TabsTrigger value="all">
            All ({tasks.length})
          </TabsTrigger>
          <TabsTrigger value="active">
            Active ({incompleteTasks.length})
          </TabsTrigger>
          <TabsTrigger value="completed">
            Completed ({completedTasks.length})
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="m-0">
          {showForm && !editingTask && (
            <div className="mb-6">
              <TaskForm 
                onSubmit={handleAddTask} 
                onCancel={() => setShowForm(false)} 
              />
            </div>
          )}
          
          {editingTask && (
            <div className="mb-6">
              <TaskForm 
                initialTask={editingTask} 
                onSubmit={handleUpdateTask} 
                onCancel={() => setEditingTask(undefined)} 
              />
            </div>
          )}
          
          {filteredTasks.length > 0 ? (
            <motion.div className="space-y-4">
              {filteredTasks.map(task => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onComplete={handleToggleComplete}
                  onEdit={handleEditTask}
                  onDelete={handleDeleteTask}
                />
              ))}
            </motion.div>
          ) : (
            <div className="py-12 text-center">
              <CheckCheck className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">No tasks found</h3>
              <p className="text-muted-foreground">
                {tasks.length === 0 
                  ? "You don't have any tasks yet. Create one to get started."
                  : "No tasks match your current filters."}
              </p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="active" className="m-0">
          {showForm && !editingTask && (
            <div className="mb-6">
              <TaskForm 
                onSubmit={handleAddTask} 
                onCancel={() => setShowForm(false)} 
              />
            </div>
          )}
          
          {editingTask && (
            <div className="mb-6">
              <TaskForm 
                initialTask={editingTask} 
                onSubmit={handleUpdateTask} 
                onCancel={() => setEditingTask(undefined)} 
              />
            </div>
          )}
          
          {filteredTasks.length > 0 ? (
            <motion.div className="space-y-4">
              {filteredTasks.map(task => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onComplete={handleToggleComplete}
                  onEdit={handleEditTask}
                  onDelete={handleDeleteTask}
                />
              ))}
            </motion.div>
          ) : (
            <div className="py-12 text-center">
              <CheckCheck className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">All caught up!</h3>
              <p className="text-muted-foreground">
                {incompleteTasks.length === 0 
                  ? "You've completed all your tasks. Great job!"
                  : "No active tasks match your current filters."}
              </p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="completed" className="m-0">
          {filteredTasks.length > 0 ? (
            <motion.div className="space-y-4">
              {filteredTasks.map(task => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onComplete={handleToggleComplete}
                  onEdit={handleEditTask}
                  onDelete={handleDeleteTask}
                />
              ))}
            </motion.div>
          ) : (
            <div className="py-12 text-center">
              <CheckCheck className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">No completed tasks</h3>
              <p className="text-muted-foreground">
                {completedTasks.length === 0 
                  ? "You haven't completed any tasks yet."
                  : "No completed tasks match your current filters."}
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
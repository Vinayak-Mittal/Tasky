import { Task } from './types';

const STORAGE_KEY = 'tasks';

export function getTasks(): Task[] {
  if (typeof window === 'undefined') return [];
  
  const storedTasks = localStorage.getItem(STORAGE_KEY);
  return storedTasks ? JSON.parse(storedTasks) : [];
}

export function saveTasks(tasks: Task[]): void {
  if (typeof window === 'undefined') return;
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

export function addTask(task: Task): Task[] {
  const tasks = getTasks();
  const updatedTasks = [...tasks, task];
  saveTasks(updatedTasks);
  return updatedTasks;
}

export function updateTask(updatedTask: Task): Task[] {
  const tasks = getTasks();
  const updatedTasks = tasks.map(task => 
    task.id === updatedTask.id ? updatedTask : task
  );
  saveTasks(updatedTasks);
  return updatedTasks;
}

export function deleteTask(taskId: string): Task[] {
  const tasks = getTasks();
  const updatedTasks = tasks.filter(task => task.id !== taskId);
  saveTasks(updatedTasks);
  return updatedTasks;
}

export function getCompletionRate(tasks: Task[]): number {
  if (tasks.length === 0) return 0;
  
  const completedCount = tasks.filter(task => task.completed).length;
  return Math.round((completedCount / tasks.length) * 100);
}
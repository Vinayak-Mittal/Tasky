import { TaskDashboard } from '@/components/task-dashboard';

export default function Home() {
  return (
    <main className="container max-w-4xl mx-auto pt-16 pb-8 px-4">
      <TaskDashboard />
    </main>
  );
}
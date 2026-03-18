import { useState, useEffect, useCallback } from "react";
import { Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import DashboardNavbar from "@/components/dashboard/DashboardNavbar";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import MobileBottomNav from "@/components/dashboard/MobileBottomNav";
import StatsCards from "@/components/dashboard/StatsCards";
import TaskCard from "@/components/dashboard/TaskCard";
import AddTaskModal from "@/components/dashboard/AddTaskModal";
import DailyTimeline from "@/components/dashboard/DailyTimeline";
import MiniCalendar from "@/components/dashboard/MiniCalendar";
import { Skeleton } from "@/components/ui/skeleton";

export interface TaskData {
  id: string;
  name: string;
  type: string;
  duration_min: number;
  total_days: number;
  start_date: string;
  color: string;
  created_at: string;
}

export interface TaskLogData {
  id: string;
  task_id: string;
  date: string;
  status: string;
}

export interface RoutineData {
  sleep_hours: number;
  meal_hours: number;
  gaming_hours: number;
  other_hours: number;
}

const Dashboard = () => {
  const { user } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);
  const [tasks, setTasks] = useState<TaskData[]>([]);
  const [todayLogs, setTodayLogs] = useState<TaskLogData[]>([]);
  const [routine, setRoutine] = useState<RoutineData | null>(null);
  const [loading, setLoading] = useState(true);

  const today = new Date().toISOString().split("T")[0];

  const loadData = useCallback(async () => {
    if (!user) return;
    const [tasksRes, logsRes, routineRes] = await Promise.all([
      supabase.from("tasks").select("*").eq("user_id", user.id).order("created_at", { ascending: false }),
      supabase.from("task_logs").select("*").eq("user_id", user.id).eq("date", today),
      supabase.from("routine_config").select("*").eq("user_id", user.id).single(),
    ]);
    if (tasksRes.data) setTasks(tasksRes.data as TaskData[]);
    if (logsRes.data) setTodayLogs(logsRes.data as TaskLogData[]);
    if (routineRes.data) setRoutine(routineRes.data as RoutineData);
    setLoading(false);
  }, [user, today]);

  useEffect(() => { loadData(); }, [loadData]);

  const completedCount = todayLogs.filter(l => l.status === "completed").length;
  const totalTasks = tasks.length;
  const score = totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0;

  const allocatedHours = tasks.reduce((sum, t) => sum + t.duration_min, 0) / 60;
  const usedHours = routine ? routine.sleep_hours + routine.meal_hours + routine.gaming_hours + routine.other_hours : 13;
  const freeHours = Math.max(0, 24 - usedHours - allocatedHours);

  const handleTaskCreated = () => {
    loadData();
    setModalOpen(false);
  };

  const handleLogTask = async (taskId: string, status: "completed" | "missed") => {
    if (!user) return;
    await supabase.from("task_logs").upsert({
      task_id: taskId, user_id: user.id, date: today, status,
    }, { onConflict: "task_id,date" });
    loadData();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background relative">
        <div className="fixed inset-0 dot-grid pointer-events-none" />
        <DashboardNavbar />
        <div className="flex relative z-10">
          <DashboardSidebar />
          <main className="flex-1 p-4 md:p-6 flex flex-col gap-6 max-w-5xl">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[1,2,3].map(i => <Skeleton key={i} className="h-24 rounded-2xl" />)}
            </div>
            <Skeleton className="h-14 rounded-2xl" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1,2,3,4,5,6].map(i => <Skeleton key={i} className="h-48 rounded-2xl" />)}
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative">
      <div className="fixed inset-0 dot-grid pointer-events-none" />
      <DashboardNavbar />
      <div className="flex relative z-10">
        <DashboardSidebar />
        <main className="flex-1 p-4 md:p-6 pb-24 md:pb-6 flex flex-col gap-6 max-w-5xl">
          <StatsCards score={score} completed={completedCount} total={totalTasks} freeHours={freeHours} />

          <button onClick={() => setModalOpen(true)}
            className="w-full py-4 rounded-2xl border-2 border-dashed border-primary/40 text-primary font-heading font-bold text-sm flex items-center justify-center gap-2 hover:bg-primary/5 transition-colors">
            <Plus className="w-5 h-5" /> Add New Task
          </button>

          {tasks.length === 0 ? (
            <div className="clay-card p-12 text-center">
              <p className="text-4xl mb-3">🌊</p>
              <p className="font-heading font-bold text-lg text-foreground mb-1">No tasks yet!</p>
              <p className="font-body text-sm text-muted-foreground">Add your first task to start flowing</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {tasks.map((task) => {
                const log = todayLogs.find(l => l.task_id === task.id);
                const daysSinceStart = Math.max(1, Math.floor((Date.now() - new Date(task.start_date).getTime()) / 86400000));
                const percentage = Math.min(100, Math.round((daysSinceStart / task.total_days) * 100));
                return (
                  <TaskCard
                    key={task.id}
                    id={task.id}
                    name={task.name}
                    duration={`${task.duration_min} min/day`}
                    dayProgress={`Day ${daysSinceStart} of ${task.total_days}`}
                    percentage={percentage}
                    bgColor={task.color}
                    todayStatus={log?.status}
                    onDone={() => handleLogTask(task.id, "completed")}
                    onMissed={() => handleLogTask(task.id, "missed")}
                  />
                );
              })}
            </div>
          )}

          <DailyTimeline routine={routine} allocatedHours={allocatedHours} />

          <div className="max-w-sm">
            <MiniCalendar tasks={tasks} />
          </div>
        </main>
      </div>
      <MobileBottomNav />
      <AddTaskModal open={modalOpen} onClose={() => setModalOpen(false)} onCreated={handleTaskCreated} />
    </div>
  );
};

export default Dashboard;

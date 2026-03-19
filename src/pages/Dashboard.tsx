import { useState, useEffect, useCallback } from "react";
import { Plus, Sparkles } from "lucide-react";
import { 
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from "@dnd-kit/core";
import { 
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants: any = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import DashboardNavbar from "@/components/dashboard/DashboardNavbar";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import MobileBottomNav from "@/components/dashboard/MobileBottomNav";
import StatsCards from "@/components/dashboard/StatsCards";
import TaskCard from "@/components/dashboard/TaskCard";
import AddTaskModal from "@/components/dashboard/AddTaskModal";
import UpgradeModal from "@/components/UpgradeModal";
import AIPlannerModal from "@/components/dashboard/AIPlannerModal";
import DailyTimeline from "@/components/dashboard/DailyTimeline";
import MiniCalendar from "@/components/dashboard/MiniCalendar";
import MoodCheckIn from "../components/dashboard/MoodCheckIn";
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
  sort_order: number;
  reminder_time?: string | null;
  frequency_type?: string | null;
  frequency_config?: any;
  category?: string | null;
}

export interface UserProfile {
  id: string;
  plan?: string | null;
  full_name?: string | null;
  email?: string | null;
  avatar_url?: string | null;
  total_xp?: number | null;
  level?: number | null;
  vacation_start?: string | null;
  vacation_end?: string | null;
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

const CATEGORIES = [
  { label: "All", emoji: "🏠", color: "#7C3AED" },
  { label: "Health & Fitness", emoji: "💪", color: "#22C55E" },
  { label: "Learning", emoji: "📚", color: "#3B82F6" },
  { label: "Work", emoji: "💼", color: "#F97316" },
  { label: "Mindfulness", emoji: "🧘", color: "#9333EA" },
  { label: "Creative", emoji: "🎨", color: "#EC4899" },
  { label: "Personal Growth", emoji: "🌱", color: "#10B981" },
  { label: "Entertainment", emoji: "🎮", color: "#EAB308" },
  { label: "Other", emoji: "⚙️", color: "#6B7280" },
];

const CATEGORY_COLORS: Record<string, string> = {};
CATEGORIES.forEach(c => { CATEGORY_COLORS[c.label] = c.color; });

// Helper: is today a scheduled day for this task?
function isScheduledToday(task: TaskData): boolean {
  const ft = task.frequency_type || "daily";
  if (ft === "daily") return true;
  if (ft === "specific") {
    const days = task.frequency_config?.days || [];
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const todayName = dayNames[new Date().getDay()];
    return days.includes(todayName);
  }
  // For weekly: always show but track separately
  return true;
}

const Dashboard = () => {
  const { user, userProfile, refreshProfile } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);
  const [aiPlannerOpen, setAiPlannerOpen] = useState(false);
  const [tasks, setTasks] = useState<TaskData[]>([]);
  const [taskToEdit, setTaskToEdit] = useState<TaskData | null>(null);
  const [todayLogs, setTodayLogs] = useState<TaskLogData[]>([]);
  const [routine, setRoutine] = useState<RoutineData | null>(null);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState("All");

  const today = new Date().toISOString().split("T")[0];

  // Vacation mode
  const isOnVacation =
    userProfile?.vacation_start &&
    userProfile?.vacation_end &&
    today >= userProfile.vacation_start &&
    today <= userProfile.vacation_end;

  const loadData = useCallback(async () => {
    if (!user) return;
    const [tasksRes, logsRes, routineRes] = await Promise.all([
      supabase.from("tasks").select("*").eq("user_id", user.id).order("sort_order", { ascending: true }).order("created_at", { ascending: false }),
      supabase.from("task_logs").select("*").eq("user_id", user.id).eq("date", today),
      supabase.from("routine_config").select("*").eq("user_id", user.id).single(),
    ]);

    if (tasksRes.data) {
      setTasks(tasksRes.data as unknown as TaskData[]);
    }
    if (logsRes.data) setTodayLogs(logsRes.data as TaskLogData[]);
    if (routineRes.data) setRoutine(routineRes.data as RoutineData);
    setLoading(false);
  }, [user, today]);

  useEffect(() => { loadData(); }, [loadData]);

  // XP helper
  const addXP = async (amount: number) => {
    if (!user || !userProfile) return;
    const currentXP = (userProfile.total_xp || 0) + amount;
    // Calculate level: L1=0-99, L2=100-249, L3=250-499, ...
    let level = 1;
    let threshold = 100;
    let xpCheck = currentXP;
    while (xpCheck >= threshold) {
      xpCheck -= threshold;
      level++;
      threshold = Math.floor(threshold * 1.5);
    }
    await supabase.from("profiles").update({ total_xp: currentXP, level }).eq("id", user.id);
    await refreshProfile();
    // Show floating XP animation
    showXPAnimation(amount);
  };

  const [xpAnim, setXpAnim] = useState<{ amount: number; id: number } | null>(null);
  const showXPAnimation = (amount: number) => {
    const id = Date.now();
    setXpAnim({ amount, id });
    setTimeout(() => setXpAnim(null), 1500);
  };

  const scheduledTasks = tasks.filter(t => isScheduledToday(t));
  const completedScheduledCount = todayLogs.filter(l => l.status === "completed" && scheduledTasks.some(t => t.id === l.task_id)).length;
  // Use today's logs specifically against today's scheduled tasks
  const score = scheduledTasks.length > 0 ? Math.round((completedScheduledCount / scheduledTasks.length) * 100) : 0;

  const allocatedHours = scheduledTasks.reduce((sum, t) => sum + t.duration_min, 0) / 60;
  const usedHours = routine ? routine.sleep_hours + routine.meal_hours + routine.gaming_hours + routine.other_hours : 13;
  const freeHours = Math.max(0, 24 - usedHours - allocatedHours);

  const handleTaskCreated = () => {
    loadData();
    setModalOpen(false);
    addXP(10); // XP for creating/modifying task
  };

  const handleAddNewTaskClick = () => {
    if (userProfile?.plan !== "pro" && tasks.length >= 5) {
      setUpgradeModalOpen(true);
    } else {
      setModalOpen(true);
    }
  };

  const handleLogTask = async (taskId: string, status: "completed" | "missed") => {
    if (!user) return;
    await supabase.from("task_logs").upsert({
      task_id: taskId, user_id: user.id, date: today, status,
    }, { onConflict: "task_id,date" });
    if (status === "completed") {
      await addXP(10);
      
      // Check for 7-day streak bonus
      // We'll calculate the new streak based on today's logs + historical
      const { data: pastLogs } = await supabase.from("task_logs").select("date").eq("user_id", user.id).eq("status", "completed");
      if (pastLogs) {
        const uniqueDates = [...new Set(pastLogs.map((l: any) => l.date))].sort().reverse();
        let streak = 0;
        const todayAtNoon = new Date();
        todayAtNoon.setHours(12, 0, 0, 0);
        for (let i = 0; i < 30; i++) {
          const expected = new Date(todayAtNoon);
          expected.setDate(expected.getDate() - i);
          const expectedStr = expected.toISOString().split("T")[0];
          if (uniqueDates.includes(expectedStr)) streak++;
          else if (i === 0) continue;
          else break;
        }
        if (streak === 7) {
          await addXP(50);
          toast({ title: "🔥 7-Day Streak! +50 XP Bonus!" });
        }
      }

      // Check if all tasks completed today for bonus
      const scheduledTasks = tasks.filter(t => isScheduledToday(t));
      const scheduledTaskIds = scheduledTasks.map(t => t.id);
      const newCompletedCount = todayLogs.filter(l => l.status === "completed" && scheduledTaskIds.includes(l.task_id)).length + 1;
      
      if (newCompletedCount >= scheduledTasks.length && scheduledTasks.length > 0) {
        await addXP(25);
        toast({ title: "🎉 All tasks completed! +25 XP bonus!" });
      }
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!user) return;
    const { error } = await supabase.from("tasks").delete().eq("id", taskId);
    if (error) {
      toast({ title: "Error deleting task", description: error.message, variant: "destructive" });
    } else {
      setTasks(prev => prev.filter(t => t.id !== taskId));
      toast({ title: "Task deleted", description: "Your task has been permanently removed." });
    }
  };

  const handleEditTask = (task: TaskData) => {
    setTaskToEdit(task);
    setModalOpen(true);
  };

  const handleTaskModalClose = () => {
    setModalOpen(false);
    setTaskToEdit(null);
  };

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = tasks.findIndex((t) => t.id === active.id);
      const newIndex = tasks.findIndex((t) => t.id === over.id);

      const newTasks = arrayMove(tasks, oldIndex, newIndex);
      setTasks(newTasks);

      try {
        const updates = newTasks.map((t, index) => ({
          id: t.id,
          user_id: user!.id,
          name: t.name,
          duration_min: t.duration_min,
          total_days: t.total_days,
          start_date: t.start_date,
          color: t.color,
          sort_order: index,
        }));
        await supabase.from("tasks").upsert(updates);
      } catch (err) {
        console.error("Failed to save new order:", err);
      }
    }
  };

  // Filter tasks by category
  const filteredTasks = categoryFilter === "All" ? tasks : tasks.filter(t => (t.category || "Other") === categoryFilter);

  if (loading) {
    return (
      <div className="min-h-screen bg-background relative">
        <div className="fixed inset-0 dot-grid pointer-events-none" />
        <DashboardNavbar />
        <div className="flex relative z-10">
          <DashboardSidebar />
          <main className="flex-1 p-4 md:p-6 flex flex-col gap-6">
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
      {/* Dot grid */}
      <div className="fixed inset-0 dot-grid pointer-events-none" />
      {/* Floating blobs */}
      <div className="blob-bg">
        <div className="blob blob-1" />
        <div className="blob blob-2" />
        <div className="blob blob-3" />
      </div>
      <DashboardNavbar />
      <div className="flex relative z-10">
        <DashboardSidebar />
        <main className="flex-1 p-4 md:p-6 pb-24 md:pb-6 flex flex-col gap-6">
          {/* Vacation Banner */}
          {isOnVacation && (
            <div className="clay-card-sm px-5 py-3 flex items-center gap-3" style={{ background: "linear-gradient(135deg, #FEF9C3 0%, #FFEDD5 100%)" }}>
              <span className="text-2xl">🏖️</span>
              <div>
                <p className="font-heading font-bold text-sm text-amber-800">Vacation Mode Active</p>
                <p className="text-xs font-body text-amber-600">Streaks are protected until {userProfile?.vacation_end}</p>
              </div>
            </div>
          )}

          <StatsCards score={score} completed={completedScheduledCount} total={scheduledTasks.length} freeHours={freeHours} />

          {/* Category Filter Bar */}
          <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-none">
            {CATEGORIES.map(cat => (
              <button
                key={cat.label}
                onClick={() => setCategoryFilter(cat.label)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-heading font-bold whitespace-nowrap transition-all shrink-0 ${
                  categoryFilter === cat.label
                    ? "text-white shadow-md scale-105"
                    : "bg-white/70 dark:bg-muted/40 text-foreground hover:scale-102"
                }`}
                style={categoryFilter === cat.label ? { backgroundColor: cat.color } : {}}
              >
                <span>{cat.emoji}</span> {cat.label}
              </button>
            ))}
          </div>

          <div className="flex gap-4">
            <button
              onClick={handleAddNewTaskClick}
              className="group flex-1 py-4 rounded-2xl border-2 border-dashed border-violet-400 text-violet-600 dark:text-violet-300 font-heading font-bold text-sm flex items-center justify-center gap-2 transition-all duration-200 hover:bg-gradient-to-r hover:from-violet-50 hover:to-purple-50 dark:hover:from-violet-900/20 dark:hover:to-purple-900/20 hover:border-violet-500 hover:scale-[1.01] hover:shadow-md"
            >
              <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-200" /> Add New Task
            </button>
            <button
              onClick={() => setAiPlannerOpen(true)}
              className="group flex-1 py-4 rounded-2xl text-white font-heading font-bold text-sm flex items-center justify-center gap-2 transition-all duration-200 shadow-[0_8px_20px_-4px_rgba(124,58,237,0.4)] hover:scale-[1.01]"
              style={{ background: "linear-gradient(135deg, #7C3AED 0%, #9333EA 100%)" }}
            >
              <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform duration-200" /> AI Planner
            </button>
          </div>

          {filteredTasks.length === 0 ? (
            <div className="clay-card p-12 text-center">
              <p className="text-4xl mb-3">🌊</p>
              <p className="font-heading font-bold text-lg text-foreground mb-1">
                {categoryFilter !== "All" ? `No ${categoryFilter} tasks` : "No tasks yet!"}
              </p>
              <p className="font-body text-sm text-muted-foreground">
                {categoryFilter !== "All" ? "Try selecting a different category" : "Add your first task to start flowing"}
              </p>
            </div>
          ) : (
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={filteredTasks.map(t => t.id)} strategy={rectSortingStrategy}>
                <motion.div variants={containerVariants} initial="hidden" animate="show" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredTasks.map((task, index) => {
                    const log = todayLogs.find(l => l.task_id === task.id);
                    const daysSinceStart = Math.max(1, Math.floor((Date.now() - new Date(task.start_date).getTime()) / 86400000));
                    const percentage = Math.min(100, Math.round((daysSinceStart / task.total_days) * 100));
                    const scheduled = isScheduledToday(task);
                    return (
                      <motion.div key={task.id} variants={itemVariants} layoutId={`task-${task.id}`}>
                        <TaskCard
                          id={task.id}
                          name={task.name}
                          duration={`${task.duration_min} min/day`}
                          dayProgress={`Day ${daysSinceStart} of ${task.total_days}`}
                          percentage={percentage}
                          bgColor={task.color}
                          index={index}
                          todayStatus={log?.status}
                          onDone={() => handleLogTask(task.id, "completed")}
                          onMissed={() => handleLogTask(task.id, "missed")}
                          onEdit={() => handleEditTask(task)}
                          onDelete={() => handleDeleteTask(task.id)}
                          category={task.category || "Other"}
                          categoryColor={CATEGORY_COLORS[task.category || "Other"] || "#6B7280"}
                          isVacation={!!isOnVacation}
                          isScheduledToday={scheduled}
                        />
                      </motion.div>
                    );
                  })}
                </motion.div>
              </SortableContext>
            </DndContext>
          )}

          <DailyTimeline routine={routine} allocatedHours={allocatedHours} />

          <div className="max-w-[400px]">
            <MiniCalendar tasks={tasks} />
          </div>
        </main>
      </div>
      <MobileBottomNav />
      <AddTaskModal 
        open={modalOpen} 
        onClose={handleTaskModalClose} 
        onCreated={handleTaskCreated} 
        editTask={taskToEdit}
      />
      <UpgradeModal open={upgradeModalOpen} onClose={() => setUpgradeModalOpen(false)} message="You've reached the free plan limit of 5 tasks." />
      <AIPlannerModal open={aiPlannerOpen} onClose={() => setAiPlannerOpen(false)} tasks={tasks} routine={routine} />

      {/* Mood Check-In Widget */}
      <MoodCheckIn />

      {/* Floating XP Animation */}
      {xpAnim && (
        <div key={xpAnim.id} className="fixed bottom-20 right-8 z-[100] animate-float-up pointer-events-none">
          <span className="text-lg font-heading font-black text-violet-500 drop-shadow-lg">
            +{xpAnim.amount} XP ⚡
          </span>
        </div>
      )}
    </div>
  );
};

export default Dashboard;

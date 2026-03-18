import { useState, useEffect } from "react";
import { ArrowLeft, TrendingUp, TrendingDown, Flame, Clock, CheckCircle } from "lucide-react";
import { NavLink } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import DashboardNavbar from "@/components/dashboard/DashboardNavbar";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import MobileBottomNav from "@/components/dashboard/MobileBottomNav";
import { Skeleton } from "@/components/ui/skeleton";

const Progress = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [heatmapData, setHeatmapData] = useState<number[][]>([]);
  const [scoreData, setScoreData] = useState<{ date: string; score: number }[]>([]);
  const [weeklyCompleted, setWeeklyCompleted] = useState(0);
  const [weeklyFocusHours, setWeeklyFocusHours] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestDay, setBestDay] = useState({ day: "—", score: 0 });
  const [worstTask, setWorstTask] = useState({ name: "—", pct: 0 });

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      const today = new Date();
      const thirtyDaysAgo = new Date(today);
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const [logsRes, tasksRes] = await Promise.all([
        supabase.from("task_logs").select("*").eq("user_id", user.id).gte("date", thirtyDaysAgo.toISOString().split("T")[0]).order("date"),
        supabase.from("tasks").select("*").eq("user_id", user.id),
      ]);

      const logs = (logsRes.data || []) as any[];
      const tasks = (tasksRes.data || []) as any[];
      const totalTasks = tasks.length || 1;

      // Heatmap (last 14 days, 2 rows of 7)
      const heatmap: number[][] = [[], []];
      for (let i = 13; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(d.getDate() - i);
        const ds = d.toISOString().split("T")[0];
        const count = logs.filter((l: any) => l.date === ds && l.status === "completed").length;
        if (i >= 7) heatmap[0].push(count);
        else heatmap[1].push(count);
      }
      setHeatmapData(heatmap);

      // Score data (last 14 days)
      const scores: { date: string; score: number }[] = [];
      for (let i = 13; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(d.getDate() - i);
        const ds = d.toISOString().split("T")[0];
        const completed = logs.filter((l: any) => l.date === ds && l.status === "completed").length;
        scores.push({ date: ds, score: Math.round((completed / totalTasks) * 100) });
      }
      setScoreData(scores);

      // Best day
      if (scores.length > 0) {
        const best = scores.reduce((a, b) => b.score > a.score ? b : a);
        const dayName = new Date(best.date).toLocaleDateString("en-US", { weekday: "long" });
        setBestDay({ day: dayName, score: best.score });
      }

      // Weekly stats
      const sevenDaysAgo = new Date(today);
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      const weekLogs = logs.filter((l: any) => new Date(l.date) >= sevenDaysAgo && l.status === "completed");
      setWeeklyCompleted(weekLogs.length);
      const focusMins = weekLogs.reduce((s: number, l: any) => {
        const t = tasks.find((t: any) => t.id === l.task_id);
        return s + (t?.duration_min || 0);
      }, 0);
      setWeeklyFocusHours(Math.round(focusMins / 60 * 10) / 10);

      // Worst task (lowest completion rate)
      if (tasks.length > 0) {
        const taskRates = tasks.map((t: any) => {
          const completed = logs.filter((l: any) => l.task_id === t.id && l.status === "completed").length;
          const total = Math.max(1, Math.floor((Date.now() - new Date(t.start_date).getTime()) / 86400000));
          return { name: t.name, pct: Math.round((completed / total) * 100) };
        });
        const worst = taskRates.reduce((a, b) => b.pct < a.pct ? b : a);
        setWorstTask(worst);
      }

      // Streak
      const uniqueDates = [...new Set(logs.filter((l: any) => l.status === "completed").map((l: any) => l.date))].sort().reverse();
      let count = 0;
      for (let i = 0; i < uniqueDates.length; i++) {
        const expected = new Date(today);
        expected.setDate(expected.getDate() - i);
        if (uniqueDates[i] === expected.toISOString().split("T")[0]) count++;
        else break;
      }
      setStreak(count);

      setLoading(false);
    };
    load();
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background relative">
        <div className="fixed inset-0 dot-grid pointer-events-none" />
        <DashboardNavbar />
        <div className="flex relative z-10">
          <DashboardSidebar />
          <main className="flex-1 p-6 flex flex-col gap-6 max-w-5xl">
            {[1,2,3,4].map(i => <Skeleton key={i} className="h-32 rounded-2xl" />)}
          </main>
        </div>
      </div>
    );
  }

  const maxScore = Math.max(...scoreData.map(s => s.score), 1);

  return (
    <div className="min-h-screen bg-background relative">
      <div className="fixed inset-0 dot-grid pointer-events-none" />
      <DashboardNavbar />
      <div className="flex relative z-10">
        <DashboardSidebar />
        <main className="flex-1 p-4 md:p-6 pb-24 md:pb-6 flex flex-col gap-6 max-w-5xl">
          <div className="flex items-center gap-3">
            <NavLink to="/dashboard" className="p-2 rounded-xl hover:bg-muted/50">
              <ArrowLeft className="w-5 h-5 text-muted-foreground" />
            </NavLink>
            <h1 className="font-heading font-bold text-2xl text-foreground">Progress</h1>
          </div>

          {/* Weekly Heatmap */}
          <div className="clay-card p-5 flex flex-col gap-3">
            <h3 className="font-heading font-bold text-sm">Activity Heatmap (14 days)</h3>
            <div className="flex flex-col gap-1">
              {heatmapData.map((week, wi) => (
                <div key={wi} className="flex gap-1">
                  {week.map((val, di) => (
                    <div key={di} className="w-10 h-10 rounded-xl flex items-center justify-center text-[10px] font-bold text-white"
                      style={{ backgroundColor: `hsl(255, 92%, ${Math.max(30, 90 - val * 10)}%)` }}>
                      {val}
                    </div>
                  ))}
                </div>
              ))}
              <div className="flex gap-1 mt-1">
                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
                  <span key={d} className="w-10 text-center text-[9px] text-muted-foreground font-body">{d}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Score Chart */}
          <div className="clay-card p-5 flex flex-col gap-3">
            <h3 className="font-heading font-bold text-sm">Daily Life Score (14 days)</h3>
            <div className="flex items-end gap-1 h-32">
              {scoreData.map((item, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-[8px] text-muted-foreground">{item.score}</span>
                  <div className="w-full rounded-t-lg transition-all"
                    style={{ height: `${(item.score / maxScore) * 100}%`, backgroundColor: `hsl(255, 92%, ${80 - (item.score / maxScore) * 20}%)` }} />
                </div>
              ))}
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="clay-card p-5 flex items-center gap-4" style={{ backgroundColor: "#E8FDF5" }}>
              <TrendingUp className="w-8 h-8 text-emerald-500" />
              <div>
                <p className="font-heading font-bold text-sm">Best Day This Week</p>
                <p className="text-2xl font-heading font-extrabold text-emerald-500">{bestDay.day} — {bestDay.score}</p>
              </div>
            </div>
            <div className="clay-card p-5 flex items-center gap-4" style={{ backgroundColor: "#FFF0E6" }}>
              <TrendingDown className="w-8 h-8 text-orange-500" />
              <div>
                <p className="font-heading font-bold text-sm">Needs Improvement</p>
                <p className="text-lg font-heading font-bold text-orange-500">{worstTask.name} — {worstTask.pct}%</p>
              </div>
            </div>
          </div>

          {/* Weekly Summary */}
          <div className="clay-card p-5">
            <h3 className="font-heading font-bold text-sm mb-4">Weekly Summary</h3>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <CheckCircle className="w-6 h-6 text-emerald-500 mx-auto mb-1" />
                <p className="font-heading font-extrabold text-2xl text-foreground">{weeklyCompleted}</p>
                <p className="text-xs font-body text-muted-foreground">Tasks Completed</p>
              </div>
              <div>
                <Clock className="w-6 h-6 text-primary mx-auto mb-1" />
                <p className="font-heading font-extrabold text-2xl text-foreground">{weeklyFocusHours}h</p>
                <p className="text-xs font-body text-muted-foreground">Focus Time</p>
              </div>
              <div>
                <Flame className="w-6 h-6 text-orange-500 mx-auto mb-1" />
                <p className="font-heading font-extrabold text-2xl text-foreground">{streak}</p>
                <p className="text-xs font-body text-muted-foreground">Day Streak</p>
              </div>
            </div>
          </div>
        </main>
      </div>
      <MobileBottomNav />
    </div>
  );
};

export default Progress;

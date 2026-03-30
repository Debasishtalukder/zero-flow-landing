import { useState, useEffect } from "react";
import { ArrowLeft, TrendingUp, Calendar, Award, BarChart3, Clock, Flame, Brain, Target, Star, Shield, Zap, Sparkles } from "lucide-react";
import { NavLink } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";
import DashboardNavbar from "@/components/dashboard/DashboardNavbar";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import MobileBottomNav from "@/components/dashboard/MobileBottomNav";
import { Skeleton } from "@/components/ui/skeleton";

const BADGES = [
  { id: "first", name: "First Task ✅", icon: Target, color: "text-emerald-500", bg: "bg-emerald-100", desc: "Complete your first task", rule: (s: number, xp: number, j: number, t: number) => t >= 1 },
  { id: "streak7", name: "7-Day Streak 🔥", icon: Flame, color: "text-orange-500", bg: "bg-orange-100", desc: "Keep a 7-day task streak", rule: (s: number) => s >= 7 },
  { id: "streak30", name: "30-Day Streak 🔥", icon: Flame, color: "text-red-500", bg: "bg-red-100", desc: "Maintain a 30-day task streak", rule: (s: number) => s >= 30 },
  { id: "roadmap", name: "Roadmap Creator 🗺️", icon: Award, color: "text-blue-500", bg: "bg-blue-100", desc: "Create your first roadmap", rule: (s: number, xp: number, j: number, t: number, r: number) => r >= 1 },
  { id: "perfect", name: "Perfect Week 🏆", icon: Shield, color: "text-yellow-500", bg: "bg-yellow-100", desc: "7 days of 100% completion", rule: (s: number) => s >= 7 },
  { id: "level5", name: "Level 5 ⚡", icon: Zap, color: "text-violet-500", bg: "bg-violet-100", desc: "Reach Level 5", rule: (_s: number, xp: number) => xp >= 1100 },
];

const Progress = () => {
  const { user, userProfile } = useAuth();
  const { isPro: isSubscriptionPro, showPaywall } = useSubscription();
  const [loading, setLoading] = useState(true);
  const [moodData, setMoodData] = useState<any[]>([]);
  const [stats, setStats] = useState({
    tasksDone: 0,
    journalCount: 0,
    streak: 0,
    bestMood: 0,
    roadmapCount: 0,
    heatmap: {} as Record<string, number>,
  });

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      const [moodsRes, logsRes, journalRes, roadmapRes] = await Promise.all([
        supabase.from("mood_logs").select("date, mood_score").eq("user_id", user.id).order("date", { ascending: true }).limit(14),
        supabase.from("task_logs").select("date").eq("user_id", user.id).eq("status", "completed"),
        supabase.from("journal_entries").select("date", { count: 'exact', head: true }).eq("user_id", user.id),
        supabase.from("roadmaps").select("id", { count: 'exact', head: true }).eq("user_id", user.id),
      ]);

      if (moodsRes.data) {
        setMoodData(moodsRes.data.map(m => ({
          date: new Date(m.date + "T12:00:00").toLocaleDateString("en-US", { weekday: "short" }),
          score: m.mood_score,
        })));
        const highMood = Math.max(...(moodsRes.data.map(m => m.mood_score) || [0]));
        setStats(prev => ({ ...prev, bestMood: highMood }));
      }

      setStats(prev => ({
        ...prev,
        tasksDone: logsRes.data?.length || 0,
        journalCount: journalRes.count || 0,
        roadmapCount: roadmapRes.count || 0,
      }));

      if (logsRes.data) {
        const heatmapData = logsRes.data.reduce((acc: any, l: any) => {
          acc[l.date] = (acc[l.date] || 0) + 1;
          return acc;
        }, {});
        
        const uniqueDates = Object.keys(heatmapData).sort().reverse();
        let count = 0;
        let d = new Date();
        let expectedStr = d.toISOString().split("T")[0];
        
        if (!uniqueDates.includes(expectedStr)) {
          d.setDate(d.getDate() - 1);
          expectedStr = d.toISOString().split("T")[0];
        }
        
        if (uniqueDates.includes(expectedStr)) {
          for (let i = 0;; i++) {
            const checkD = new Date(d);
            checkD.setDate(checkD.getDate() - i);
            if (uniqueDates.includes(checkD.toISOString().split("T")[0])) count++;
            else break;
          }
        }
        
        setStats(prev => ({ ...prev, streak: count, heatmap: heatmapData }));
      }

      setLoading(false);
    };
    load();
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background relative">
        <DashboardNavbar />
        <div className="flex relative z-10">
          <DashboardSidebar />
          <main className="flex-1 p-6 flex flex-col gap-6">
            <Skeleton className="h-40 rounded-2xl" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Skeleton className="h-64 rounded-2xl" />
              <Skeleton className="h-64 rounded-2xl" />
            </div>
          </main>
        </div>
      </div>
    );
  }

  const xp = userProfile?.total_xp || 0;
  const isPro = userProfile?.plan === "pro" || isSubscriptionPro;

  return (
    <div className="min-h-screen bg-background relative">
      <div className="fixed inset-0 dot-grid pointer-events-none" />
      <DashboardNavbar />
      <div className="flex relative z-10">
        <DashboardSidebar />
        <main className="flex-1 p-4 md:p-6 pb-24 md:pb-6 flex flex-col gap-6">
          <div className="flex items-center gap-3">
            <NavLink to="/dashboard" className="p-2 rounded-xl hover:bg-muted/50">
              <ArrowLeft className="w-5 h-5 text-muted-foreground" />
            </NavLink>
            <h1 className="font-heading font-bold text-2xl text-foreground">📈 Progress</h1>
          </div>

          {/* Top Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "Tasks Done", value: stats.tasksDone, icon: Target, color: "text-emerald-500" },
              { label: "Best Streak", value: `${stats.streak}d`, icon: Flame, color: "text-orange-500" },
              { label: "Journal Entries", value: stats.journalCount, icon: Brain, color: "text-violet-500" },
              { label: "Avg Mood", value: stats.bestMood || "-", icon: Star, color: "text-yellow-500" },
            ].map(stat => (
              <div key={stat.label} className="clay-card p-4 flex flex-col gap-1">
                <stat.icon className={`w-4 h-4 ${stat.color} mb-1`} />
                <p className="text-2xl font-heading font-black text-foreground">{stat.value}</p>
                <p className="text-[10px] font-body text-muted-foreground uppercase tracking-wider">{stat.label}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Mood Trends Chart */}
            <div className="clay-card p-6 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h2 className="font-heading font-bold text-lg text-foreground">Mood Trends</h2>
                <TrendingUp className="w-4 h-4 text-muted-foreground" />
              </div>
              <div className="h-64 w-full relative">
                {!isPro && (
                  <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-background/40 backdrop-blur-md rounded-2xl border-2 border-dashed border-violet-500/20">
                    <Sparkles className="w-8 h-8 text-violet-500 mb-2 animate-bounce" />
                    <p className="text-sm font-heading font-bold text-foreground">Mood Trends (Pro Only)</p>
                    <p className="text-[10px] text-muted-foreground mb-4 text-center px-6">Upgrade to visualize your mental wellbeing patterns</p>
                    <button 
                      onClick={showPaywall}
                      className="px-5 py-2 bg-violet-600 text-white rounded-xl text-xs font-bold shadow-lg shadow-violet-200"
                    >
                      Unlock Now
                    </button>
                  </div>
                )}
                <div className={!isPro ? "blur-sm pointer-events-none h-full" : "h-full"}>
                  {moodData.length > 1 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={moodData}>
                        <defs>
                          <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#7C3AED" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                        <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontFamily: 'inter' }} />
                        <YAxis hide domain={[0, 5]} />
                        <Tooltip 
                          contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}
                          itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                        />
                        <Area type="monotone" dataKey="score" stroke="#7C3AED" strokeWidth={3} fillOpacity={1} fill="url(#colorScore)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-center gap-2">
                      <Brain className="w-10 h-10 text-muted-foreground/20" />
                      <p className="text-sm font-body text-muted-foreground">Log your mood for a few days to see trends!</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Badges Hub */}
            <div className="clay-card p-6 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h2 className="font-heading font-bold text-lg text-foreground">Badges Hub</h2>
                <Award className="w-4 h-4 text-muted-foreground" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                {BADGES.map(badge => {
                  const unlocked = badge.rule(stats.streak, xp, stats.journalCount, stats.tasksDone, stats.roadmapCount);
                  return (
                    <div key={badge.id} className={`p-4 rounded-3xl flex items-center gap-3 transition-all ${unlocked ? "bg-white dark:bg-muted/40 shadow-sm opacity-100" : "opacity-40 grayscale"}`}>
                      <div className={`p-2 rounded-2xl ${badge.bg}`}>
                        <badge.icon className={`w-5 h-5 ${badge.color}`} />
                      </div>
                      <div>
                        <p className="text-xs font-heading font-bold text-foreground">{badge.name}</p>
                        <p className="text-[9px] font-body text-muted-foreground line-clamp-1">{badge.desc}</p>
                      </div>
                      {unlocked && <Sparkles className="w-3 h-3 text-yellow-400 absolute top-2 right-2 animate-pulse" />}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Activity Insights */}
          <div className="clay-card p-6 flex flex-col gap-4">
            <h2 className="font-heading font-bold text-lg text-foreground">Weekly Overview</h2>
            <div className="flex gap-2">
              {Array.from({length: 7}).map((_, i) => {
                const d = new Date();
                d.setDate(d.getDate() - (6 - i));
                const dateStr = d.toISOString().split("T")[0];
                const dayName = d.toLocaleDateString("en-US", { weekday: "short" });
                const count = stats.heatmap[dateStr] || 0;
                return (
                <div key={i} className="flex-1 flex flex-col gap-2 items-center">
                  <div className={`w-full aspect-square rounded-lg ${count > 0 ? 'bg-violet-500/80 shadow-md shadow-violet-200' : 'bg-muted/30'}`} title={`${count} tasks`} />
                  <span className="text-[9px] font-heading font-bold text-muted-foreground">{dayName}</span>
                </div>
                );
              })}
            </div>
            <p className="text-xs font-body text-muted-foreground flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-violet-500" /> You're more productive on Tuesdays! Keep it up.
            </p>
          </div>
        </main>
      </div>
      <MobileBottomNav />
    </div>
  );
};

export default Progress;

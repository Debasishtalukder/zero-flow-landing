import { Home, Calendar, Map, BarChart3, Settings, Flame, ChevronRight, PenLine } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { Sparkles } from "lucide-react";

const navItems = [
  { icon: Home, label: "Dashboard", href: "/dashboard" },
  { icon: Calendar, label: "Calendar", href: "/dashboard" },
  { icon: Map, label: "Roadmap", href: "/roadmap" },
  { icon: BarChart3, label: "Progress", href: "/progress" },
  { icon: PenLine, label: "Journal", href: "/journal" },
  { icon: Settings, label: "Settings", href: "/settings" },
];

// XP level thresholds
function getLevelInfo(totalXP: number) {
  let level = 1;
  let threshold = 100;
  let xpInLevel = totalXP;
  while (xpInLevel >= threshold) {
    xpInLevel -= threshold;
    level++;
    threshold = Math.floor(threshold * 1.5);
  }
  return { level, xpInLevel, nextThreshold: threshold, percentage: Math.round((xpInLevel / threshold) * 100) };
}

const DashboardSidebar = () => {
  const { user, userProfile } = useAuth();
  const { isPro: isSubscriptionPro } = useSubscription();
  const [streak, setStreak] = useState(0);
  const [freeHours, setFreeHours] = useState(0);
  const [firstRoadmap, setFirstRoadmap] = useState<{ title: string; progress_percent: number } | null>(null);

  const displayName = userProfile?.full_name || user?.email?.split("@")[0] || "User";
  const avatarUrl = userProfile?.avatar_url;
  const totalXP = userProfile?.total_xp || 0;
  const levelInfo = getLevelInfo(totalXP);

  useEffect(() => {
    if (!user) return;
    const load = async () => {

      const [routineRes, tasksRes, roadmapsRes] = await Promise.all([
        supabase.from("routine_config").select("*").eq("user_id", user.id).single(),
        supabase.from("tasks").select("duration_min").eq("user_id", user.id),
        supabase.from("roadmaps").select("title, progress_percent").eq("user_id", user.id).order("created_at", { ascending: false }).limit(1),
      ]);
      const r = routineRes.data as any;
      const allocated = (tasksRes.data || []).reduce((s: number, t: any) => s + (t.duration_min || 0), 0) / 60;
      const used = r ? Number(r.sleep_hours) + Number(r.meal_hours) + Number(r.gaming_hours) + Number(r.other_hours) : 13;
      setFreeHours(Math.max(0, 24 - used - allocated));
      if (roadmapsRes.data && roadmapsRes.data.length > 0) setFirstRoadmap(roadmapsRes.data[0] as any);

      const { data: logs } = await supabase.from("task_logs").select("date, status").eq("user_id", user.id).eq("status", "completed").order("date", { ascending: false });
      if (logs && logs.length > 0) {
        const uniqueDates = [...new Set(logs.map((l: any) => l.date))].sort().reverse();
        let count = 0;
        const todayAtNoon = new Date();
        todayAtNoon.setHours(12, 0, 0, 0);

        const vStart = userProfile?.vacation_start ? new Date(userProfile.vacation_start + "T12:00:00") : null;
        const vEnd = userProfile?.vacation_end ? new Date(userProfile.vacation_end + "T12:00:00") : null;

        let logIdx = 0;
        for (let i = 0; i < 365; i++) { // Check up to a year back
          const expected = new Date(todayAtNoon);
          expected.setDate(expected.getDate() - i);
          const expectedStr = expected.toISOString().split("T")[0];

          // If this day is a vacation day, skip it
          if (vStart && vEnd && expected >= vStart && expected <= vEnd) {
            continue;
          }

          if (uniqueDates[logIdx] === expectedStr) {
            count++;
            logIdx++;
          } else {
            // If they haven't completed a task today yet, don't break the streak if they haven't missed it
            if (i === 0) continue; 
            break;
          }
        }
        setStreak(count);
      }
    };
    load();
  }, [user]);

  const freePercent = Math.min(100, (freeHours / 24) * 100);
  const circumference = 2 * Math.PI * 30;
  const offset = circumference - (freePercent / 100) * circumference;

  const rmCirc = 2 * Math.PI * 18;
  const rmOffset = firstRoadmap ? rmCirc - (firstRoadmap.progress_percent / 100) * rmCirc : rmCirc;

  return (
    <aside
      className="hidden md:flex w-[220px] sticky top-[57px] h-[calc(100vh-57px)] flex-col p-4 gap-4 sidebar-gradient overflow-y-auto scrollbar-none"
    >
      {/* Profile + Nav */}
      <div className="clay-card-sm p-4 flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-white font-heading font-bold text-xs ring-2 ring-violet-200/50 overflow-hidden bg-muted"
            style={{
              background: avatarUrl ? "white" : "linear-gradient(135deg, #7C3AED 0%, #34C789 100%)",
              boxShadow: "0 3px 10px rgba(124,58,237,0.35)",
            }}
          >
            {avatarUrl ? (
              <img src={avatarUrl} alt={displayName} className="w-full h-full object-cover" />
            ) : (
              displayName.charAt(0).toUpperCase()
            )}
          </div>
          <div className="flex flex-col min-w-0">
            <p className="text-xs font-body text-foreground truncate">Hi, {displayName} 👋</p>
            {(userProfile?.plan === "pro" || isSubscriptionPro) && (
              <span className="flex items-center gap-0.5 text-[9px] font-heading font-black text-violet-600 dark:text-violet-400">
                <Sparkles className="w-2 h-2" /> PRO
              </span>
            )}
          </div>
        </div>

        <nav className="flex flex-col gap-0.5">
          {navItems.map((item) => (
            <NavLink
              key={item.href + item.label}
              to={item.href}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-body transition-all ${
                  isActive ? "nav-active" : "text-muted-foreground hover:bg-primary/8 hover:text-foreground"
                }`
              }
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* XP Progress Bar */}
      <div className="clay-card-sm p-4 flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <p className="text-[10px] font-heading font-bold text-muted-foreground uppercase tracking-wide">Level {levelInfo.level}</p>
          <span className="text-[10px] font-heading font-bold text-violet-600 dark:text-violet-400">{totalXP} XP</span>
        </div>
        <div className="w-full h-2.5 rounded-full bg-muted/60 overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700 ease-out"
            style={{
              width: `${levelInfo.percentage}%`,
              background: "linear-gradient(90deg, #7C3AED 0%, #9333EA 50%, #A78BFA 100%)",
              boxShadow: "0 0 8px rgba(124,58,237,0.4)",
            }}
          />
        </div>
        <p className="text-[9px] font-body text-muted-foreground text-right">
          {levelInfo.xpInLevel}/{levelInfo.nextThreshold} XP to Level {levelInfo.level + 1}
        </p>
      </div>

      {/* Free Time ring — mint green */}
      <div className="clay-card-sm p-4 flex flex-col items-center gap-2">
        <p className="text-[10px] font-heading font-bold text-muted-foreground uppercase tracking-wide">Free Time</p>
        <div className="relative w-20 h-20">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 80 80">
            <circle cx="40" cy="40" r="30" fill="none" stroke="rgba(34,197,94,0.15)" strokeWidth="6" />
            <circle
              cx="40" cy="40" r="30"
              fill="none"
              stroke="#22C55E"
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              style={{ filter: "drop-shadow(0 0 4px rgba(34,197,94,0.6))", transition: "stroke-dashoffset 0.7s ease" }}
            />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-sm font-heading font-black text-emerald-600">
            {freeHours.toFixed(1)}h
          </span>
        </div>
      </div>

      {/* Streak counter — glowing orange */}
      <div
        className="clay-card-sm p-4 flex items-center gap-3 justify-center"
        style={{ background: "linear-gradient(135deg, #FFF5E6 0%, #FFF0D6 100%)" }}
      >
        <div style={{ filter: "drop-shadow(0 0 8px rgba(251,146,60,0.7))" }}>
          <Flame className="w-6 h-6 text-orange-500" />
        </div>
        <div>
          <p className="font-heading font-black text-xl text-orange-600 leading-none">{streak}</p>
          <p className="text-[10px] font-body text-orange-500">day streak 🔥</p>
        </div>
      </div>

      {/* Mini Roadmap widget */}
      {firstRoadmap && (
        <NavLink
          to="/roadmap"
          className="clay-card-sm p-4 flex flex-col gap-3 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg group"
          style={{ background: "linear-gradient(145deg, #E9D5FF 0%, #F3E8FF 100%)" }}
        >
          <p className="text-[9px] font-heading font-black text-violet-500 uppercase tracking-widest">📍 Roadmap</p>
          <div className="flex items-center gap-3">
            <div className="relative w-11 h-11 flex-shrink-0">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 44 44">
                <circle cx="22" cy="22" r="18" fill="none" stroke="rgba(147,51,234,0.15)" strokeWidth="5" />
                <circle cx="22" cy="22" r="18" fill="none" stroke="#9333EA" strokeWidth="5" strokeLinecap="round"
                  strokeDasharray={rmCirc} strokeDashoffset={rmOffset}
                  style={{ filter: "drop-shadow(0 0 3px rgba(147,51,234,0.6))" }}
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-[9px] font-heading font-black text-violet-700">
                {firstRoadmap.progress_percent}%
              </span>
            </div>
            <p className="text-xs font-heading font-bold text-violet-800 truncate flex-1">{firstRoadmap.title}</p>
          </div>
          <div className="flex items-center gap-0.5 text-violet-600 text-[11px] font-heading font-bold group-hover:gap-1.5 transition-all">
            View Roadmap <ChevronRight className="w-3 h-3" />
          </div>
        </NavLink>
      )}
    </aside>
  );
};

export default DashboardSidebar;

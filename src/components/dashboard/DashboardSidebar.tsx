import { Home, Calendar, Map, BarChart3, Settings, Flame } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

const navItems = [
  { icon: Home, label: "Dashboard", href: "/dashboard" },
  { icon: Calendar, label: "Calendar", href: "/dashboard" },
  { icon: Map, label: "Roadmap", href: "/roadmap" },
  { icon: BarChart3, label: "Progress", href: "/progress" },
  { icon: Settings, label: "Settings", href: "/settings" },
];

const DashboardSidebar = () => {
  const { user } = useAuth();
  const [streak, setStreak] = useState(0);
  const [freeHours, setFreeHours] = useState(0);
  const [displayName, setDisplayName] = useState("User");

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      const { data: prof } = await supabase.from("profiles").select("full_name").eq("id", user.id).single();
      if (prof?.full_name) setDisplayName(prof.full_name);
      else setDisplayName(user.email?.split("@")[0] || "User");

      const [routineRes, tasksRes] = await Promise.all([
        supabase.from("routine_config").select("*").eq("user_id", user.id).single(),
        supabase.from("tasks").select("duration_min").eq("user_id", user.id),
      ]);
      const r = routineRes.data as any;
      const allocated = (tasksRes.data || []).reduce((s: number, t: any) => s + (t.duration_min || 0), 0) / 60;
      const used = r ? Number(r.sleep_hours) + Number(r.meal_hours) + Number(r.gaming_hours) + Number(r.other_hours) : 13;
      setFreeHours(Math.max(0, 24 - used - allocated));

      const { data: logs } = await supabase.from("task_logs").select("date, status").eq("user_id", user.id).eq("status", "completed").order("date", { ascending: false });
      if (logs && logs.length > 0) {
        const uniqueDates = [...new Set(logs.map((l: any) => l.date))].sort().reverse();
        let count = 0;
        const today = new Date();
        for (let i = 0; i < uniqueDates.length; i++) {
          const expected = new Date(today);
          expected.setDate(expected.getDate() - i);
          const expStr = expected.toISOString().split("T")[0];
          if (uniqueDates[i] === expStr) count++;
          else break;
        }
        setStreak(count);
      }
    };
    load();
  }, [user]);

  const freePercent = Math.min(100, (freeHours / 24) * 100);
  const circumference = 2 * Math.PI * 30;
  const offset = circumference - (freePercent / 100) * circumference;

  return (
    <aside className="hidden md:flex w-[220px] sticky top-[57px] h-[calc(100vh-57px)] flex-col p-4 gap-4">
      <div className="clay-card-sm p-4 flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-[hsl(255,60%,65%)] flex items-center justify-center text-white font-heading font-bold text-xs border-2 border-primary/30">
            {displayName.charAt(0).toUpperCase()}
          </div>
          <p className="text-xs font-body text-foreground truncate">Hi, {displayName} 👋</p>
        </div>

        <nav className="flex flex-col gap-1">
          {navItems.map((item) => (
            <NavLink key={item.href + item.label} to={item.href}
              className={({ isActive }) => `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-body transition-colors ${
                isActive ? "bg-primary/15 text-primary font-bold" : "text-muted-foreground hover:bg-muted/50"
              }`}>
              <item.icon className="w-4 h-4" />
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="clay-card-sm p-4 flex flex-col items-center gap-2">
        <p className="text-xs font-body text-muted-foreground">Free Time Today</p>
        <div className="relative w-20 h-20">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 80 80">
            <circle cx="40" cy="40" r="30" fill="none" stroke="hsl(var(--muted))" strokeWidth="6" />
            <circle cx="40" cy="40" r="30" fill="none" stroke="hsl(var(--success))" strokeWidth="6" strokeLinecap="round"
              strokeDasharray={circumference} strokeDashoffset={offset} />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-xs font-heading font-bold">{freeHours.toFixed(1)}h</span>
        </div>
      </div>

      <div className="clay-card-sm p-4 flex items-center gap-3 justify-center">
        <Flame className="w-5 h-5 text-orange-500" />
        <span className="font-heading font-bold text-sm text-foreground">🔥 {streak} Day Streak</span>
      </div>
    </aside>
  );
};

export default DashboardSidebar;

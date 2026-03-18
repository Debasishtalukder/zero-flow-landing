import { Home, Calendar, Map, BarChart3, Settings, Flame } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";

const navItems = [
  { icon: Home, label: "Dashboard", path: "/dashboard" },
  { icon: Calendar, label: "Calendar", path: "/dashboard/calendar" },
  { icon: Map, label: "Roadmap", path: "/roadmap" },
  { icon: BarChart3, label: "Progress", path: "/progress" },
  { icon: Settings, label: "Settings", path: "/dashboard/settings" },
];

const DashboardSidebar = () => {
  const location = useLocation();

  return (
    <aside className="hidden md:flex flex-col w-[220px] min-w-[220px] p-4 gap-4">
      <div className="clay-card-sm bg-white p-4 flex-1 flex flex-col gap-6">
        {/* User greeting */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-[hsl(255,60%,65%)] flex items-center justify-center text-white font-heading font-bold text-sm">
            Z
          </div>
          <div>
            <p className="font-heading font-bold text-sm text-foreground">
              Good morning, zerox 👋
            </p>
            <p className="text-xs text-muted-foreground font-body">
              Let's crush today
            </p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-1">
          {navItems.map((item) => {
            const isActive =
              item.path === "/dashboard"
                ? location.pathname === "/dashboard"
                : location.pathname.startsWith(item.path);
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-full text-sm font-body transition-all duration-200 ${
                  isActive
                    ? "bg-primary text-primary-foreground font-semibold shadow-md shadow-primary/20"
                    : "text-muted-foreground hover:bg-muted/50"
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </NavLink>
            );
          })}
        </nav>

        {/* Free Time Widget */}
        <div className="flex flex-col items-center gap-2 p-3">
          <p className="text-xs font-heading font-bold text-muted-foreground uppercase tracking-wider">
            Free Time Today
          </p>
          <div className="relative w-24 h-24">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50" cy="50" r="42"
                fill="none"
                stroke="hsl(var(--muted))"
                strokeWidth="8"
              />
              <circle
                cx="50" cy="50" r="42"
                fill="none"
                stroke="hsl(var(--success))"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={`${0.65 * 2 * Math.PI * 42} ${2 * Math.PI * 42}`}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="font-heading font-bold text-lg text-foreground">6.5</span>
              <span className="text-[10px] text-muted-foreground font-body">hrs free</span>
            </div>
          </div>
        </div>

        {/* Streak */}
        <div className="flex items-center gap-2 px-3 py-2.5 rounded-2xl bg-[#FFF0E6]">
          <Flame className="w-5 h-5 text-orange-500" />
          <span className="font-heading font-bold text-sm text-foreground">
            🔥 7 Day Streak
          </span>
        </div>

        {/* Roadmap Preview */}
        <div className="clay-card-sm bg-[#F3E8FF] p-3 flex flex-col gap-2">
          <p className="font-heading font-bold text-xs text-foreground">My Learning Path</p>
          <div className="relative w-12 h-12 mx-auto">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="42" fill="none" stroke="hsl(var(--muted))" strokeWidth="10" />
              <circle cx="50" cy="50" r="42" fill="none" stroke="hsl(var(--primary))" strokeWidth="10" strokeLinecap="round"
                strokeDasharray={`${0.35 * 2 * Math.PI * 42} ${2 * Math.PI * 42}`} />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold font-heading">35%</span>
          </div>
          <div className="text-[10px] font-body text-muted-foreground space-y-1">
            <p>✅ Intro to React</p>
            <p>✅ State Management</p>
            <p className="opacity-50">◻ API Integration</p>
            <p className="opacity-50">◻ Testing</p>
          </div>
          <NavLink to="/roadmap" className="text-[10px] font-heading font-bold text-primary hover:underline">
            View Full Roadmap →
          </NavLink>
        </div>
      </div>
    </aside>
  );
};

export default DashboardSidebar;

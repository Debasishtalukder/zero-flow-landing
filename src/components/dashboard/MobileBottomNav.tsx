import { Home, Calendar, Map, BarChart3, Settings } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";

const items = [
  { icon: Home, label: "Home", path: "/dashboard" },
  { icon: Calendar, label: "Calendar", path: "/dashboard/calendar" },
  { icon: Map, label: "Roadmap", path: "/roadmap" },
  { icon: BarChart3, label: "Progress", path: "/progress" },
  { icon: Settings, label: "Settings", path: "/dashboard/settings" },
];

const MobileBottomNav = () => {
  const location = useLocation();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-t border-border/50">
      <div className="flex items-center justify-around py-2">
        {items.map((item) => {
          const isActive =
            item.path === "/dashboard"
              ? location.pathname === "/dashboard"
              : location.pathname.startsWith(item.path);
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-xl transition-all ${
                isActive ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-[10px] font-body">{item.label}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileBottomNav;

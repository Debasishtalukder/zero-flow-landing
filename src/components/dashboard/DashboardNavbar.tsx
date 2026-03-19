import { Bell, ChevronDown, LogOut, Settings, User, Moon, Sun } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import logo from "@/assets/logo.jpg";
import { useTheme } from "@/contexts/ThemeContext";

const DashboardNavbar = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const { signOut, user, userProfile } = useAuth();
  const navigate = useNavigate();
  const { resolvedTheme, setTheme, theme } = useTheme();

  const today = new Date();
  const dateStr = today.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <nav className="navbar-glass sticky top-0 z-50 w-full">
      <div className="flex items-center justify-between px-6 py-3">
        {/* Logo — gradient text */}
        <div className="flex items-center gap-2.5">
          <img src={logo} alt="ZeroFlow" className="w-8 h-8 object-contain rounded-xl" />
          <span className="font-heading font-extrabold text-xl text-gradient-violet-mint tracking-tight">
            ZeroFlow
          </span>
        </div>

        <span className="hidden md:block font-body text-sm text-muted-foreground">{dateStr}</span>

        <div className="flex items-center gap-3">
          {userProfile?.plan !== "pro" && (
            <button
              onClick={() => navigate("/upgrade")}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-heading font-extrabold text-white transition-all hover:scale-105"
              style={{ background: "linear-gradient(135deg, #9333EA 0%, #7C3AED 100%)", boxShadow: "0 4px 12px rgba(124,58,237,0.3)" }}
            >
              <span className="text-[10px]">⚡</span> Upgrade to Pro
            </button>
          )}

          <button
            onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
            className="p-2 rounded-xl hover:bg-primary/10 transition-colors"
            title={resolvedTheme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {resolvedTheme === "dark" ? (
              <Sun className="w-5 h-5 text-yellow-400" />
            ) : (
              <Moon className="w-5 h-5 text-muted-foreground" />
            )}
          </button>

          <button className="relative p-2 rounded-xl hover:bg-primary/10 transition-colors">
            <Bell className="w-5 h-5 text-muted-foreground" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-accent animate-pulse" />
          </button>

          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-2 px-2 py-1.5 rounded-2xl hover:bg-primary/10 transition-all"
            >
              <div className="w-9 h-9 rounded-full flex items-center justify-center text-white font-heading font-bold text-sm border-2 border-white/60 overflow-hidden bg-muted"
                style={{ 
                  background: userProfile?.avatar_url ? "white" : "linear-gradient(135deg, #7C3AED 0%, #34C789 100%)", 
                  boxShadow: "0 4px 12px rgba(124,58,237,0.4)" 
                }}>
                {userProfile?.avatar_url ? (
                  <img src={userProfile.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  (userProfile?.full_name?.charAt(0) || user?.email?.charAt(0) || "Z").toUpperCase()
                )}
              </div>
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            </button>

            {showDropdown && (
              <div className="absolute right-0 top-12 w-48 clay-card bg-white p-2 z-50 animate-in fade-in-0 zoom-in-95">
                {[
                  { icon: User, label: "Profile", action: () => { setShowDropdown(false); navigate("/settings"); } },
                  { icon: Settings, label: "Settings", action: () => { setShowDropdown(false); navigate("/settings"); } },
                  { icon: LogOut, label: "Logout", action: () => { setShowDropdown(false); handleLogout(); } },
                ].map((item) => (
                  <button key={item.label} onClick={item.action}
                    className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-body text-foreground hover:bg-primary/10 hover:text-primary transition-colors">
                    <item.icon className="w-4 h-4 text-muted-foreground" />
                    {item.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default DashboardNavbar;

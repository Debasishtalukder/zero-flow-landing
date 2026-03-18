import { Bell, ChevronDown, LogOut, Settings, User } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import logo from "@/assets/logo.jpg";

const DashboardNavbar = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const { signOut, user } = useAuth();
  const navigate = useNavigate();

  const today = new Date();
  const dateStr = today.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-border/50">
      <div className="flex items-center justify-between px-6 py-3">
        <div className="flex items-center gap-2">
          <img src={logo} alt="ZeroFlow" className="w-8 h-8 rounded-xl" />
          <span className="font-heading font-bold text-lg text-foreground">ZeroFlow</span>
        </div>

        <span className="hidden md:block font-body text-sm text-muted-foreground">{dateStr}</span>

        <div className="flex items-center gap-4">
          <button className="relative p-2 rounded-xl hover:bg-muted/50 transition-colors">
            <Bell className="w-5 h-5 text-muted-foreground" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-accent" />
          </button>

          <div className="relative">
            <button onClick={() => setShowDropdown(!showDropdown)} className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-[hsl(255,60%,65%)] flex items-center justify-center text-white font-heading font-bold text-sm border-2 border-primary/30">
                {(user?.email?.charAt(0) || "Z").toUpperCase()}
              </div>
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            </button>

            {showDropdown && (
              <div className="absolute right-0 top-12 w-48 clay-card-sm bg-white p-2 z-50">
                {[
                  { icon: User, label: "Profile", action: () => { setShowDropdown(false); navigate("/settings"); } },
                  { icon: Settings, label: "Settings", action: () => { setShowDropdown(false); navigate("/settings"); } },
                  { icon: LogOut, label: "Logout", action: () => { setShowDropdown(false); handleLogout(); } },
                ].map((item) => (
                  <button key={item.label} onClick={item.action}
                    className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-body text-foreground hover:bg-muted/50 transition-colors">
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

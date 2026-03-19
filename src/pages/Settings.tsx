import { useState, useEffect } from "react";
import { ArrowLeft, Zap, Sparkles, Camera, Loader2, Sun, Moon, Monitor, Bell, BellOff, Palmtree } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { toast } from "@/hooks/use-toast";
import DashboardNavbar from "@/components/dashboard/DashboardNavbar";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import MobileBottomNav from "@/components/dashboard/MobileBottomNav";
import ComingSoonModal from "@/components/ui/ComingSoonModal";
import { Skeleton } from "@/components/ui/skeleton";

const Settings = () => {
  const { user, userProfile, signOut, refreshProfile } = useAuth();
  const { theme, setTheme} = useTheme();
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [sleep, setSleep] = useState(8);
  const [meals, setMeals] = useState(1);
  const [gaming, setGaming] = useState(2);
  const [other, setOther] = useState(2);
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  const [tasksCount, setTasksCount] = useState(0);
  const [roadmapsCount, setRoadmapsCount] = useState(0);
  const [showModal, setShowModal] = useState(false);

  // Notification state
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [notifPermission, setNotifPermission] = useState(Notification.permission);

  // Vacation state
  const [vacationStart, setVacationStart] = useState("");
  const [vacationEnd, setVacationEnd] = useState("");

  useEffect(() => {
    if (!user || !userProfile) return;
    setFullName(userProfile.full_name || "");
    setEmail(userProfile.email || "");
    setAvatarUrl(userProfile.avatar_url || null);
    setNotificationsEnabled(userProfile.notifications_enabled !== false);
    setVacationStart(userProfile.vacation_start || "");
    setVacationEnd(userProfile.vacation_end || "");
    
    const loadRoutine = async () => {
      const [{ data: routineRes }, { count: tCount }, { count: rCount }] = await Promise.all([
        supabase.from("routine_config").select("*").eq("user_id", user.id).single(),
        supabase.from("tasks").select("*", { count: 'exact', head: true }).eq("user_id", user.id),
        supabase.from("roadmaps").select("*", { count: 'exact', head: true }).eq("user_id", user.id),
      ]);
      if (routineRes) {
        setSleep(Number(routineRes.sleep_hours));
        setMeals(Number(routineRes.meal_hours));
        setGaming(Number(routineRes.gaming_hours));
        setOther(Number(routineRes.other_hours));
      }
      setTasksCount(tCount || 0);
      setRoadmapsCount(rCount || 0);
      setLoading(false);
    };
    loadRoutine();
  }, [user, userProfile]);

  const saveProfile = async () => {
    if (!user) return;
    setSaving(true);
    await supabase.from("profiles").update({ full_name: fullName, email }).eq("id", user.id);
    await refreshProfile();
    toast({ title: "Profile updated ✓" });
    setSaving(false);
  };

  const saveRoutine = async () => {
    if (!user) return;
    setSaving(true);
    const { data } = await supabase.from("routine_config").select("id").eq("user_id", user.id).single();
    if (data) {
      await supabase.from("routine_config").update({
        sleep_hours: sleep, meal_hours: meals, gaming_hours: gaming, other_hours: other,
      }).eq("user_id", user.id);
    } else {
      await supabase.from("routine_config").insert({
        user_id: user.id, sleep_hours: sleep, meal_hours: meals, gaming_hours: gaming, other_hours: other,
      });
    }
    toast({ title: "Routine updated ✓" });
    setSaving(false);
  };

  const changePassword = async () => {
    if (newPassword.length < 6) {
      toast({ title: "Password too short", description: "Min 6 characters", variant: "destructive" });
      return;
    }
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else { toast({ title: "Password changed ✓" }); setNewPassword(""); }
  };

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      if (!event.target.files || event.target.files.length === 0) {
        throw new Error("You must select an image to upload.");
      }

      const file = event.target.files[0];
      const fileExt = file.name.split(".").pop();
      const filePath = `${user!.id}/${Math.random()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("avatars")
        .getPublicUrl(filePath);

      const { error: updateError } = await supabase
        .from("profiles")
        .update({ avatar_url: publicUrl })
        .eq("id", user!.id);

      if (updateError) throw updateError;

      await refreshProfile();
      setAvatarUrl(publicUrl);
      toast({ title: "Profile picture updated! 🎉" });
    } catch (error: any) {
      toast({
        title: "Upload failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const requestNotifPermission = async () => {
    const perm = await Notification.requestPermission();
    setNotifPermission(perm);
    if (perm === "granted") {
      toast({ title: "Notifications enabled! 🔔" });
    } else {
      toast({ title: "Permission denied", description: "You can change this in browser settings.", variant: "destructive" });
    }
  };

  const toggleNotifications = async () => {
    if (!user) return;
    const next = !notificationsEnabled;
    setNotificationsEnabled(next);
    await supabase.from("user_settings").upsert({ user_id: user.id, notifications_enabled: next });
    toast({ title: next ? "Reminders enabled 🔔" : "Reminders disabled 🔕" });
  };

  const saveVacation = async () => {
    if (!user) return;
    setSaving(true);
    const { error } = await supabase
      .from("user_settings")
      .upsert({
        user_id: user.id,
        vacation_start: vacationStart || null,
        vacation_end: vacationEnd || null,
      });
    await refreshProfile();
    toast({ title: vacationStart ? "Vacation mode set! 🏖️" : "Vacation mode cleared" });
    setSaving(false);
  };

  const deleteAccount = async () => {
    if (!confirm("Are you sure? This will permanently delete your account and all data.")) return;
    await signOut();
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background relative">
        <div className="fixed inset-0 dot-grid pointer-events-none" />
        <DashboardNavbar />
        <div className="flex relative z-10">
          <DashboardSidebar />
          <main className="flex-1 p-6 flex flex-col gap-6">
            {[1,2,3].map(i => <Skeleton key={i} className="h-40 rounded-2xl" />)}
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
        <main className="flex-1 p-4 md:p-6 pb-24 md:pb-6 flex flex-col gap-6">
          <div className="flex items-center gap-3">
            <NavLink to="/dashboard" className="p-2 rounded-xl hover:bg-muted/50">
              <ArrowLeft className="w-5 h-5 text-muted-foreground" />
            </NavLink>
            <h1 className="font-heading font-bold text-2xl text-foreground">Settings</h1>
          </div>

          {/* Your Plan Section */}
          <div className="clay-card p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 border-2 border-violet-100/50" style={userProfile?.plan === "pro" ? { background: "linear-gradient(135deg, #F5F3FF 0%, #FFFFFF 100%)", borderColor: "#C4B5FD" } : {}}>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-heading font-bold text-lg text-foreground">Your Plan:</h3>
                {userProfile?.plan === "pro" ? (
                  <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-violet-100 text-violet-700">
                    <Sparkles className="w-3 h-3" /> Pro Plan
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-600">
                    Free Plan
                  </span>
                )}
              </div>
              <p className="font-body text-sm text-muted-foreground mb-4">
                {userProfile?.plan === "pro" ? "You have unlimited access to all features." : "Upgrade to Pro to unlock unlimited tasks and exclusive features."}
              </p>
              
              <div className="flex gap-6">
                <div>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-0.5">Tasks Used</p>
                  <p className="font-heading font-bold text-foreground">{tasksCount} <span className="text-muted-foreground font-body font-normal">{userProfile?.plan === "pro" ? "" : "/ 5"}</span></p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-0.5">Roadmaps Used</p>
                  <p className="font-heading font-bold text-foreground">{roadmapsCount} <span className="text-muted-foreground font-body font-normal">{userProfile?.plan === "pro" ? "" : "/ 1"}</span></p>
                </div>
              </div>
            </div>
            
            <div className="shrink-0">
              {userProfile?.plan === "pro" ? (
                <button className="btn-pill bg-white dark:bg-muted border border-slate-200 dark:border-muted text-slate-700 dark:text-foreground hover:bg-slate-50 transition-colors w-full md:w-auto">
                  Manage Subscription
                </button>
              ) : (
                <button 
                  onClick={() => setShowModal(true)}
                  className="btn-pill text-white flex items-center justify-center gap-2 w-full md:w-auto transition-transform hover:scale-105"
                  style={{ background: "linear-gradient(135deg, #7C3AED 0%, #9333EA 100%)", boxShadow: "0 4px 12px rgba(124,58,237,0.3)" }}
                >
                  <Zap className="w-4 h-4" /> Upgrade to Pro
                </button>
              )}
            </div>
          </div>

          {/* Appearance (Dark Mode) */}
          <div className="clay-card p-6 flex flex-col gap-4">
            <h2 className="font-heading font-bold text-lg text-foreground">🎨 Appearance</h2>
            <p className="text-sm font-body text-muted-foreground">Choose your preferred theme.</p>
            <div className="flex gap-3">
              {([
                { key: "light" as const, label: "Light", icon: Sun },
                { key: "dark" as const, label: "Dark", icon: Moon },
                { key: "system" as const, label: "System", icon: Monitor },
              ]).map(opt => (
                <button key={opt.key} onClick={() => setTheme(opt.key)}
                  className={`flex flex-col items-center gap-2 px-5 py-4 rounded-2xl border-2 transition-all flex-1 ${
                    theme === opt.key
                      ? "border-violet-400 bg-violet-50 dark:bg-violet-900/30 shadow-md"
                      : "border-border hover:border-violet-200 bg-white dark:bg-muted/20"
                  }`}
                >
                  <opt.icon className={`w-6 h-6 ${theme === opt.key ? "text-violet-600 dark:text-violet-400" : "text-muted-foreground"}`} />
                  <span className={`text-sm font-heading font-bold ${theme === opt.key ? "text-violet-700 dark:text-violet-300" : "text-foreground"}`}>{opt.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Notifications */}
          <div className="clay-card p-6 flex flex-col gap-4">
            <h2 className="font-heading font-bold text-lg text-foreground">🔔 Notifications</h2>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-heading font-bold text-sm text-foreground">Daily Reminders</p>
                <p className="text-xs font-body text-muted-foreground">Receive browser notifications for your tasks</p>
              </div>
              <button
                onClick={toggleNotifications}
                className={`relative w-12 h-7 rounded-full transition-colors ${notificationsEnabled ? "bg-violet-500" : "bg-muted"}`}
              >
                <span className={`absolute top-0.5 w-6 h-6 rounded-full bg-white shadow-md transition-all ${notificationsEnabled ? "left-[22px]" : "left-0.5"}`} />
              </button>
            </div>
            {notifPermission !== "granted" && (
              <button
                onClick={requestNotifPermission}
                className="btn-pill bg-primary text-primary-foreground self-start flex items-center gap-2 text-sm"
              >
                <Bell className="w-4 h-4" /> Allow Notifications
              </button>
            )}
            {notifPermission === "granted" && (
              <p className="text-xs font-body text-emerald-600 flex items-center gap-1">
                <Bell className="w-3 h-3" /> Browser notifications permitted
              </p>
            )}
          </div>

          {/* Vacation Mode */}
          <div className="clay-card p-6 flex flex-col gap-4">
            <h2 className="font-heading font-bold text-lg text-foreground">🏖️ Vacation Mode</h2>
            <p className="text-sm font-body text-muted-foreground">
              Protect your streaks during time off. Task cards will show "Paused" during vacation.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-body font-medium text-muted-foreground mb-1 block">Start Date</label>
                <input type="date" value={vacationStart} onChange={e => setVacationStart(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-white dark:bg-muted/20 font-body text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
              </div>
              <div>
                <label className="text-xs font-body font-medium text-muted-foreground mb-1 block">End Date</label>
                <input type="date" value={vacationEnd} onChange={e => setVacationEnd(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-white dark:bg-muted/20 font-body text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={saveVacation} disabled={saving} className="btn-pill bg-primary text-primary-foreground self-start">
                {vacationStart ? "Save Vacation" : "Clear Vacation"}
              </button>
              {vacationStart && (
                <button onClick={() => { setVacationStart(""); setVacationEnd(""); saveVacation(); }}
                  className="btn-pill bg-muted text-foreground self-start">
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Profile */}
          <div className="clay-card p-6 flex flex-col gap-6">
            <h2 className="font-heading font-bold text-lg text-foreground">Profile</h2>
            
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="relative group">
                <div className="w-24 h-24 rounded-full border-4 border-white dark:border-muted shadow-xl overflow-hidden bg-muted flex items-center justify-center">
                  {avatarUrl ? (
                    <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-3xl font-heading font-bold text-muted-foreground">
                      {fullName.charAt(0).toUpperCase() || "Z"}
                    </span>
                  )}
                  {uploading && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <Loader2 className="w-8 h-8 text-white animate-spin" />
                    </div>
                  )}
                </div>
                <label className="absolute bottom-0 right-0 p-2 bg-violet-600 rounded-full text-white shadow-lg cursor-pointer hover:bg-violet-700 transition-colors">
                  <Camera className="w-4 h-4" />
                  <input type="file" className="hidden" accept="image/*" onChange={handleAvatarUpload} disabled={uploading} />
                </label>
              </div>
              
              <div className="flex flex-col gap-1">
                <p className="font-heading font-bold text-base text-foreground">Profile Picture</p>
                <p className="text-xs font-body text-muted-foreground">JPG, PNG or WebP. Max 2MB.</p>
                <label className="mt-2 text-xs font-heading font-extrabold text-violet-600 dark:text-violet-400 hover:text-violet-700 cursor-pointer">
                  {uploading ? "Uploading..." : "Upload New Photo"}
                  <input type="file" className="hidden" accept="image/*" onChange={handleAvatarUpload} disabled={uploading} />
                </label>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-body font-medium text-muted-foreground mb-1 block">Display Name</label>
                <input value={fullName} onChange={e => setFullName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-white dark:bg-muted/20 font-body text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow" />
              </div>
              <div>
                <label className="text-xs font-body font-medium text-muted-foreground mb-1 block">Email</label>
                <input value={email} onChange={e => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-white dark:bg-muted/20 font-body text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow" />
              </div>
            </div>
            <button onClick={saveProfile} disabled={saving} className="btn-pill bg-primary text-primary-foreground self-start px-8">
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>

          {/* Routine */}
          <div className="clay-card p-6 flex flex-col gap-4">
            <h2 className="font-heading font-bold text-lg text-foreground">Daily Routine</h2>
            {[
              { label: "Sleep (hours)", value: sleep, set: setSleep },
              { label: "Meals (hours)", value: meals, set: setMeals },
              { label: "Gaming (hours)", value: gaming, set: setGaming },
              { label: "Other (hours)", value: other, set: setOther },
            ].map(item => (
              <div key={item.label} className="flex items-center gap-3">
                <label className="text-sm font-body text-muted-foreground w-32">{item.label}</label>
                <input type="range" min={0} max={12} step={0.5} value={item.value}
                  onChange={e => item.set(Number(e.target.value))} className="flex-1 accent-primary" />
                <span className="font-heading font-bold text-sm w-10 text-right text-foreground">{item.value}h</span>
              </div>
            ))}
            <button onClick={saveRoutine} disabled={saving} className="btn-pill bg-primary text-primary-foreground self-start">
              Save Routine
            </button>
          </div>

          {/* Account */}
          <div className="clay-card p-6 flex flex-col gap-4">
            <h2 className="font-heading font-bold text-lg text-foreground">Account</h2>
            <div>
              <label className="text-xs font-body font-medium text-muted-foreground mb-1 block">New Password</label>
              <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="Min 6 characters"
                className="w-full px-4 py-3 rounded-xl border border-border bg-white dark:bg-muted/20 font-body text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
            </div>
            <button onClick={changePassword} className="btn-pill bg-primary text-primary-foreground self-start">
              Change Password
            </button>
            <hr className="border-border" />
            <button onClick={deleteAccount} className="btn-pill bg-destructive text-destructive-foreground self-start">
              Delete Account
            </button>
          </div>
        </main>
      </div>
      <MobileBottomNav />
      <ComingSoonModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </div>
  );
};

export default Settings;

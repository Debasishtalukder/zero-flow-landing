import { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import DashboardNavbar from "@/components/dashboard/DashboardNavbar";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import MobileBottomNav from "@/components/dashboard/MobileBottomNav";
import { Skeleton } from "@/components/ui/skeleton";

const Settings = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [sleep, setSleep] = useState(8);
  const [meals, setMeals] = useState(1);
  const [gaming, setGaming] = useState(2);
  const [other, setOther] = useState(2);
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      const [profileRes, routineRes] = await Promise.all([
        supabase.from("profiles").select("*").eq("id", user.id).single(),
        supabase.from("routine_config").select("*").eq("user_id", user.id).single(),
      ]);
      if (profileRes.data) {
        setFullName(profileRes.data.full_name || "");
        setEmail(profileRes.data.email || "");
      }
      if (routineRes.data) {
        setSleep(Number(routineRes.data.sleep_hours));
        setMeals(Number(routineRes.data.meal_hours));
        setGaming(Number(routineRes.data.gaming_hours));
        setOther(Number(routineRes.data.other_hours));
      }
      setLoading(false);
    };
    load();
  }, [user]);

  const saveProfile = async () => {
    if (!user) return;
    setSaving(true);
    await supabase.from("profiles").update({ full_name: fullName, email }).eq("id", user.id);
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
          <main className="flex-1 p-6 flex flex-col gap-6 max-w-3xl">
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
        <main className="flex-1 p-4 md:p-6 pb-24 md:pb-6 flex flex-col gap-6 max-w-3xl">
          <div className="flex items-center gap-3">
            <NavLink to="/dashboard" className="p-2 rounded-xl hover:bg-muted/50">
              <ArrowLeft className="w-5 h-5 text-muted-foreground" />
            </NavLink>
            <h1 className="font-heading font-bold text-2xl text-foreground">Settings</h1>
          </div>

          {/* Profile */}
          <div className="clay-card p-6 flex flex-col gap-4">
            <h2 className="font-heading font-bold text-lg text-foreground">Profile</h2>
            <div>
              <label className="text-xs font-body font-medium text-muted-foreground mb-1 block">Display Name</label>
              <input value={fullName} onChange={e => setFullName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-border bg-white font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
            </div>
            <div>
              <label className="text-xs font-body font-medium text-muted-foreground mb-1 block">Email</label>
              <input value={email} onChange={e => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-border bg-white font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
            </div>
            <button onClick={saveProfile} disabled={saving} className="btn-pill bg-primary text-primary-foreground self-start">
              Save Profile
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
                <span className="font-heading font-bold text-sm w-10 text-right">{item.value}h</span>
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
                className="w-full px-4 py-3 rounded-xl border border-border bg-white font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
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
    </div>
  );
};

export default Settings;

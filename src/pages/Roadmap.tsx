import { useState, useEffect, useCallback } from "react";
import { ArrowLeft, Plus, CheckCircle, Circle, ChevronRight, X, Calendar } from "lucide-react";
import { NavLink } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import DashboardNavbar from "@/components/dashboard/DashboardNavbar";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import MobileBottomNav from "@/components/dashboard/MobileBottomNav";
import UpgradeModal from "@/components/UpgradeModal";
import { Skeleton } from "@/components/ui/skeleton";

interface Milestone {
  id: string;
  title: string;
  due_date: string | null;
  completed: boolean;
}

interface RoadmapItem {
  id: string;
  title: string;
  description: string | null;
  progress_percent: number;
  target_date: string | null;
  milestones?: Milestone[];
}

const CARD_PALETTES = [
  { bg: "#D6EAFF", ring: "#4A9EFF", text: "#1055a8", label: "sky" },
  { bg: "#D9F5EC", ring: "#34C789", text: "#1a7a52", label: "mint" },
  { bg: "#EDD9FF", ring: "#9B59F5", text: "#5c1eb0", label: "lilac" },
  { bg: "#FFE8D6", ring: "#FF8C42", text: "#a84a00", label: "peach" },
  { bg: "#FFF5D6", ring: "#F5C030", text: "#8a6500", label: "gold" },
  { bg: "#EDE9FE", ring: "#7C3AED", text: "#4c1d95", label: "lavender" },
];

const Roadmap = () => {
  const { user, userProfile, refreshProfile } = useAuth();
  const [roadmaps, setRoadmaps] = useState<RoadmapItem[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewModal, setShowNewModal] = useState(false);
  const [showMilestoneModal, setShowMilestoneModal] = useState(false);
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);

  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newTarget, setNewTarget] = useState("");

  const [msTitle, setMsTitle] = useState("");
  const [msDue, setMsDue] = useState("");

  const loadRoadmaps = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase.from("roadmaps").select("*").eq("user_id", user.id).order("created_at", { ascending: false });
    setRoadmaps((data || []) as RoadmapItem[]);
    setLoading(false);
  }, [user]);

  useEffect(() => { loadRoadmaps(); }, [loadRoadmaps]);

  const loadMilestones = useCallback(async (roadmapId: string) => {
    const { data } = await supabase.from("milestones").select("*").eq("roadmap_id", roadmapId).order("due_date");
    setMilestones((data || []) as Milestone[]);
  }, []);

  const selectRoadmap = (id: string) => {
    setSelectedId(id);
    loadMilestones(id);
  };

  const handleNewRoadmapClick = () => {
    if (userProfile?.plan !== "pro" && roadmaps.length >= 1) {
      setUpgradeModalOpen(true);
    } else {
      setShowNewModal(true);
    }
  };

  const createRoadmap = async () => {
    if (!user || !newTitle.trim()) return;
    const { error } = await supabase.from("roadmaps").insert({
      user_id: user.id, title: newTitle.trim(), description: newDesc, target_date: newTarget || null,
    });
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else {
      toast({ title: "Roadmap created! 🗺️" });
      
      // Award 15 XP for roadmap creation
      const { data: profile } = await supabase.from("profiles").select("total_xp").eq("id", user.id).single();
      if (profile) {
        await supabase.from("profiles").update({ total_xp: (profile.total_xp || 0) + 15 }).eq("id", user.id);
        await refreshProfile();
      }

      setNewTitle(""); setNewDesc(""); setNewTarget("");
      setShowNewModal(false); loadRoadmaps();
    }
  };

  const createMilestone = async () => {
    if (!selectedId || !msTitle.trim()) return;
    const { error } = await supabase.from("milestones").insert({
      roadmap_id: selectedId, title: msTitle.trim(), due_date: msDue || null,
    });
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else {
      toast({ title: "Milestone added! 🏁" });
      setMsTitle(""); setMsDue(""); setShowMilestoneModal(false);
      loadMilestones(selectedId);
      updateProgress(selectedId);
    }
  };

  const toggleMilestone = async (ms: Milestone) => {
    if (!selectedId) return;
    
    // Optimistic update
    const updatedMilestones = milestones.map(m => m.id === ms.id ? { ...m, completed: !m.completed } : m);
    setMilestones(updatedMilestones);
    
    const pct = updatedMilestones.length > 0 ? Math.round((updatedMilestones.filter(m => m.completed).length / updatedMilestones.length) * 100) : 0;
    setRoadmaps(prev => prev.map(r => r.id === selectedId ? { ...r, progress_percent: pct } : r));

    await supabase.from("milestones").update({ completed: !ms.completed }).eq("id", ms.id);
    await supabase.from("roadmaps").update({ progress_percent: pct }).eq("id", selectedId);
  };

  const updateProgress = async (roadmapId: string) => {
    const { data } = await supabase.from("milestones").select("completed").eq("roadmap_id", roadmapId);
    if (data && data.length > 0) {
      const pct = Math.round((data.filter((m: any) => m.completed).length / data.length) * 100);
      await supabase.from("roadmaps").update({ progress_percent: pct }).eq("id", roadmapId);
      loadRoadmaps();
    }
  };

  const selected = roadmaps.find(r => r.id === selectedId);

  if (loading) {
    return (
      <div className="min-h-screen bg-background relative">
        <div className="fixed inset-0 dot-grid pointer-events-none" />
        <div className="blob-bg"><div className="blob blob-1" /><div className="blob blob-2" /></div>
        <DashboardNavbar />
        <div className="flex relative z-10">
          <DashboardSidebar />
          <main className="flex-1 p-6 flex flex-col gap-6">
            {[1,2,3].map(i => <Skeleton key={i} className="h-36 rounded-2xl" />)}
          </main>
        </div>
      </div>
    );
  }

  // ── Detail view ──
  if (selected) {
    const idx = roadmaps.findIndex(r => r.id === selected.id);
    const palette = CARD_PALETTES[idx % CARD_PALETTES.length];
    const r = 44;
    const circumference = 2 * Math.PI * r;
    const offset = circumference - (selected.progress_percent / 100) * circumference;
    const completedMs = milestones.filter(m => m.completed).length;

    return (
      <div className="min-h-screen bg-background relative">
        <div className="fixed inset-0 dot-grid pointer-events-none" />
        <div className="blob-bg"><div className="blob blob-1" /><div className="blob blob-2" /><div className="blob blob-3" /></div>
        <DashboardNavbar />
        <div className="flex relative z-10">
          <DashboardSidebar />
          <main className="flex-1 p-4 md:p-6 pb-24 md:pb-6 flex flex-col gap-6">
            <div className="flex items-center gap-3">
              <button onClick={() => setSelectedId(null)} className="p-2 rounded-xl hover:bg-muted/50">
                <ArrowLeft className="w-5 h-5 text-muted-foreground" />
              </button>
              <h1 className="font-heading font-bold text-2xl">{selected.title}</h1>
            </div>

            {/* Hero progress card */}
            <div
              className="rounded-3xl p-6 flex items-center gap-6"
              style={{ background: `linear-gradient(135deg, ${palette.bg} 0%, white 100%)`, boxShadow: `inset 0 3px 8px rgba(255,255,255,0.85), 0 12px 40px -8px ${palette.ring}44` }}
            >
              {/* Big SVG ring */}
              <div className="relative w-28 h-28 flex-shrink-0">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 104 104">
                  <circle cx="52" cy="52" r={r} fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="9" />
                  <circle cx="52" cy="52" r={r} fill="none" stroke={palette.ring}
                    strokeWidth="9" strokeLinecap="round"
                    strokeDasharray={circumference} strokeDashoffset={offset}
                    style={{ transition: "stroke-dashoffset 0.6s ease" }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="font-heading font-extrabold text-2xl" style={{ color: palette.text }}>{selected.progress_percent}%</span>
                  <span className="text-[9px] font-body opacity-60" style={{ color: palette.text }}>complete</span>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                {selected.description && (
                  <p className="text-sm font-body text-muted-foreground">{selected.description}</p>
                )}
                {selected.target_date && (
                  <div className="flex items-center gap-1.5 text-xs font-body" style={{ color: palette.text }}>
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Target: <strong>{new Date(selected.target_date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</strong></span>
                  </div>
                )}
                <div className="flex items-center gap-1.5 text-xs font-body text-muted-foreground">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                  <span>{completedMs} / {milestones.length} milestones complete</span>
                </div>
              </div>
            </div>

            {/* Milestones section */}
            <div className="flex items-center justify-between">
              <h2 className="font-heading font-bold text-lg">Milestones</h2>
              <button onClick={() => setShowMilestoneModal(true)}
                className="btn-pill bg-accent text-accent-foreground flex items-center gap-2">
                <Plus className="w-4 h-4" /> Add Milestone
              </button>
            </div>

            {milestones.length === 0 ? (
              <div className="clay-card p-8 text-center">
                <p className="text-3xl mb-2">🏁</p>
                <p className="font-heading font-bold text-foreground">No milestones yet</p>
                <p className="text-sm font-body text-muted-foreground">Add milestones to track your progress</p>
              </div>
            ) : (
              <div className="flex flex-col gap-0">
                {milestones.map((m, i) => (
                  <div key={m.id} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <button onClick={() => toggleMilestone(m)} className="transition-transform hover:scale-110">
                        {m.completed
                          ? <CheckCircle className="w-6 h-6 text-emerald-500 flex-shrink-0" />
                          : <Circle className="w-6 h-6 text-muted-foreground/40 flex-shrink-0" />}
                      </button>
                      {i < milestones.length - 1 && (
                        <div className={`w-0.5 flex-1 min-h-[44px] ${m.completed ? "bg-emerald-300" : "bg-muted"}`} />
                      )}
                    </div>
                    <div
                      className="rounded-2xl p-4 mb-3 flex-1 transition-all"
                      style={{
                        backgroundColor: m.completed ? "#D9F5EC" : "white",
                        boxShadow: m.completed
                          ? "inset 0 2px 6px rgba(255,255,255,0.8), 0 4px 12px -4px rgba(52,199,137,0.3)"
                          : "inset 0 2px 6px rgba(255,255,255,0.9), 0 4px 12px -4px rgba(0,0,0,0.08)",
                      }}
                    >
                      <p className={`font-heading font-bold text-sm ${m.completed ? "line-through text-emerald-700" : "text-foreground"}`}>{m.title}</p>
                      {m.due_date && (
                        <div className="flex items-center gap-1 mt-1">
                          <Calendar className="w-3 h-3 text-muted-foreground" />
                          <p className="text-[11px] font-body text-muted-foreground">
                            Due: {new Date(m.due_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </main>
        </div>
        <MobileBottomNav />

        {/* Milestone Modal */}
        {showMilestoneModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-foreground/20 backdrop-blur-sm" onClick={() => setShowMilestoneModal(false)} />
            <div className="relative clay-card bg-white p-8 w-full max-w-md mx-4 flex flex-col gap-5">
              <div className="flex items-center justify-between">
                <h2 className="font-heading font-bold text-xl">Add Milestone</h2>
                <button onClick={() => setShowMilestoneModal(false)} className="p-1 rounded-xl hover:bg-muted/50"><X className="w-5 h-5" /></button>
              </div>
              <div>
                <label className="text-xs font-body font-medium text-muted-foreground mb-1 block">Title</label>
                <input value={msTitle} onChange={e => setMsTitle(e.target.value)} placeholder="e.g. Complete Chapter 1"
                  onKeyDown={(e) => e.key === "Enter" && createMilestone()}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-white font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
              </div>
              <div>
                <label className="text-xs font-body font-medium text-muted-foreground mb-1 block">Due Date</label>
                <input type="date" value={msDue} onChange={e => setMsDue(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-white font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
              </div>
              <button onClick={createMilestone} disabled={!msTitle.trim()} className="btn-pill bg-accent text-accent-foreground w-full py-3.5 disabled:opacity-50">
                Add Milestone 🏁
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ── List view ──
  return (
    <div className="min-h-screen bg-background relative">
      <div className="fixed inset-0 dot-grid pointer-events-none" />
      <div className="blob-bg"><div className="blob blob-1" /><div className="blob blob-2" /><div className="blob blob-3" /></div>
      <DashboardNavbar />
      <div className="flex relative z-10">
        <DashboardSidebar />
        <main className="flex-1 p-4 md:p-6 pb-24 md:pb-6 flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <NavLink to="/dashboard" className="p-2 rounded-xl hover:bg-muted/50">
                <ArrowLeft className="w-5 h-5 text-muted-foreground" />
              </NavLink>
              <h1 className="font-heading font-bold text-2xl">Roadmaps</h1>
            </div>
            <button onClick={handleNewRoadmapClick} className="btn-pill bg-accent text-accent-foreground flex items-center gap-2">
              <Plus className="w-4 h-4" /> New Roadmap
            </button>
          </div>

          {roadmaps.length === 0 ? (
            <div className="clay-card p-12 text-center">
              <p className="text-4xl mb-3">🗺️</p>
              <p className="font-heading font-bold text-lg text-foreground mb-1">No roadmaps yet!</p>
              <p className="font-body text-sm text-muted-foreground">Create your first roadmap to start planning your journey</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {roadmaps.map((rm, idx) => {
                const palette = CARD_PALETTES[idx % CARD_PALETTES.length];
                const circ = 2 * Math.PI * 34;
                const off = circ - (rm.progress_percent / 100) * circ;
                return (
                  <button key={rm.id} onClick={() => selectRoadmap(rm.id)}
                    className="rounded-3xl p-6 flex flex-col gap-4 text-left transition-all duration-300 hover:-translate-y-2"
                    style={{
                      background: `linear-gradient(145deg, ${palette.bg} 0%, white 100%)`,
                      boxShadow: `inset 0 2px 8px rgba(255,255,255,0.85), 0 12px 40px -8px ${palette.ring}44, 0 4px 16px -4px ${palette.ring}33`,
                    }}
                  >
                    {/* Title */}
                    <h3 className="font-heading font-extrabold text-base leading-tight" style={{ color: palette.text }}>
                      {rm.title}
                    </h3>

                    {/* Progress ring + meta */}
                    <div className="flex items-center gap-4">
                      <div className="relative w-20 h-20 flex-shrink-0">
                        <svg className="w-full h-full -rotate-90" viewBox="0 0 84 84">
                          <circle cx="42" cy="42" r="34" fill="none" stroke={`${palette.ring}22`} strokeWidth="7" />
                          <circle cx="42" cy="42" r="34" fill="none" stroke={palette.ring}
                            strokeWidth="7" strokeLinecap="round"
                            strokeDasharray={circ} strokeDashoffset={off}
                            style={{ transition: "stroke-dashoffset 0.6s ease", filter: `drop-shadow(0 0 5px ${palette.ring}99)` }}
                          />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <span className="font-heading font-extrabold text-sm" style={{ color: palette.text }}>
                            {rm.progress_percent}%
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-col gap-1.5 text-xs font-body">
                        {rm.target_date ? (
                          <div className="flex items-center gap-1" style={{ color: palette.text }}>
                            <Calendar className="w-3.5 h-3.5" />
                            <span>
                              {new Date(rm.target_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                            </span>
                          </div>
                        ) : (
                          <span className="text-muted-foreground">No target date</span>
                        )}
                        {rm.description && (
                          <p className="text-muted-foreground line-clamp-2 text-[11px]">{rm.description}</p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-1 text-xs font-heading font-bold mt-auto" style={{ color: palette.ring }}>
                      View details <ChevronRight className="w-3.5 h-3.5" />
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </main>
      </div>
      <MobileBottomNav />

      {/* New Roadmap Modal */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-foreground/20 backdrop-blur-sm" onClick={() => setShowNewModal(false)} />
          <div className="relative clay-card bg-white p-8 w-full max-w-md mx-4 flex flex-col gap-5">
            <div className="flex items-center justify-between">
              <h2 className="font-heading font-bold text-xl">New Roadmap</h2>
              <button onClick={() => setShowNewModal(false)} className="p-1 rounded-xl hover:bg-muted/50"><X className="w-5 h-5" /></button>
            </div>
            <div>
              <label className="text-xs font-body font-medium text-muted-foreground mb-1 block">Title</label>
              <input value={newTitle} onChange={e => setNewTitle(e.target.value)} placeholder="e.g. Learn React"
                className="w-full px-4 py-3 rounded-xl border border-border bg-white font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
            </div>
            <div>
              <label className="text-xs font-body font-medium text-muted-foreground mb-1 block">Description</label>
              <textarea value={newDesc} onChange={e => setNewDesc(e.target.value)} placeholder="What's this roadmap about?"
                className="w-full px-4 py-3 rounded-xl border border-border bg-white font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none h-20" />
            </div>
            <div>
              <label className="text-xs font-body font-medium text-muted-foreground mb-1 block">Target Date</label>
              <input type="date" value={newTarget} onChange={e => setNewTarget(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-border bg-white font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
            </div>
            <button onClick={createRoadmap} disabled={!newTitle.trim()} className="btn-pill bg-accent text-accent-foreground w-full py-3.5 disabled:opacity-50">
              Create Roadmap 🗺️
            </button>
          </div>
        </div>
      )}

      {/* Upgrade Modal */}
      <UpgradeModal open={upgradeModalOpen} onClose={() => setUpgradeModalOpen(false)} message="You've reached the free plan limit of 1 roadmap." />
    </div>
  );
};

export default Roadmap;

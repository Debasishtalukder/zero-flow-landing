import { useState, useEffect, useCallback } from "react";
import { ArrowLeft, Plus, CheckCircle, Circle, ChevronRight, X } from "lucide-react";
import { NavLink } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import DashboardNavbar from "@/components/dashboard/DashboardNavbar";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import MobileBottomNav from "@/components/dashboard/MobileBottomNav";
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

const Roadmap = () => {
  const { user } = useAuth();
  const [roadmaps, setRoadmaps] = useState<RoadmapItem[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewModal, setShowNewModal] = useState(false);
  const [showMilestoneModal, setShowMilestoneModal] = useState(false);

  // New roadmap form
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newTarget, setNewTarget] = useState("");

  // New milestone form
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

  const createRoadmap = async () => {
    if (!user || !newTitle.trim()) return;
    const { error } = await supabase.from("roadmaps").insert({
      user_id: user.id, title: newTitle.trim(), description: newDesc, target_date: newTarget || null,
    });
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else { toast({ title: "Roadmap created! 🗺️" }); setNewTitle(""); setNewDesc(""); setNewTarget(""); setShowNewModal(false); loadRoadmaps(); }
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
    await supabase.from("milestones").update({ completed: !ms.completed }).eq("id", ms.id);
    loadMilestones(selectedId);
    updateProgress(selectedId);
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
        <DashboardNavbar />
        <div className="flex relative z-10">
          <DashboardSidebar />
          <main className="flex-1 p-6 flex flex-col gap-6 max-w-5xl">
            {[1,2,3].map(i => <Skeleton key={i} className="h-36 rounded-2xl" />)}
          </main>
        </div>
      </div>
    );
  }

  // Detail view
  if (selected) {
    const circumference = 2 * Math.PI * 42;
    const offset = circumference - (selected.progress_percent / 100) * circumference;

    return (
      <div className="min-h-screen bg-background relative">
        <div className="fixed inset-0 dot-grid pointer-events-none" />
        <DashboardNavbar />
        <div className="flex relative z-10">
          <DashboardSidebar />
          <main className="flex-1 p-4 md:p-6 pb-24 md:pb-6 flex flex-col gap-6 max-w-3xl">
            <div className="flex items-center gap-3">
              <button onClick={() => setSelectedId(null)} className="p-2 rounded-xl hover:bg-muted/50">
                <ArrowLeft className="w-5 h-5 text-muted-foreground" />
              </button>
              <h1 className="font-heading font-bold text-2xl">{selected.title}</h1>
            </div>

            <div className="flex items-center gap-6">
              <div className="relative w-24 h-24">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="42" fill="none" stroke="hsl(var(--muted))" strokeWidth="8" />
                  <circle cx="50" cy="50" r="42" fill="none" stroke="hsl(var(--primary))" strokeWidth="8" strokeLinecap="round"
                    strokeDasharray={circumference} strokeDashoffset={offset} />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center font-heading font-bold text-lg">{selected.progress_percent}%</span>
              </div>
              <div>
                <p className="text-sm font-body text-muted-foreground">Target: {selected.target_date || "No date set"}</p>
                <p className="text-sm font-body text-muted-foreground">{milestones.filter(m => m.completed).length}/{milestones.length} milestones</p>
              </div>
            </div>

            <button onClick={() => setShowMilestoneModal(true)}
              className="btn-pill bg-accent text-accent-foreground self-start flex items-center gap-2">
              <Plus className="w-4 h-4" /> Add Milestone
            </button>

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
                      <button onClick={() => toggleMilestone(m)}>
                        {m.completed ? <CheckCircle className="w-6 h-6 text-emerald-500 flex-shrink-0" /> : <Circle className="w-6 h-6 text-muted-foreground/40 flex-shrink-0" />}
                      </button>
                      {i < milestones.length - 1 && <div className={`w-0.5 flex-1 min-h-[40px] ${m.completed ? "bg-emerald-300" : "bg-muted"}`} />}
                    </div>
                    <div className="clay-card-sm p-4 mb-3 flex-1" style={{ backgroundColor: m.completed ? "#E8FDF5" : "white" }}>
                      <p className="font-heading font-bold text-sm">{m.title}</p>
                      {m.due_date && <p className="text-[11px] font-body text-muted-foreground">Due: {m.due_date}</p>}
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
                  className="w-full px-4 py-3 rounded-xl border border-border bg-white font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
              </div>
              <div>
                <label className="text-xs font-body font-medium text-muted-foreground mb-1 block">Due Date</label>
                <input type="date" value={msDue} onChange={e => setMsDue(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-white font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
              </div>
              <button onClick={createMilestone} disabled={!msTitle.trim()} className="btn-pill bg-accent text-accent-foreground w-full py-3.5 disabled:opacity-50">
                Add Milestone
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // List view
  return (
    <div className="min-h-screen bg-background relative">
      <div className="fixed inset-0 dot-grid pointer-events-none" />
      <DashboardNavbar />
      <div className="flex relative z-10">
        <DashboardSidebar />
        <main className="flex-1 p-4 md:p-6 pb-24 md:pb-6 flex flex-col gap-6 max-w-5xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <NavLink to="/dashboard" className="p-2 rounded-xl hover:bg-muted/50">
                <ArrowLeft className="w-5 h-5 text-muted-foreground" />
              </NavLink>
              <h1 className="font-heading font-bold text-2xl">Roadmaps</h1>
            </div>
            <button onClick={() => setShowNewModal(true)} className="btn-pill bg-accent text-accent-foreground flex items-center gap-2">
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {roadmaps.map((rm) => {
                const circ = 2 * Math.PI * 30;
                const off = circ - (rm.progress_percent / 100) * circ;
                const colors = ["#E8F4FF", "#E8FDF5", "#F3E8FF", "#FFF0E6", "#FFFBE6", "#EDE9FE"];
                const color = colors[roadmaps.indexOf(rm) % colors.length];
                return (
                  <button key={rm.id} onClick={() => selectRoadmap(rm.id)}
                    className="clay-card p-5 flex flex-col gap-3 text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                    style={{ backgroundColor: color }}>
                    <h3 className="font-heading font-bold text-sm">{rm.title}</h3>
                    <div className="flex items-center gap-3">
                      <div className="relative w-14 h-14">
                        <svg className="w-full h-full -rotate-90" viewBox="0 0 80 80">
                          <circle cx="40" cy="40" r="30" fill="none" stroke="white" strokeWidth="6" opacity={0.5} />
                          <circle cx="40" cy="40" r="30" fill="none" stroke="hsl(var(--primary))" strokeWidth="6" strokeLinecap="round"
                            strokeDasharray={circ} strokeDashoffset={off} />
                        </svg>
                        <span className="absolute inset-0 flex items-center justify-center text-xs font-heading font-bold">{rm.progress_percent}%</span>
                      </div>
                      <div className="text-xs font-body text-muted-foreground">
                        <p>Target: {rm.target_date || "—"}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-primary text-xs font-heading font-bold">
                      View details <ChevronRight className="w-3 h-3" />
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
              Create Roadmap
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Roadmap;

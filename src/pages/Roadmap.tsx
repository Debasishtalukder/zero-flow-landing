import { useState } from "react";
import { ArrowLeft, Plus, CheckCircle, Circle, ChevronRight } from "lucide-react";
import { NavLink } from "react-router-dom";
import DashboardNavbar from "@/components/dashboard/DashboardNavbar";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import MobileBottomNav from "@/components/dashboard/MobileBottomNav";

interface Milestone {
  title: string;
  dueDate: string;
  tasks: string[];
  completed: boolean;
}

interface RoadmapItem {
  title: string;
  progress: number;
  milestones: Milestone[];
  targetDate: string;
  color: string;
}

const sampleRoadmaps: RoadmapItem[] = [
  {
    title: "Learn React",
    progress: 65,
    targetDate: "Apr 30, 2026",
    color: "#E8F4FF",
    milestones: [
      { title: "Components & Props", dueDate: "Feb 15", tasks: ["Study docs", "Build 3 components"], completed: true },
      { title: "State Management", dueDate: "Mar 1", tasks: ["Learn useState/useReducer", "Build todo app"], completed: true },
      { title: "API Integration", dueDate: "Mar 20", tasks: ["Fetch data", "Error handling"], completed: false },
      { title: "Testing", dueDate: "Apr 15", tasks: ["Unit tests", "Integration tests"], completed: false },
    ],
  },
  {
    title: "Fitness Goal",
    progress: 40,
    targetDate: "Jun 30, 2026",
    color: "#E8FDF5",
    milestones: [
      { title: "Build routine", dueDate: "Feb 1", tasks: ["5x/week workouts"], completed: true },
      { title: "Run 5K", dueDate: "Mar 15", tasks: ["Couch to 5K program"], completed: false },
      { title: "10K Goal", dueDate: "May 1", tasks: ["Increase distance"], completed: false },
    ],
  },
  {
    title: "Spanish B1",
    progress: 25,
    targetDate: "Dec 31, 2026",
    color: "#F3E8FF",
    milestones: [
      { title: "A1 Basics", dueDate: "Jan 30", tasks: ["Duolingo daily", "Basic phrases"], completed: true },
      { title: "A2 Grammar", dueDate: "Apr 30", tasks: ["Verb conjugations", "Past tense"], completed: false },
      { title: "B1 Conversation", dueDate: "Sep 30", tasks: ["Language exchange", "Watch shows"], completed: false },
    ],
  },
];

const Roadmap = () => {
  const [selectedRoadmap, setSelectedRoadmap] = useState<RoadmapItem | null>(null);

  if (selectedRoadmap) {
    const circumference = 2 * Math.PI * 42;
    const offset = circumference - (selectedRoadmap.progress / 100) * circumference;

    return (
      <div className="min-h-screen bg-background relative">
        <div className="fixed inset-0 dot-grid pointer-events-none" />
        <DashboardNavbar />
        <div className="flex relative z-10">
          <DashboardSidebar />
          <main className="flex-1 p-4 md:p-6 pb-24 md:pb-6 flex flex-col gap-6 max-w-3xl">
            <div className="flex items-center gap-3">
              <button onClick={() => setSelectedRoadmap(null)} className="p-2 rounded-xl hover:bg-muted/50">
                <ArrowLeft className="w-5 h-5 text-muted-foreground" />
              </button>
              <h1 className="font-heading font-bold text-2xl">{selectedRoadmap.title}</h1>
            </div>

            {/* Progress */}
            <div className="flex items-center gap-6">
              <div className="relative w-24 h-24">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="42" fill="none" stroke="hsl(var(--muted))" strokeWidth="8" />
                  <circle cx="50" cy="50" r="42" fill="none" stroke="hsl(var(--primary))" strokeWidth="8" strokeLinecap="round"
                    strokeDasharray={circumference} strokeDashoffset={offset} />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center font-heading font-bold text-lg">{selectedRoadmap.progress}%</span>
              </div>
              <div>
                <p className="text-sm font-body text-muted-foreground">Target: {selectedRoadmap.targetDate}</p>
                <p className="text-sm font-body text-muted-foreground">
                  {selectedRoadmap.milestones.filter((m) => m.completed).length}/{selectedRoadmap.milestones.length} milestones
                </p>
              </div>
            </div>

            {/* Timeline */}
            <div className="flex flex-col gap-0">
              {selectedRoadmap.milestones.map((m, i) => (
                <div key={i} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    {m.completed ? (
                      <CheckCircle className="w-6 h-6 text-emerald-500 flex-shrink-0" />
                    ) : (
                      <Circle className="w-6 h-6 text-muted-foreground/40 flex-shrink-0" />
                    )}
                    {i < selectedRoadmap.milestones.length - 1 && (
                      <div className={`w-0.5 flex-1 min-h-[40px] ${m.completed ? "bg-emerald-300" : "bg-muted"}`} />
                    )}
                  </div>
                  <div className="clay-card-sm p-4 mb-3 flex-1" style={{ backgroundColor: m.completed ? "#E8FDF5" : "white" }}>
                    <p className="font-heading font-bold text-sm">{m.title}</p>
                    <p className="text-[11px] font-body text-muted-foreground mb-2">Due: {m.dueDate}</p>
                    <div className="flex flex-col gap-1">
                      {m.tasks.map((t, ti) => (
                        <p key={ti} className="text-xs font-body text-muted-foreground">• {t}</p>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </main>
        </div>
        <MobileBottomNav />
      </div>
    );
  }

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
            <button className="btn-pill bg-accent text-accent-foreground flex items-center gap-2">
              <Plus className="w-4 h-4" /> New Roadmap
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {sampleRoadmaps.map((rm) => {
              const circ = 2 * Math.PI * 30;
              const off = circ - (rm.progress / 100) * circ;
              return (
                <button
                  key={rm.title}
                  onClick={() => setSelectedRoadmap(rm)}
                  className="clay-card p-5 flex flex-col gap-3 text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                  style={{ backgroundColor: rm.color }}
                >
                  <h3 className="font-heading font-bold text-sm">{rm.title}</h3>
                  <div className="flex items-center gap-3">
                    <div className="relative w-14 h-14">
                      <svg className="w-full h-full -rotate-90" viewBox="0 0 80 80">
                        <circle cx="40" cy="40" r="30" fill="none" stroke="white" strokeWidth="6" opacity={0.5} />
                        <circle cx="40" cy="40" r="30" fill="none" stroke="hsl(var(--primary))" strokeWidth="6" strokeLinecap="round"
                          strokeDasharray={circ} strokeDashoffset={off} />
                      </svg>
                      <span className="absolute inset-0 flex items-center justify-center text-xs font-heading font-bold">{rm.progress}%</span>
                    </div>
                    <div className="text-xs font-body text-muted-foreground">
                      <p>{rm.milestones.length} milestones</p>
                      <p>Target: {rm.targetDate}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-primary text-xs font-heading font-bold">
                    View details <ChevronRight className="w-3 h-3" />
                  </div>
                </button>
              );
            })}
          </div>
        </main>
      </div>
      <MobileBottomNav />
    </div>
  );
};

export default Roadmap;

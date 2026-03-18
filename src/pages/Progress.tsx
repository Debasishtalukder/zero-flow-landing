import { ArrowLeft, TrendingUp, TrendingDown, Flame, Clock, CheckCircle } from "lucide-react";
import { NavLink } from "react-router-dom";
import DashboardNavbar from "@/components/dashboard/DashboardNavbar";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import MobileBottomNav from "@/components/dashboard/MobileBottomNav";

const heatmapData = [
  [3, 5, 4, 2, 6, 5, 4],
  [4, 6, 5, 3, 5, 6, 3],
];

const scoreData = [72, 78, 65, 80, 87, 75, 82, 90, 85, 70, 88, 92, 79, 87];

const Progress = () => {
  const maxScore = Math.max(...scoreData);
  const minIdx = scoreData.indexOf(Math.min(...scoreData));

  return (
    <div className="min-h-screen bg-background relative">
      <div className="fixed inset-0 dot-grid pointer-events-none" />
      <DashboardNavbar />
      <div className="flex relative z-10">
        <DashboardSidebar />
        <main className="flex-1 p-4 md:p-6 pb-24 md:pb-6 flex flex-col gap-6 max-w-5xl">
          <div className="flex items-center gap-3">
            <NavLink to="/dashboard" className="p-2 rounded-xl hover:bg-muted/50">
              <ArrowLeft className="w-5 h-5 text-muted-foreground" />
            </NavLink>
            <h1 className="font-heading font-bold text-2xl text-foreground">Progress</h1>
          </div>

          {/* Weekly Heatmap */}
          <div className="clay-card p-5 flex flex-col gap-3">
            <h3 className="font-heading font-bold text-sm">Weekly Completion Heatmap</h3>
            <div className="flex flex-col gap-1">
              {heatmapData.map((week, wi) => (
                <div key={wi} className="flex gap-1">
                  {week.map((val, di) => (
                    <div
                      key={di}
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-[10px] font-bold text-white"
                      style={{
                        backgroundColor: `hsl(255, 92%, ${90 - val * 8}%)`,
                      }}
                    >
                      {val}
                    </div>
                  ))}
                </div>
              ))}
              <div className="flex gap-1 mt-1">
                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
                  <span key={d} className="w-10 text-center text-[9px] text-muted-foreground font-body">{d}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Score Chart */}
          <div className="clay-card p-5 flex flex-col gap-3">
            <h3 className="font-heading font-bold text-sm">Daily Life Score (14 days)</h3>
            <div className="flex items-end gap-1 h-32">
              {scoreData.map((score, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-[8px] text-muted-foreground">{score}</span>
                  <div
                    className="w-full rounded-t-lg transition-all"
                    style={{
                      height: `${(score / maxScore) * 100}%`,
                      backgroundColor: `hsl(255, 92%, ${80 - (score / maxScore) * 20}%)`,
                    }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="clay-card p-5 flex items-center gap-4" style={{ backgroundColor: "#E8FDF5" }}>
              <TrendingUp className="w-8 h-8 text-emerald-500" />
              <div>
                <p className="font-heading font-bold text-sm">Best Day This Week</p>
                <p className="text-2xl font-heading font-extrabold text-emerald-500">Tuesday — 92</p>
              </div>
            </div>
            <div className="clay-card p-5 flex items-center gap-4" style={{ backgroundColor: "#FFF0E6" }}>
              <TrendingDown className="w-8 h-8 text-orange-500" />
              <div>
                <p className="font-heading font-bold text-sm">Needs Improvement</p>
                <p className="text-lg font-heading font-bold text-orange-500">Learn Spanish — 20%</p>
              </div>
            </div>
          </div>

          {/* Weekly Summary */}
          <div className="clay-card p-5">
            <h3 className="font-heading font-bold text-sm mb-4">Weekly Summary</h3>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <CheckCircle className="w-6 h-6 text-emerald-500 mx-auto mb-1" />
                <p className="font-heading font-extrabold text-2xl text-foreground">28</p>
                <p className="text-xs font-body text-muted-foreground">Tasks Completed</p>
              </div>
              <div>
                <Clock className="w-6 h-6 text-primary mx-auto mb-1" />
                <p className="font-heading font-extrabold text-2xl text-foreground">12.5h</p>
                <p className="text-xs font-body text-muted-foreground">Focus Time</p>
              </div>
              <div>
                <Flame className="w-6 h-6 text-orange-500 mx-auto mb-1" />
                <p className="font-heading font-extrabold text-2xl text-foreground">7</p>
                <p className="text-xs font-body text-muted-foreground">Day Streak</p>
              </div>
            </div>
          </div>
        </main>
      </div>
      <MobileBottomNav />
    </div>
  );
};

export default Progress;

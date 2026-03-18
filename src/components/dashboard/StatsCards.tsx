import { BarChart3, Clock } from "lucide-react";

interface StatsCardsProps {
  score: number;
  completed: number;
  total: number;
  freeHours: number;
}

const StatsCards = ({ score, completed, total, freeHours }: StatsCardsProps) => {
  const scoreColor = score >= 70 ? "text-green-500" : score >= 40 ? "text-yellow-500" : "text-red-400";
  const scoreMsg = score >= 70 ? "Great day so far!" : score >= 40 ? "Keep going!" : "Let's get started!";
  const fraction = total > 0 ? completed / total : 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div className="clay-card p-5 flex items-center gap-4" style={{ boxShadow: "inset 0 4px 6px rgba(255,255,255,0.9), 0 20px 40px -10px rgba(72,187,120,0.2)" }}>
        <div className="w-14 h-14 rounded-2xl bg-green-100 flex items-center justify-center">
          <BarChart3 className="w-6 h-6 text-green-500" />
        </div>
        <div>
          <p className={`font-heading font-extrabold text-3xl ${scoreColor}`}>{score}</p>
          <p className="text-xs font-body text-muted-foreground">Today's Score</p>
          <p className={`text-[10px] font-body ${scoreColor}`}>{scoreMsg}</p>
        </div>
      </div>

      <div className="clay-card p-5 flex items-center gap-4">
        <div className="relative w-14 h-14">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="42" fill="none" stroke="hsl(var(--muted))" strokeWidth="8" />
            <circle cx="50" cy="50" r="42" fill="none" stroke="hsl(var(--primary))" strokeWidth="8" strokeLinecap="round"
              strokeDasharray={`${fraction * 2 * Math.PI * 42} ${2 * Math.PI * 42}`} />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-xs font-heading font-bold">{completed}/{total}</span>
        </div>
        <div>
          <p className="font-heading font-extrabold text-xl text-foreground">{completed}/{total} completed</p>
          <p className="text-xs font-body text-muted-foreground">Tasks Today</p>
        </div>
      </div>

      <div className="clay-card p-5 flex items-center gap-4" style={{ boxShadow: "inset 0 4px 6px rgba(255,255,255,0.9), 0 20px 40px -10px rgba(72,187,120,0.15)" }}>
        <div className="w-14 h-14 rounded-2xl bg-emerald-100 flex items-center justify-center">
          <Clock className="w-6 h-6 text-emerald-500" />
        </div>
        <div>
          <p className="font-heading font-extrabold text-3xl text-emerald-500">{freeHours.toFixed(1)}</p>
          <p className="text-xs font-body text-muted-foreground">Free Time Left</p>
          <p className="text-[10px] font-body text-muted-foreground">hrs remaining</p>
        </div>
      </div>
    </div>
  );
};

export default StatsCards;

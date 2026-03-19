import { BarChart3, Clock } from "lucide-react";

interface StatsCardsProps {
  score: number;
  completed: number;
  total: number;
  freeHours: number;
}

const StatsCards = ({ score, completed, total, freeHours }: StatsCardsProps) => {
  const scoreMsg = score >= 70 ? "Great day! 🎉" : score >= 40 ? "Keep going! 💪" : "Let's go! 🌊";
  const fraction = total > 0 ? completed / total : 0;
  const circ = 2 * Math.PI * 22;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
      {/* Score card — warm green gradient */}
      <div
        className="rounded-3xl p-6 flex items-center gap-5"
        style={{
          background: "linear-gradient(145deg, #C8F5D0 0%, #E8FDF5 100%)",
          boxShadow: "inset 0 2px 8px rgba(255,255,255,0.85), 0 16px 48px -10px rgba(34,197,94,0.35), 0 4px 16px -4px rgba(34,197,94,0.2)",
        }}
      >
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0"
          style={{ background: "rgba(255,255,255,0.75)", boxShadow: "0 4px 16px rgba(34,197,94,0.25)" }}
        >
          <BarChart3 className="w-8 h-8 text-emerald-500" />
        </div>
        <div>
          <p className="font-heading font-black text-5xl leading-none text-emerald-600">{score}</p>
          <p className="text-xs font-heading font-bold text-emerald-700 opacity-80 mt-0.5">Today's Score</p>
          <p className="text-[11px] font-body text-emerald-600 mt-1">{scoreMsg}</p>
        </div>
      </div>

      {/* Tasks card — soft blue gradient */}
      <div
        className="rounded-3xl p-6 flex items-center gap-5"
        style={{
          background: "linear-gradient(145deg, #C5E8FF 0%, #E8F4FF 100%)",
          boxShadow: "inset 0 2px 8px rgba(255,255,255,0.85), 0 16px 48px -10px rgba(59,130,246,0.35), 0 4px 16px -4px rgba(59,130,246,0.2)",
        }}
      >
        <div className="relative w-14 h-14 flex-shrink-0">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 56 56">
            <circle cx="28" cy="28" r="22" fill="none" stroke="rgba(59,130,246,0.15)" strokeWidth="6" />
            <circle cx="28" cy="28" r="22" fill="none" stroke="#3B82F6" strokeWidth="6" strokeLinecap="round"
              strokeDasharray={`${fraction * circ} ${circ}`}
              style={{ transition: "stroke-dasharray 0.7s cubic-bezier(.4,0,.2,1)", filter: "drop-shadow(0 0 4px rgba(59,130,246,0.6))" }}
            />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-xs font-heading font-black text-blue-700">
            {completed}/{total}
          </span>
        </div>
        <div>
          <p className="font-heading font-black text-3xl text-blue-700 leading-none">
            {completed}<span className="text-lg opacity-60">/{total}</span>
          </p>
          <p className="text-xs font-heading font-bold text-blue-600 opacity-80 mt-0.5">Tasks Today</p>
          <p className="text-[11px] font-body text-blue-500 mt-1">{fraction === 1 && total > 0 ? "All done! 🚀" : "Stay in flow!"}</p>
        </div>
      </div>

      {/* Free time card — soft violet gradient */}
      <div
        className="rounded-3xl p-6 flex items-center gap-5"
        style={{
          background: "linear-gradient(145deg, #E9D5FF 0%, #F3E8FF 100%)",
          boxShadow: "inset 0 2px 8px rgba(255,255,255,0.85), 0 16px 48px -10px rgba(147,51,234,0.35), 0 4px 16px -4px rgba(147,51,234,0.2)",
        }}
      >
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0"
          style={{ background: "rgba(255,255,255,0.75)", boxShadow: "0 4px 16px rgba(147,51,234,0.25)" }}
        >
          <Clock className="w-8 h-8 text-violet-500" />
        </div>
        <div>
          <p className="font-heading font-black text-5xl leading-none text-violet-600">{freeHours.toFixed(1)}</p>
          <p className="text-xs font-heading font-bold text-violet-700 opacity-80 mt-0.5">Free Time Left</p>
          <p className="text-[11px] font-body text-violet-500 mt-1">hrs remaining ✨</p>
        </div>
      </div>
    </div>
  );
};

export default StatsCards;

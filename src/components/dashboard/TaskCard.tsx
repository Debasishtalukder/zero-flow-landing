import { Check, X, MoreHorizontal, Flame } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface TaskCardProps {
  id: string;
  name: string;
  duration: string;
  dayProgress: string;
  percentage: number;
  bgColor: string;
  todayStatus?: string;
  onDone: () => void;
  onMissed: () => void;
}

const TaskCard = ({ name, duration, dayProgress, percentage, bgColor, todayStatus, onDone, onMissed }: TaskCardProps) => {
  const circumference = 2 * Math.PI * 30;
  const offset = circumference - (percentage / 100) * circumference;

  const handleDone = () => {
    onDone();
    toast({ title: `${name} completed ✓`, description: "Great job! Keep it up!" });
  };

  const handleMissed = () => {
    onMissed();
    toast({ title: `${name} missed`, description: "Don't worry, try again tomorrow!", variant: "destructive" });
  };

  return (
    <div
      className="clay-card-sm p-5 flex flex-col gap-3 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl cursor-pointer"
      style={{ backgroundColor: bgColor }}
    >
      <div className="flex items-start justify-between">
        <h3 className="font-heading font-bold text-sm text-foreground">{name}</h3>
        <button className="p-1 rounded-lg hover:bg-white/50 transition-colors">
          <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>

      <div className="flex items-center gap-2">
        <span className="px-3 py-1 rounded-full bg-white/60 text-[11px] font-body font-medium text-foreground">{duration}</span>
        <span className="text-[11px] font-body text-muted-foreground">{dayProgress}</span>
      </div>

      <div className="flex items-center justify-between">
        <div className="relative w-16 h-16">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 80 80">
            <circle cx="40" cy="40" r="30" fill="none" stroke="white" strokeWidth="6" opacity={0.5} />
            <circle cx="40" cy="40" r="30" fill="none" stroke="hsl(var(--primary))" strokeWidth="6" strokeLinecap="round"
              strokeDasharray={circumference} strokeDashoffset={offset} />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-xs font-heading font-bold">{percentage}%</span>
        </div>

        <div className="flex items-center gap-2">
          {todayStatus === "completed" ? (
            <span className="px-3 py-1.5 rounded-full bg-green-200 text-green-700 text-xs font-bold">Done ✓</span>
          ) : todayStatus === "missed" ? (
            <span className="px-3 py-1.5 rounded-full bg-red-200 text-red-700 text-xs font-bold">Missed</span>
          ) : (
            <>
              <button onClick={handleDone} className="btn-pill px-3 py-1.5 bg-green-100 text-green-600 text-xs hover:bg-green-200">
                <Check className="w-3.5 h-3.5" />
              </button>
              <button onClick={handleMissed} className="btn-pill px-3 py-1.5 bg-red-100 text-red-500 text-xs hover:bg-red-200">
                <X className="w-3.5 h-3.5" />
              </button>
            </>
          )}
          {todayStatus === "completed" && <Flame className="w-4 h-4 text-orange-500" />}
        </div>
      </div>
    </div>
  );
};

export default TaskCard;

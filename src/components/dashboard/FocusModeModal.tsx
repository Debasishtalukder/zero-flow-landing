import { useState, useEffect } from "react";
import { Play, Pause, RotateCcw, X, Lock } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

interface FocusModeModalProps {
  open: boolean;
  onClose: () => void;
  taskName: string;
  accentColor: string;
}

const FocusModeModal = ({ open, onClose, taskName, accentColor }: FocusModeModalProps) => {
  const { userProfile } = useAuth();
  const navigate = useNavigate();
  
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [sessionsCompleted, setSessionsCompleted] = useState(0);

  const isFree = userProfile?.plan !== "pro";

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      setIsRunning(false);
      setSessionsCompleted((prev) => prev + 1);
      // Play a sound or notification here
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  const toggleTimer = () => setIsRunning(!isRunning);
  
  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(25 * 60);
  };

  if (!open) return null;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const progress = ((25 * 60 - timeLeft) / (25 * 60)) * 100;

  // Pro Gate
  if (isFree) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/60 backdrop-blur-md animate-in fade-in duration-300" onClick={onClose} />
        <div className="clay-card bg-background p-8 w-full max-w-sm relative z-10 flex flex-col items-center text-center animate-in zoom-in-95 duration-300 border border-violet-100">
          <button onClick={onClose} className="absolute top-4 right-4 text-muted-foreground hover:bg-muted p-2 rounded-full">
            <X className="w-5 h-5" />
          </button>
          
          <div className="w-16 h-16 rounded-full bg-violet-100 flex items-center justify-center text-violet-600 mb-4 shadow-[0_0_20px_rgba(139,92,246,0.3)]">
            <Lock className="w-8 h-8" />
          </div>
          
          <h2 className="font-heading font-extrabold text-2xl text-foreground mb-2">Pro Feature</h2>
          <p className="text-sm font-body text-muted-foreground mb-6">
            Focus Mode requires a Pro subscription. Upgrade to unlock the full-screen Pomodoro timer and deeply focus on your tasks.
          </p>
          
          <button 
            onClick={() => { onClose(); navigate("/upgrade"); }}
            className="w-full py-3 rounded-2xl text-white font-heading font-bold text-sm shadow-md transition-transform hover:scale-105"
            style={{ background: "linear-gradient(135deg, #FF7E67 0%, #FF5A5F 100%)", boxShadow: "0 8px 20px -4px rgba(255,126,103,0.4)" }}
          >
            Upgrade to Pro
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Dark backdrop */}
      <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-xl animate-in fade-in duration-300" />
      
      <div className="relative z-10 w-full max-w-md flex flex-col items-center animate-in slide-in-from-bottom-10 duration-500">
        <button 
          onClick={onClose} 
          className="absolute -top-16 right-0 text-slate-400 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="text-center mb-12">
          <p className="text-slate-400 font-body text-sm uppercase tracking-widest mb-2 font-bold">Focusing On</p>
          <h2 className="text-3xl font-heading font-extrabold text-white">{taskName}</h2>
        </div>

        {/* Timer Circle */}
        <div className="relative w-72 h-72 flex items-center justify-center mb-12">
          {/* Background Ring */}
          <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="4" />
            <circle 
              cx="50" cy="50" r="45" fill="none" 
              stroke={accentColor} 
              strokeWidth="4" 
              strokeDasharray={`${2 * Math.PI * 45}`}
              strokeDashoffset={`${2 * Math.PI * 45 - (progress / 100) * (2 * Math.PI * 45)}`}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-linear"
              style={{ filter: `drop-shadow(0 0 12px ${accentColor}60)` }}
            />
          </svg>
          
          <div className="flex flex-col items-center">
            <span className="font-heading font-black text-7xl text-white tracking-tighter" style={{ textShadow: "0 4px 24px rgba(0,0,0,0.4)" }}>
              {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
            </span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-6">
          <button 
            onClick={resetTimer}
            className="w-14 h-14 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all border border-slate-700/50"
          >
            <RotateCcw className="w-6 h-6" />
          </button>
          
          <button 
            onClick={toggleTimer}
            className="w-20 h-20 rounded-full flex items-center justify-center text-white shadow-xl transition-transform hover:scale-105 active:scale-95"
            style={{ backgroundColor: accentColor, boxShadow: `0 12px 32px -8px ${accentColor}` }}
          >
            {isRunning ? <Pause className="w-8 h-8 fill-current" /> : <Play className="w-8 h-8 fill-current ml-1" />}
          </button>
          
          <div className="w-14 h-14 rounded-full flex flex-col items-center justify-center border border-slate-700/50 bg-slate-800/20 text-slate-300">
            <span className="text-xs font-bold leading-none">{sessionsCompleted}</span>
            <span className="text-[9px] uppercase tracking-wider opacity-70">Done</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FocusModeModal;

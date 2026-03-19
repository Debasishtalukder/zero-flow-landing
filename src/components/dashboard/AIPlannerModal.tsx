import { useState } from "react";
import { Sparkles, CalendarClock, Wand2, X, Lock, Check } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

interface AIPlannerModalProps {
  open: boolean;
  onClose: () => void;
  tasks: any[];
  routine: any;
}

const AIPlannerModal = ({ open, onClose, tasks, routine }: AIPlannerModalProps) => {
  const { userProfile } = useAuth();
  const navigate = useNavigate();
  const [isGenerating, setIsGenerating] = useState(false);
  const [schedule, setSchedule] = useState<any[] | null>(null);

  const isFree = userProfile?.plan !== "pro";

  const handleGenerate = () => {
    setIsGenerating(true);
    // Simulate AI generation delay
    setTimeout(() => {
      // Mock generated schedule based on active tasks
      const activeTasks = tasks.map(t => t.name);
      const newSchedule = [
        { time: "09:00 AM", task: "Deep Work: " + (activeTasks[0] || "Core Project") },
        { time: "11:30 AM", task: "Break / Walk" },
        { time: "12:00 PM", task: activeTasks[1] || "Emails & Admin" },
        { time: "01:30 PM", task: "Lunch & Rest" },
        { time: "02:30 PM", task: "Focus: " + (activeTasks[2] || "Creative Work") },
        { time: "04:00 PM", task: "Learning / Review" },
        { time: "05:00 PM", task: "Wrap up" }
      ];
      setSchedule(newSchedule);
      setIsGenerating(false);
    }, 2500);
  };

  const handleClose = () => {
    setSchedule(null);
    onClose();
  };

  if (!open) return null;

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
            The AI Daily Planner is exclusively available on the Pro plan. Upgrade to let AI optimize your daily schedule.
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
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200" onClick={handleClose} />
      
      <div className="clay-card bg-white p-6 w-full max-w-md relative z-10 flex flex-col animate-in zoom-in-95 duration-200 border border-violet-100 max-h-[85vh] overflow-hidden">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center bg-violet-100 text-violet-600 shadow-[0_0_15px_rgba(139,92,246,0.2)]">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-heading font-extrabold text-xl text-foreground">AI Daily Planner</h2>
              <p className="font-body text-xs text-muted-foreground">Optimize your workflow</p>
            </div>
          </div>
          <button onClick={handleClose} className="text-muted-foreground hover:bg-muted p-2 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
          {!schedule ? (
            <div className="flex flex-col items-center justify-center py-10 text-center px-4">
              <div className={`mb-6 text-violet-500 mb-4 ${isGenerating ? 'animate-pulse' : ''}`}>
                <Wand2 className="w-16 h-16 mx-auto opacity-80" />
              </div>
              <h3 className="font-heading font-bold text-lg mb-2">
                {isGenerating ? "Analyzing your routine..." : "Ready to plan your day?"}
              </h3>
              <p className="font-body text-sm text-muted-foreground mb-8">
                {isGenerating 
                  ? "Our AI is matching your active tasks with your free time slots to create the perfect schedule." 
                  : "We'll look at your tasks, sleep cycle, and free time to build an optimized daily schedule for maximum productivity."}
              </p>
              
              <button 
                onClick={handleGenerate}
                disabled={isGenerating}
                className="btn-pill w-full flex items-center justify-center gap-2 text-white shadow-lg shadow-violet-500/30 disabled:opacity-70 transition-all hover:scale-[1.02]"
                style={{ background: "linear-gradient(135deg, #7C3AED 0%, #9333EA 100%)" }}
              >
                {isGenerating ? (
                  <span className="animate-pulse">Generating Schedule...</span>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" /> Generate Schedule
                  </>
                )}
              </button>
            </div>
          ) : (
            <div className="space-y-4 py-2 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="bg-emerald-50 text-emerald-700 px-4 py-3 rounded-2xl flex items-start gap-3 mb-6 border border-emerald-100">
                <Check className="w-5 h-5 shrink-0 mt-0.5" />
                <p className="text-xs font-body leading-relaxed">
                  <strong>Schedule Ready!</strong> We've distributed your tasks throughout your free hours avoiding your designated gaming and meal times.
                </p>
              </div>
              
              <ul className="relative border-l-2 border-violet-100 ml-3 space-y-6 pb-4">
                {schedule.map((item, i) => (
                  <li key={i} className="relative pl-6">
                    <div className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-violet-400 shadow-[0_0_8px_rgba(139,92,246,0.6)]" />
                    <p className="text-xs font-heading font-bold text-violet-600 mb-0.5">{item.time}</p>
                    <p className="text-sm font-body text-foreground font-medium">{item.task}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIPlannerModal;

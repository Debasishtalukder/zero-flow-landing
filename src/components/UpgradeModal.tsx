import { Sparkles, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface UpgradeModalProps {
  open: boolean;
  onClose: () => void;
  message?: string;
}

const UpgradeModal = ({ open, onClose, message = "You've reached the free plan limit." }: UpgradeModalProps) => {
  const navigate = useNavigate();

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200" 
        onClick={onClose} 
      />
      
      {/* Modal */}
      <div className="clay-card w-full max-w-sm p-6 relative z-10 animate-in zoom-in-95 duration-200 flex flex-col items-center text-center gap-4 border border-violet-100">
        <button 
          onClick={onClose}
          className="absolute top-3 right-3 p-1.5 rounded-full hover:bg-muted/50 text-muted-foreground transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-16 h-16 rounded-full flex items-center justify-center mb-2" style={{ background: "linear-gradient(135deg, #FF7E67 0%, #FFB199 100%)", boxShadow: "0 8px 24px -6px rgba(255,126,103,0.5)" }}>
          <Sparkles className="w-8 h-8 text-white" />
        </div>

        <div>
          <h2 className="font-heading font-extrabold text-xl text-foreground mb-1">Upgrade to Pro</h2>
          <p className="font-body text-sm text-muted-foreground">{message}</p>
        </div>

        <ul className="text-left font-body text-sm text-muted-foreground w-full space-y-2 my-2 bg-muted/30 p-4 rounded-2xl">
          <li className="flex items-center gap-2">✓ Unlimited tasks</li>
          <li className="flex items-center gap-2">✓ Unlimited roadmaps</li>
          <li className="flex items-center gap-2">✓ AI Daily Planner</li>
          <li className="flex items-center gap-2">✓ Focus Mode Timer</li>
          <li className="flex items-center gap-2">✓ 30-day History</li>
        </ul>

        <button 
          onClick={() => { onClose(); navigate("/upgrade"); }}
          className="w-full btn-pill text-white mt-2"
          style={{ background: "linear-gradient(135deg, #FF7E67 0%, #FF5A5F 100%)", boxShadow: "0 8px 20px -4px rgba(255,126,103,0.4)" }}
        >
          Get Pro for $6/mo
        </button>
        <button onClick={onClose} className="text-xs font-body font-bold text-muted-foreground hover:text-foreground mt-1">
          Maybe later
        </button>
      </div>
    </div>
  );
};

export default UpgradeModal;

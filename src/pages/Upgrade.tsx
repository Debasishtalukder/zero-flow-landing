import { useState } from "react";
import { ArrowLeft, Check, Sparkles, Zap } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import DashboardNavbar from "@/components/dashboard/DashboardNavbar";
import ComingSoonModal from "@/components/ui/ComingSoonModal";
import { toast } from "@/hooks/use-toast";

const Upgrade = () => {
  const { user, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  const handleUpgrade = () => {
    if (!user) {
      toast({ title: "Please sign in to upgrade" });
      return;
    }
    setShowModal(true);
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="fixed inset-0 dot-grid pointer-events-none opacity-50" />
      <div className="blob-bg"><div className="blob blob-1" /><div className="blob blob-2" /></div>
      
      <DashboardNavbar />
      
      <div className="relative z-10 max-w-5xl mx-auto px-4 py-8 md:py-16">
        <div className="flex items-center gap-3 mb-10">
          <NavLink to="/dashboard" className="p-2 rounded-xl hover:bg-white/50 bg-white/30 backdrop-blur-md transition-colors">
            <ArrowLeft className="w-5 h-5 text-muted-foreground" />
          </NavLink>
        </div>

        <div className="text-center mb-16 animate-in slide-in-from-bottom-5 duration-500">
          <div className="inline-flex items-center justify-center p-3 rounded-full bg-violet-100 text-violet-600 mb-6 shadow-xl shadow-violet-500/20">
            <Sparkles className="w-8 h-8" />
          </div>
          <h1 className="font-heading font-extrabold text-4xl md:text-5xl lg:text-6xl text-foreground mb-4 tracking-tight">
            Unlock your full <span className="text-gradient-violet-mint">potential</span>
          </h1>
          <p className="font-body text-lg text-muted-foreground max-w-2xl mx-auto">
            Get unlimited access to all ZeroFlow features. Build better habits, organize your life, and achieve your goals faster.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto animate-in zoom-in-95 duration-700 delay-150 fill-mode-both">
          
          {/* Free Tier */}
          <div className="clay-card p-8 flex flex-col h-full bg-white/60 backdrop-blur-lg border-2 border-transparent">
            <h3 className="font-heading font-extrabold text-2xl text-foreground mb-2">Free</h3>
            <div className="flex items-baseline gap-2 mb-6">
              <span className="font-heading font-black text-5xl">$0</span>
              <span className="text-muted-foreground font-body">/ forever</span>
            </div>
            
            <p className="font-body text-sm text-muted-foreground mb-8">
              Perfect for getting started and trying out the core workflow.
            </p>
            
            <ul className="space-y-4 mb-8 flex-1">
              {[
                "Up to 5 active tasks",
                "1 Roadmap",
                "Basic Daily Timeline",
                "7-day Progress History",
              ].map((feature, i) => (
                <li key={i} className="flex items-center gap-3 font-body text-sm text-foreground">
                  <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 shrink-0">
                    <Check className="w-3 h-3" />
                  </div>
                  {feature}
                </li>
              ))}
            </ul>
            
            <button disabled className="w-full py-3 rounded-2xl bg-slate-100 text-slate-400 font-heading font-bold text-sm cursor-not-allowed">
              Current Plan
            </button>
          </div>

          {/* Pro Tier */}
          <div className="clay-card p-8 flex flex-col h-full relative" style={{ background: "linear-gradient(135deg, #ffffff 0%, #F5F3FF 100%)", borderColor: "#8B5CF6", borderWidth: "2px" }}>
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-heading font-bold text-white shadow-lg" style={{ background: "linear-gradient(135deg, #7C3AED 0%, #34C789 100%)" }}>
              MOST POPULAR
            </div>
            
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-heading font-extrabold text-2xl text-violet-700">Pro</h3>
              <Zap className="w-6 h-6 text-violet-500 fill-violet-500" />
            </div>
            <div className="flex items-baseline gap-2 mb-6">
              <span className="font-heading font-black text-5xl text-foreground">$6</span>
              <span className="text-muted-foreground font-body">/ month</span>
            </div>
            
            <p className="font-body text-sm text-muted-foreground mb-8">
              Everything you need to master your time and reach your goals.
            </p>
            
            <ul className="space-y-4 mb-8 flex-1">
              {[
                "Unlimited active tasks",
                "Unlimited Roadmaps",
                "30-day Progress History & Data Export",
                "Focus Mode Timer (Pomodoro)",
                "AI Daily Planner",
                "Custom Themes (Coming Soon)",
              ].map((feature, i) => (
                <li key={i} className="flex items-start gap-3 flex-wrap">
                  <div className="w-5 h-5 rounded-full bg-violet-100 flex items-center justify-center text-violet-600 shrink-0 mt-0.5">
                    <Check className="w-3 h-3" />
                  </div>
                  <span className="font-body text-sm text-foreground font-medium flex-1">{feature}</span>
                </li>
              ))}
            </ul>
            
            <button 
              onClick={handleUpgrade}
              className="w-full py-4 rounded-2xl text-white font-heading font-bold text-sm transition-all hover:scale-[1.02] shadow-[0_8px_20px_-4px_rgba(124,58,237,0.4)] disabled:opacity-70 flex items-center justify-center gap-2"
              style={{ background: "linear-gradient(135deg, #7C3AED 0%, #9333EA 100%)" }}
            >
              Get Pro Now
            </button>
          </div>

        </div>
      </div>
      
      <ComingSoonModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </div>
  );
};

export default Upgrade;

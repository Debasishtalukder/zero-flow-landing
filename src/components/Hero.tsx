import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import heroSplit from "@/assets/hero-split.png";
import heroChaos from "@/assets/hero-chaos.png";
import heroFlow from "@/assets/hero-flow.png";
import { Flame, CalendarDays, Check, BarChart3 } from "lucide-react";

const spring = { type: "spring" as const, stiffness: 80, damping: 20 };
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { ...spring, delay },
});

const float = (delay: number, duration: number) => ({
  initial: { opacity: 0, scale: 0.7, y: 20 },
  animate: { opacity: 1, scale: 1, y: [0, -12, 0] },
  transition: {
    opacity: { delay, duration: 0.5 },
    scale: { delay, ...spring },
    y: { duration, repeat: Infinity, ease: "easeInOut" as const, delay: delay + 0.3 },
  },
});

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center pt-24 pb-20 overflow-hidden">
      <div className="absolute inset-0 dot-grid pointer-events-none" />

      {/* Ambient blobs */}
      <div className="absolute top-10 left-0 w-[500px] h-[500px] bg-primary/8 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-success/8 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-accent/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        {/* Headline */}
        <div className="text-center max-w-4xl mx-auto mb-12">
          <motion.h1
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-heading font-extrabold tracking-tight leading-[1.05] text-foreground mb-6"
            {...fadeUp(0)}
          >
            Stop Surviving. Start Flowing.
          </motion.h1>
          <motion.p
            className="text-lg md:text-xl font-body text-muted-foreground leading-relaxed max-w-2xl mx-auto"
            {...fadeUp(0.1)}
          >
            ZeroFlow organizes your daily life so you actually make progress — beautifully.
          </motion.p>
        </div>

        {/* CTA Buttons */}
        <motion.div
          className="flex flex-wrap items-center justify-center gap-4 mb-16 md:mb-24"
          {...fadeUp(0.2)}
        >
          <button onClick={() => navigate("/signup")} className="btn-pill bg-accent text-accent-foreground shadow-[0_6px_20px_rgba(255,107,107,0.35)] text-lg px-10 py-4">
            Get Started Free
          </button>
          <button onClick={() => { const el = document.querySelector("#how-it-works"); if (el) el.scrollIntoView({ behavior: "smooth" }); }}
            className="btn-pill border-2 border-foreground/12 text-foreground hover:border-foreground/25 bg-transparent text-lg px-10 py-4">
            See How It Works
          </button>
        </motion.div>

        {/* Split visual with floating elements */}
        <div className="relative max-w-5xl mx-auto">

          {/* ===== FLOATING WIDGETS ===== */}

          {/* Top-left: Mint task card */}
          <motion.div
            className="absolute -top-10 -left-4 md:-left-28 z-20 hidden md:block"
            {...float(0.6, 4)}
          >
            <div className="bg-success/15 backdrop-blur-sm rounded-2xl p-4 shadow-[inset_0_2px_4px_rgba(255,255,255,0.8),0_8px_24px_-6px_rgba(52,211,153,0.25)]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-success/20 flex items-center justify-center">
                  <Check size={20} className="text-success" />
                </div>
                <div>
                  <p className="text-xs font-heading font-bold text-foreground">Morning Run</p>
                  <p className="text-[10px] font-body text-muted-foreground">30 min · Done ✓</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Top-right: Progress ring */}
          <motion.div
            className="absolute -top-8 -right-2 md:-right-24 z-20 hidden md:block"
            {...float(0.8, 5)}
          >
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 shadow-[inset_0_2px_4px_rgba(255,255,255,0.8),0_8px_24px_-6px_rgba(167,139,250,0.25)]">
              <div className="relative w-16 h-16 flex items-center justify-center">
                <svg viewBox="0 0 36 36" className="w-16 h-16 -rotate-90">
                  <circle cx="18" cy="18" r="15.5" fill="none" stroke="hsl(var(--muted))" strokeWidth="3" />
                  <circle cx="18" cy="18" r="15.5" fill="none" stroke="hsl(var(--primary))" strokeWidth="3" strokeDasharray="97.4" strokeDashoffset="19.5" strokeLinecap="round" />
                  <circle cx="18" cy="18" r="15.5" fill="none" stroke="hsl(var(--success))" strokeWidth="3" strokeDasharray="97.4" strokeDashoffset="58.4" strokeLinecap="round" />
                </svg>
              </div>
            </div>
          </motion.div>

          {/* Bottom-left: Streak flame */}
          <motion.div
            className="absolute -bottom-8 left-0 md:-left-20 z-20 hidden md:block"
            {...float(1.0, 3.5)}
          >
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl px-5 py-4 shadow-[inset_0_2px_4px_rgba(255,255,255,0.8),0_8px_24px_-6px_rgba(255,107,107,0.2)] flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-accent/15 flex items-center justify-center">
                <Flame size={22} className="text-accent" />
              </div>
              <p className="text-sm font-heading font-bold text-foreground">Streak</p>
            </div>
          </motion.div>

          {/* Bottom-right: Calendar widget */}
          <motion.div
            className="absolute -bottom-10 -right-2 md:-right-28 z-20 hidden md:block"
            {...float(1.2, 4.5)}
          >
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-[inset_0_2px_4px_rgba(255,255,255,0.8),0_8px_24px_-6px_rgba(167,139,250,0.15)]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-body text-muted-foreground">‹</span>
                <span className="text-[10px] font-heading font-bold text-foreground/70">October 2022</span>
                <span className="text-[10px] font-body text-muted-foreground">›</span>
              </div>
              <div className="grid grid-cols-7 gap-[3px]">
                {["S","M","T","W","T","F","S"].map((d,i) => (
                  <span key={i} className="text-[8px] font-body text-muted-foreground text-center w-4">{d}</span>
                ))}
                {Array.from({length: 31}, (_, i) => i + 1).map(d => (
                  <span
                    key={d}
                    className={`text-[8px] font-body text-center w-4 h-4 flex items-center justify-center rounded-full ${
                      d === 1 ? "bg-accent text-accent-foreground font-bold" :
                      d <= 18 ? "text-foreground/50" : "text-foreground/30"
                    }`}
                  >
                    {d}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Mid-right: Flame + check badge */}
          <motion.div
            className="absolute top-[30%] -right-6 md:-right-16 z-20 hidden lg:block"
            {...float(0.9, 5.5)}
          >
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-3 shadow-[inset_0_2px_4px_rgba(255,255,255,0.8),0_8px_20px_-6px_rgba(167,139,250,0.15)] flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-success/15 flex items-center justify-center">
                <Check size={14} className="text-success" />
              </div>
              <Flame size={18} className="text-accent" />
            </div>
          </motion.div>

          {/* ===== MAIN SPLIT VISUAL ===== */}
          <motion.div
            className="rounded-2xl overflow-hidden relative shadow-[0_20px_60px_-15px_rgba(167,139,250,0.2)]"
            initial={{ opacity: 0, y: 50, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ ...spring, delay: 0.3 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 min-h-[340px] md:min-h-[420px]">
              {/* CHAOS SIDE */}
              <div className="relative overflow-hidden">
                <img src={heroChaos} alt="Chaos — scattered tasks and notifications" className="w-full h-full object-cover" />
              </div>

              {/* GLOWING DIVIDER */}
              <div className="hidden md:block absolute left-1/2 top-0 bottom-0 z-30 -translate-x-1/2">
                <div className="w-[3px] h-full bg-gradient-to-b from-primary/20 via-primary to-primary/20 shadow-[0_0_15px_3px_rgba(167,139,250,0.4)]" />
              </div>

              {/* FLOW SIDE */}
              <div className="relative overflow-hidden">
                <img src={heroFlow} alt="Flow — organized tasks with progress" className="w-full h-full object-cover" />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

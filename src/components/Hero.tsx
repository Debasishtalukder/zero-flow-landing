import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Check, AlertCircle, Flame, CalendarDays, Target,
  Bell, Clock, FileWarning, Zap, BarChart3
} from "lucide-react";

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

          {/* ===== FLOATING CARDS (quso.ai style) ===== */}

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
            <div className="bg-primary/10 backdrop-blur-sm rounded-2xl p-5 shadow-[inset_0_2px_4px_rgba(255,255,255,0.8),0_8px_24px_-6px_rgba(167,139,250,0.25)]">
              <div className="relative w-16 h-16 flex items-center justify-center">
                <svg viewBox="0 0 36 36" className="w-16 h-16 -rotate-90">
                  <circle cx="18" cy="18" r="15.5" fill="none" stroke="hsl(var(--muted))" strokeWidth="3" />
                  <circle cx="18" cy="18" r="15.5" fill="none" stroke="hsl(var(--primary))" strokeWidth="3" strokeDasharray="97.4" strokeDashoffset="19.5" strokeLinecap="round" />
                </svg>
                <span className="absolute text-sm font-heading font-extrabold text-primary">80%</span>
              </div>
            </div>
          </motion.div>

          {/* Bottom-left: Streak flame */}
          <motion.div
            className="absolute -bottom-8 left-0 md:-left-20 z-20 hidden md:block"
            {...float(1.0, 3.5)}
          >
            <div className="bg-warm backdrop-blur-sm rounded-2xl px-5 py-4 shadow-[inset_0_2px_4px_rgba(255,255,255,0.8),0_8px_24px_-6px_rgba(255,107,107,0.2)] flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-accent/15 flex items-center justify-center">
                <Flame size={20} className="text-accent" />
              </div>
              <div>
                <p className="text-xs font-heading font-bold text-foreground">7-day Streak</p>
                <p className="text-[10px] font-body text-muted-foreground">Keep it going! 🔥</p>
              </div>
            </div>
          </motion.div>

          {/* Bottom-right: Calendar widget */}
          <motion.div
            className="absolute -bottom-10 -right-2 md:-right-28 z-20 hidden md:block"
            {...float(1.2, 4.5)}
          >
            <div className="bg-soft-yellow/30 backdrop-blur-sm rounded-2xl p-4 shadow-[inset_0_2px_4px_rgba(255,255,255,0.8),0_8px_24px_-6px_rgba(167,139,250,0.15)]">
              <div className="flex items-center gap-2 mb-2">
                <CalendarDays size={14} className="text-foreground/60" />
                <span className="text-[10px] font-heading font-bold text-foreground/70">March 2026</span>
              </div>
              <div className="grid grid-cols-7 gap-[3px]">
                {["S","M","T","W","T","F","S"].map((d,i) => (
                  <span key={i} className="text-[8px] font-body text-muted-foreground text-center w-4">{d}</span>
                ))}
                {Array.from({length: 18}, (_, i) => i + 1).map(d => (
                  <span
                    key={d}
                    className={`text-[8px] font-body text-center w-4 h-4 flex items-center justify-center rounded-full ${
                      d === 18 ? "bg-primary text-primary-foreground font-bold" :
                      d < 18 ? "text-foreground/50" : "text-foreground/30"
                    }`}
                  >
                    {d}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Extra floating: Life score badge (mid-right) */}
          <motion.div
            className="absolute top-1/2 -right-6 md:-right-32 -translate-y-1/2 z-20 hidden lg:block"
            {...float(1.4, 6)}
          >
            <div className="bg-sky/25 backdrop-blur-sm rounded-2xl px-4 py-3 shadow-[inset_0_2px_4px_rgba(255,255,255,0.8),0_8px_20px_-6px_rgba(167,139,250,0.15)] flex items-center gap-2">
              <BarChart3 size={16} className="text-primary" />
              <span className="text-xs font-heading font-bold text-foreground">Score: 92</span>
            </div>
          </motion.div>

          {/* ===== MAIN SPLIT VISUAL ===== */}
          <motion.div
            className="clay-card p-0 overflow-hidden relative"
            initial={{ opacity: 0, y: 50, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ ...spring, delay: 0.3 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 min-h-[340px] md:min-h-[420px]">

              {/* CHAOS SIDE */}
              <div className="relative bg-[hsl(220,10%,14%)] p-6 md:p-10 flex items-center justify-center overflow-hidden">
                {/* Noise overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-foreground/[0.02] to-transparent" />

                {/* Scattered chaos cards */}
                <div className="relative w-full max-w-[280px] h-[280px] md:h-[320px]">
                  {[
                    { text: "Overdue: Q3 Report", rot: -12, x: "5%", y: "5%", delay: 0.5 },
                    { text: "Missed: Team Call", rot: 8, x: "30%", y: "15%", delay: 0.6 },
                    { text: "URGENT: Client Email", rot: -5, x: "10%", y: "40%", delay: 0.7 },
                    { text: "Late: Gym Session", rot: 15, x: "35%", y: "50%", delay: 0.8 },
                    { text: "Forgot: Mom's Birthday", rot: -8, x: "15%", y: "70%", delay: 0.9 },
                    { text: "Pending: Invoice #42", rot: 6, x: "40%", y: "75%", delay: 1.0 },
                  ].map((card, i) => (
                    <motion.div
                      key={i}
                      className="absolute bg-[hsl(220,10%,22%)] rounded-xl px-3 py-2.5 shadow-lg flex items-center gap-2 min-w-[160px]"
                      style={{ left: card.x, top: card.y, rotate: `${card.rot}deg` }}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 0.85, scale: 1 }}
                      transition={{ ...spring, delay: card.delay }}
                    >
                      <AlertCircle size={13} className="text-accent shrink-0" />
                      <span className="text-[11px] font-body text-[hsl(220,10%,60%)] whitespace-nowrap">{card.text}</span>
                      {i < 3 && (
                        <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-accent rounded-full flex items-center justify-center text-[8px] font-bold text-accent-foreground">!</span>
                      )}
                    </motion.div>
                  ))}

                  {/* Scattered notification badges */}
                  {[
                    { x: "70%", y: "10%", count: "10", delay: 0.7 },
                    { x: "0%", y: "35%", count: "5", delay: 0.85 },
                    { x: "75%", y: "60%", count: "3", delay: 1.0 },
                  ].map((badge, i) => (
                    <motion.div
                      key={`badge-${i}`}
                      className="absolute w-6 h-6 bg-accent rounded-full flex items-center justify-center shadow-[0_2px_8px_rgba(255,107,107,0.4)]"
                      style={{ left: badge.x, top: badge.y }}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 0.9, scale: 1 }}
                      transition={{ ...spring, delay: badge.delay }}
                    >
                      <span className="text-[8px] font-bold text-accent-foreground">{badge.count}</span>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* GLOWING DIVIDER */}
              <div className="hidden md:block absolute left-1/2 top-0 bottom-0 z-30 -translate-x-1/2">
                <div className="w-[3px] h-full bg-gradient-to-b from-primary/20 via-primary to-primary/20 shadow-[0_0_15px_3px_rgba(167,139,250,0.4)]" />
              </div>

              {/* FLOW SIDE */}
              <div className="relative bg-gradient-to-br from-primary/[0.06] to-primary/[0.02] p-6 md:p-10 flex items-center justify-center overflow-hidden">
                {/* Soft glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-primary/10 rounded-full blur-[60px]" />

                {/* Clean organized cards */}
                <div className="relative w-full max-w-[280px] space-y-3">
                  {[
                    { text: "Morning Run", time: "6:30 AM", done: true, delay: 0.5 },
                    { text: "Deep Work Block", time: "9:00 AM", done: true, delay: 0.65 },
                    { text: "Team Standup", time: "11:00 AM", done: true, delay: 0.8 },
                    { text: "Journal & Reflect", time: "8:00 PM", done: false, delay: 0.95 },
                  ].map((task, i) => (
                    <motion.div
                      key={i}
                      className="clay-card-sm px-4 py-3 flex items-center gap-3"
                      initial={{ opacity: 0, x: 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ ...spring, delay: task.delay }}
                    >
                      <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${
                        task.done ? "bg-success/20" : "bg-muted"
                      }`}>
                        {task.done && <Check size={14} className="text-success" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-heading font-bold ${task.done ? "text-foreground" : "text-foreground/50"}`}>{task.text}</p>
                        <p className="text-[10px] font-body text-muted-foreground">{task.time}</p>
                      </div>
                      {task.done && (
                        <motion.div
                          className="w-5 h-5 rounded-full bg-success/15 flex items-center justify-center"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ ...spring, delay: task.delay + 0.2 }}
                        >
                          <Check size={10} className="text-success" />
                        </motion.div>
                      )}
                    </motion.div>
                  ))}

                  {/* Mini streak indicator */}
                  <motion.div
                    className="flex items-center gap-2 justify-center pt-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.2, duration: 0.5 }}
                  >
                    <Flame size={14} className="text-accent" />
                    <span className="text-xs font-heading font-bold text-foreground/60">7-day streak</span>
                    <Zap size={12} className="text-primary" />
                    <span className="text-xs font-heading font-bold text-foreground/60">Score: 92</span>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

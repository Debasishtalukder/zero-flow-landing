import { motion } from "framer-motion";
import { Check, AlertCircle, Flame, CalendarDays, Target } from "lucide-react";
import heroChaos from "@/assets/hero-chaos.png";
import heroFlow from "@/assets/hero-flow.png";

const floatingCardClass = "clay-card-sm p-4 absolute";

const smoothSpring = { type: "spring" as const, stiffness: 80, damping: 20 };
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { ...smoothSpring, delay },
});

const Hero = () => {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center pt-20 overflow-hidden">
      <div className="absolute inset-0 dot-grid pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        {/* Headline */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <motion.h1
            className="text-5xl md:text-6xl font-heading font-extrabold tracking-tight leading-[1.1] text-foreground mb-6"
            {...fadeUp(0)}
          >
            Stop Surviving.{" "}
            <span className="text-primary">Start Flowing.</span>
          </motion.h1>
          <motion.p
            className="text-lg font-body text-muted-foreground leading-relaxed max-w-xl mx-auto"
            {...fadeUp(0.15)}
          >
            ZeroFlow organizes your daily life so you actually make progress — beautifully.
          </motion.p>
        </div>

        {/* CTA Buttons */}
        <motion.div
          className="flex flex-wrap items-center justify-center gap-4 mb-16"
          {...fadeUp(0.3)}
        >
          <button className="btn-pill bg-accent text-accent-foreground shadow-[0_4px_16px_rgba(255,107,107,0.35)] text-base">
            Get Started Free
          </button>
          <button className="btn-pill border-2 border-foreground/15 text-foreground hover:border-foreground/30 bg-transparent text-base">
            See How It Works
          </button>
        </motion.div>

        {/* Split Visual */}
        <motion.div
          className="relative max-w-5xl mx-auto rounded-3xl overflow-hidden clay-card"
          initial={{ opacity: 0, y: 40, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ ...smoothSpring, delay: 0.45 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 min-h-[420px] relative">
            {/* Chaos side */}
            <div className="relative bg-foreground/[0.04] p-6 md:p-10 flex flex-col items-center justify-center gap-6">
              <motion.img
                src={heroChaos}
                alt="Chaotic task management"
                className="w-52 h-52 md:w-60 md:h-60 object-cover rounded-2xl shadow-lg"
                initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
                animate={{ opacity: 0.85, scale: 1, rotate: -1 }}
                transition={{ ...smoothSpring, delay: 0.6 }}
              />
              <div className="space-y-2.5 w-full max-w-[220px]">
                {["Overdue: Report", "Missed: Gym", "Late: Call Mom"].map((t, i) => (
                  <motion.div
                    key={i}
                    className="bg-foreground/10 rounded-xl p-3 text-sm font-body text-foreground/60 flex items-center gap-2"
                    style={{ transform: `rotate(${(i - 1) * 4}deg)` }}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ ...smoothSpring, delay: 0.7 + i * 0.1 }}
                  >
                    <AlertCircle size={16} className="text-accent shrink-0" />
                    {t}
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Glowing divider */}
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-[2px] bg-gradient-to-b from-transparent via-primary/70 to-transparent z-10 blur-[0.5px]" />

            {/* Flow side */}
            <div className="relative bg-primary/[0.04] p-6 md:p-10 flex flex-col items-center justify-center gap-6">
              <motion.img
                src={heroFlow}
                alt="Organized ZeroFlow dashboard"
                className="w-52 h-52 md:w-60 md:h-60 object-cover rounded-2xl shadow-lg"
                initial={{ opacity: 0, scale: 0.9, rotate: 2 }}
                animate={{ opacity: 1, scale: 1, rotate: 1 }}
                transition={{ ...smoothSpring, delay: 0.6 }}
              />
              <div className="space-y-2.5 w-full max-w-[220px]">
                {["Morning Run", "Deep Work Block", "Journal & Reflect"].map((t, i) => (
                  <motion.div
                    key={i}
                    className="clay-card-sm p-3 text-sm font-body text-foreground flex items-center gap-2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ ...smoothSpring, delay: 0.7 + i * 0.1 }}
                  >
                    <Check size={16} className="text-success shrink-0" />
                    {t}
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Floating cards */}
        <motion.div
          className={`${floatingCardClass} top-32 left-4 md:left-[8%] hidden lg:flex items-center gap-2`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: [0, -12, 0] }}
          transition={{ opacity: { delay: 1, duration: 0.6 }, y: { duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 } }}
        >
          <div className="w-8 h-8 rounded-lg bg-success/20 flex items-center justify-center">
            <Check size={16} className="text-success" />
          </div>
          <span className="text-xs font-body font-medium text-foreground/70">Task Done!</span>
        </motion.div>

        <motion.div
          className={`${floatingCardClass} top-36 right-4 md:right-[8%] hidden lg:flex items-center gap-2`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: [0, -12, 0] }}
          transition={{ opacity: { delay: 1.2, duration: 0.6 }, y: { duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1.2 } }}
        >
          <div className="w-8 h-8 rounded-lg bg-sky/30 flex items-center justify-center">
            <Target size={16} className="text-primary" />
          </div>
          <span className="text-xs font-body font-medium text-foreground/70">78%</span>
        </motion.div>

        <motion.div
          className={`${floatingCardClass} bottom-16 left-4 md:left-[12%] hidden lg:flex items-center gap-2`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: [0, -12, 0] }}
          transition={{ opacity: { delay: 1.4, duration: 0.6 }, y: { duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1.4 } }}
        >
          <div className="w-8 h-8 rounded-lg bg-warm/60 flex items-center justify-center">
            <Flame size={16} className="text-accent" />
          </div>
          <span className="text-xs font-body font-medium text-foreground/70">7-day streak!</span>
        </motion.div>

        <motion.div
          className={`${floatingCardClass} bottom-20 right-4 md:right-[12%] hidden lg:flex items-center gap-2`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: [0, -12, 0] }}
          transition={{ opacity: { delay: 1.6, duration: 0.6 }, y: { duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 1.6 } }}
        >
          <div className="w-8 h-8 rounded-lg bg-soft-yellow/50 flex items-center justify-center">
            <CalendarDays size={16} className="text-foreground/60" />
          </div>
          <span className="text-xs font-body font-medium text-foreground/70">Today</span>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;

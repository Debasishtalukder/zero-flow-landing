import { motion } from "framer-motion";
import { Check, AlertCircle, Flame, CalendarDays, Target, TrendingUp } from "lucide-react";
import heroChaos from "@/assets/hero-chaos.png";
import heroFlow from "@/assets/hero-flow.png";

const spring = { type: "spring" as const, stiffness: 80, damping: 20 };
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { ...spring, delay },
});

const Hero = () => {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center pt-24 pb-12 overflow-hidden">
      <div className="absolute inset-0 dot-grid pointer-events-none" />
      
      {/* Decorative blobs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-20 right-10 w-80 h-80 bg-success/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        {/* Headline */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <motion.div
            className="inline-flex items-center gap-2 clay-card-sm px-4 py-2 mb-6"
            {...fadeUp(0)}
          >
            <TrendingUp size={14} className="text-success" />
            <span className="text-xs font-body font-medium text-muted-foreground">Trusted by 1,000+ productive humans</span>
          </motion.div>

          <motion.h1
            className="text-5xl md:text-7xl font-heading font-extrabold tracking-tight leading-[1.05] text-foreground mb-6"
            {...fadeUp(0.08)}
          >
            Stop Surviving.
            <br />
            <span className="bg-gradient-to-r from-primary to-[hsl(258,90%,66%)] bg-clip-text text-transparent">Start Flowing.</span>
          </motion.h1>
          <motion.p
            className="text-lg md:text-xl font-body text-muted-foreground leading-relaxed max-w-xl mx-auto"
            {...fadeUp(0.16)}
          >
            ZeroFlow organizes your daily life so you actually make progress — beautifully.
          </motion.p>
        </div>

        {/* CTA Buttons */}
        <motion.div
          className="flex flex-wrap items-center justify-center gap-4 mb-20"
          {...fadeUp(0.24)}
        >
          <button className="btn-pill bg-accent text-accent-foreground shadow-[0_6px_20px_rgba(255,107,107,0.35)] text-base px-8 py-4">
            Get Started Free
          </button>
          <button className="btn-pill border-2 border-foreground/15 text-foreground hover:border-foreground/30 bg-transparent text-base px-8 py-4">
            See How It Works
          </button>
        </motion.div>

        {/* Split Visual — enhanced */}
        <motion.div
          className="relative max-w-5xl mx-auto"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...spring, delay: 0.35 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Chaos Card */}
            <motion.div
              className="clay-card p-0 overflow-hidden relative group"
              whileHover={{ y: -4, transition: { type: "spring", stiffness: 300, damping: 20 } }}
            >
              {/* Label */}
              <div className="absolute top-5 left-5 z-20 clay-card-sm px-3 py-1.5">
                <span className="text-xs font-heading font-bold text-accent">Before</span>
              </div>

              {/* Image */}
              <div className="relative h-56 md:h-64 overflow-hidden bg-foreground/[0.03]">
                <motion.img
                  src={heroChaos}
                  alt="Chaotic task management"
                  className="w-full h-full object-cover"
                  initial={{ scale: 1.1 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 1.2, ease: "easeOut" }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent" />
              </div>

              {/* Task cards overlaying */}
              <div className="p-5 space-y-2.5 relative -mt-6 z-10">
                {["Overdue: Report", "Missed: Gym", "Late: Call Mom"].map((t, i) => (
                  <motion.div
                    key={i}
                    className="bg-foreground/[0.06] backdrop-blur-sm rounded-xl p-3.5 text-sm font-body text-foreground/55 flex items-center gap-2.5 border border-foreground/[0.06]"
                    style={{ transform: `rotate(${(i - 1) * 2.5}deg) translateX(${(i - 1) * 8}px)` }}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ ...spring, delay: 0.6 + i * 0.1 }}
                  >
                    <AlertCircle size={15} className="text-accent shrink-0" />
                    {t}
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Flow Card */}
            <motion.div
              className="clay-card p-0 overflow-hidden relative group"
              whileHover={{ y: -4, transition: { type: "spring", stiffness: 300, damping: 20 } }}
            >
              {/* Label */}
              <div className="absolute top-5 left-5 z-20 clay-card-sm px-3 py-1.5">
                <span className="text-xs font-heading font-bold text-success">After</span>
              </div>

              {/* Image */}
              <div className="relative h-56 md:h-64 overflow-hidden bg-primary/[0.03]">
                <motion.img
                  src={heroFlow}
                  alt="Organized ZeroFlow dashboard"
                  className="w-full h-full object-cover"
                  initial={{ scale: 1.1 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 1.2, ease: "easeOut" }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent" />
              </div>

              {/* Task cards overlaying */}
              <div className="p-5 space-y-2.5 relative -mt-6 z-10">
                {["Morning Run", "Deep Work Block", "Journal & Reflect"].map((t, i) => (
                  <motion.div
                    key={i}
                    className="clay-card-sm p-3.5 text-sm font-body text-foreground flex items-center gap-2.5"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ ...spring, delay: 0.6 + i * 0.1 }}
                  >
                    <Check size={15} className="text-success shrink-0" />
                    {t}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Floating cards around the visual */}
          <motion.div
            className="clay-card-sm p-3 px-4 absolute -top-4 -left-4 md:left-[5%] hidden lg:flex items-center gap-2 z-20"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1, y: [0, -10, 0] }}
            transition={{ opacity: { delay: 0.9, duration: 0.5 }, scale: { delay: 0.9, duration: 0.5 }, y: { duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 } }}
          >
            <div className="w-8 h-8 rounded-lg bg-success/20 flex items-center justify-center">
              <Check size={16} className="text-success" />
            </div>
            <span className="text-xs font-body font-medium text-foreground/70">Task Done!</span>
          </motion.div>

          <motion.div
            className="clay-card-sm p-3 px-4 absolute -top-4 -right-4 md:right-[5%] hidden lg:flex items-center gap-2 z-20"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1, y: [0, -10, 0] }}
            transition={{ opacity: { delay: 1.1, duration: 0.5 }, scale: { delay: 1.1, duration: 0.5 }, y: { duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1.2 } }}
          >
            <div className="w-8 h-8 rounded-lg bg-sky/30 flex items-center justify-center">
              <Target size={16} className="text-primary" />
            </div>
            <span className="text-xs font-body font-medium text-foreground/70">Score: 78%</span>
          </motion.div>

          <motion.div
            className="clay-card-sm p-3 px-4 absolute -bottom-4 left-8 md:left-[8%] hidden lg:flex items-center gap-2 z-20"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1, y: [0, -10, 0] }}
            transition={{ opacity: { delay: 1.3, duration: 0.5 }, scale: { delay: 1.3, duration: 0.5 }, y: { duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1.4 } }}
          >
            <div className="w-8 h-8 rounded-lg bg-warm/60 flex items-center justify-center">
              <Flame size={16} className="text-accent" />
            </div>
            <span className="text-xs font-body font-medium text-foreground/70">7-day streak!</span>
          </motion.div>

          <motion.div
            className="clay-card-sm p-3 px-4 absolute -bottom-4 right-8 md:right-[8%] hidden lg:flex items-center gap-2 z-20"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1, y: [0, -10, 0] }}
            transition={{ opacity: { delay: 1.5, duration: 0.5 }, scale: { delay: 1.5, duration: 0.5 }, y: { duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 1.6 } }}
          >
            <div className="w-8 h-8 rounded-lg bg-soft-yellow/50 flex items-center justify-center">
              <CalendarDays size={16} className="text-foreground/60" />
            </div>
            <span className="text-xs font-body font-medium text-foreground/70">Today</span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;

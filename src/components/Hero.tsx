import { motion } from "framer-motion";
import { Check, Flame, CalendarDays, Target, TrendingUp } from "lucide-react";
import heroSplit from "@/assets/hero-split.png";
import featTasks from "@/assets/feat-tasks.png";
import featScore from "@/assets/feat-score.png";
import featStreak from "@/assets/feat-streak.png";
import featCalendar from "@/assets/feat-calendar.png";

const spring = { type: "spring" as const, stiffness: 80, damping: 20 };
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { ...spring, delay },
});

const Hero = () => {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center pt-24 pb-16 overflow-hidden">
      <div className="absolute inset-0 dot-grid pointer-events-none" />

      {/* Decorative blobs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-20 right-10 w-80 h-80 bg-success/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        {/* Headline */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <motion.h1
            className="text-5xl md:text-7xl font-heading font-extrabold tracking-tight leading-[1.05] text-foreground mb-6"
            {...fadeUp(0)}
          >
            Stop Surviving. Start Flowing.
          </motion.h1>
          <motion.p
            className="text-lg md:text-xl font-body text-muted-foreground leading-relaxed max-w-xl mx-auto"
            {...fadeUp(0.1)}
          >
            ZeroFlow organizes your daily life so you actually make progress — beautifully.
          </motion.p>
        </div>

        {/* CTA Buttons */}
        <motion.div
          className="flex flex-wrap items-center justify-center gap-4 mb-20"
          {...fadeUp(0.2)}
        >
          <button className="btn-pill bg-accent text-accent-foreground shadow-[0_6px_20px_rgba(255,107,107,0.35)] text-base px-8 py-4">
            Get Started Free
          </button>
          <button className="btn-pill border-2 border-foreground/15 text-foreground hover:border-foreground/30 bg-transparent text-base px-8 py-4">
            See How It Works
          </button>
        </motion.div>

        {/* Main split visual with floating cards */}
        <div className="relative max-w-4xl mx-auto">
          {/* Floating card: Task card - top left */}
          <motion.div
            className="clay-card-sm p-3 absolute -top-8 -left-8 md:-left-24 z-20 hidden md:block"
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1, y: [0, -10, 0] }}
            transition={{
              opacity: { delay: 0.8, duration: 0.5 },
              scale: { delay: 0.8, ...spring },
              y: { duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1.2 },
            }}
          >
            <img src={featTasks} alt="Tasks" className="w-20 h-20 object-contain" />
          </motion.div>

          {/* Floating card: Progress ring - top right */}
          <motion.div
            className="clay-card-sm p-3 absolute -top-6 -right-6 md:-right-20 z-20 hidden md:block"
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1, y: [0, -10, 0] }}
            transition={{
              opacity: { delay: 1, duration: 0.5 },
              scale: { delay: 1, ...spring },
              y: { duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1.4 },
            }}
          >
            <img src={featScore} alt="Score" className="w-20 h-20 object-contain" />
          </motion.div>

          {/* Floating card: Streak - bottom left */}
          <motion.div
            className="clay-card-sm p-3 px-5 absolute -bottom-6 -left-6 md:-left-20 z-20 hidden md:flex items-center gap-2"
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1, y: [0, -10, 0] }}
            transition={{
              opacity: { delay: 1.2, duration: 0.5 },
              scale: { delay: 1.2, ...spring },
              y: { duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 1.6 },
            }}
          >
            <img src={featStreak} alt="Streak" className="w-10 h-10 object-contain" />
            <span className="text-xs font-heading font-bold text-foreground/70">Streak</span>
          </motion.div>

          {/* Floating card: Calendar - bottom right */}
          <motion.div
            className="clay-card-sm p-3 absolute -bottom-8 -right-4 md:-right-24 z-20 hidden md:block"
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1, y: [0, -10, 0] }}
            transition={{
              opacity: { delay: 1.4, duration: 0.5 },
              scale: { delay: 1.4, ...spring },
              y: { duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 1.8 },
            }}
          >
            <img src={featCalendar} alt="Calendar" className="w-20 h-20 object-contain" />
          </motion.div>

          {/* Main split image */}
          <motion.div
            className="clay-card p-0 overflow-hidden relative"
            initial={{ opacity: 0, y: 40, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ ...spring, delay: 0.35 }}
          >
            <img
              src={heroSplit}
              alt="Chaos vs Flow — ZeroFlow transforms your productivity"
              className="w-full h-auto rounded-[2rem]"
            />
            {/* Glowing center divider overlay */}
            <div className="absolute left-1/2 top-0 bottom-0 w-[3px] -translate-x-1/2 bg-gradient-to-b from-primary/30 via-primary/80 to-primary/30 blur-[1px]" />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

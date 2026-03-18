import { motion } from "framer-motion";
import { CheckSquare, Flame, BarChart3, Map, CalendarDays, Sparkles } from "lucide-react";

const features = [
  { icon: CheckSquare, title: "3D Task Cards", desc: "Beautiful, tactile task cards that feel alive.", bg: "bg-success/10", iconColor: "text-success" },
  { icon: Flame, title: "Streak System", desc: "Stay motivated with daily streaks and rewards.", bg: "bg-warm", iconColor: "text-accent" },
  { icon: BarChart3, title: "Daily Life Score", desc: "One number that shows how your day is going.", bg: "bg-sky/30", iconColor: "text-primary" },
  { icon: Map, title: "Roadmap Builder", desc: "Plan your weeks and months with visual clarity.", bg: "bg-lilac/50", iconColor: "text-primary" },
  { icon: CalendarDays, title: "Smart Calendar", desc: "Auto-schedule tasks into your ideal daily flow.", bg: "bg-soft-yellow/40", iconColor: "text-foreground/70" },
  { icon: Sparkles, title: "AI Daily Planner", desc: "Let AI optimize your day for maximum flow.", bg: "bg-primary/10", iconColor: "text-primary", pro: true },
];

const Features = () => (
  <section id="features" className="py-24 relative">
    <div className="container mx-auto px-6">
      <motion.h2
        className="text-4xl font-heading font-bold text-center text-foreground mb-4"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        style={{ textWrap: "balance" } as React.CSSProperties}
      >
        Everything you need to build a better life.
      </motion.h2>
      <p className="text-center text-muted-foreground font-body mb-16 max-w-md mx-auto">
        Six powerful tools designed to help you grow every single day.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {features.map((f, i) => (
          <motion.div
            key={i}
            className={`clay-card p-7 relative ${f.bg}`}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.08, ease: [0.34, 1.56, 0.64, 1] }}
            whileHover={{ scale: 1.02, y: -5 }}
          >
            {f.pro && (
              <span className="absolute top-4 right-4 bg-primary-foreground/40 backdrop-blur-sm text-primary text-[10px] font-heading font-bold px-2.5 py-1 rounded-full">
                Pro
              </span>
            )}
            <div className="w-11 h-11 rounded-xl bg-primary-foreground/60 flex items-center justify-center mb-4">
              <f.icon size={22} className={f.iconColor} />
            </div>
            <h3 className="text-lg font-heading font-bold text-foreground mb-1">{f.title}</h3>
            <p className="text-sm font-body text-muted-foreground leading-relaxed">{f.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default Features;

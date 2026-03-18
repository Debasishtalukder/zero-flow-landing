import { motion } from "framer-motion";
import { UserPlus, ListChecks, TrendingUp } from "lucide-react";

const steps = [
  {
    icon: UserPlus,
    title: "Sign Up Free",
    desc: "Create your account and set your daily routine in seconds.",
  },
  {
    icon: ListChecks,
    title: "Add Your Tasks",
    desc: "Set task name, duration, and day commitment to build your flow.",
  },
  {
    icon: TrendingUp,
    title: "Track & Grow",
    desc: "Check off daily, watch your streak and life score grow.",
  },
];

const HowItWorks = () => (
  <section className="py-24 relative">
    <div className="container mx-auto px-6">
      <motion.h2
        className="text-4xl font-heading font-bold text-center text-foreground mb-16"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        style={{ textWrap: "balance" } as React.CSSProperties}
      >
        Simple. Powerful. Beautiful.
      </motion.h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
        {steps.map((step, i) => (
          <motion.div
            key={i}
            className="clay-card p-8 text-center flex flex-col items-center gap-4"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.15, ease: [0.34, 1.56, 0.64, 1] }}
            whileHover={{ scale: 1.02, y: -5 }}
          >
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
              <step.icon size={28} className="text-primary" />
            </div>
            <span className="text-sm font-heading font-extrabold text-primary">Step {i + 1}</span>
            <h3 className="text-xl font-heading font-bold text-foreground">{step.title}</h3>
            <p className="text-sm font-body text-muted-foreground leading-relaxed">{step.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default HowItWorks;

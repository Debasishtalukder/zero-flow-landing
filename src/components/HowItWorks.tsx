import { motion } from "framer-motion";
import { UserPlus, ListChecks, TrendingUp } from "lucide-react";

const steps = [
  { icon: UserPlus, title: "Sign Up Free", desc: "Create your account and set your daily routine in seconds." },
  { icon: ListChecks, title: "Add Your Tasks", desc: "Set task name, duration, and day commitment to build your flow." },
  { icon: TrendingUp, title: "Track & Grow", desc: "Check off daily, watch your streak and life score grow." },
];

const spring = { type: "spring" as const, stiffness: 80, damping: 20 };

const HowItWorks = () => (
  <section id="how-it-works" className="py-24 relative">
    <div className="container mx-auto px-6">
      <motion.h2
        className="text-4xl font-heading font-bold text-center text-foreground mb-16"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={spring}
        style={{ textWrap: "balance" } as React.CSSProperties}
      >
        Simple. Powerful. Beautiful.
      </motion.h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
        {steps.map((step, i) => (
          <motion.div
            key={i}
            className="clay-card p-8 text-center flex flex-col items-center gap-4"
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ ...spring, delay: i * 0.12 }}
            whileHover={{ scale: 1.03, y: -6, transition: { type: "spring", stiffness: 300, damping: 20 } }}
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

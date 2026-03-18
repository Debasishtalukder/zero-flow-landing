import { motion } from "framer-motion";
import { Check } from "lucide-react";

const freePlan = ["Unlimited tasks", "Daily life score", "7-day streaks", "Basic calendar"];
const proPlan = ["Everything in Free", "AI Daily Planner", "Unlimited streaks", "Roadmap Builder", "Priority support", "Custom themes"];

const spring = { type: "spring" as const, stiffness: 80, damping: 20 };

const Pricing = () => (
  <section id="pricing" className="py-24 relative">
    <div className="container mx-auto px-6">
      <motion.h2
        className="text-4xl font-heading font-bold text-center text-foreground mb-4"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={spring}
        style={{ textWrap: "balance" } as React.CSSProperties}
      >
        Start free. Upgrade when ready.
      </motion.h2>
      <motion.p
        className="text-center text-muted-foreground font-body mb-16 max-w-md mx-auto"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ ...spring, delay: 0.08 }}
      >
        No credit card required to start.
      </motion.p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
        <motion.div
          className="clay-card p-8"
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={spring}
          whileHover={{ scale: 1.02, y: -5, transition: { type: "spring", stiffness: 300, damping: 20 } }}
        >
          <h3 className="text-2xl font-heading font-bold text-foreground mb-1">Free</h3>
          <p className="text-muted-foreground font-body text-sm mb-6">Everything you need to get started.</p>
          <p className="text-4xl font-heading font-extrabold text-foreground mb-6">$0<span className="text-base font-normal text-muted-foreground">/month</span></p>
          <ul className="space-y-3 mb-8">
            {freePlan.map((f, i) => (
              <li key={i} className="flex items-center gap-2 text-sm font-body text-foreground">
                <Check size={16} className="text-success shrink-0" /> {f}
              </li>
            ))}
          </ul>
          <button className="btn-pill bg-accent text-accent-foreground w-full shadow-[0_4px_12px_rgba(255,107,107,0.3)]">
            Get Started Free
          </button>
        </motion.div>

        <motion.div
          className="relative p-8 text-primary-foreground overflow-hidden"
          style={{
            background: "linear-gradient(135deg, hsl(255 92% 76%), hsl(258 90% 66%))",
            borderRadius: "2rem",
            boxShadow: "inset 0 4px 6px rgba(255,255,255,0.2), 0 20px 40px -10px rgba(139,92,246,0.35)",
          }}
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ ...spring, delay: 0.1 }}
          whileHover={{ scale: 1.02, y: -5, transition: { type: "spring", stiffness: 300, damping: 20 } }}
        >
          <span className="absolute top-4 right-4 bg-primary-foreground/20 text-primary-foreground text-[10px] font-heading font-bold px-3 py-1 rounded-full">
            Most Popular
          </span>
          <h3 className="text-2xl font-heading font-bold mb-1">Pro</h3>
          <p className="text-primary-foreground/70 font-body text-sm mb-6">Unlock your full potential.</p>
          <p className="text-4xl font-heading font-extrabold mb-6">$6<span className="text-base font-normal text-primary-foreground/70">/month</span></p>
          <ul className="space-y-3 mb-8">
            {proPlan.map((f, i) => (
              <li key={i} className="flex items-center gap-2 text-sm font-body text-primary-foreground">
                <Check size={16} className="text-success shrink-0" /> {f}
              </li>
            ))}
          </ul>
          <button className="btn-pill bg-accent text-accent-foreground w-full shadow-[0_4px_12px_rgba(255,107,107,0.3)]">
            Get Pro
          </button>
        </motion.div>
      </div>
    </div>
  </section>
);

export default Pricing;

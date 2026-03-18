import { motion } from "framer-motion";
import { X, Check, Flame, AlertCircle, Frown, Smile } from "lucide-react";
import heroChaos from "@/assets/hero-chaos.png";
import heroFlow from "@/assets/hero-flow.png";

const spring = { type: "spring" as const, stiffness: 80, damping: 20 };

const BeforeAfter = () => (
  <section className="py-24 relative">
    <div className="container mx-auto px-6">
      <motion.h2
        className="text-4xl md:text-5xl font-heading font-bold text-center text-foreground mb-16"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={spring}
        style={{ textWrap: "balance" } as React.CSSProperties}
      >
        See the <span className="text-primary">difference</span>
      </motion.h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
        {/* Before */}
        <motion.div
          className="clay-card p-0 overflow-hidden"
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={spring}
          whileHover={{ y: -4, transition: { type: "spring", stiffness: 300, damping: 20 } }}
        >
          <div className="relative h-48 overflow-hidden bg-foreground/[0.04]">
            <img src={heroChaos} alt="Life without ZeroFlow" className="w-full h-full object-cover opacity-80" />
            <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />
            <div className="absolute bottom-4 left-5 flex items-center gap-2">
              <Frown size={18} className="text-accent" />
              <span className="text-sm font-heading font-bold text-foreground/80">Without ZeroFlow</span>
            </div>
          </div>
          <div className="p-6 space-y-3">
            {["Missed deadlines everywhere", "Notification overload", "No clear priorities", "Constant stress"].map((t, i) => (
              <motion.div
                key={i}
                className="flex items-center gap-3 text-foreground/50 font-body text-sm"
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ ...spring, delay: 0.1 + i * 0.06 }}
              >
                <X size={15} className="text-accent shrink-0" />
                {t}
              </motion.div>
            ))}
            <div className="pt-3 space-y-2">
              {["Overdue report", "Gym — skipped again"].map((t, i) => (
                <motion.div
                  key={i}
                  className="bg-foreground/[0.06] rounded-xl p-3 text-xs font-body text-foreground/45 flex items-center gap-2"
                  style={{ transform: `rotate(${(i - 0.5) * 2}deg)` }}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ ...spring, delay: 0.35 + i * 0.08 }}
                >
                  <AlertCircle size={13} className="text-accent shrink-0" /> {t}
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* After */}
        <motion.div
          className="clay-card p-0 overflow-hidden"
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={spring}
          whileHover={{ y: -4, transition: { type: "spring", stiffness: 300, damping: 20 } }}
        >
          <div className="relative h-48 overflow-hidden bg-primary/[0.04]">
            <img src={heroFlow} alt="Life with ZeroFlow" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />
            <div className="absolute bottom-4 left-5 flex items-center gap-2">
              <Smile size={18} className="text-success" />
              <span className="text-sm font-heading font-bold text-foreground">With ZeroFlow</span>
            </div>
          </div>
          <div className="p-6 space-y-3">
            {["Clear daily priorities", "Calm, organized dashboard", "Growing streak & score", "Effortless progress"].map((t, i) => (
              <motion.div
                key={i}
                className="flex items-center gap-3 text-foreground font-body text-sm"
                initial={{ opacity: 0, x: 16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ ...spring, delay: 0.1 + i * 0.06 }}
              >
                <Check size={15} className="text-success shrink-0" />
                {t}
              </motion.div>
            ))}
            <div className="pt-3 space-y-2">
              {["Morning Run", "Deep Work"].map((t, i) => (
                <motion.div
                  key={i}
                  className="clay-card-sm p-3 text-xs font-body text-foreground flex items-center gap-2"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ ...spring, delay: 0.35 + i * 0.08 }}
                >
                  <Check size={13} className="text-success shrink-0" /> {t}
                  <Flame size={13} className="text-accent ml-auto" />
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  </section>
);

export default BeforeAfter;

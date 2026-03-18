import { motion } from "framer-motion";
import { X, Check, Flame, AlertCircle } from "lucide-react";

const BeforeAfter = () => (
  <section className="py-24 relative">
    <div className="container mx-auto px-6">
      <div className="grid grid-cols-1 md:grid-cols-2 rounded-3xl overflow-hidden max-w-5xl mx-auto relative">
        {/* Before */}
        <motion.div
          className="bg-foreground/[0.03] p-10 md:p-14"
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h3 className="text-2xl font-heading font-bold text-foreground/70 mb-6">
            Life <span className="text-accent">without</span> ZeroFlow
          </h3>
          <div className="space-y-3">
            {["Missed deadlines everywhere", "Notification overload", "No clear priorities", "Constant stress"].map((t, i) => (
              <div key={i} className="flex items-center gap-3 text-foreground/50 font-body text-sm">
                <X size={16} className="text-accent shrink-0" />
                {t}
              </div>
            ))}
          </div>
          <div className="mt-8 space-y-2">
            {["Overdue report", "Gym — skipped again"].map((t, i) => (
              <div key={i} className="bg-foreground/10 rounded-xl p-3 text-xs font-body text-foreground/50 flex items-center gap-2" style={{ transform: `rotate(${(i - 0.5) * 3}deg)` }}>
                <AlertCircle size={14} className="text-accent shrink-0" /> {t}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Divider */}
        <div className="hidden md:block absolute left-1/2 top-8 bottom-8 w-px bg-gradient-to-b from-transparent via-primary to-transparent opacity-50 z-10" />

        {/* After */}
        <motion.div
          className="bg-primary/5 p-10 md:p-14"
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h3 className="text-2xl font-heading font-bold text-foreground mb-6">
            Life <span className="text-primary">with</span> ZeroFlow
          </h3>
          <div className="space-y-3">
            {["Clear daily priorities", "Calm, organized dashboard", "Growing streak & score", "Effortless progress"].map((t, i) => (
              <div key={i} className="flex items-center gap-3 text-foreground font-body text-sm">
                <Check size={16} className="text-success shrink-0" />
                {t}
              </div>
            ))}
          </div>
          <div className="mt-8 space-y-2">
            {["Morning Run", "Deep Work"].map((t, i) => (
              <div key={i} className="clay-card-sm p-3 text-xs font-body text-foreground flex items-center gap-2">
                <Check size={14} className="text-success shrink-0" /> {t}
                <Flame size={14} className="text-accent ml-auto" />
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  </section>
);

export default BeforeAfter;

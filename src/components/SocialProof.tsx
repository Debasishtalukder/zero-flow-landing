import { motion } from "framer-motion";
import { Star } from "lucide-react";

const avatarGradients = [
  "linear-gradient(135deg, #A78BFA, #7C3AED)",
  "linear-gradient(135deg, #34D399, #059669)",
  "linear-gradient(135deg, #FB923C, #EA580C)",
  "linear-gradient(135deg, #60A5FA, #2563EB)",
  "linear-gradient(135deg, #F472B6, #DB2777)",
];
const initials = ["AK", "JR", "MS", "LP", "TW"];

const spring = { type: "spring" as const, stiffness: 80, damping: 20 };

const SocialProof = () => (
  <section className="py-20 relative">
    <div className="container mx-auto px-6 text-center">
      <motion.p
        className="text-3xl font-heading font-bold text-foreground mb-8"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={spring}
        style={{ textWrap: "balance" } as React.CSSProperties}
      >
        Join 1,000+ people building better habits.
      </motion.p>

      <motion.div
        className="flex items-center justify-center gap-2 mb-4"
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ ...spring, delay: 0.1 }}
      >
        {avatarColors.map((c, i) => (
          <div key={i} className={`w-10 h-10 rounded-full ${c} flex items-center justify-center text-xs font-heading font-bold text-foreground/60 -ml-2 first:ml-0 ring-2 ring-background`}>
            {initials[i]}
          </div>
        ))}
      </motion.div>

      <motion.div
        className="flex items-center justify-center gap-1 mb-6"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {[...Array(5)].map((_, i) => (
          <Star key={i} size={18} className="text-soft-yellow fill-soft-yellow" />
        ))}
      </motion.div>

      <motion.p
        className="text-base font-body italic text-muted-foreground max-w-md mx-auto"
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ ...spring, delay: 0.25 }}
      >
        "ZeroFlow made me actually stick to my goals for the first time."
      </motion.p>
      <motion.p
        className="text-sm font-body text-primary font-medium mt-2"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay: 0.35 }}
      >
        — @zerox
      </motion.p>
    </div>
  </section>
);

export default SocialProof;

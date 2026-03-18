import { motion } from "framer-motion";
import { Star } from "lucide-react";

const avatarColors = ["bg-primary/30", "bg-success/30", "bg-accent/30", "bg-warm", "bg-sky/40"];
const initials = ["AK", "JR", "MS", "LP", "TW"];

const SocialProof = () => (
  <section className="py-20 relative">
    <div className="container mx-auto px-6 text-center">
      <motion.p
        className="text-3xl font-heading font-bold text-foreground mb-8"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        style={{ textWrap: "balance" } as React.CSSProperties}
      >
        Join 1,000+ people building better habits.
      </motion.p>

      <div className="flex items-center justify-center gap-2 mb-4">
        {avatarColors.map((c, i) => (
          <div key={i} className={`w-10 h-10 rounded-full ${c} flex items-center justify-center text-xs font-heading font-bold text-foreground/60 -ml-2 first:ml-0 ring-2 ring-background`}>
            {initials[i]}
          </div>
        ))}
      </div>

      <div className="flex items-center justify-center gap-1 mb-6">
        {[...Array(5)].map((_, i) => (
          <Star key={i} size={18} className="text-soft-yellow fill-soft-yellow" />
        ))}
      </div>

      <p className="text-base font-body italic text-muted-foreground max-w-md mx-auto">
        "ZeroFlow made me actually stick to my goals for the first time."
      </p>
      <p className="text-sm font-body text-primary font-medium mt-2">— @zerox</p>
    </div>
  </section>
);

export default SocialProof;

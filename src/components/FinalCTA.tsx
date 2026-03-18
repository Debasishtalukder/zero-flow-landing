import { motion } from "framer-motion";

const FinalCTA = () => (
  <section className="py-24 relative">
    <div className="mx-6 rounded-3xl overflow-hidden" style={{ background: "linear-gradient(135deg, hsl(255 92% 76% / 0.15), hsl(255 100% 98%))" }}>
      <div className="container mx-auto px-6 py-20 text-center">
        <motion.h2
          className="text-4xl md:text-5xl font-heading font-extrabold text-foreground mb-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ textWrap: "balance" } as React.CSSProperties}
        >
          Ready to start flowing?
        </motion.h2>
        <motion.p
          className="text-lg font-body text-muted-foreground mb-8 max-w-md mx-auto"
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
        >
          Join thousands organizing their life with ZeroFlow — for free.
        </motion.p>
        <motion.button
          className="btn-pill bg-accent text-accent-foreground shadow-[0_6px_20px_rgba(255,107,107,0.35)] text-base"
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Get Started Free — No Credit Card Required
        </motion.button>
      </div>
    </div>
  </section>
);

export default FinalCTA;

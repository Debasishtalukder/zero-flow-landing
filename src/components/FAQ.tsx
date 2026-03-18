import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

const faqs = [
  { q: "Is ZeroFlow really free?", a: "Yes! The Free plan includes unlimited tasks, daily life score, 7-day streaks, and a basic calendar. No credit card required." },
  { q: "Does it work on mobile?", a: "Absolutely. ZeroFlow is fully responsive and works beautifully on phones, tablets, and desktops." },
  { q: "Can I cancel my Pro plan anytime?", a: "Yes, you can cancel your Pro subscription at any time. No lock-in, no questions asked." },
  { q: "How is ZeroFlow different from Notion or Todoist?", a: "ZeroFlow is a Life OS — it combines task management, habit tracking, streaks, life scoring, and roadmap planning in one calm, beautiful interface. No steep learning curve." },
  { q: "Is my data safe?", a: "Your data is encrypted and stored securely. We never sell your personal information." },
];

const spring = { type: "spring" as const, stiffness: 80, damping: 20 };

const FAQ = () => {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section id="faq" className="py-24 relative">
      <div className="container mx-auto px-6 max-w-2xl">
        <motion.h2
          className="text-4xl font-heading font-bold text-center text-foreground mb-16"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={spring}
        >
          Got questions?
        </motion.h2>

        <div className="space-y-2">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              className="clay-card overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ ...spring, delay: i * 0.06 }}
            >
              <button
                className="w-full flex items-center justify-between p-6 text-left"
                onClick={() => setOpen(open === i ? null : i)}
              >
                <span className="font-heading font-bold text-foreground text-base pr-4">{faq.q}</span>
                <motion.div
                  animate={{ rotate: open === i ? 180 : 0 }}
                  transition={{ type: "spring", stiffness: 200, damping: 20 }}
                >
                  <ChevronDown size={20} className="text-primary shrink-0" />
                </motion.div>
              </button>
              <AnimatePresence>
                {open === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 120, damping: 20 }}
                  >
                    <p className="px-6 pb-6 text-sm font-body text-muted-foreground leading-relaxed">
                      {faq.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;

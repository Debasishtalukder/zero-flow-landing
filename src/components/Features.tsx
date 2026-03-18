import { motion } from "framer-motion";
import featTasks from "@/assets/feat-tasks.png";
import featStreak from "@/assets/feat-streak.png";
import featScore from "@/assets/feat-score.png";
import featRoadmap from "@/assets/feat-roadmap.png";
import featCalendar from "@/assets/feat-calendar.png";
import featAi from "@/assets/feat-ai.png";

const features = [
  { img: featTasks, title: "3D Task Cards", desc: "Beautiful, tactile task cards that feel alive.", bgColor: "#E8FDF5" },
  { img: featStreak, title: "Streak System", desc: "Stay motivated with daily streaks and rewards.", bgColor: "#FFF0E6" },
  { img: featScore, title: "Daily Life Score", desc: "One number that shows how your day is going.", bgColor: "#E8F4FF" },
  { img: featRoadmap, title: "Roadmap Builder", desc: "Plan your weeks and months with visual clarity.", bgColor: "#F3E8FF" },
  { img: featCalendar, title: "Smart Calendar", desc: "Auto-schedule tasks into your ideal daily flow.", bgColor: "#FFFBE6" },
  { img: featAi, title: "AI Daily Planner", desc: "Let AI optimize your day for maximum flow.", bgColor: "#EDE9FE", pro: true },
];

const spring = { type: "spring" as const, stiffness: 80, damping: 20 };

const Features = () => (
  <section id="features" className="py-24 relative">
    <div className="container mx-auto px-6">
      <motion.h2
        className="text-4xl md:text-5xl font-heading font-bold text-center text-foreground mb-4"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={spring}
        style={{ textWrap: "balance" } as React.CSSProperties}
      >
        Everything you need to build a better life.
      </motion.h2>
      <motion.p
        className="text-center text-muted-foreground font-body mb-16 max-w-md mx-auto"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ ...spring, delay: 0.08 }}
      >
        Six powerful tools designed to help you grow every single day.
      </motion.p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {features.map((f, i) => (
          <motion.div
            key={i}
            className="clay-card p-6 relative overflow-hidden group cursor-default"
            style={{ backgroundColor: f.bgColor }}
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ ...spring, delay: i * 0.07 }}
            whileHover={{ scale: 1.03, y: -6, transition: { type: "spring", stiffness: 300, damping: 20 } }}
          >
            {f.pro && (
              <span className="absolute top-4 right-4 bg-primary-foreground/40 backdrop-blur-sm text-primary text-[10px] font-heading font-bold px-2.5 py-1 rounded-full z-10">
                Pro
              </span>
            )}

            {/* 3D illustration */}
            <div className="flex justify-center mb-4">
              <motion.img
                src={f.img}
                alt={f.title}
                className="w-20 h-20 object-contain drop-shadow-sm"
                whileHover={{ scale: 1.1, rotate: 3, transition: { type: "spring", stiffness: 300, damping: 15 } }}
              />
            </div>

            <h3 className="text-lg font-heading font-bold text-foreground mb-1 text-center">{f.title}</h3>
            <p className="text-sm font-body text-muted-foreground leading-relaxed text-center">{f.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default Features;

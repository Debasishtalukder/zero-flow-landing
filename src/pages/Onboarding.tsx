import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import logo from "@/assets/logo.jpg";

const Onboarding = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [sleep, setSleep] = useState(8);
  const [meals, setMeals] = useState(1);
  const [gaming, setGaming] = useState(2);
  const [other, setOther] = useState(2);
  const [loading, setLoading] = useState(false);

  const freeHours = Math.max(0, 24 - sleep - meals - gaming - other);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    const { error } = await supabase.from("routine_config").insert({
      user_id: user.id,
      sleep_hours: sleep,
      meal_hours: meals,
      gaming_hours: gaming,
      other_hours: other,
    });
    setLoading(false);
    if (error) {
      toast({ title: "Error saving routine", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "You're all set! 🎉", description: "Welcome to ZeroFlow" });
      navigate("/dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center relative">
      <div className="fixed inset-0 dot-grid pointer-events-none" />
      <div className="clay-card p-8 w-full max-w-lg mx-4 relative z-10">
        <div className="flex items-center gap-2 justify-center mb-4">
          <img src={logo} alt="ZeroFlow" className="w-10 h-10 rounded-xl" />
          <span className="font-heading font-extrabold text-2xl text-foreground">ZeroFlow</span>
        </div>
        <h1 className="font-heading font-bold text-xl text-center mb-2 text-foreground">Set up your daily routine</h1>
        <p className="text-sm font-body text-muted-foreground text-center mb-8">Tell us how you spend your day so we can calculate your free time.</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {[
            { label: "Sleep", value: sleep, set: setSleep, emoji: "😴" },
            { label: "Meals & Cooking", value: meals, set: setMeals, emoji: "🍽️" },
            { label: "Gaming / Entertainment", value: gaming, set: setGaming, emoji: "🎮" },
            { label: "Other (commute, chores)", value: other, set: setOther, emoji: "📦" },
          ].map((item) => (
            <div key={item.label}>
              <label className="text-xs font-body font-medium text-muted-foreground mb-2 flex items-center gap-2">
                <span>{item.emoji}</span> {item.label}
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min={0}
                  max={12}
                  step={0.5}
                  value={item.value}
                  onChange={(e) => item.set(Number(e.target.value))}
                  className="flex-1 accent-primary"
                />
                <span className="font-heading font-bold text-sm w-12 text-right">{item.value}h</span>
              </div>
            </div>
          ))}

          <div className="clay-card-sm p-4 text-center">
            <p className="text-xs font-body text-muted-foreground">Your free time each day</p>
            <p className="font-heading font-extrabold text-3xl text-primary">{freeHours}h</p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-pill bg-accent text-accent-foreground w-full py-3.5 text-base disabled:opacity-50"
          >
            {loading ? "Saving..." : "Start Flowing 🌊"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Onboarding;

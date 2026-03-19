import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";

const MOODS = [
  { emoji: "😔", label: "Rough", score: 1 },
  { emoji: "😐", label: "Okay", score: 2 },
  { emoji: "🙂", label: "Good", score: 3 },
  { emoji: "😊", label: "Great", score: 4 },
  { emoji: "🤩", label: "Amazing", score: 5 },
];

const MoodCheckIn = () => {
  const { user, refreshProfile } = useAuth();
  const [show, setShow] = useState(false);
  const [dismissing, setDismissing] = useState(false);

  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    if (!user) return;
    const check = async () => {
      const { data } = await supabase
        .from("mood_logs")
        .select("id")
        .eq("user_id", user.id)
        .eq("date", today)
        .single();
      if (!data) setShow(true);
    };
    // Delay showing for a smooth experience
    const timer = setTimeout(check, 2000);
    return () => clearTimeout(timer);
  }, [user, today]);

  const handleMood = async (score: number) => {
    if (!user) return;
    setDismissing(true);
    await supabase.from("mood_logs").insert({
      user_id: user.id,
      date: today,
      mood_score: score,
    });

    // Award 20 XP for mood check-in
    const { data: profile } = await supabase.from("profiles").select("total_xp").eq("id", user.id).single();
    if (profile) {
      await supabase.from("profiles").update({ total_xp: (profile.total_xp || 0) + 20 }).eq("id", user.id);
      await refreshProfile();
    }

    toast({ title: `Mood logged: ${MOODS[score - 1].emoji} ${MOODS[score - 1].label}`, description: "+20 XP earned!" });
    setTimeout(() => setShow(false), 400);
  };

  if (!show) return null;

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 transition-all duration-500 ${
        dismissing ? "opacity-0 translate-y-6 scale-90" : "opacity-100 translate-y-0 scale-100"
      }`}
    >
      <div className="clay-card p-5 w-72 flex flex-col gap-3 shadow-2xl">
        <p className="font-heading font-bold text-sm text-foreground">How are you feeling today?</p>
        <p className="text-xs text-muted-foreground font-body">Your daily mood check-in</p>
        <div className="flex justify-between">
          {MOODS.map(m => (
            <button
              key={m.score}
              onClick={() => handleMood(m.score)}
              className="flex flex-col items-center gap-1 p-2 rounded-xl hover:bg-muted/40 transition-all hover:scale-110"
            >
              <span className="text-2xl">{m.emoji}</span>
              <span className="text-[9px] font-heading font-bold text-muted-foreground">{m.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MoodCheckIn;

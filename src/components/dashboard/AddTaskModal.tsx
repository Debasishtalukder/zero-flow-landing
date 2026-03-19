import { X, Clock } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import { sanitizeInput } from "@/lib/sanitize";

const colorOptions = ["#D9F5EC", "#FFE8D6", "#D6EAFF", "#EDD9FF", "#FFF5D6", "#EDE9FE"];
const colorLabels = ["Mint", "Peach", "Sky", "Lilac", "Gold", "Lavender"];

const CATEGORIES = [
  { label: "Health & Fitness", emoji: "💪", color: "#22C55E" },
  { label: "Learning", emoji: "📚", color: "#3B82F6" },
  { label: "Work", emoji: "💼", color: "#F97316" },
  { label: "Mindfulness", emoji: "🧘", color: "#9333EA" },
  { label: "Creative", emoji: "🎨", color: "#EC4899" },
  { label: "Personal Growth", emoji: "🌱", color: "#10B981" },
  { label: "Entertainment", emoji: "🎮", color: "#EAB308" },
  { label: "Other", emoji: "⚙️", color: "#6B7280" },
];

const DAYS_OF_WEEK = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

interface AddTaskModalProps {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
  editTask?: {
    id: string;
    name: string;
    type: string;
    duration_min: number;
    total_days: number;
    color: string;
    reminder_time?: string | null;
    frequency_type?: string | null;
    frequency_config?: any;
    category?: string | null;
  } | null;
}

const AddTaskModal = ({ open, onClose, onCreated, editTask }: AddTaskModalProps) => {
  const { user, refreshProfile } = useAuth();
  const [taskName, setTaskName] = useState("");
  const [taskType, setTaskType] = useState<"habit" | "task">("habit");
  const [duration, setDuration] = useState(30);
  const [totalDays, setTotalDays] = useState(30);
  const [selectedColor, setSelectedColor] = useState(colorOptions[0]);
  const [saving, setSaving] = useState(false);

  // New fields
  const [category, setCategory] = useState("Other");
  const [reminderTime, setReminderTime] = useState("");
  const [frequencyType, setFrequencyType] = useState<"daily" | "weekly" | "specific">("daily");
  const [timesPerWeek, setTimesPerWeek] = useState(3);
  const [specificDays, setSpecificDays] = useState<string[]>([]);

  useEffect(() => {
    if (open && editTask) {
      setTaskName(editTask.name);
      setTaskType(editTask.type as "habit" | "task");
      setDuration(editTask.duration_min);
      setTotalDays(editTask.total_days);
      setSelectedColor(editTask.color);
      setCategory(editTask.category || "Other");
      setReminderTime(editTask.reminder_time || "");
      setFrequencyType((editTask.frequency_type as any) || "daily");
      if (editTask.frequency_config) {
        const config = typeof editTask.frequency_config === "string"
          ? JSON.parse(editTask.frequency_config)
          : editTask.frequency_config;
        setTimesPerWeek(config.times_per_week || 3);
        setSpecificDays(config.days || []);
      }
    } else if (open && !editTask) {
      setTaskName("");
      setTaskType("habit");
      setDuration(30);
      setTotalDays(30);
      setSelectedColor(colorOptions[0]);
      setCategory("Other");
      setReminderTime("");
      setFrequencyType("daily");
      setTimesPerWeek(3);
      setSpecificDays([]);
    }
  }, [open, editTask]);

  if (!open) return null;

  const toggleDay = (day: string) => {
    setSpecificDays(prev =>
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  const handleSave = async () => {
    const sanitizedName = sanitizeInput(taskName);
    if (!user || !sanitizedName) return;
    if (sanitizedName.length > 100) {
      toast({ title: "Name too long", description: "Task name must be under 100 characters.", variant: "destructive" });
      return;
    }
    setSaving(true);

    const frequencyConfig: any = {};
    if (frequencyType === "weekly") frequencyConfig.times_per_week = timesPerWeek;
    if (frequencyType === "specific") frequencyConfig.days = specificDays;

    const taskData: any = {
      user_id: user.id,
      name: sanitizedName,
      type: taskType,
      duration_min: duration,
      total_days: totalDays,
      color: selectedColor,
      category,
      reminder_time: reminderTime || null,
      frequency_type: frequencyType,
      frequency_config: frequencyConfig,
    };

    let error;
    if (editTask) {
      const { error: err } = await supabase
        .from("tasks")
        .update(taskData)
        .eq("id", editTask.id);
      error = err;
    } else {
      const { error: err } = await supabase
        .from("tasks")
        .insert(taskData);
      error = err;
    }

    setSaving(false);
    if (error) {
      toast({ title: editTask ? "Error updating task" : "Error creating task", description: error.message, variant: "destructive" });
    } else {
      toast({
        title: editTask ? "Task updated! ✨" : "Task created successfully! 🎉",
        description: `"${sanitizedName}" has been ${editTask ? "updated" : "added to your dashboard"}.`,
      });

      // Award XP
      const { data: profile } = await supabase.from("profiles").select("total_xp").eq("id", user.id).single();
      if (profile) {
        const xpToAdd = editTask ? 5 : 10;
        await supabase.from("profiles").update({ total_xp: (profile.total_xp || 0) + xpToAdd }).eq("id", user.id);
        await refreshProfile();
      }

      onCreated();
      onClose();
    }
  };

  const selectedCat = CATEGORIES.find(c => c.label === category);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-foreground/20 backdrop-blur-sm" onClick={onClose} />
      <div className="relative clay-card bg-white dark:bg-card p-8 w-full max-w-lg mx-4 flex flex-col gap-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between">
          <h2 className="font-heading font-bold text-xl text-foreground">{editTask ? "Edit Task" : "Add New Task"}</h2>
          <button onClick={onClose} className="p-1 rounded-xl hover:bg-muted/50">
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        {/* Task Name */}
        <div>
          <label className="text-xs font-body font-medium text-muted-foreground mb-1 block">Task Name</label>
          <input type="text" value={taskName} onChange={(e) => setTaskName(e.target.value)} placeholder="e.g. Morning Run"
            onKeyDown={(e) => e.key === "Enter" && handleSave()}
            className="w-full px-4 py-3 rounded-xl border border-border bg-white dark:bg-muted/20 font-body text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow" />
        </div>

        {/* Category */}
        <div>
          <label className="text-xs font-body font-medium text-muted-foreground mb-2 block">Category</label>
          <div className="grid grid-cols-4 gap-2">
            {CATEGORIES.map(cat => (
              <button key={cat.label} onClick={() => setCategory(cat.label)}
                className={`flex flex-col items-center gap-1 px-2 py-2 rounded-xl text-xs font-heading font-bold transition-all border ${category === cat.label ? "border-violet-400 bg-violet-50 dark:bg-violet-900/30 shadow-sm scale-105" : "border-transparent hover:bg-muted/30"}`}
              >
                <span className="text-lg">{cat.emoji}</span>
                <span className="text-[10px] text-foreground truncate w-full text-center">{cat.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Task Type */}
        <div>
          <label className="text-xs font-body font-medium text-muted-foreground mb-1 block">Task Type</label>
          <div className="flex rounded-full bg-muted p-1">
            {(["habit", "task"] as const).map((type) => (
              <button key={type} onClick={() => setTaskType(type)}
                className={`flex-1 py-2 rounded-full text-sm font-heading font-bold transition-all ${taskType === type ? "bg-primary text-primary-foreground shadow-md" : "text-muted-foreground"}`}>
                {type === "habit" ? "Habit" : "Task"}
              </button>
            ))}
          </div>
        </div>

        {/* Duration & Commitment */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-body font-medium text-muted-foreground mb-1 block">Duration</label>
            <div className="flex items-center gap-2">
              <input type="number" value={duration} onChange={(e) => setDuration(Number(e.target.value))}
                className="w-full px-3 py-3 rounded-xl border border-border bg-white dark:bg-muted/20 font-body text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
              <span className="text-xs text-muted-foreground font-body whitespace-nowrap">min</span>
            </div>
          </div>
          <div>
            <label className="text-xs font-body font-medium text-muted-foreground mb-1 block">Commitment</label>
            <div className="flex items-center gap-2">
              <input type="number" value={totalDays} onChange={(e) => setTotalDays(Number(e.target.value))}
                className="w-full px-3 py-3 rounded-xl border border-border bg-white dark:bg-muted/20 font-body text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
              <span className="text-xs text-muted-foreground font-body whitespace-nowrap">days</span>
            </div>
          </div>
        </div>

        {/* Frequency */}
        <div>
          <label className="text-xs font-body font-medium text-muted-foreground mb-2 block">Frequency</label>
          <div className="flex rounded-full bg-muted p-1 mb-3">
            {([
              { key: "daily", label: "Every day" },
              { key: "weekly", label: "X/week" },
              { key: "specific", label: "Specific days" },
            ] as const).map(opt => (
              <button key={opt.key} onClick={() => setFrequencyType(opt.key)}
                className={`flex-1 py-2 rounded-full text-xs font-heading font-bold transition-all ${frequencyType === opt.key ? "bg-primary text-primary-foreground shadow-md" : "text-muted-foreground"}`}>
                {opt.label}
              </button>
            ))}
          </div>
          {frequencyType === "weekly" && (
            <div className="flex items-center gap-3">
              <input type="number" min={1} max={6} value={timesPerWeek} onChange={e => setTimesPerWeek(Number(e.target.value))}
                className="w-16 px-3 py-2 rounded-xl border border-border bg-white dark:bg-muted/20 font-body text-sm text-foreground text-center" />
              <span className="text-sm text-muted-foreground font-body">times per week</span>
            </div>
          )}
          {frequencyType === "specific" && (
            <div className="flex gap-1.5 flex-wrap">
              {DAYS_OF_WEEK.map(day => (
                <button key={day} onClick={() => toggleDay(day)}
                  className={`px-3 py-1.5 rounded-full text-xs font-heading font-bold transition-all ${specificDays.includes(day) ? "bg-primary text-primary-foreground shadow-md" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}>
                  {day}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Daily Reminder */}
        <div>
          <label className="text-xs font-body font-medium text-muted-foreground mb-1 block">Daily Reminder</label>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <input type="time" value={reminderTime} onChange={e => setReminderTime(e.target.value)}
              className="px-3 py-2.5 rounded-xl border border-border bg-white dark:bg-muted/20 font-body text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
            {reminderTime && (
              <button onClick={() => setReminderTime("")} className="text-xs text-red-500 hover:underline">Clear</button>
            )}
          </div>
        </div>

        {/* Card Color */}
        <div>
          <label className="text-xs font-body font-medium text-muted-foreground mb-2 block">Card Color</label>
          <div className="flex gap-2.5">
            {colorOptions.map((color, i) => (
              <button key={color} onClick={() => setSelectedColor(color)}
                title={colorLabels[i]}
                className={`w-9 h-9 rounded-full border-2 transition-all hover:scale-110 ${selectedColor === color ? "border-primary scale-110 shadow-md" : "border-white dark:border-muted shadow-sm"}`}
                style={{ backgroundColor: color }} />
            ))}
          </div>
        </div>

        <button onClick={handleSave} disabled={saving || !taskName.trim()} className="btn-pill bg-accent text-accent-foreground w-full py-3.5 text-base disabled:opacity-50">
          {saving ? (editTask ? "Saving..." : "Creating...") : (editTask ? "Save Changes ✨" : "Create Task ✨")}
        </button>
        <button onClick={onClose} className="text-sm text-muted-foreground font-body hover:underline mx-auto">Cancel</button>
      </div>
    </div>
  );
};

export default AddTaskModal;

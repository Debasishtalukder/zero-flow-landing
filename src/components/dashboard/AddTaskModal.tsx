import { X } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";

const colorOptions = ["#E8FDF5", "#FFF0E6", "#E8F4FF", "#F3E8FF", "#FFFBE6", "#EDE9FE"];

interface AddTaskModalProps {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
}

const AddTaskModal = ({ open, onClose, onCreated }: AddTaskModalProps) => {
  const { user } = useAuth();
  const [taskName, setTaskName] = useState("");
  const [taskType, setTaskType] = useState<"habit" | "task">("habit");
  const [duration, setDuration] = useState(30);
  const [totalDays, setTotalDays] = useState(30);
  const [selectedColor, setSelectedColor] = useState(colorOptions[0]);
  const [saving, setSaving] = useState(false);

  if (!open) return null;

  const handleCreate = async () => {
    if (!user || !taskName.trim()) return;
    setSaving(true);
    const { error } = await supabase.from("tasks").insert({
      user_id: user.id,
      name: taskName.trim(),
      type: taskType,
      duration_min: duration,
      total_days: totalDays,
      color: selectedColor,
    });
    setSaving(false);
    if (error) {
      toast({ title: "Error creating task", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Task created! 🎉", description: `${taskName} has been added to your dashboard.` });
      setTaskName("");
      setTaskType("habit");
      setDuration(30);
      setTotalDays(30);
      setSelectedColor(colorOptions[0]);
      onCreated();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-foreground/20 backdrop-blur-sm" onClick={onClose} />
      <div className="relative clay-card bg-white p-8 w-full max-w-md mx-4 flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <h2 className="font-heading font-bold text-xl text-foreground">Add New Task</h2>
          <button onClick={onClose} className="p-1 rounded-xl hover:bg-muted/50">
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        <div>
          <label className="text-xs font-body font-medium text-muted-foreground mb-1 block">Task Name</label>
          <input type="text" value={taskName} onChange={(e) => setTaskName(e.target.value)} placeholder="e.g. Morning Run"
            className="w-full px-4 py-3 rounded-xl border border-border bg-white font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow" />
        </div>

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

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-body font-medium text-muted-foreground mb-1 block">Duration</label>
            <div className="flex items-center gap-2">
              <input type="number" value={duration} onChange={(e) => setDuration(Number(e.target.value))}
                className="w-full px-3 py-3 rounded-xl border border-border bg-white font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
              <span className="text-xs text-muted-foreground font-body whitespace-nowrap">min</span>
            </div>
          </div>
          <div>
            <label className="text-xs font-body font-medium text-muted-foreground mb-1 block">Commitment</label>
            <div className="flex items-center gap-2">
              <input type="number" value={totalDays} onChange={(e) => setTotalDays(Number(e.target.value))}
                className="w-full px-3 py-3 rounded-xl border border-border bg-white font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
              <span className="text-xs text-muted-foreground font-body whitespace-nowrap">days</span>
            </div>
          </div>
        </div>

        <div>
          <label className="text-xs font-body font-medium text-muted-foreground mb-2 block">Card Color</label>
          <div className="flex gap-3">
            {colorOptions.map((color) => (
              <button key={color} onClick={() => setSelectedColor(color)}
                className={`w-8 h-8 rounded-full border-2 transition-all ${selectedColor === color ? "border-primary scale-110" : "border-transparent"}`}
                style={{ backgroundColor: color }} />
            ))}
          </div>
        </div>

        <button onClick={handleCreate} disabled={saving || !taskName.trim()} className="btn-pill bg-accent text-accent-foreground w-full py-3.5 text-base disabled:opacity-50">
          {saving ? "Creating..." : "Create Task"}
        </button>
        <button onClick={onClose} className="text-sm text-muted-foreground font-body hover:underline mx-auto">Cancel</button>
      </div>
    </div>
  );
};

export default AddTaskModal;

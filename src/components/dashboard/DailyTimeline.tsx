import type { RoutineData } from "@/pages/Dashboard";

interface DailyTimelineProps {
  routine: RoutineData | null;
  allocatedHours: number;
}

const DailyTimeline = ({ routine, allocatedHours }: DailyTimelineProps) => {
  const sleep = routine?.sleep_hours ?? 8;
  const meals = routine?.meal_hours ?? 1;
  const gaming = routine?.gaming_hours ?? 2;
  const other = routine?.other_hours ?? 2;
  const taskHours = allocatedHours;
  const freeHours = Math.max(0, 24 - sleep - meals - gaming - other - taskHours);

  const segments = [
    { label: "Sleep", hours: sleep, color: "hsl(222, 47%, 20%)", textColor: "white" },
    { label: "Meals", hours: meals, color: "#FFF0E6", textColor: "#333" },
    { label: "Gaming", hours: gaming, color: "#E8FDF5", textColor: "#333" },
    { label: "Other", hours: other, color: "hsl(var(--muted))", textColor: "#666" },
    { label: "Tasks", hours: taskHours, color: "hsl(var(--primary))", textColor: "white" },
    { label: "Free", hours: freeHours, color: "#F5F3FF", textColor: "#666" },
  ].filter(s => s.hours > 0);

  const total = segments.reduce((sum, s) => sum + s.hours, 0);

  return (
    <div className="clay-card p-5 flex flex-col gap-3">
      <h3 className="font-heading font-bold text-sm text-foreground">Your Day</h3>
      <div className="flex rounded-full overflow-hidden h-10">
        {segments.map((seg) => (
          <div key={seg.label} className="flex items-center justify-center text-[10px] font-body font-medium transition-all"
            style={{ width: `${(seg.hours / total) * 100}%`, backgroundColor: seg.color, color: seg.textColor }}>
            {seg.hours >= 1.5 && <span className="truncate px-1">{seg.label} {seg.hours.toFixed(1)}h</span>}
          </div>
        ))}
      </div>
      <p className="text-xs font-body text-muted-foreground">
        You have <strong className="text-foreground">{freeHours.toFixed(1)} hours</strong> of free time today. You've allocated{" "}
        <strong className="text-primary">{taskHours.toFixed(1)} hours</strong> to tasks.
      </p>
    </div>
  );
};

export default DailyTimeline;

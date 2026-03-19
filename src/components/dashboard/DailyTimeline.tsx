import type { RoutineData } from "@/pages/Dashboard";

interface DailyTimelineProps {
  routine: RoutineData | null;
  allocatedHours: number;
}

const SEGMENTS_CONFIG = [
  { key: "sleep",  label: "Sleep",  color: "#2D3A6B", textColor: "white" },
  { key: "meals",  label: "Meals",  color: "#FFAC5F", textColor: "#7a3500" },
  { key: "gaming", label: "Gaming", color: "#4ADE80", textColor: "#14532d" },
  { key: "other",  label: "Other",  color: "#94A3B8", textColor: "#1e293b" },
  { key: "tasks",  label: "Tasks",  color: "#9333EA", textColor: "white" },
  { key: "free",   label: "Free",   color: "#67E8F9", textColor: "#164e63" },
];

const DailyTimeline = ({ routine, allocatedHours }: DailyTimelineProps) => {
  const sleep = routine?.sleep_hours ?? 8;
  const meals = routine?.meal_hours ?? 1;
  const gaming = routine?.gaming_hours ?? 2;
  const other = routine?.other_hours ?? 2;
  const taskHours = allocatedHours;
  const freeHours = Math.max(0, 24 - sleep - meals - gaming - other - taskHours);

  const rawSegments = [
    { key: "sleep", hours: sleep },
    { key: "meals", hours: meals },
    { key: "gaming", hours: gaming },
    { key: "other", hours: other },
    { key: "tasks", hours: taskHours },
    { key: "free", hours: freeHours },
  ].filter(s => s.hours > 0);

  const total = rawSegments.reduce((sum, s) => sum + s.hours, 0);
  const actualTotal = Math.max(24, total);

  const segments = rawSegments.map(s => {
    const cfg = SEGMENTS_CONFIG.find(c => c.key === s.key)!;
    const rawPct = (s.hours / actualTotal) * 100;
    return { ...s, ...cfg, pct: rawPct, rawPct };
  });

  return (
    <div className="clay-card p-5 flex flex-col gap-4">
      <h3 className="font-heading font-bold text-sm text-foreground">Your Day</h3>

      {/* Bar */}
      <div className="relative flex rounded-full overflow-hidden h-12 gap-0.5" style={{ isolation: "isolate" }}>
        {segments.map((seg, i) => {
          const isFirst = i === 0;
          const isLast = i === segments.length - 1;
          return (
            <div
              key={seg.key}
              className="relative flex items-center justify-center text-[10px] font-heading font-bold overflow-hidden timeline-bar-shine transition-all"
              style={{
                width: `${seg.pct}%`,
                backgroundColor: seg.color,
                color: seg.textColor,
                borderRadius: isFirst ? "9999px 0 0 9999px" : isLast ? "0 9999px 9999px 0" : "0",
              }}
              title={`${seg.label}: ${seg.hours.toFixed(1)}h`}
            >
              {/* shine overlay */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.28) 0%, transparent 55%)" }}
              />
              {seg.rawPct >= 10 && (
                <span className="relative z-10 truncate px-2">{seg.label} {seg.hours.toFixed(1)}h</span>
              )}
              {seg.rawPct >= 5 && seg.rawPct < 10 && (
                <span className="relative z-10 text-[9px]">{seg.label[0]}</span>
              )}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-x-4 gap-y-1.5">
        {segments.map((seg) => (
          <div key={seg.key} className="flex items-center gap-1.5">
            <div
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: seg.color, boxShadow: `0 0 4px ${seg.color}88` }}
            />
            <span className="text-[10px] font-body text-muted-foreground">
              {seg.label} <span className="font-semibold">{seg.hours.toFixed(1)}h</span>
            </span>
          </div>
        ))}
      </div>

      <p className="text-xs font-body text-muted-foreground">
        You have <strong className="text-foreground">{freeHours.toFixed(1)} hrs</strong> free today •{" "}
        <strong className="text-violet-600">{taskHours.toFixed(1)} hrs</strong> allocated to tasks
      </p>
    </div>
  );
};

export default DailyTimeline;

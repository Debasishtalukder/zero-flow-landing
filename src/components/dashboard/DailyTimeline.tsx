const segments = [
  { label: "Sleep", hours: 8, color: "hsl(222, 47%, 20%)", textColor: "white" },
  { label: "Meals", hours: 1, color: "#FFF0E6", textColor: "#333" },
  { label: "Gaming", hours: 2, color: "#E8FDF5", textColor: "#333" },
  { label: "Other", hours: 2, color: "hsl(var(--muted))", textColor: "#666" },
  { label: "Tasks", hours: 2.5, color: "hsl(var(--primary))", textColor: "white" },
  { label: "Free", hours: 6.5, color: "#F5F3FF", textColor: "#666" },
];

const total = segments.reduce((sum, s) => sum + s.hours, 0);

const DailyTimeline = () => {
  return (
    <div className="clay-card p-5 flex flex-col gap-3">
      <h3 className="font-heading font-bold text-sm text-foreground">Your Day</h3>
      <div className="flex rounded-full overflow-hidden h-10">
        {segments.map((seg) => (
          <div
            key={seg.label}
            className="flex items-center justify-center text-[10px] font-body font-medium transition-all"
            style={{
              width: `${(seg.hours / total) * 100}%`,
              backgroundColor: seg.color,
              color: seg.textColor,
            }}
          >
            {seg.hours >= 1.5 && (
              <span className="truncate px-1">
                {seg.label} {seg.hours}h
              </span>
            )}
          </div>
        ))}
      </div>
      <p className="text-xs font-body text-muted-foreground">
        You have <strong className="text-foreground">6.5 hours</strong> of free time today. You've allocated{" "}
        <strong className="text-primary">2.5 hours</strong> to tasks.
      </p>
    </div>
  );
};

export default DailyTimeline;

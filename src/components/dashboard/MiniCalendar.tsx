import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

const taskDays = [3, 5, 8, 10, 12, 15, 18, 20, 22, 25, 28];

const MiniCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const today = new Date();

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const monthName = currentDate.toLocaleDateString("en-US", { month: "long", year: "numeric" });

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const isToday = (day: number) =>
    day === today.getDate() && month === today.getMonth() && year === today.getFullYear();

  return (
    <div className="clay-card-sm p-4 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <button onClick={prevMonth} className="p-1 rounded-lg hover:bg-muted/50">
          <ChevronLeft className="w-4 h-4 text-muted-foreground" />
        </button>
        <span className="font-heading font-bold text-sm">{monthName}</span>
        <button onClick={nextMonth} className="p-1 rounded-lg hover:bg-muted/50">
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-body text-muted-foreground">
        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
          <span key={d} className="py-1">{d}</span>
        ))}
        {Array.from({ length: firstDay }).map((_, i) => (
          <span key={`empty-${i}`} />
        ))}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const hasTask = taskDays.includes(day);
          return (
            <button
              key={day}
              className={`relative py-1.5 rounded-full text-xs font-body transition-all hover:bg-muted/50 ${
                isToday(day)
                  ? "bg-primary text-primary-foreground font-bold"
                  : "text-foreground"
              }`}
            >
              {day}
              {hasTask && !isToday(day) && (
                <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-emerald-400" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default MiniCalendar;

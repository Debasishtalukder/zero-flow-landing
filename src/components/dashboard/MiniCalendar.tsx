import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import type { TaskData } from "@/pages/Dashboard";

interface MiniCalendarProps {
  tasks: TaskData[];
}

const MiniCalendar = ({ tasks }: MiniCalendarProps) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const today = new Date();

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthName = currentDate.toLocaleDateString("en-US", { month: "long", year: "numeric" });

  const prevMonth = () => { setCurrentDate(new Date(year, month - 1, 1)); setSelectedDay(null); };
  const nextMonth = () => { setCurrentDate(new Date(year, month + 1, 1)); setSelectedDay(null); };

  const isToday = (day: number) =>
    day === today.getDate() && month === today.getMonth() && year === today.getFullYear();

  // Tasks that fall within the current month based on start_date and total_days
  const getTasksForDay = (day: number) => {
    const date = new Date(year, month, day);
    return tasks.filter(t => {
      const start = new Date(t.start_date);
      const end = new Date(start);
      end.setDate(end.getDate() + t.total_days);
      return date >= start && date <= end;
    });
  };

  const taskDays = Array.from({ length: daysInMonth }, (_, i) => i + 1).filter(d => getTasksForDay(d).length > 0);

  return (
    <div className="clay-card-sm p-4 flex flex-col gap-3 relative">
      <div className="flex items-center justify-between">
        <button onClick={prevMonth} className="p-1 rounded-lg hover:bg-muted/50"><ChevronLeft className="w-4 h-4 text-muted-foreground" /></button>
        <span className="font-heading font-bold text-sm">{monthName}</span>
        <button onClick={nextMonth} className="p-1 rounded-lg hover:bg-muted/50"><ChevronRight className="w-4 h-4 text-muted-foreground" /></button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-body text-muted-foreground">
        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (<span key={d} className="py-1">{d}</span>))}
        {Array.from({ length: firstDay }).map((_, i) => (<span key={`empty-${i}`} />))}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const hasTask = taskDays.includes(day);
          return (
            <button key={day} onClick={() => setSelectedDay(selectedDay === day ? null : day)}
              className={`relative py-1.5 rounded-full text-xs font-body transition-all hover:bg-muted/50 ${
                isToday(day) ? "bg-primary text-primary-foreground font-bold" : "text-foreground"
              }`}>
              {day}
              {hasTask && !isToday(day) && (
                <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-emerald-400" />
              )}
            </button>
          );
        })}
      </div>

      {selectedDay && (
        <div className="clay-card-sm p-3 bg-white">
          <p className="font-heading font-bold text-xs mb-2">Tasks for {monthName.split(" ")[0]} {selectedDay}</p>
          {getTasksForDay(selectedDay).length === 0 ? (
            <p className="text-xs font-body text-muted-foreground">No tasks this day</p>
          ) : (
            <div className="flex flex-col gap-1">
              {getTasksForDay(selectedDay).map(t => (
                <div key={t.id} className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: t.color }} />
                  <span className="text-xs font-body text-foreground">{t.name}</span>
                  <span className="text-[10px] text-muted-foreground">{t.duration_min}min</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MiniCalendar;

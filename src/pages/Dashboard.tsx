import { useState } from "react";
import { Plus } from "lucide-react";
import DashboardNavbar from "@/components/dashboard/DashboardNavbar";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import MobileBottomNav from "@/components/dashboard/MobileBottomNav";
import StatsCards from "@/components/dashboard/StatsCards";
import TaskCard from "@/components/dashboard/TaskCard";
import AddTaskModal from "@/components/dashboard/AddTaskModal";
import DailyTimeline from "@/components/dashboard/DailyTimeline";
import MiniCalendar from "@/components/dashboard/MiniCalendar";

const sampleTasks = [
  { name: "Morning Run", duration: "45 min/day", dayProgress: "Day 12 of 30", percentage: 40, bgColor: "#E8FDF5", hasStreak: true },
  { name: "Deep Work", duration: "90 min/day", dayProgress: "Day 8 of 21", percentage: 75, bgColor: "#FFF0E6", hasStreak: true },
  { name: "Read 30 min", duration: "30 min/day", dayProgress: "Day 5 of 60", percentage: 20, bgColor: "#E8F4FF", hasStreak: false },
  { name: "Learn Spanish", duration: "20 min/day", dayProgress: "Day 18 of 90", percentage: 60, bgColor: "#F3E8FF", hasStreak: true },
  { name: "Workout", duration: "60 min/day", dayProgress: "Day 3 of 30", percentage: 10, bgColor: "#FFFBE6", hasStreak: false },
  { name: "Journal", duration: "15 min/day", dayProgress: "Day 25 of 30", percentage: 83, bgColor: "#EDE9FE", hasStreak: true },
];

const Dashboard = () => {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background relative">
      {/* Dot grid */}
      <div className="fixed inset-0 dot-grid pointer-events-none" />

      <DashboardNavbar />

      <div className="flex relative z-10">
        <DashboardSidebar />

        <main className="flex-1 p-4 md:p-6 pb-24 md:pb-6 flex flex-col gap-6 max-w-5xl">
          <StatsCards />

          {/* Add Task Button */}
          <button
            onClick={() => setModalOpen(true)}
            className="w-full py-4 rounded-2xl border-2 border-dashed border-primary/40 text-primary font-heading font-bold text-sm flex items-center justify-center gap-2 hover:bg-primary/5 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add New Task
          </button>

          {/* Task Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {sampleTasks.map((task) => (
              <TaskCard key={task.name} {...task} />
            ))}
          </div>

          {/* Daily Timeline */}
          <DailyTimeline />

          {/* Calendar */}
          <div className="max-w-sm">
            <MiniCalendar />
          </div>
        </main>
      </div>

      <MobileBottomNav />
      <AddTaskModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
};

export default Dashboard;

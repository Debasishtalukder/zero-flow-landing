import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

const NotificationSystem = () => {
  const { user, userProfile } = useAuth();

  useEffect(() => {
    if (!user || userProfile?.notifications_enabled === false) return;

    const checkReminders = async () => {
      if (Notification.permission !== "granted") return;

      const now = new Date();
      const currentTime = now.toTimeString().slice(0, 5); // "HH:MM"
      
      // Get tasks with reminders set for this exact minute
      const { data: tasks } = await supabase
        .from("tasks")
        .select("name, reminder_time")
        .eq("user_id", user.id)
        .eq("reminder_time", currentTime);

      if (tasks && tasks.length > 0) {
        tasks.forEach(task => {
          new Notification("ZeroFlow Reminder", {
            body: `Time for ${task.name}! Let's keep your streak going 🔥`,
            icon: "/favicon.ico", // Ensure this exists or use a default
          });
        });
      }
    };

    // Check every minute
    const interval = setInterval(checkReminders, 60000);
    
    // Also check immediately on mount
    checkReminders();

    return () => clearInterval(interval);
  }, [user, userProfile?.notifications_enabled]);

  return null; // Invisible component
};

export default NotificationSystem;

import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";

const NotificationSystem = () => {
  const { user, userProfile } = useAuth();

  useEffect(() => {
    if (!user || userProfile?.notifications_enabled === false) return;

    const checkReminders = async () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, "0");
      const minutes = now.getMinutes().toString().padStart(2, "0");
      const currentTime = `${hours}:${minutes}`;
      
      // Get tasks with reminders set for this exact minute (matching HH:MM or HH:MM:SS)
      const { data: tasks } = await supabase
        .from("tasks")
        .select("name, reminder_time")
        .eq("user_id", user.id)
        .like("reminder_time", `${currentTime}%`);

      if (tasks && tasks.length > 0) {
        tasks.forEach(task => {
          const title = "ZeroFlow Reminder";
          const body = `Time for ${task.name}! Let's keep your streak going 🔥`;

          // Show in-app toast notification
          toast({
            title,
            description: body,
            duration: 10000,
          });

          // Show native browser notification if permitted
          if (Notification.permission === "granted") {
            new Notification(title, {
              body,
              icon: "/favicon.ico",
            });
          }
        });
      }
    };

    // Calculate time until next minute to align the interval
    const now = new Date();
    const delayToNextMinute = 60000 - (now.getSeconds() * 1000 + now.getMilliseconds());

    let interval: ReturnType<typeof setInterval>;
    
    const timeout = setTimeout(() => {
      checkReminders();
      interval = setInterval(checkReminders, 60000);
    }, delayToNextMinute);
    
    // Also check immediately on mount
    checkReminders();

    return () => {
      clearTimeout(timeout);
      if (interval) clearInterval(interval);
    };
  }, [user, userProfile?.notifications_enabled]);

  return null; // Invisible component
};

export default NotificationSystem;

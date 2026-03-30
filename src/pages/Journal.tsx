import { useState, useEffect } from "react";
import { ArrowLeft, Save, Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { NavLink } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { toast } from "@/hooks/use-toast";
import DashboardNavbar from "@/components/dashboard/DashboardNavbar";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import MobileBottomNav from "@/components/dashboard/MobileBottomNav";
import { Skeleton } from "@/components/ui/skeleton";
import { sanitizeInput } from "@/lib/sanitize";

const Journal = () => {
  const { user, userProfile, refreshProfile } = useAuth();
  const { isPro: isSubscriptionPro } = useSubscription();
  const [content, setContent] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [entryId, setEntryId] = useState<string | null>(null);
  const [totalEntries, setTotalEntries] = useState(0);
  const [journalStreak, setJournalStreak] = useState(0);
  const [calendarMonth, setCalendarMonth] = useState(new Date());
  const [entryDates, setEntryDates] = useState<string[]>([]);

  const today = new Date().toISOString().split("T")[0];
  const isToday = selectedDate === today;
  const isPro = userProfile?.plan === "pro" || isSubscriptionPro;
  const FREE_LIMIT = 7;
  const isLocked = !isPro && totalEntries >= FREE_LIMIT && !entryId;

  const loadData = async () => {
    if (!user) return;
    setLoading(true);
    // Fetch entry for selected date
    const { data: entry } = await supabase
      .from("journal_entries")
      .select("*")
      .eq("user_id", user.id)
      .eq("date", selectedDate)
      .single();

    if (entry) {
      setContent((entry as any).content);
      setEntryId((entry as any).id);
    } else {
      setContent("");
      setEntryId(null);
    }

    // Fetch total count
    const { count } = await supabase
      .from("journal_entries")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id);
    setTotalEntries(count || 0);

    // Fetch all entry dates for calendar
    const { data: dates } = await supabase
      .from("journal_entries")
      .select("date")
      .eq("user_id", user.id);
    setEntryDates((dates || []).map((d: any) => d.date));

    // Calculate journal streak
    if (dates && dates.length > 0) {
      const sorted = [...new Set((dates as any[]).map(d => d.date))].sort().reverse();
      let streak = 0;
      let d = new Date();
      let expectedStr = d.toISOString().split("T")[0];
      if (!sorted.includes(expectedStr)) {
        d.setDate(d.getDate() - 1);
        expectedStr = d.toISOString().split("T")[0];
      }
      if (sorted.includes(expectedStr)) {
        for (let i = 0;; i++) {
          const checkD = new Date(d);
          checkD.setDate(checkD.getDate() - i);
          if (sorted.includes(checkD.toISOString().split("T")[0])) streak++;
          else break;
        }
      }
      setJournalStreak(streak);
    }

    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [user, selectedDate]);

  const handleSave = async () => {
    const sanitizedContent = sanitizeInput(content);
    if (!user || !sanitizedContent) return;
    if (sanitizedContent.length > 5000) {
      toast({ title: "Entry too long", description: "Journal entry must be under 5000 characters.", variant: "destructive" });
      return;
    }
    setSaving(true);

    if (entryId) {
      await supabase.from("journal_entries").update({ content: sanitizedContent }).eq("id", entryId);
      toast({ title: "Journal entry updated ✍️" });
    } else {
      await supabase.from("journal_entries").insert({
        user_id: user.id,
        date: selectedDate,
        content: sanitizedContent,
      });

      // Award 50 XP for daily journal entry
      const { data: profile } = await supabase.from("profiles").select("total_xp").eq("id", user.id).single();
      if (profile) {
        await supabase.from("profiles").update({ total_xp: (profile.total_xp || 0) + 50 }).eq("id", user.id);
        await refreshProfile();
        loadData(); // Refresh state
      }

      toast({ title: "Journal saved! 📖", description: "+50 XP earned!" });
    }

    setSaving(false);
    // Reload to update counts
    const { count } = await supabase
      .from("journal_entries")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id);
    setTotalEntries(count || 0);
  };

  const handleExportPDF = () => {
    if (!isPro) return;
    window.print();
  };

  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;

  // Mini calendar logic
  const year = calendarMonth.getFullYear();
  const month = calendarMonth.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthName = calendarMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" });

  const calendarDays = [];
  for (let i = 0; i < firstDay; i++) calendarDays.push(null);
  for (let i = 1; i <= daysInMonth; i++) calendarDays.push(i);

  if (loading) {
    return (
      <div className="min-h-screen bg-background relative">
        <div className="fixed inset-0 dot-grid pointer-events-none" />
        <DashboardNavbar />
        <div className="flex relative z-10">
          <DashboardSidebar />
          <main className="flex-1 p-6 flex flex-col gap-6">
            {[1, 2].map(i => <Skeleton key={i} className="h-40 rounded-2xl" />)}
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative">
      <div className="fixed inset-0 dot-grid pointer-events-none" />
      <div className="blob-bg">
        <div className="blob blob-1" />
        <div className="blob blob-2" />
        <div className="blob blob-3" />
      </div>
      <DashboardNavbar />
      <div className="flex relative z-10">
        <DashboardSidebar />
        <main className="flex-1 p-4 md:p-6 pb-24 md:pb-6 flex flex-col gap-6">
          <div className="flex items-center gap-3">
            <NavLink to="/dashboard" className="p-2 rounded-xl hover:bg-muted/50">
              <ArrowLeft className="w-5 h-5 text-muted-foreground" />
            </NavLink>
            <h1 className="font-heading font-bold text-2xl text-foreground">📝 Journal</h1>
            <div className="ml-auto flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-heading font-bold bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300">
                🔥 {journalStreak} day streak
              </span>
              {!isPro && (
                <span className="px-3 py-1 rounded-full text-xs font-heading font-bold bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300">
                  {totalEntries}/{FREE_LIMIT} entries used
                </span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Journal Entry Area */}
            <div className="lg:col-span-2 clay-card p-6 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h2 className="font-heading font-bold text-lg text-foreground">
                  {isToday ? "Today's Entry" : new Date(selectedDate + "T12:00:00").toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
                </h2>
                <span className="text-xs font-body text-muted-foreground">{wordCount} words</span>
              </div>

              {isLocked ? (
                <div className="relative">
                  <textarea
                    disabled
                    placeholder="Write your thoughts..."
                    className="w-full h-64 px-4 py-3 rounded-xl border border-border bg-muted/30 font-body text-sm resize-none blur-sm"
                  />
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/60 backdrop-blur-sm rounded-xl">
                    <p className="text-2xl mb-2">🔒</p>
                    <p className="font-heading font-bold text-foreground">Free limit reached</p>
                    <p className="text-sm text-muted-foreground mb-3">Upgrade to Pro for unlimited journaling</p>
                    <NavLink to="/upgrade" className="btn-pill bg-primary text-primary-foreground text-sm px-6 py-2">
                      Upgrade to Pro ⚡
                    </NavLink>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex flex-col gap-1">
                    <textarea
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      placeholder="How was your day? What went well? What will you improve tomorrow?"
                      disabled={!isToday || isLocked}
                      className="w-full h-64 px-4 py-3 rounded-xl border border-border bg-white dark:bg-muted/20 font-body text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow text-foreground placeholder:text-muted-foreground"
                    />
                    <div className="flex items-center justify-between text-[10px] text-muted-foreground font-medium px-1">
                      <span>{wordCount} words</span>
                      {isToday && <span>Today's Reflection</span>}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={handleSave}
                      disabled={saving || !isToday || isLocked || !content.trim()}
                      className="flex-1 flex items-center justify-center gap-2 py-3 bg-violet-600 text-white rounded-2xl font-bold shadow-lg shadow-violet-200 hover:bg-violet-700 disabled:opacity-50 transition-all"
                    >
                      <Save className="w-4 h-4" />
                      {saving ? "Saving..." : "Save Reflection"}
                    </button>

                    {isPro && (
                      <button
                        onClick={handleExportPDF}
                        className="p-3 bg-white dark:bg-muted/40 text-foreground border border-border rounded-2xl font-bold hover:bg-muted/50 transition-all"
                        title="Export as PDF"
                      >
                        <Save className="w-4 h-4 text-emerald-500" />
                      </button>
                    )}
                  </div>
                  {!isToday && entryId && (
                    <p className="text-xs text-muted-foreground font-body italic">Past entries are read-only.</p>
                  )}
                </>
              )}
            </div>

            {/* Calendar Sidebar */}
            <div className="clay-card p-5 flex flex-col gap-4 h-fit">
              <div className="flex items-center justify-between">
                <button onClick={() => setCalendarMonth(new Date(year, month - 1, 1))} className="p-1.5 rounded-lg hover:bg-muted/40">
                  <ChevronLeft className="w-4 h-4 text-muted-foreground" />
                </button>
                <span className="font-heading font-bold text-sm text-foreground">{monthName}</span>
                <button onClick={() => setCalendarMonth(new Date(year, month + 1, 1))} className="p-1.5 rounded-lg hover:bg-muted/40">
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>

              <div className="grid grid-cols-7 gap-1 text-center">
                {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
                  <span key={i} className="text-[10px] font-heading font-bold text-muted-foreground">{d}</span>
                ))}
                {calendarDays.map((day, i) => {
                  if (!day) return <div key={i} />;
                  const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                  const hasEntry = entryDates.includes(dateStr);
                  const isSelected = dateStr === selectedDate;
                  return (
                    <button
                      key={i}
                      onClick={() => setSelectedDate(dateStr)}
                      className={`w-8 h-8 rounded-full text-xs font-heading font-bold transition-all mx-auto flex items-center justify-center ${
                        isSelected
                          ? "bg-primary text-primary-foreground shadow-md"
                          : hasEntry
                          ? "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300"
                          : "text-foreground hover:bg-muted/40"
                      }`}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>

              <div className="border-t border-border pt-3">
                <p className="text-[10px] font-heading font-bold text-muted-foreground uppercase tracking-wider mb-1">Legend</p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground font-body">
                  <span className="w-3 h-3 rounded-full bg-violet-100 dark:bg-violet-900/40 inline-block" /> Has entry
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
      <MobileBottomNav />
    </div>
  );
};

export default Journal;

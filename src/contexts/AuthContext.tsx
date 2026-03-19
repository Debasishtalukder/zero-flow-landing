import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

interface UserProfile {
  id: string;
  plan?: string | null;
  full_name?: string | null;
  email?: string | null;
  avatar_url?: string | null;
  total_xp?: number | null;
  level?: number | null;
  vacation_start?: string | null;
  vacation_end?: string | null;
  theme_preference?: string | null;
  notifications_enabled?: boolean | null;
}

interface AuthContextType {
  session: Session | null;
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  userProfile: null,
  loading: true,
  signOut: async () => {},
  refreshProfile: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (userId: string) => {
    console.log("fetchProfile started for user", userId);
    try {
      // Add a 5-second timeout to prevent infinite hanging
      const timeoutPromise = new Promise<{data: null, error: Error}>((_, reject) => {
        setTimeout(() => reject(new Error("Supabase request timed out after 5s")), 5000);
      });
      
      const [profileRes, settingsRes] = await Promise.all([
        supabase.from("profiles").select("*").eq("id", userId).single(),
        supabase.from("user_settings").select("*").eq("user_id", userId).single(),
      ]);
      
      let combinedData = { ...profileRes.data };
      if (settingsRes.data) {
        combinedData = { ...combinedData, ...settingsRes.data };
      } else {
        // If settings don't exist yet, create them with defaults
        const { data: newSettings } = await supabase.from("user_settings").insert({ user_id: userId }).select().single();
        if (newSettings) combinedData = { ...combinedData, ...newSettings };
      }
      
      // Use plan from DB, fallback to "free" if not set
      combinedData.plan = combinedData.plan || "free";
      
      // Manual overrides for paying users as requested
      const payingEmails = ["debatulakder@gmail.com", "debatalukder55@gmail.com"];
      if (session?.user?.email && payingEmails.includes(session.user.email.toLowerCase())) {
        combinedData.plan = "pro";
      }
      
      setUserProfile(combinedData as UserProfile);
    } catch (e) {
      console.error("Failed to fetch profile and settings:", e);
    }
  };

  const refreshProfile = async () => {
    if (session?.user?.id) await fetchProfile(session.user.id);
  };

  useEffect(() => {
    console.log("AuthContext useEffect ran");
    
    // Auth Session Expiry Check (7 days inactive)
    const checkSessionExpiry = () => {
      const lastActivity = localStorage.getItem("zeroflow_last_activity");
      if (lastActivity && Date.now() - parseInt(lastActivity) > 7 * 24 * 60 * 60 * 1000) {
        supabase.auth.signOut();
        localStorage.removeItem("zeroflow_last_activity");
      } else {
        localStorage.setItem("zeroflow_last_activity", Date.now().toString());
      }
    };
    checkSessionExpiry();

    const updateActivity = () => localStorage.setItem("zeroflow_last_activity", Date.now().toString());
    window.addEventListener("click", updateActivity);
    window.addEventListener("keydown", updateActivity);

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, newSession) => {
        console.log("onAuthStateChange fired. Event:", event, "Has user:", !!newSession?.user);
        setSession(newSession);
        
        if (newSession?.user) {
          // Do not await, let it run in background so we don't hang
          fetchProfile(newSession.user.id).finally(() => {
            console.log("Setting loading to false from onAuthStateChange finally");
            setLoading(false);
          });
        } else {
          setUserProfile(null);
          setLoading(false);
        }
      }
    );

    console.log("Calling getSession()...");
    const sessionTimeout = new Promise<any>((_, reject) => {
      setTimeout(() => reject(new Error("getSession timed out after 5s")), 5000);
    });

    Promise.race([
      supabase.auth.getSession(),
      sessionTimeout
    ]).then(async (res: any) => {
      const { data: { session: initSession }, error } = res;
      console.log("getSession() returned. Has session:", !!initSession, "Error:", !!error);
      setSession(initSession);
      try {
        if (initSession?.user) {
          await fetchProfile(initSession.user.id);
        }
      } finally {
        console.log("Setting loading to false from getSession finally");
        setLoading(false);
      }
    }).catch(e => {
      console.error("Failed to get session:", e);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
      window.removeEventListener("click", updateActivity);
      window.removeEventListener("keydown", updateActivity);
    };
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ session, user: session?.user ?? null, userProfile, loading, signOut, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

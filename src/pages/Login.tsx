import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import logo from "@/assets/logo.jpg";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const attempts = parseInt(localStorage.getItem("zf_login_attempts") || "0");
    const lockout = parseInt(localStorage.getItem("zf_login_lockout") || "0");
    
    if (lockout && Date.now() < lockout) {
      toast({ title: "Too many attempts", description: "Please wait 15 minutes.", variant: "destructive" });
      return;
    }
    
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    
    if (error) {
      const newAttempts = attempts + 1;
      localStorage.setItem("zf_login_attempts", newAttempts.toString());
      if (newAttempts >= 5) {
        localStorage.setItem("zf_login_lockout", (Date.now() + 15 * 60 * 1000).toString());
        toast({ title: "Too many attempts", description: "Please wait 15 minutes.", variant: "destructive" });
      } else {
        toast({ title: "Login failed", description: error.message, variant: "destructive" });
      }
    } else {
      localStorage.removeItem("zf_login_attempts");
      localStorage.removeItem("zf_login_lockout");
      navigate("/dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center relative">
      <div className="fixed inset-0 dot-grid pointer-events-none" />
      <div className="clay-card p-8 w-full max-w-md mx-4 relative z-10">
        <div className="flex items-center gap-2 justify-center mb-8">
          <img src={logo} alt="ZeroFlow" className="w-10 h-10 rounded-xl" />
          <span className="font-heading font-extrabold text-2xl text-foreground">ZeroFlow</span>
        </div>
        <h1 className="font-heading font-bold text-xl text-center mb-6 text-foreground">Welcome back</h1>
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div>
            <label className="text-xs font-body font-medium text-muted-foreground mb-1 block">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="w-full px-4 py-3 rounded-xl border border-border bg-white font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
          <div>
            <label className="text-xs font-body font-medium text-muted-foreground mb-1 block">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full px-4 py-3 rounded-xl border border-border bg-white font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="btn-pill bg-primary text-primary-foreground w-full py-3.5 text-base disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
        <p className="text-center text-sm font-body text-muted-foreground mt-6">
          Don't have an account?{" "}
          <Link to="/signup" className="text-primary font-bold hover:underline">Sign up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;

import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { motion, AnimatePresence } from "framer-motion";

interface ComingSoonModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ComingSoonModal = ({ isOpen, onClose }: ComingSoonModalProps) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  
  useEffect(() => {
    if (user?.email && !email) {
      setEmail(user.email);
    }
  }, [user, email]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    try {
      const { error } = await supabase.from("waitlist").insert({ email, user_id: user?.id });
      
      if (error) {
        if (error.code === '23505') { // Unique violation
          toast({
            title: "Already on the list! 🚀",
            description: "We'll notify you as soon as Pro is ready.",
          });
          onClose();
        } else {
          throw error;
        }
      } else {
        toast({
          title: "You're on the list! 🎉",
          description: `We'll notify you at ${email}`,
        });
        onClose();
      }
    } catch (error: any) {
      toast({
        title: "Error joining waitlist",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ 
                opacity: 1, 
                scale: 1, 
                y: 0,
                transition: { type: "spring", stiffness: 300, damping: 20 }
              }}
              exit={{ opacity: 0, scale: 0.95, y: -20, transition: { duration: 0.2 } }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 pointer-events-auto relative overflow-hidden"
            >
              <button
                onClick={onClose}
                className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition-colors p-2 rounded-full hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-center mt-2">
                <div className="text-5xl mb-4">🚀</div>
                <h2 className="text-2xl font-heading font-bold text-gray-900 mb-2">
                  Pro is Coming Soon!
                </h2>
                <p className="text-gray-600 font-body mb-6">
                  We're working hard to bring you an amazing Pro experience. Enter your email to get notified when Pro launches!
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      required
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-coral-500/50 focus:border-coral-500 transition-all font-body text-gray-900"
                    />
                  </div>
                  
                  <div className="flex flex-col gap-3 pt-2">
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-3 rounded-xl bg-coral-500 text-white font-heading font-medium hover:bg-coral-600 active:scale-[0.98] transition-all disabled:opacity-70 flex items-center justify-center shadow-lg shadow-coral-500/20"
                    >
                      {loading ? (
                        <span className="flex items-center gap-2">
                          <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Saving...
                        </span>
                      ) : "Notify Me"}
                    </button>
                    <button
                      type="button"
                      onClick={onClose}
                      className="w-full py-3 rounded-xl bg-gray-100 text-gray-600 font-medium hover:bg-gray-200 active:scale-[0.98] transition-all"
                    >
                      Maybe Later
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ComingSoonModal;

"use client";

import { supabase } from "@/lib/supabaseClient";
import { useState } from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Lock, Chrome } from "lucide-react"; 
import { Bookmark as BookmarkIcon } from "lucide-react";
export default function LoginPage() {
  const [loading, setLoading] = useState(false);

  const login = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
       
      });
      if (error) throw error;
    } catch (error: any) {
      console.error("Login error:", error.message);
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-slate-950 px-4 overflow-hidden">
      {/* Dynamic Background Mesh */}
      <div className="absolute inset-0">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-600/20 blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-600/20 blur-[120px] animate-pulse delay-700" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Decorative Top Icon */}
        <div className="flex justify-center mb-6">
          <motion.div 
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            className="p-4 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl shadow-2xl"
          >
            <Lock className="text-indigo-400 w-8 h-8" />
          </motion.div>
        </div>

        <div className="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl shadow-2xl p-8 md:p-10">
         
          <div className="text-center mb-10">
           
            <h1 className="flex items-center justify-center text-4xl font-extrabold text-white tracking-tight">
              BookMark
              <span className="ml-2 inline-flex p-1.5 bg-indigo-500 rounded-lg shadow-lg shadow-indigo-500/30">
                <BookmarkIcon className="text-white w-6 h-6" />
              </span>
            </h1>
            <p className="text-slate-400 mt-3 font-medium">
              Securely store and sync your web.
            </p>
          </div>
          
          <button
            onClick={login}
            disabled={loading}
            className={`group relative w-full flex items-center justify-center gap-3 rounded-xl px-6 py-4 font-semibold transition-all duration-300 overflow-hidden
              ${
                loading
                  ? "bg-slate-800 text-slate-500 cursor-not-allowed"
                  : "bg-white text-slate-900 hover:bg-slate-100 hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] active:scale-95"
              }`}
          >
            {loading ? (
              <span className="flex items-center gap-3">
                <span className="w-5 h-5 border-2 border-slate-500 border-t-transparent rounded-full animate-spin" />
                Loading...
              </span>
            ) : (
              <>
                <img
                  src="https://www.svgrepo.com/show/475656/google-color.svg"
                  alt="Google"
                  className="w-5 h-5 group-hover:scale-110 transition-transform"
                />
                Continue with Google
              </>
            )}
          </button>

          {/* Trust Banner */}
          <div className="mt-8 flex items-center justify-center gap-2 text-slate-500 text-xs uppercase tracking-widest font-bold">
            <div className="h-[1px] w-8 bg-slate-800" />
            <span className="flex items-center gap-1.5">
              <ShieldCheck size={14} className="text-indigo-500" />
              Enterprise Security
            </span>
            <div className="h-[1px] w-8 bg-slate-800" />
          </div>

    
          <p className="text-xs text-slate-500 text-center mt-10 leading-relaxed">
            You agree to our{" "}
            <span className="text-slate-300 hover:text-white underline cursor-pointer transition-colors">
              Terms of Service
            </span>{" "}
            and{" "}
            <span className="text-slate-300 hover:text-white underline cursor-pointer transition-colors">
              Privacy Policy
            </span>.
          </p>
        </div>

        Floating Background Hint
        <p className="text-center text-slate-600 text-[10px] mt-6 tracking-[0.2em] uppercase">
          Powered by Supabase & Next.js
        </p>
      </motion.div>
    </div>
  );
}
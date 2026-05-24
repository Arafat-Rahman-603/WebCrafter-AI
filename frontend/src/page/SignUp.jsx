"use client";

import React, { useCallback, useEffect } from "react";
import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import GoogleAuthButton from "@/componentes/GoogleAuthButton";
import { googleAuthUser, clearError } from "../redux/slices/authSlice";

export default function SignUp() {
  const dispatch = useDispatch();
  const { isLoading, error, isInitialized, user } = useSelector((state) => state.auth);
  const router = useRouter();

  useEffect(() => {
    if (isInitialized && user) {
      router.push("/");
    }
  }, [isInitialized, user, router]);

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  const handleGoogleAuth = useCallback(async (credential) => {
    try {
      await dispatch(googleAuthUser({ credential })).unwrap();
      router.push("/dashboard");
    } catch {}
  }, [dispatch, router]);

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#0a0f1e]">
      {/* Animated background orbs */}
      <motion.div
        animate={{ scale: [1, 1.25, 1], x: [0, 50, 0], y: [0, -40, 0] }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[-15%] right-[-10%] w-[550px] h-[550px] rounded-full bg-indigo-700/30 blur-[130px]"
      />
      <motion.div
        animate={{ scale: [1, 1.2, 1], x: [0, -40, 0], y: [0, 50, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-blue-800/25 blur-[140px]"
      />
      <motion.div
        animate={{ scale: [1, 1.1, 1], x: [0, 20, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[30%] left-[30%] w-[300px] h-[300px] rounded-full bg-violet-600/20 blur-[90px]"
      />

      {/* Glassmorphic card */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md mx-4 my-8"
      >
        <div
          className="rounded-2xl border border-white/10 p-8 sm:p-10"
          style={{
            background: "rgba(15, 23, 42, 0.75)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            boxShadow: "0 8px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.08)",
          }}
        >
          {/* Logo */}
          <div className="text-center mb-2">
            <span className="text-2xl font-extrabold tracking-tight text-gray-400">
              WebCrafter
              <span className="ml-1 bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
                AI
              </span>
            </span>
          </div>

          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent text-center mb-1">Create your account</h1>
          <p className="text-slate-400 text-sm text-center mb-8">Continue with Google to start using WebCrafter AI.</p>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-3.5 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl text-sm font-medium"
            >
              {error}
            </motion.div>
          )}

          <div className="space-y-5">
            <div className="flex justify-center">
              <GoogleAuthButton
                onCredential={handleGoogleAuth}
                text="signup_with"
              />
            </div>

            {isLoading && (
              <div className="flex items-center justify-center gap-2 text-sm text-slate-300">
                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating your account...
              </div>
            )}
          </div>

          {/* Feature pills */}
          <div className="mt-6 flex flex-wrap gap-2 justify-center">
            {["AI code generation", "Deploy in one click", "Google sign in"].map((f) => (
              <span
                key={f}
                className="px-3 py-1 rounded-full text-xs font-medium text-slate-400 border border-white/10 bg-white/5"
              >
                ✓ {f}
              </span>
            ))}
          </div>

          <p className="mt-6 text-center text-sm text-slate-500">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-blue-400 hover:text-blue-300 transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}


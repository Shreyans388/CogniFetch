"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { api, ApiError } from "@/lib/api";
import { Flame, Eye, EyeOff, ArrowRight, Zap, Shield, Brain } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError]             = useState("");
  const [loading, setLoading]         = useState(false);
  const [showPw, setShowPw]           = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(""); setLoading(true);
    const fd = new FormData(e.currentTarget);
    const params = new URLSearchParams();
    params.append("username", fd.get("username") as string);
    params.append("password", fd.get("password") as string);
    try {
      const data = await api.post("/api/auth/token", params, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });
      localStorage.setItem("token", data.access_token);
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Login failed. Please try again.");
    } finally { setLoading(false); }
  };

  const features = [
    { icon: Brain,  title: "AI-Powered Search",   desc: "Semantic retrieval across all your documents" },
    { icon: Zap,    title: "Instant Answers",      desc: "Stream responses word by word in real-time" },
    { icon: Shield, title: "Secure & Private",     desc: "Your data stays in your own infrastructure" },
  ];

  return (
    <main className="min-h-screen flex" style={{ background: "#070d1a" }}>
      {/* ── Left Panel ── */}
      <div className="hidden lg:flex flex-col justify-between w-[46%] p-12 relative overflow-hidden">
        {/* Decorative blobs */}
        <div className="absolute -top-20 -left-20 w-96 h-96 rounded-full opacity-20 blur-3xl animate-pulse"
          style={{ background: "radial-gradient(circle, #f97316 0%, transparent 70%)" }} />
        <div className="absolute bottom-0 right-0 w-72 h-72 rounded-full opacity-10 blur-3xl animate-pulse [animation-delay:2s]"
          style={{ background: "radial-gradient(circle, #f97316 0%, transparent 70%)" }} />

        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group z-10">
          <div className="w-11 h-11 rounded-2xl flex items-center justify-center shadow-xl transition-all group-hover:scale-105"
            style={{ background: "linear-gradient(135deg,#f97316,#ea580c)", boxShadow: "0 8px 24px rgba(234,88,12,0.4)" }}>
            <Flame className="h-6 w-6 text-white" />
          </div>
          <span className="text-2xl font-bold text-white">Cogni<span className="text-orange-400">Fetch</span></span>
        </Link>

        {/* Hero */}
        <div className="z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold text-orange-300"
            style={{ background: "rgba(234,88,12,0.12)", border: "1px solid rgba(234,88,12,0.25)" }}>
            <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse" />
            AI Knowledge Platform
          </div>
          <h1 className="text-5xl font-extrabold text-white leading-[1.15] tracking-tight">
            Your docs,<br />
            <span className="animate-shimmer-text">supercharged.</span>
          </h1>
          <p className="text-slate-400 text-lg leading-relaxed max-w-sm">
            Upload any document, ask anything — CogniFetch delivers precise, cited answers in seconds.
          </p>
        </div>

        {/* Feature cards */}
        <div className="z-10 space-y-3">
          {features.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex items-center gap-4 p-4 rounded-2xl"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
              <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: "rgba(234,88,12,0.12)", border: "1px solid rgba(234,88,12,0.2)" }}>
                <Icon className="h-4.5 w-4.5 text-orange-400" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">{title}</p>
                <p className="text-xs text-slate-500 mt-0.5">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Right Form Panel ── */}
      <div className="flex flex-1 items-center justify-center px-6 py-12 relative">
        {/* Glow behind card */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full opacity-8 blur-[120px] pointer-events-none"
          style={{ background: "radial-gradient(circle, #f97316 0%, transparent 70%)" }} />

        <div className="w-full max-w-md rounded-3xl p-9 space-y-8 relative z-10"
          style={{
            background: "rgba(10,17,32,0.85)",
            backdropFilter: "blur(32px)",
            border: "1px solid rgba(255,255,255,0.07)",
            boxShadow: "0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(234,88,12,0.06)",
          }}
        >
          {/* Mobile logo */}
          <div className="flex lg:hidden items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: "linear-gradient(135deg,#f97316,#ea580c)", boxShadow: "0 4px 16px rgba(234,88,12,0.35)" }}>
              <Flame className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white">Cogni<span className="text-orange-400">Fetch</span></span>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white">Welcome back</h2>
            <p className="mt-1.5 text-sm text-slate-500">Sign in to your account to continue</p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            {/* Username */}
            <div className="space-y-2">
              <label htmlFor="username" className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">Username</label>
              <input id="username" name="username" type="text" required disabled={loading}
                placeholder="Enter your username"
                className="w-full px-4 py-3.5 rounded-xl text-sm text-white placeholder-slate-600 outline-none transition-all disabled:opacity-50"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
                onFocus={e => (e.currentTarget.style.borderColor = "rgba(234,88,12,0.5)")}
                onBlur={e  => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)")}
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label htmlFor="password" className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">Password</label>
              <div className="relative">
                <input id="password" name="password" type={showPw ? "text" : "password"} required disabled={loading}
                  placeholder="Enter your password"
                  className="w-full px-4 py-3.5 pr-12 rounded-xl text-sm text-white placeholder-slate-600 outline-none transition-all disabled:opacity-50"
                  style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
                  onFocus={e => (e.currentTarget.style.borderColor = "rgba(234,88,12,0.5)")}
                  onBlur={e  => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)")}
                />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-400 transition-colors">
                  {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-start gap-2.5 p-3.5 rounded-xl text-sm text-red-400"
                style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.15)" }}>
                <span className="mt-0.5 flex-shrink-0">⚠</span>{error}
              </div>
            )}

            <button type="submit" disabled={loading}
              className="w-full flex items-center justify-center gap-2.5 py-3.5 rounded-xl text-sm font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                background: "linear-gradient(135deg, #f97316 0%, #ea580c 100%)",
                boxShadow: loading ? "none" : "0 8px 24px rgba(234,88,12,0.35)",
                color: "#fff",
              }}
            >
              {loading ? (
                <><div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />Signing in...</>
              ) : (
                <>Sign in<ArrowRight className="h-4 w-4" /></>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-slate-600">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-orange-400 hover:text-orange-300 font-semibold transition-colors">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}

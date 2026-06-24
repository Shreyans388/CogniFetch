"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { api, ApiError } from "@/lib/api";
import { Flame, Eye, EyeOff, UserPlus } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError]   = useState("");
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw]   = useState(false);
  const [showCf, setShowCf]   = useState(false);
  const [ve, setVe] = useState({ email: "", password: "", confirmPassword: "" });

  const validateEmail = (v: string) => {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) {
      setVe(p => ({ ...p, email: "Please enter a valid email address" })); return false;
    }
    setVe(p => ({ ...p, email: "" })); return true;
  };
  const validatePassword = (v: string) => {
    if (v.length < 8)       { setVe(p => ({ ...p, password: "Minimum 8 characters" })); return false; }
    if (!/[A-Z]/.test(v))   { setVe(p => ({ ...p, password: "Include an uppercase letter" })); return false; }
    if (!/[a-z]/.test(v))   { setVe(p => ({ ...p, password: "Include a lowercase letter" })); return false; }
    if (!/[0-9]/.test(v))   { setVe(p => ({ ...p, password: "Include a number" })); return false; }
    setVe(p => ({ ...p, password: "" })); return true;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); setError(""); setLoading(true);
    const fd = new FormData(e.currentTarget);
    const username = fd.get("username") as string;
    const email    = fd.get("email")    as string;
    const password = fd.get("password") as string;
    const confirm  = fd.get("confirmPassword") as string;
    const emailOk = validateEmail(email);
    const passOk  = validatePassword(password);
    if (password !== confirm) {
      setVe(p => ({ ...p, confirmPassword: "Passwords do not match" }));
      setLoading(false); return;
    }
    if (!emailOk || !passOk) { setLoading(false); return; }
    try {
      await api.post("/api/auth/register", { username, email, password });
      router.push("/login");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Registration failed");
    } finally { setLoading(false); }
  };

  const inputClass = "w-full px-4 py-3.5 rounded-xl text-sm text-white placeholder-slate-600 outline-none transition-all disabled:opacity-50";
  const inputStyle = { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" };
  const onFocus = (e: React.FocusEvent<HTMLInputElement>) => (e.currentTarget.style.borderColor = "rgba(234,88,12,0.5)");
  const onBlur  = (e: React.FocusEvent<HTMLInputElement>) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)");

  return (
    <main className="min-h-screen flex items-center justify-center px-6 py-12 relative" style={{ background: "#070d1a" }}>
      {/* Radial glows */}
      <div className="fixed top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-6 blur-[130px] pointer-events-none"
        style={{ background: "radial-gradient(circle, #f97316 0%, transparent 70%)" }} />

      <div className="w-full max-w-md rounded-3xl p-9 space-y-7 relative z-10"
        style={{
          background: "rgba(10,17,32,0.88)",
          backdropFilter: "blur(32px)",
          border: "1px solid rgba(255,255,255,0.07)",
          boxShadow: "0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(234,88,12,0.06)",
        }}
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center transition-all group-hover:scale-105"
            style={{ background: "linear-gradient(135deg,#f97316,#ea580c)", boxShadow: "0 4px 16px rgba(234,88,12,0.35)" }}>
            <Flame className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold text-white">Cogni<span className="text-orange-400">Fetch</span></span>
        </Link>

        <div>
          <h2 className="text-2xl font-bold text-white">Create an account</h2>
          <p className="mt-1.5 text-sm text-slate-500">Join CogniFetch — it&apos;s free to start</p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Username */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Username</label>
            <input name="username" type="text" required placeholder="Pick a username"
              className={inputClass} style={inputStyle} onFocus={onFocus} onBlur={onBlur} />
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Email</label>
            <input name="email" type="email" required placeholder="you@example.com"
              className={inputClass}
              style={{ ...inputStyle, borderColor: ve.email ? "rgba(239,68,68,0.4)" : undefined }}
              onFocus={onFocus} onBlur={onBlur}
              onChange={e => validateEmail(e.target.value)}
            />
            {ve.email && <p className="text-xs text-red-400">{ve.email}</p>}
          </div>

          {/* Password */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Password</label>
            <div className="relative">
              <input name="password" type={showPw ? "text" : "password"} required placeholder="Create a strong password"
                className={`${inputClass} pr-12`}
                style={{ ...inputStyle, borderColor: ve.password ? "rgba(239,68,68,0.4)" : undefined }}
                onFocus={onFocus} onBlur={onBlur}
                onChange={e => validatePassword(e.target.value)}
              />
              <button type="button" onClick={() => setShowPw(!showPw)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-400 transition-colors">
                {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {ve.password && <p className="text-xs text-red-400">{ve.password}</p>}
          </div>

          {/* Confirm */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Confirm Password</label>
            <div className="relative">
              <input name="confirmPassword" type={showCf ? "text" : "password"} required placeholder="Repeat password"
                className={`${inputClass} pr-12`}
                style={{ ...inputStyle, borderColor: ve.confirmPassword ? "rgba(239,68,68,0.4)" : undefined }}
                onFocus={onFocus} onBlur={onBlur}
              />
              <button type="button" onClick={() => setShowCf(!showCf)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-400 transition-colors">
                {showCf ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {ve.confirmPassword && <p className="text-xs text-red-400">{ve.confirmPassword}</p>}
          </div>

          {error && (
            <div className="flex items-start gap-2 p-3.5 rounded-xl text-sm text-red-400"
              style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.15)" }}>
              ⚠ {error}
            </div>
          )}

          <button type="submit" disabled={loading}
            className="w-full flex items-center justify-center gap-2.5 py-3.5 mt-1 rounded-xl text-sm font-bold text-white transition-all disabled:opacity-50"
            style={{
              background: "linear-gradient(135deg, #f97316 0%, #ea580c 100%)",
              boxShadow: loading ? "none" : "0 8px 24px rgba(234,88,12,0.35)",
            }}
          >
            {loading ? (
              <><div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />Creating...</>
            ) : (
              <><UserPlus className="h-4 w-4" />Create Account</>
            )}
          </button>
        </form>

        <p className="text-center text-sm text-slate-600">
          Already have an account?{" "}
          <Link href="/login" className="text-orange-400 hover:text-orange-300 font-semibold transition-colors">Sign in</Link>
        </p>
      </div>
    </main>
  );
}

"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/dashboard-layout";
import {
  Book, MessageSquare, ArrowRight, Plus,
  Upload, Brain, Sparkles, TrendingUp, Flame,
} from "lucide-react";
import { api, ApiError } from "@/lib/api";

interface Stats { knowledgeBases: number; chats: number; }

export default function DashboardPage() {
  const [stats, setStats]     = useState<Stats>({ knowledgeBases: 0, chats: 0 });
  const [username, setUsername] = useState("there");

  useEffect(() => {
    (async () => {
      try {
        const [kb, ch] = await Promise.all([api.get("/api/knowledge-base"), api.get("/api/chat")]);
        setStats({ knowledgeBases: kb.length, chats: ch.length });
      } catch (e) { if (e instanceof ApiError && e.status === 401) return; }
    })();
    try {
      const token = localStorage.getItem("token");
      if (token) { const p = JSON.parse(atob(token.split(".")[1])); setUsername(p.sub || p.username || "there"); }
    } catch {}
  }, []);

  const actions = [
    { href: "/dashboard/knowledge/new", icon: Brain,    title: "New Knowledge Base", desc: "Create and organise your AI knowledge repository", accentBg: "rgba(234,88,12,0.10)", accentBorder: "rgba(234,88,12,0.22)", iconBg: "rgba(234,88,12,0.15)", iconColor: "text-orange-400" },
    { href: "/dashboard/knowledge",     icon: Upload,   title: "Upload Documents",   desc: "Add PDFs, DOCX, MD or TXT to your bases",          accentBg: "rgba(234,88,12,0.08)", accentBorder: "rgba(234,88,12,0.18)", iconBg: "rgba(234,88,12,0.12)", iconColor: "text-orange-300" },
    { href: "/dashboard/chat/new",      icon: Sparkles, title: "Start Chatting",     desc: "Get cited answers from your knowledge instantly",   accentBg: "rgba(234,88,12,0.06)", accentBorder: "rgba(234,88,12,0.15)", iconBg: "rgba(234,88,12,0.10)", iconColor: "text-orange-300" },
  ];

  const steps = [
    { n: 1, color: "#f97316", title: "Create a Knowledge Base", desc: "Organise information with a name and description.", href: "/dashboard/knowledge/new", link: "Create now" },
    { n: 2, color: "#ea580c", title: "Upload Your Documents",   desc: "PDF, DOCX, MD or TXT — we index them automatically.", href: "/dashboard/knowledge",     link: "Upload" },
    { n: 3, color: "#c2410c", title: "Chat With Your Docs",     desc: "Ask natural questions and get accurate cited answers.", href: "/dashboard/chat/new",      link: "Start chatting" },
  ];

  return (
    <DashboardLayout>
      <div className="p-4 sm:p-6 max-w-6xl mx-auto space-y-7 animate-slide-up">

        {/* ── Hero banner ── */}
        <div className="relative rounded-3xl overflow-hidden p-8 md:p-10"
          style={{
            background: "linear-gradient(135deg, #0e1826 0%, #0a1120 100%)",
            border: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          {/* Orange glow */}
          <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full blur-3xl pointer-events-none opacity-20"
            style={{ background: "radial-gradient(circle, #f97316, transparent 70%)" }} />
          <div className="absolute bottom-0 left-1/3 w-48 h-32 rounded-full blur-3xl pointer-events-none opacity-10"
            style={{ background: "radial-gradient(circle, #f97316, transparent 70%)" }} />

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-xl flex items-center justify-center"
                  style={{ background: "linear-gradient(135deg,#f97316,#ea580c)", boxShadow: "0 4px 14px rgba(234,88,12,0.35)" }}>
                  <Flame className="h-3.5 w-3.5 text-white" />
                </div>
                <span className="text-xs font-semibold text-orange-400 tracking-widest uppercase">CogniFetch</span>
              </div>

              <h1 className="text-3xl md:text-4xl font-extrabold text-white leading-tight">
                Hello,{" "}
                <span className="animate-shimmer-text capitalize">{username}</span>! 👋
              </h1>
              <p className="text-slate-400 max-w-md text-base leading-relaxed">
                Your AI-powered knowledge platform. Upload documents and get instant, cited answers.
              </p>
            </div>

            <a href="/dashboard/knowledge/new"
              className="inline-flex items-center gap-2 rounded-2xl px-6 py-3.5 text-sm font-bold text-white flex-shrink-0 transition-all hover:scale-105 active:scale-95"
              style={{
                background: "linear-gradient(135deg, #f97316 0%, #ea580c 100%)",
                boxShadow: "0 8px 28px rgba(234,88,12,0.4)",
              }}
            >
              <Plus className="h-4 w-4" />
              New Knowledge Base
            </a>
          </div>
        </div>

        {/* ── Stats ── */}
        <div className="grid gap-4 sm:grid-cols-2">
          {[
            { icon: Book,         count: stats.knowledgeBases, label: "Knowledge Bases", href: "/dashboard/knowledge", link: "Browse all" },
            { icon: MessageSquare, count: stats.chats,          label: "Chat Sessions",   href: "/dashboard/chat",      link: "View history" },
          ].map(card => (
            <div key={card.label}
              className="rounded-2xl p-6 flex items-center justify-between transition-all hover:scale-[1.01]"
              style={{ background: "rgba(14,24,38,0.9)", border: "1px solid rgba(255,255,255,0.06)" }}
            >
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center"
                  style={{ background: "rgba(234,88,12,0.12)", border: "1px solid rgba(234,88,12,0.2)" }}>
                  <card.icon className="h-7 w-7 text-orange-400" />
                </div>
                <div>
                  <p className="text-4xl font-extrabold text-white">{card.count}</p>
                  <p className="text-slate-500 text-sm mt-0.5">{card.label}</p>
                </div>
              </div>
              <a href={card.href}
                className="flex items-center gap-1 text-xs font-semibold text-orange-400 hover:text-orange-300 transition-colors">
                {card.link}<ArrowRight className="h-3.5 w-3.5" />
              </a>
            </div>
          ))}
        </div>

        {/* ── Quick Actions ── */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="h-4 w-4 text-orange-400" />
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">Quick Actions</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {actions.map(a => (
              <a key={a.title} href={a.href}
                className="group flex flex-col items-center text-center rounded-2xl p-7 transition-all duration-200 hover:scale-[1.03]"
                style={{ background: a.accentBg, border: `1px solid ${a.accentBorder}` }}
              >
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110"
                  style={{ background: a.iconBg, border: `1px solid ${a.accentBorder}` }}>
                  <a.icon className={`h-6 w-6 ${a.iconColor}`} />
                </div>
                <h3 className="text-sm font-bold text-white mb-2">{a.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{a.desc}</p>
              </a>
            ))}
          </div>
        </div>

        {/* ── How it works ── */}
        <div className="rounded-2xl p-7"
          style={{ background: "rgba(14,24,38,0.9)", border: "1px solid rgba(255,255,255,0.06)" }}>
          <h2 className="text-sm font-bold text-white uppercase tracking-wider mb-5 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-orange-400" />
            How It Works
          </h2>
          <div className="space-y-3">
            {steps.map(s => (
              <div key={s.n} className="flex items-start gap-5 p-5 rounded-xl transition-colors hover:bg-white/[0.02]"
                style={{ background: "rgba(7,13,26,0.6)" }}>
                <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-extrabold flex-shrink-0"
                  style={{ background: `linear-gradient(135deg, ${s.color}, #c2410c)`, boxShadow: `0 4px 14px ${s.color}55` }}>
                  {s.n}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-white text-sm">{s.title}</h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">{s.desc}</p>
                  <a href={s.href}
                    className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-orange-400 hover:text-orange-300 transition-colors">
                    {s.link}<ArrowRight className="h-3 w-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

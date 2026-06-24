"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { Book, MessageSquare, LogOut, Menu, User, Flame, X, Key } from "lucide-react";
import Breadcrumb from "@/components/ui/breadcrumb";

const NAV = [
  { name: "Knowledge Base", href: "/dashboard/knowledge", icon: Book },
  { name: "Chat",           href: "/dashboard/chat",      icon: MessageSquare },
  { name: "API Keys",       href: "/dashboard/api-keys",  icon: Key },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router   = useRouter();
  const pathname = usePathname();
  const [open, setOpen]       = useState(false);
  const [username, setUsername] = useState("User");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { router.push("/login"); return; }
    try {
      const p = JSON.parse(atob(token.split(".")[1]));
      setUsername(p.sub || p.username || "User");
    } catch {}
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  return (
    <div className="min-h-screen" style={{ background: "#070d1a" }}>
      {/* Mobile overlay */}
      {open && (
        <div
          className="lg:hidden fixed inset-0 z-30 bg-black/70 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Mobile burger */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setOpen(!open)}
          className="w-10 h-10 rounded-xl flex items-center justify-center transition-all"
          style={{
            background: "rgba(234,88,12,0.15)",
            border: "1px solid rgba(234,88,12,0.35)",
          }}
        >
          {open ? <X className="h-5 w-5 text-orange-400" /> : <Menu className="h-5 w-5 text-orange-400" />}
        </button>
      </div>

      {/* ── Sidebar ── */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 flex flex-col transform transition-transform duration-300 lg:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"}`}
        style={{
          background: "linear-gradient(180deg, #0a1020 0%, #080e1c 60%, #070d1a 100%)",
          borderRight: "1px solid rgba(255,255,255,0.05)",
        }}
      >
        {/* Logo */}
        <Link href="/dashboard" onClick={() => setOpen(false)}
          className="flex items-center gap-3 h-[68px] px-6 group"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}
        >
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg transition-all group-hover:scale-110"
            style={{
              background: "linear-gradient(135deg, #f97316 0%, #ea580c 100%)",
              boxShadow: "0 4px 16px rgba(234,88,12,0.35)",
            }}
          >
            <Flame className="h-5 w-5 text-white" />
          </div>
          <div>
            <span className="text-[17px] font-bold text-white leading-none">
              Cogni<span className="text-orange-400">Fetch</span>
            </span>
            <p className="text-[10px] text-slate-500 mt-0.5 font-medium tracking-wider uppercase">AI Knowledge</p>
          </div>
        </Link>

        {/* Nav */}
        <nav className="flex-1 px-3 py-5 space-y-0.5 overflow-y-auto">
          <p className="text-[10px] font-semibold tracking-widest text-slate-600 uppercase px-3 mb-3">Navigation</p>
          {NAV.map(({ name, href, icon: Icon }) => {
            const active = pathname.startsWith(href);
            return (
              <Link key={name} href={href} onClick={() => setOpen(false)}
                className="group flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-all duration-150 relative"
                style={active ? {
                  background: "linear-gradient(135deg, rgba(234,88,12,0.18) 0%, rgba(234,88,12,0.08) 100%)",
                  border: "1px solid rgba(234,88,12,0.25)",
                  color: "#fb923c",
                } : {
                  color: "#64748b",
                }}
              >
                {active && <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 rounded-r-full bg-orange-500" />}
                <Icon className={`h-4.5 w-4.5 transition-transform duration-150 group-hover:scale-110 ${active ? "text-orange-400" : "text-slate-600 group-hover:text-slate-400"}`} />
                <span className={active ? "text-orange-300" : "group-hover:text-slate-300 transition-colors"}>{name}</span>
                {active && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-orange-400 shadow-sm" style={{ boxShadow: "0 0 8px rgba(234,88,12,0.8)" }} />}
              </Link>
            );
          })}
        </nav>

        {/* Bottom user */}
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }} className="p-3 space-y-2">
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl" style={{ background: "rgba(255,255,255,0.03)" }}>
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
              style={{ background: "linear-gradient(135deg, #f97316, #ea580c)", boxShadow: "0 2px 8px rgba(234,88,12,0.3)" }}
            >
              {username.charAt(0).toUpperCase()}
            </div>
            <span className="text-sm text-slate-300 font-medium truncate">{username}</span>
          </div>
          <button onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-red-500 hover:bg-red-500/8 hover:text-red-400 transition-all"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="lg:pl-64">
        <main className="min-h-screen py-6 px-4 sm:px-6 lg:px-8">
          <Breadcrumb />
          {children}
        </main>
      </div>
    </div>
  );
}

export const dashboardConfig = {
  mainNav: [],
  sidebarNav: [
    { title: "Knowledge Base", href: "/dashboard/knowledge", icon: "database" },
    { title: "Chat",           href: "/dashboard/chat",      icon: "messageSquare" },
    { title: "API Keys",       href: "/dashboard/api-keys",  icon: "key" },
  ],
};

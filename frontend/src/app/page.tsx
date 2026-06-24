import Link from "next/link";
import { Flame, ArrowRight, Book, Shield, Zap, Sparkles } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen text-slate-300 relative overflow-hidden" style={{ background: "#070d1a" }}>
      {/* Background radial glow */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-orange-600/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-600/10 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 py-16 sm:py-24 relative z-10">
        
        {/* Navigation / Header */}
        <header className="flex justify-between items-center mb-16 pb-6 border-b border-white/5">
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center shadow-lg"
              style={{
                background: "linear-gradient(135deg, #f97316 0%, #ea580c 100%)",
                boxShadow: "0 4px 12px rgba(234,88,12,0.3)",
              }}
            >
              <Flame className="h-4 w-4 text-white" />
            </div>
            <span className="text-lg font-bold text-white tracking-tight">
              Cogni<span className="text-orange-500">Fetch</span>
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="text-sm font-medium hover:text-orange-400 transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="px-4 py-2 text-xs font-semibold text-white rounded-lg shadow-lg hover:scale-105 transition-transform"
              style={{
                background: "linear-gradient(135deg, #f97316 0%, #ea580c 100%)",
                boxShadow: "0 4px 12px rgba(234,88,12,0.3)",
              }}
            >
              Get Started
            </Link>
          </div>
        </header>

        {/* Hero Section */}
        <div className="text-center space-y-8 mb-24 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-orange-500/30 bg-orange-500/10 text-orange-400 text-xs font-medium mb-4 animate-pulse">
            <Sparkles className="h-3 w-3" />
            Advanced RAG Knowledge Assistant
          </div>

          <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight text-white leading-tight">
            Cogni<span className="text-orange-500">Fetch</span>
          </h1>
          <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto font-light leading-relaxed">
            Experience the next generation of AI knowledge management.
            Upload your documents, build intelligent knowledge bases, and get instant answers in natural conversations.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-12">
            <Link
              href="/register"
              className="group flex items-center justify-center gap-2 px-8 py-4 text-white rounded-full text-base font-semibold transition-all duration-300 hover:opacity-90 shadow-lg w-full sm:w-auto"
              style={{
                background: "linear-gradient(135deg, #f97316 0%, #ea580c 100%)",
                boxShadow: "0 6px 20px rgba(234,88,12,0.4)",
              }}
            >
              Get Started for Free
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/login"
              className="flex items-center justify-center px-8 py-4 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-full text-base font-semibold transition-all duration-300 w-full sm:w-auto"
            >
              Sign In
            </Link>
            <a
              href="https://github.com/Shreyans388/CogniFetch"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-8 py-4 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-full text-base font-semibold transition-all duration-300 w-full sm:w-auto"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              GitHub
            </a>
          </div>
          
          <div className="mt-12 flex justify-center items-center gap-4 flex-wrap">
            <a
              href="https://github.com/Shreyans388/CogniFetch"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-80 transition-opacity"
            >
              <img
                alt="GitHub stars"
                src="https://img.shields.io/github/stars/Shreyans388/CogniFetch?style=social"
                className="h-6"
              />
            </a>
            <img
              alt="License"
              src="https://img.shields.io/github/license/Shreyans388/CogniFetch"
              className="h-6"
            />
            <img
              alt="Python version"
              src="https://img.shields.io/badge/python-3.9+-orange.svg?style=flat&logo=python&logoColor=white"
              className="h-6"
            />
            <img
              alt="Node version"
              src="https://img.shields.io/badge/node-%3E%3D18-orange.svg?style=flat&logo=node.js&logoColor=white"
              className="h-6"
            />
          </div>
        </div>

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
          <div className="p-8 rounded-2xl border border-white/5 hover:border-orange-500/20 transition-colors duration-300 relative group overflow-hidden" style={{ background: "rgba(255,255,255,0.02)" }}>
            <div className="absolute top-0 right-0 w-24 h-24 bg-orange-600/5 rounded-full blur-2xl group-hover:bg-orange-600/10 transition-colors" />
            <div className="h-12 w-12 rounded-xl flex items-center justify-center mb-6" style={{ background: "rgba(249,115,22,0.1)", border: "1px solid rgba(249,115,22,0.2)" }}>
              <Zap className="h-6 w-6 text-orange-500" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-4">
              Powerful RAG Engine
            </h3>
            <p className="text-slate-400 leading-relaxed text-sm">
              Harness state-of-the-art AI models with our advanced retrieval-augmented generation engine, optimized for accurate, cite-backed answers.
            </p>
          </div>

          <div className="p-8 rounded-2xl border border-white/5 hover:border-orange-500/20 transition-colors duration-300 relative group overflow-hidden" style={{ background: "rgba(255,255,255,0.02)" }}>
            <div className="absolute top-0 right-0 w-24 h-24 bg-orange-600/5 rounded-full blur-2xl group-hover:bg-orange-600/10 transition-colors" />
            <div className="h-12 w-12 rounded-xl flex items-center justify-center mb-6" style={{ background: "rgba(249,115,22,0.1)", border: "1px solid rgba(249,115,22,0.2)" }}>
              <Book className="h-6 w-6 text-orange-500" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-4">
              Seamless Document Ingestion
            </h3>
            <p className="text-slate-400 leading-relaxed text-sm">
              Supporting PDF, DOCX, Markdown, and TXT. Files are chunked, vectorized, and cataloged automatically for instant search readiness.
            </p>
          </div>

          <div className="p-8 rounded-2xl border border-white/5 hover:border-orange-500/20 transition-colors duration-300 relative group overflow-hidden" style={{ background: "rgba(255,255,255,0.02)" }}>
            <div className="absolute top-0 right-0 w-24 h-24 bg-orange-600/5 rounded-full blur-2xl group-hover:bg-orange-600/10 transition-colors" />
            <div className="h-12 w-12 rounded-xl flex items-center justify-center mb-6" style={{ background: "rgba(249,115,22,0.1)", border: "1px solid rgba(249,115,22,0.2)" }}>
              <Shield className="h-6 w-6 text-orange-500" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-4">
              Sleek & Secure Platform
            </h3>
            <p className="text-slate-400 leading-relaxed text-sm">
              Keep full control with localized database storage, customizable API keys, and customizable embedding or LLM providers.
            </p>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center rounded-3xl p-12 sm:p-16 border border-white/5 relative overflow-hidden" style={{ background: "linear-gradient(135deg, #0a1020 0%, #080e1c 100%)" }}>
          <div className="absolute top-[-50%] left-[-20%] w-[60%] h-[120%] bg-orange-500/5 rounded-full blur-[100px] pointer-events-none" />
          
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-6">Ready to search smarter?</h2>
          <p className="text-base sm:text-lg text-slate-400 mb-8 max-w-xl mx-auto font-light">
            Bring your own files, choose your models, and start querying your custom data in seconds.
          </p>
          <Link
            href="/register"
            className="inline-flex px-8 py-4 text-white rounded-full text-base font-semibold transition-all duration-300 hover:opacity-90 shadow-lg"
            style={{
              background: "linear-gradient(135deg, #f97316 0%, #ea580c 100%)",
              boxShadow: "0 6px 20px rgba(234,88,12,0.35)",
            }}
          >
            Try CogniFetch for Free
          </Link>
        </div>
      </div>
    </main>
  );
}

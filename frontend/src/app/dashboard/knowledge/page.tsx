"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FileIcon, defaultStyles } from "react-file-icon";
import { ArrowRight, Plus, Settings, Trash2, Search } from "lucide-react";
import DashboardLayout from "@/components/layout/dashboard-layout";
import { api, ApiError } from "@/lib/api";
import { useToast } from "@/components/ui/use-toast";

interface KnowledgeBase {
  id: number;
  name: string;
  description: string;
  documents: Document[];
  created_at: string;
}
interface Document {
  id: number;
  file_name: string;
  file_path: string;
  file_size: number;
  content_type: string;
  knowledge_base_id: number;
  created_at: string;
  updated_at: string;
  processing_tasks: any[];
}

export default function KnowledgeBasePage() {
  const [knowledgeBases, setKnowledgeBases] = useState<KnowledgeBase[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchKnowledgeBases();
  }, []);

  const fetchKnowledgeBases = async () => {
    try {
      const data = await api.get("/api/knowledge-base");
      setKnowledgeBases(data);
    } catch (error) {
      console.error("Failed to fetch knowledge bases:", error);
      if (error instanceof ApiError) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this knowledge base?"))
      return;
    try {
      await api.delete(`/api/knowledge-base/${id}`);
      setKnowledgeBases((prev) => prev.filter((kb) => kb.id !== id));
      toast({
        title: "Success",
        description: "Knowledge base deleted successfully",
      });
    } catch (error) {
      console.error("Failed to delete knowledge base:", error);
      if (error instanceof ApiError) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      }
    }
  };

  return (
    <DashboardLayout>
      <div className="p-4 sm:p-6 max-w-5xl mx-auto space-y-7 animate-slide-up">
        {/* Header */}
        <div
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 rounded-2xl p-7"
          style={{
            background: "linear-gradient(135deg, rgba(234,88,12,0.08) 0%, rgba(10,17,32,0.95) 100%)",
            border: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <div>
            <h1 className="text-2xl font-bold text-white">Knowledge Bases</h1>
            <p className="text-slate-500 mt-1 text-sm">Manage your knowledge bases and documents</p>
          </div>
          <Link
            href="/dashboard/knowledge/new"
            className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold text-white flex-shrink-0 transition-all hover:scale-105"
            style={{
              background: "linear-gradient(135deg, #f97316 0%, #ea580c 100%)",
              boxShadow: "0 6px 20px rgba(234,88,12,0.35)",
            }}
          >
            <Plus className="h-4 w-4" />
            New Knowledge Base
          </Link>
        </div>

        {/* Grid */}
        <div className="grid gap-5">
          {knowledgeBases.map((kb) => (
            <div
              key={kb.id}
              className="rounded-2xl p-6 space-y-5 transition-all hover:shadow-xl hover:scale-[1.005]"
              style={{
                background: "rgba(10,17,32,0.9)",
                border: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-bold text-white truncate">{kb.name}</h3>
                  <p className="text-sm text-slate-500 mt-1">{kb.description || "No description"}</p>
                  <p className="text-xs text-slate-600 mt-2">
                    <span className="text-orange-400 font-bold">{kb.documents.length}</span> documents • Created {new Date(kb.created_at).toLocaleDateString()}
                  </p>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <Link
                    href={`/dashboard/knowledge/${kb.id}`}
                    className="flex items-center justify-center w-8 h-8 rounded-lg transition-all hover:scale-110"
                    style={{ background: "rgba(234,88,12,0.10)", border: "1px solid rgba(234,88,12,0.2)" }}
                    title="Settings"
                  >
                    <Settings className="h-3.5 w-3.5 text-orange-400" />
                  </Link>
                  <Link
                    href={`/dashboard/test-retrieval/${kb.id}`}
                    className="flex items-center justify-center w-8 h-8 rounded-lg transition-all hover:scale-110"
                    style={{ background: "rgba(234,88,12,0.10)", border: "1px solid rgba(234,88,12,0.2)" }}
                    title="Test Retrieval"
                  >
                    <Search className="h-3.5 w-3.5 text-orange-400" />
                  </Link>
                  <button
                    onClick={() => handleDelete(kb.id)}
                    className="flex items-center justify-center w-8 h-8 rounded-lg transition-all"
                    style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.15)" }}
                    title="Delete"
                  >
                    <Trash2 className="h-3.5 w-3.5 text-red-400" />
                  </button>
                </div>
              </div>

              {kb.documents.length > 0 && (
                <div className="border-t pt-5" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Documents</h4>
                  <div className="flex flex-wrap gap-2 max-h-[400px] overflow-y-auto">
                    {kb.documents.slice(0, 9).map((doc) => (
                      <div
                        key={doc.id}
                        className="flex flex-col items-center gap-2 p-3 rounded-xl cursor-pointer transition-all hover:scale-105 w-[130px] h-[130px] justify-center"
                        style={{ background: "rgba(7,13,26,0.8)", border: "1px solid rgba(255,255,255,0.05)" }}
                      >
                        <div className="w-8 h-8 mb-1">
                          {doc.content_type.toLowerCase().includes("pdf") ? (
                            <FileIcon extension="pdf" {...defaultStyles.pdf} />
                          ) : doc.content_type.toLowerCase().includes("doc") ? (
                            <FileIcon extension="doc" {...defaultStyles.docx} />
                          ) : doc.content_type.toLowerCase().includes("txt") ? (
                            <FileIcon extension="txt" {...defaultStyles.txt} />
                          ) : doc.content_type.toLowerCase().includes("md") ? (
                            <FileIcon extension="md" {...defaultStyles.md} />
                          ) : (
                            <FileIcon extension={doc.file_name.split(".").pop() || ""} color="#1e3a5f" labelColor="#22d3ee" />
                          )}
                        </div>
                        <div className="text-xs font-medium text-slate-400 text-center max-w-[100px]">
                          <div className="line-clamp-2">{doc.file_name}</div>
                        </div>
                        <span className="text-[10px] text-slate-500">
                          {new Date(doc.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    ))}
                    {kb.documents.length > 9 && (
                      <Link
                        href={`/dashboard/knowledge/${kb.id}`}
                        className="flex flex-col items-center p-3 rounded-xl transition-all hover:scale-105 w-[130px] h-[130px] justify-center"
                        style={{ background: "rgba(234,88,12,0.06)", border: "1px solid rgba(234,88,12,0.18)" }}
                      >
                        <div className="w-8 h-8 mb-1 flex items-center justify-center">
                          <ArrowRight className="w-5 h-5 text-cyan-400" />
                        </div>
                        <span className="text-xs font-bold text-orange-400 text-center">View All</span>
                        <span className="text-[10px] text-slate-500 mt-1">{kb.documents.length} total</span>
                      </Link>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}

          {!loading && knowledgeBases.length === 0 && (
            <div
              className="text-center py-16 rounded-2xl"
              style={{ background: "rgba(10,17,32,0.7)", border: "1px dashed rgba(255,255,255,0.06)" }}
            >
              <div className="w-12 h-12 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center mx-auto mb-4">
                <Plus className="h-6 w-6 text-orange-400" />
              </div>
              <p className="text-slate-400 font-semibold">No knowledge bases yet</p>
              <p className="text-slate-600 text-sm mt-1">Create one to get started with CogniFetch</p>
              <Link
                href="/dashboard/knowledge/new"
                className="inline-flex items-center gap-2 mt-5 rounded-xl px-5 py-2.5 text-sm font-bold text-white"
                style={{ background: "linear-gradient(135deg, #f97316 0%, #ea580c 100%)", boxShadow: "0 6px 20px rgba(234,88,12,0.3)" }}
              >
                <Plus className="h-4 w-4" />
                Create Knowledge Base
              </Link>
            </div>
          )}

          {loading && (
            <div className="flex items-center justify-center py-16">
              <div className="text-center space-y-4">
                <div className="w-10 h-10 rounded-full border-2 border-orange-500/30 border-t-orange-500 animate-spin mx-auto" />
                <p className="text-slate-500 text-sm animate-pulse">Loading knowledge bases...</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

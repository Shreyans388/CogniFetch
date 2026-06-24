"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useChat } from "ai/react";
import { Send, User, Bot } from "lucide-react";
import DashboardLayout from "@/components/layout/dashboard-layout";
import { api, ApiError } from "@/lib/api";
import { useToast } from "@/components/ui/use-toast";
import { Answer } from "@/components/chat/answer";

interface Message {
  id: string;
  role: "assistant" | "user" | "system" | "data";
  content: string;
  citations?: Citation[];
}

interface ChatMessage {
  id: number;
  content: string;
  role: "assistant" | "user";
  created_at: string;
}

interface Chat {
  id: number;
  title: string;
  messages: ChatMessage[];
}

interface Citation {
  id: number;
  text: string;
  metadata: Record<string, any>;
}

// Extend the default useChat message type
declare module "ai/react" {
  interface Message {
    citations?: Citation[];
  }
}

export default function ChatPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const {
    messages,
    data,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    setMessages,
  } = useChat({
    api: `/api/chat/${params.id}/messages`,
    headers: {
      Authorization: `Bearer ${
        typeof window !== "undefined"
          ? window.localStorage.getItem("token")
          : ""
      }`,
    },
  });

  useEffect(() => {
    if (isInitialLoad) { fetchChat(); setIsInitialLoad(false); }
  }, [isInitialLoad]);

  useEffect(() => {
    if (!isInitialLoad) scrollToBottom();
  }, [messages, isInitialLoad]);

  const fetchChat = async () => {
    try {
      const data: Chat = await api.get(`/api/chat/${params.id}`);
      const formattedMessages = data.messages.map((msg) => {
        if (msg.role !== "assistant" || !msg.content)
          return { id: msg.id.toString(), role: msg.role, content: msg.content };

        try {
          if (!msg.content.includes("__LLM_RESPONSE__"))
            return { id: msg.id.toString(), role: msg.role, content: msg.content };

          const [base64Part, responseText] = msg.content.split("__LLM_RESPONSE__");
          const contextData = base64Part
            ? (JSON.parse(atob(base64Part.trim())) as { context: Array<{ page_content: string; metadata: Record<string, any> }> })
            : null;
          const citations: Citation[] =
            contextData?.context.map((c, i) => ({ id: i + 1, text: c.page_content, metadata: c.metadata })) || [];

          return { id: msg.id.toString(), role: msg.role, content: responseText || "", citations };
        } catch (e) {
          console.error("Failed to process message:", e);
          return { id: msg.id.toString(), role: msg.role, content: msg.content };
        }
      });
      setMessages(formattedMessages);
    } catch (error) {
      console.error("Failed to fetch chat:", error);
      if (error instanceof ApiError) {
        toast({ title: "Error", description: error.message, variant: "destructive" });
      }
      router.push("/dashboard/chat");
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const markdownParse = (text: string) =>
    text
      .replace(/\[\[([cC])itation/g, "[citation")
      .replace(/[cC]itation:(\d+)]]/g, "citation:$1]")
      .replace(/\[\[([cC]itation:\d+)]](?!])/g, `[$1]`)
      .replace(/\[[cC]itation:(\d+)]/g, "[citation]($1)");

  const processedMessages = useMemo(() => {
    return messages.map((message) => {
      if (message.role !== "assistant" || !message.content) return message;
      try {
        if (!message.content.includes("__LLM_RESPONSE__"))
          return { ...message, content: markdownParse(message.content) };

        const [base64Part, responseText] = message.content.split("__LLM_RESPONSE__");
        const contextData = base64Part
          ? (JSON.parse(atob(base64Part.trim())) as { context: Array<{ page_content: string; metadata: Record<string, any> }> })
          : null;
        const citations: Citation[] =
          contextData?.context.map((c, i) => ({ id: i + 1, text: c.page_content, metadata: c.metadata })) || [];

        return { ...message, content: markdownParse(responseText || ""), citations };
      } catch (e) {
        console.error("Failed to process message:", e);
        return message;
      }
    });
  }, [messages]);

  return (
    <DashboardLayout>
      <div
        className="flex flex-col h-[calc(100vh-6rem)] max-w-4xl mx-auto w-full rounded-3xl overflow-hidden relative"
        style={{
          background: "rgba(10,17,32,0.95)",
          border: "1px solid rgba(255,255,255,0.06)",
          boxShadow: "0 12px 40px rgba(0,0,0,0.5)",
        }}
      >
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5 pb-[100px]">
          {processedMessages.map((message) =>
            message.role === "assistant" ? (
              <div key={message.id} className="flex justify-start items-start space-x-3 group animate-slide-up">
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: "rgba(234,88,12,0.12)", border: "1px solid rgba(234,88,12,0.22)" }}
                >
                  <Bot className="h-4 w-4 text-orange-400" />
                </div>
                <div
                  className="max-w-[85%] rounded-2xl rounded-tl-none px-5 py-4 leading-relaxed"
                  style={{ background: "rgba(14,24,38,0.95)", border: "1px solid rgba(255,255,255,0.06)", color: "#e2e8f0" }}
                >
                  <Answer key={message.id} markdown={message.content} citations={message.citations} />
                </div>
              </div>
            ) : (
              <div key={message.id} className="flex justify-end items-start space-x-3 group animate-slide-up">
                <div
                  className="max-w-[85%] rounded-2xl rounded-tr-none px-5 py-4 font-medium leading-relaxed text-white"
                  style={{
                    background: "linear-gradient(135deg, #f97316 0%, #ea580c 100%)",
                    boxShadow: "0 4px 18px rgba(234,88,12,0.3)",
                  }}
                >
                  {message.content}
                </div>
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: "linear-gradient(135deg, #f97316, #ea580c)", boxShadow: "0 3px 10px rgba(234,88,12,0.35)" }}
                >
                  <User className="h-4 w-4 text-white" />
                </div>
              </div>
            )
          )}

          {/* Typing indicator */}
          <div className="flex justify-start">
            {isLoading && processedMessages[processedMessages.length - 1]?.role !== "assistant" && (
              <div className="flex justify-start items-start space-x-3">
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: "rgba(234,88,12,0.12)", border: "1px solid rgba(234,88,12,0.22)" }}
                >
                  <Bot className="h-4 w-4 text-orange-400" />
                </div>
                <div
                  className="rounded-2xl rounded-tl-none px-6 py-4"
                  style={{ background: "rgba(14,24,38,0.95)", border: "1px solid rgba(255,255,255,0.06)" }}
                >
                  <div className="flex items-center space-x-1.5">
                    <div className="w-2 h-2 rounded-full bg-orange-500 animate-bounce" />
                    <div className="w-2 h-2 rounded-full bg-orange-500 animate-bounce [animation-delay:0.18s]" />
                    <div className="w-2 h-2 rounded-full bg-orange-500 animate-bounce [animation-delay:0.36s]" />
                  </div>
                </div>
              </div>
            )}
          </div>
          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <form
          onSubmit={handleSubmit}
          className="absolute bottom-4 left-4 right-4 p-2 flex items-center gap-2 rounded-2xl backdrop-blur-xl"
          style={{
            background: "rgba(7,13,26,0.92)",
            border: "1px solid rgba(255,255,255,0.07)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
          }}
        >
          <input
            value={input}
            onChange={handleInputChange}
            placeholder="Ask anything about your knowledge base…"
            className="flex-1 min-w-0 h-10 bg-transparent border-0 px-3 text-sm text-slate-100 placeholder-slate-600 outline-none focus:ring-0"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="h-9 w-9 rounded-xl flex items-center justify-center transition-all flex-shrink-0"
            style={{
              background: isLoading || !input.trim()
                ? "rgba(234,88,12,0.12)"
                : "linear-gradient(135deg, #f97316, #ea580c)",
              boxShadow: isLoading || !input.trim() ? "none" : "0 4px 16px rgba(234,88,12,0.4)",
            }}
          >
            <Send className="h-4 w-4 text-white" />
          </button>
        </form>
      </div>
    </DashboardLayout>
  );
}

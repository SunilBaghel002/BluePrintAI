"use client";

import * as React from "react";
import {
  Bot,
  Sparkles,
  X,
  Send,
  FileText,
  FileCode,
  Download,
  ArrowRight,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { useEventListener, useBroadcastEvent } from "@liveblocks/react";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  aiStatusPayloadSchema,
  aiChatMessageSchema,
  type AiStatusPayload,
  type AiChatMessage,
  AI_GENERATING_STATUSES,
} from "@/types/tasks";

interface AiSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const STARTER_CHIPS = [
  "Design an e-commerce backend",
  "Create a chat app architecture",
  "Build a CI/CD pipeline",
];

export function AiSidebar({ isOpen, onClose }: AiSidebarProps) {
  const { user } = useUser();
  const broadcast = useBroadcastEvent();

  const [chatMessages, setChatMessages] = React.useState<AiChatMessage[]>([]);
  const [inputText, setInputText] = React.useState("");
  const [sendError, setSendError] = React.useState<string | null>(null);
  const [latestStatus, setLatestStatus] = React.useState<AiStatusPayload | null>(null);

  // Subscribe to real-time broadcast events on status and chat feeds
  useEventListener(({ event }) => {
    // 1. Validate AI status feed event
    const statusParseResult = aiStatusPayloadSchema.safeParse(event);
    if (statusParseResult.success) {
      setLatestStatus(statusParseResult.data);
      return;
    }

    // 2. Validate AI chat feed event
    const chatParseResult = aiChatMessageSchema.safeParse(event);
    if (chatParseResult.success) {
      const validMsg = chatParseResult.data;
      setChatMessages((prev) => {
        if (prev.some((m) => m.id === validMsg.id)) return prev;
        return [...prev, validMsg].sort((a, b) => a.timestamp - b.timestamp);
      });
    }
  });

  if (!isOpen) return null;

  const isAiGenerating = latestStatus
    ? AI_GENERATING_STATUSES.includes(latestStatus.status)
    : false;

  const handleSendText = (textToSend: string) => {
    const trimmed = textToSend.trim();
    if (!trimmed || isAiGenerating) return;

    const messageId = `msg_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const senderName = user?.fullName || user?.firstName || "Collaborator";

    const newMsg: AiChatMessage = {
      type: "AI_CHAT",
      id: messageId,
      sender: senderName,
      senderId: user?.id,
      role: "user",
      content: trimmed,
      timestamp: Date.now(),
    };

    try {
      setSendError(null);
      // Broadcast to room chat feed
      broadcast(newMsg);

      // Optimistically append locally if not already present
      setChatMessages((prev) => {
        if (prev.some((m) => m.id === newMsg.id)) return prev;
        return [...prev, newMsg].sort((a, b) => a.timestamp - b.timestamp);
      });

      setInputText("");
    } catch (err) {
      console.error("Failed to broadcast chat message:", err);
      setSendError("Failed to send message to room chat.");
    }
  };

  const handleSend = () => {
    handleSendText(inputText);
  };

  const handleSelectChip = (chipText: string) => {
    if (isAiGenerating) return;
    handleSendText(chipText);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      handleSend();
    }
  };

  const displayMessageText = latestStatus?.text || latestStatus?.message;

  return (
    <aside className="absolute right-3 top-3 bottom-3 z-30 w-[340px] rounded-2xl border border-surface-border bg-base/95 backdrop-blur-md p-4 flex flex-col shadow-2xl transition-all overflow-hidden select-none">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-surface-border shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-dim text-accent-text relative">
            <Bot className="h-4 w-4 stroke-[1.5]" />
            {isAiGenerating && (
              <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
              </span>
            )}
          </div>
          <div className="flex flex-col">
            <h3 className="text-xs font-semibold text-primary-text leading-none flex items-center gap-1.5">
              AI Workspace
            </h3>
            <span className="text-[10px] text-muted-text leading-none mt-1">
              Collaborate with Ghost AI
            </span>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon-xs"
          onClick={onClose}
          aria-label="Close AI Sidebar"
          className="h-7 w-7 rounded-lg text-muted-text hover:text-primary-text hover:bg-surface-border transition-colors"
        >
          <X className="h-4 w-4 stroke-[1.5]" />
        </Button>
      </div>

      {/* Shared AI Status Feed Banner */}
      {latestStatus && displayMessageText && (
        <div
          className={`mt-2 px-3 py-2 rounded-xl text-xs flex items-center gap-2 transition-all shrink-0 ${
            isAiGenerating
              ? "bg-purple-950/40 border border-purple-800/50 text-purple-200"
              : latestStatus.status === "error"
              ? "bg-red-950/40 border border-red-800/50 text-red-200"
              : "bg-emerald-950/40 border border-emerald-800/50 text-emerald-200"
          }`}
        >
          {isAiGenerating ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin text-purple-400 shrink-0 stroke-[2]" />
          ) : latestStatus.status === "error" ? (
            <span className="h-2 w-2 rounded-full bg-red-500 shrink-0" />
          ) : (
            <span className="h-2 w-2 rounded-full bg-emerald-400 shrink-0" />
          )}
          <span className="truncate text-[11px] font-medium leading-tight">
            {displayMessageText}
          </span>
        </div>
      )}

      {/* Tabs Layout */}
      <Tabs defaultValue="architect" className="flex-1 flex flex-col mt-3 overflow-hidden">
        <TabsList className="w-full bg-elevated border border-surface-border p-1 rounded-xl grid grid-cols-2 gap-1 h-9 shrink-0">
          <TabsTrigger
            value="architect"
            className="text-xs font-medium rounded-lg text-muted-text data-[state=active]:bg-surface-border data-[state=active]:text-accent-text transition-all flex items-center justify-center gap-1.5"
          >
            <Sparkles className="h-3.5 w-3.5 stroke-[1.5]" />
            AI Architect
          </TabsTrigger>
          <TabsTrigger
            value="specs"
            className="text-xs font-medium rounded-lg text-muted-text data-[state=active]:bg-surface-border data-[state=active]:text-accent-text transition-all flex items-center justify-center gap-1.5"
          >
            <FileText className="h-3.5 w-3.5 stroke-[1.5]" />
            Specs
          </TabsTrigger>
        </TabsList>

        {/* AI Architect Tab Content */}
        <TabsContent value="architect" className="flex-1 flex flex-col mt-3 outline-none overflow-hidden">
          {/* Scrollable Messages / Empty State Area */}
          <div className="flex-1 overflow-y-auto pr-1 space-y-3">
            {chatMessages.length === 0 ? (
              <div className="flex flex-col items-center justify-center text-center p-3 h-full my-auto space-y-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-dim text-accent-text border border-accent/30 shadow-lg">
                  <Bot className="h-5 w-5 stroke-[1.5]" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-primary-text">
                    Design SaaS Architectures
                  </h4>
                  <p className="text-[11px] text-muted-text mt-1 leading-relaxed max-w-[240px]">
                    Describe your application goals to generate microservices, databases, caches, and queues.
                  </p>
                </div>

                {/* Starter Prompt Chips */}
                <div className="flex flex-col gap-2 w-full pt-2">
                  <span className="text-[10px] font-bold text-muted-text tracking-[0.15em] uppercase text-left">
                    STARTER PROMPTS
                  </span>
                  {STARTER_CHIPS.map((chip, idx) => (
                    <button
                      key={idx}
                      type="button"
                      disabled={isAiGenerating}
                      onClick={() => handleSelectChip(chip)}
                      className="w-full text-left text-xs bg-elevated border border-surface-border hover:border-accent/50 text-accent-text hover:text-primary-text rounded-xl px-3 py-2 transition-all flex items-center justify-between group disabled:opacity-50 disabled:pointer-events-none"
                    >
                      <span className="truncate">{chip}</span>
                      <ArrowRight className="h-3 w-3 text-muted-text group-hover:text-accent-text shrink-0 stroke-[1.5]" />
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {chatMessages.map((msg) => {
                  const isSelf = Boolean(
                    user?.id && msg.senderId && msg.senderId === user.id
                  );
                  const formattedTime = new Date(msg.timestamp).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  });

                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isSelf ? "items-end" : "items-start"}`}
                    >
                      <div className="flex items-center gap-1.5 mb-0.5 px-1 text-[10px] text-muted-text">
                        <span className="font-medium text-primary-text/80">{msg.sender}</span>
                        <span>•</span>
                        <span>{formattedTime}</span>
                      </div>
                      <div
                        className={`rounded-2xl p-3 text-xs leading-relaxed max-w-[90%] shadow-sm ${
                          isSelf
                            ? "bg-brand-dim/70 border border-accent/50 text-primary-text rounded-tr-sm"
                            : "bg-elevated border border-surface-border text-primary-text rounded-tl-sm"
                        }`}
                      >
                        {msg.content}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Input Composer Area */}
          <div className="shrink-0 pt-3 border-t border-surface-border space-y-2">
            {sendError && (
              <div className="text-[10px] text-red-400 bg-red-950/30 border border-red-900/40 rounded-lg px-2.5 py-1 text-left flex items-center gap-1.5">
                <AlertCircle className="h-3 w-3 shrink-0" />
                <span>{sendError}</span>
              </div>
            )}

            <div className="relative rounded-xl border border-surface-border bg-elevated p-2.5 focus-within:border-accent/60 transition-colors">
              <Textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isAiGenerating}
                placeholder={
                  isAiGenerating
                    ? "Ghost AI is generating architecture..."
                    : "Describe system architecture or prompt Ghost AI..."
                }
                className="w-full min-h-[72px] max-h-[140px] bg-transparent border-none text-xs text-primary-text placeholder:text-muted-text focus-visible:ring-0 resize-none p-0 disabled:opacity-50"
              />
              <div className="flex items-center justify-between pt-2">
                <span className="text-[10px] text-muted-text">
                  {isAiGenerating
                    ? "Generation active..."
                    : "Enter to send, Shift+Enter newline"}
                </span>
                <Button
                  type="button"
                  size="sm"
                  onClick={handleSend}
                  disabled={isAiGenerating || !inputText.trim()}
                  className="h-7 px-3 bg-accent text-white hover:bg-accent/90 font-medium text-xs rounded-lg transition-colors flex items-center gap-1.5 disabled:opacity-40"
                >
                  {isAiGenerating ? (
                    <Loader2 className="h-3 w-3 animate-spin stroke-[1.5]" />
                  ) : (
                    <Send className="h-3 w-3 stroke-[1.5]" />
                  )}
                  {isAiGenerating ? "Generating..." : "Send"}
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Specs Tab Content */}
        <TabsContent value="specs" className="flex-1 flex flex-col mt-3 space-y-3 outline-none overflow-y-auto pr-1">
          <Button
            type="button"
            size="sm"
            disabled
            title="AI Spec Generation available in Phase 5"
            className="w-full h-9 bg-accent/50 text-white/60 font-semibold text-xs rounded-xl flex items-center justify-center gap-2 shrink-0 cursor-not-allowed shadow-none"
          >
            <Sparkles className="h-4 w-4 stroke-[1.5]" />
            Generate Architecture Spec
          </Button>

          {/* Demo Spec Card */}
          <div className="rounded-xl border border-surface-border bg-elevated p-3.5 space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-surface-border text-accent-text shrink-0">
                  <FileCode className="h-4 w-4 stroke-[1.5]" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-primary-text">
                    Architecture Spec v1.0
                  </h4>
                  <span className="text-[10px] text-muted-text block">
                    Generated Draft
                  </span>
                </div>
              </div>
              <span className="text-[9px] font-mono font-semibold px-2 py-0.5 rounded bg-brand-dim text-accent-text">
                DEMO
              </span>
            </div>

            <p className="text-[11px] text-muted-text leading-relaxed">
              Complete high-level architectural document detailing API gateway routing, auth microservices, database schemas, and message queue event flows.
            </p>

            <div className="pt-1 flex items-center justify-between border-t border-surface-border">
              <span className="text-[10px] text-muted-text">PDF / Markdown</span>
              <Button
                type="button"
                size="sm"
                disabled
                className="h-7 px-2.5 text-[11px] bg-surface-border text-muted-text cursor-not-allowed rounded-lg flex items-center gap-1"
              >
                <Download className="h-3 w-3 stroke-[1.5]" />
                Download
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </aside>
  );
}

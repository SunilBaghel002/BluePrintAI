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
import { useEventListener, useBroadcastEvent, useRoom } from "@liveblocks/react";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { SpecPreviewModal } from "@/components/editor/spec-preview-modal";
import { useRealtimeRun } from "@/hooks/use-realtime-run";
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
  const room = useRoom();
  const broadcast = useBroadcastEvent();

  const [chatMessages, setChatMessages] = React.useState<AiChatMessage[]>([]);
  const [inputText, setInputText] = React.useState("");
  const [sendError, setSendError] = React.useState<string | null>(null);
  const [latestStatus, setLatestStatus] = React.useState<AiStatusPayload | null>(null);
  const [activeRunId, setActiveRunId] = React.useState<string | null>(null);
  const [publicToken, setPublicToken] = React.useState<string | null>(null);

  // Specs tab state
  const [specs, setSpecs] = React.useState<Array<{ id: string; projectId: string; filePath: string; createdAt: string }>>([]);
  const [isSpecsLoading, setIsSpecsLoading] = React.useState(false);
  const [specsError, setSpecsError] = React.useState<string | null>(null);
  const [isGeneratingSpec, setIsGeneratingSpec] = React.useState(false);
  const [selectedSpecId, setSelectedSpecId] = React.useState<string | null>(null);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = React.useState(false);

  const fetchSpecs = React.useCallback(async () => {
    if (!room?.id) return;
    try {
      setIsSpecsLoading(true);
      setSpecsError(null);
      const res = await fetch(`/api/projects/${room.id}/specs`);
      if (!res.ok) throw new Error("Failed to fetch specs");
      const data = await res.json();
      if (data.specs) {
        setSpecs(data.specs);
      }
    } catch (err: unknown) {
      console.error("Specs list fetch error:", err);
      setSpecsError(err instanceof Error ? err.message : "Error loading specs");
    } finally {
      setIsSpecsLoading(false);
    }
  }, [room?.id]);

  React.useEffect(() => {
    fetchSpecs();
  }, [fetchSpecs]);

  // Realtime run tracking via Trigger.dev publicToken & Liveblocks
  const { isCompleted, isLoading: isRunLoading } = useRealtimeRun(activeRunId, {
    accessToken: publicToken,
  });

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

  const isAiGenerating = latestStatus
    ? AI_GENERATING_STATUSES.includes(latestStatus.status)
    : false;

  const isRunActive = isRunLoading || isAiGenerating;

  // Handle run completion and broadcast final AI response message
  const hasHandledCompletionRef = React.useRef(false);
  React.useEffect(() => {
    if (isCompleted && activeRunId && !hasHandledCompletionRef.current) {
      hasHandledCompletionRef.current = true;
      const finalContent =
        latestStatus?.text || latestStatus?.message || "Architecture design complete! I've updated the canvas.";

      const aiResponseMsg: AiChatMessage = {
        type: "AI_CHAT",
        id: `msg_ai_${Date.now()}`,
        sender: "Ghost AI",
        senderId: "ghost-ai",
        role: "assistant",
        content: finalContent,
        timestamp: Date.now(),
      };

      // Broadcast to other clients
      broadcast(aiResponseMsg);

      // Append to local state so sender UI renders the AI response immediately
      setChatMessages((prev) => {
        if (prev.some((m) => m.id === aiResponseMsg.id)) return prev;
        return [...prev, aiResponseMsg].sort((a, b) => a.timestamp - b.timestamp);
      });

      setActiveRunId(null);
      setPublicToken(null);
      fetchSpecs();
    }
  }, [isCompleted, activeRunId, latestStatus, broadcast, fetchSpecs]);

  const handleGenerateSpec = async () => {
    if (!room?.id || isGeneratingSpec || isRunActive) return;
    try {
      setIsGeneratingSpec(true);
      setSendError(null);
      const response = await fetch("/api/ai/spec", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roomId: room.id,
          chatHistory: chatMessages.slice(-20),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to trigger spec generation task.");
      }

      const data = await response.json();
      if (data.runId) {
        setActiveRunId(data.runId);
        if (data.publicToken) {
          setPublicToken(data.publicToken);
        }
      }
    } catch (err: unknown) {
      console.error("Spec generation error:", err);
      setSendError(err instanceof Error ? err.message : "Failed to trigger spec generation.");
    } finally {
      setIsGeneratingSpec(false);
    }
  };

  React.useEffect(() => {
    if (activeRunId) {
      hasHandledCompletionRef.current = false;
    }
  }, [activeRunId]);

  if (!isOpen) return null;

  const handleSendText = async (textToSend: string) => {
    const trimmed = textToSend.trim();
    if (!trimmed || isRunActive) return;

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
      // 1. Broadcast user message to room chat feed
      broadcast(newMsg);

      // Optimistically append locally
      setChatMessages((prev) => {
        if (prev.some((m) => m.id === newMsg.id)) return prev;
        return [...prev, newMsg].sort((a, b) => a.timestamp - b.timestamp);
      });

      setInputText("");

      // 2. Submit prompt to AI design API
      const response = await fetch("/api/ai/design", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: trimmed, roomId: room.id }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to trigger AI design agent.");
      }

      const data = await response.json();
      if (data.runId) {
        setActiveRunId(data.runId);
        if (data.publicToken) {
          setPublicToken(data.publicToken);
        }
      }
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to send prompt to Ghost AI.";
      console.error("AI prompt submission error:", err);
      setSendError(errorMessage);

      // Broadcast error message to room chat & append locally
      const errorMsg: AiChatMessage = {
        type: "AI_CHAT",
        id: `msg_err_${Date.now()}`,
        sender: "Ghost AI",
        senderId: "ghost-ai",
        role: "assistant",
        content: `Error: ${errorMessage}`,
        timestamp: Date.now(),
      };
      broadcast(errorMsg);
      setChatMessages((prev) => {
        if (prev.some((m) => m.id === errorMsg.id)) return prev;
        return [...prev, errorMsg].sort((a, b) => a.timestamp - b.timestamp);
      });
    }
  };

  const handleSend = () => {
    handleSendText(inputText);
  };

  const handleSelectChip = (chipText: string) => {
    if (isRunActive) return;
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
            {isRunActive && (
              <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#62C073]"></span>
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
                      disabled={isRunActive}
                      onClick={() => handleSelectChip(chip)}
                      className="w-full text-left text-xs bg-elevated border border-surface-border hover:border-[#62C073]/50 text-[#62C073] hover:text-white rounded-xl px-3 py-2 transition-all flex items-center justify-between group disabled:opacity-50 disabled:pointer-events-none"
                    >
                      <span className="truncate">{chip}</span>
                      <ArrowRight className="h-3 w-3 text-muted-text group-hover:text-[#62C073] shrink-0 stroke-[1.5]" />
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
                            ? "bg-[#62C073] text-[#0A0A0C] font-medium rounded-tr-sm"
                            : "bg-[#18181B] border border-[#27272A] text-primary-text rounded-tl-sm"
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

          {/* Compact Run Status Strip (Above Input - Visible ONLY during active run) */}
          {isRunActive && displayMessageText && (
            <div className="mt-2 px-3 py-1.5 rounded-xl text-xs flex items-center gap-2 transition-all shrink-0 bg-[#121215] border border-[#62C073]/30 text-[#62C073]">
              <Loader2 className="h-3.5 w-3.5 animate-spin text-[#62C073] shrink-0 stroke-[2]" />
              <span className="truncate text-[11px] font-medium leading-tight">
                {displayMessageText}
              </span>
            </div>
          )}

          {/* Input Composer Area */}
          <div className="shrink-0 pt-3 border-t border-surface-border space-y-2">
            {sendError && (
              <div className="text-[10px] text-red-400 bg-red-950/30 border border-red-900/40 rounded-lg px-2.5 py-1 text-left flex items-center gap-1.5">
                <AlertCircle className="h-3 w-3 shrink-0" />
                <span>{sendError}</span>
              </div>
            )}

            <div className="relative rounded-xl border border-surface-border bg-elevated p-2.5 focus-within:border-[#62C073]/60 transition-colors">
              <Textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isRunActive}
                placeholder={
                  isRunActive
                    ? "Ghost AI is generating architecture..."
                    : "Describe system architecture or prompt Ghost AI..."
                }
                className="w-full min-h-[72px] max-h-[140px] bg-transparent border-none text-xs text-primary-text placeholder:text-muted-text focus-visible:ring-0 resize-none p-0 disabled:opacity-50"
              />
              <div className="flex items-center justify-between pt-2">
                <span className="text-[10px] text-muted-text">
                  {isRunActive
                    ? "Generation active..."
                    : "Enter to send, Shift+Enter newline"}
                </span>
                <Button
                  type="button"
                  size="sm"
                  onClick={handleSend}
                  disabled={isRunActive || !inputText.trim()}
                  className="h-7 px-3 bg-[#62C073] hover:bg-[#52B063] text-[#0A0A0C] font-semibold text-xs rounded-lg transition-colors flex items-center gap-1.5 disabled:opacity-40"
                >
                  {isRunActive ? (
                    <Loader2 className="h-3 w-3 animate-spin stroke-[2] text-[#0A0A0C]" />
                  ) : (
                    <Send className="h-3 w-3 stroke-[2] text-[#0A0A0C]" />
                  )}
                  {isRunActive ? "Running..." : "Send"}
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
            onClick={handleGenerateSpec}
            disabled={isRunActive || isGeneratingSpec}
            title="Generate comprehensive Markdown technical specification"
            className="w-full h-9 bg-accent hover:bg-accent-hover text-white font-semibold text-xs rounded-xl flex items-center justify-center gap-2 shrink-0 transition-colors shadow-md disabled:opacity-50"
          >
            {isGeneratingSpec ? (
              <Loader2 className="h-4 w-4 animate-spin stroke-[2]" />
            ) : (
              <Sparkles className="h-4 w-4 stroke-[1.5]" />
            )}
            {isGeneratingSpec ? "Triggering Spec AI..." : "Generate Architecture Spec"}
          </Button>

          {isSpecsLoading && specs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-muted-text space-y-2">
              <Loader2 className="h-5 w-5 animate-spin text-accent-primary" />
              <span className="text-[11px] font-mono">Loading specs...</span>
            </div>
          ) : specsError ? (
            <div className="text-[11px] text-red-400 bg-red-950/30 border border-red-900/40 rounded-xl p-3 text-center">
              {specsError}
            </div>
          ) : specs.length === 0 ? (
            <div className="rounded-xl border border-surface-border bg-elevated p-4 text-center space-y-2 my-auto">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-surface-border text-muted-text mx-auto">
                <FileCode className="h-4 w-4 stroke-[1.5]" />
              </div>
              <h4 className="text-xs font-semibold text-primary-text">No Specs Generated Yet</h4>
              <p className="text-[11px] text-muted-text leading-relaxed">
                Click above to generate a comprehensive architectural specification document for this project.
              </p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {specs.map((spec, index) => {
                const formattedDate = new Date(spec.createdAt).toLocaleDateString([], {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                });
                const specTitle = `Architecture Spec v${specs.length - index}`;

                return (
                  <div
                    key={spec.id}
                    onClick={() => {
                      setSelectedSpecId(spec.id);
                      setIsPreviewModalOpen(true);
                    }}
                    className="group rounded-xl border border-surface-border bg-elevated hover:border-accent-primary/60 p-3 transition-all cursor-pointer space-y-2 hover:shadow-lg"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-surface-border text-accent-text shrink-0 group-hover:bg-brand-dim transition-colors">
                          <FileText className="h-4 w-4 stroke-[1.5]" />
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-xs font-semibold text-primary-text truncate group-hover:text-accent-text transition-colors">
                            {specTitle}
                          </h4>
                          <span className="text-[10px] text-muted-text block truncate mt-0.5">
                            {formattedDate}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 flex items-center justify-between border-t border-surface-border">
                      <span className="text-[10px] text-muted-text font-mono">
                        spec-{spec.id.substring(0, 8)}.md
                      </span>
                      <Button
                        type="button"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (!room?.id) return;
                          window.open(`/api/projects/${room.id}/specs/${spec.id}/download`, "_blank");
                        }}
                        className="h-7 px-2.5 text-[11px] bg-surface-border hover:bg-accent-primary text-muted-text hover:text-white rounded-lg flex items-center gap-1 transition-colors"
                      >
                        <Download className="h-3 w-3 stroke-[1.5]" />
                        Download
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Spec Preview Modal */}
      <SpecPreviewModal
        isOpen={isPreviewModalOpen}
        onClose={() => setIsPreviewModalOpen(false)}
        projectId={room?.id || ""}
        specId={selectedSpecId}
      />
    </aside>
  );
}

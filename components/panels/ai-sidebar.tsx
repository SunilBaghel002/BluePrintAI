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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

interface AiSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

const STARTER_CHIPS = [
  "Design an e-commerce backend",
  "Create a chat app architecture",
  "Build a CI/CD pipeline",
];

export function AiSidebar({ isOpen, onClose }: AiSidebarProps) {
  const [messages, setMessages] = React.useState<ChatMessage[]>([]);
  const [inputText, setInputText] = React.useState("");

  if (!isOpen) return null;

  const handleSend = () => {
    const trimmed = inputText.trim();
    if (!trimmed) return;

    setMessages((prev) => [
      ...prev,
      { role: "user", content: trimmed },
      {
        role: "assistant",
        content: `Got it! I am preparing an architecture schema for "${trimmed}". AI generation models will connect in Phase 5.`,
      },
    ]);
    setInputText("");
  };

  const handleSelectChip = (chipText: string) => {
    setInputText(chipText);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <aside className="absolute right-3 top-3 bottom-3 z-30 w-[340px] rounded-2xl border border-surface-border bg-base/95 backdrop-blur-md p-4 flex flex-col shadow-2xl transition-all overflow-hidden select-none">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-surface-border shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-dim text-accent-text">
            <Bot className="h-4 w-4 stroke-[1.5]" />
          </div>
          <div className="flex flex-col">
            <h3 className="text-xs font-semibold text-primary-text leading-none">
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
            {messages.length === 0 ? (
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
                      onClick={() => handleSelectChip(chip)}
                      className="w-full text-left text-xs bg-elevated border border-surface-border hover:border-accent/50 text-accent-text hover:text-primary-text rounded-xl px-3 py-2 transition-all flex items-center justify-between group"
                    >
                      <span className="truncate">{chip}</span>
                      <ArrowRight className="h-3 w-3 text-muted-text group-hover:text-accent-text shrink-0 stroke-[1.5]" />
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {messages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex flex-col ${
                      msg.role === "user" ? "items-end" : "items-start"
                    }`}
                  >
                    <div
                      className={`rounded-2xl p-3 text-xs leading-relaxed max-w-[90%] shadow-sm ${
                        msg.role === "user"
                          ? "bg-brand-dim/70 border border-accent/50 text-primary-text rounded-tr-sm"
                          : "bg-elevated border border-surface-border text-primary-text rounded-tl-sm"
                      }`}
                    >
                      {msg.content}
                    </div>
                    <span className="text-[10px] text-muted-text/80 mt-1 px-1">
                      {msg.role === "user" ? "You" : "Ghost AI"}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Input Composer Area */}
          <div className="shrink-0 pt-3 border-t border-surface-border space-y-2">
            <div className="relative rounded-xl border border-surface-border bg-elevated p-2.5 focus-within:border-accent/60 transition-colors">
              <Textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Describe system architecture or prompt Ghost AI..."
                className="w-full min-h-[72px] max-h-[140px] bg-transparent border-none text-xs text-primary-text placeholder:text-muted-text focus-visible:ring-0 resize-none p-0"
              />
              <div className="flex items-center justify-between pt-2">
                <span className="text-[10px] text-muted-text">
                  Enter to send, Shift+Enter newline
                </span>
                <Button
                  type="button"
                  size="sm"
                  onClick={handleSend}
                  disabled={!inputText.trim()}
                  className="h-7 px-3 bg-accent text-white hover:bg-accent/90 font-medium text-xs rounded-lg transition-colors flex items-center gap-1.5 disabled:opacity-40"
                >
                  <Send className="h-3 w-3 stroke-[1.5]" />
                  Send
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

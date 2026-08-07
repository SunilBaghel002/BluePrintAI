"use client";

import * as React from "react";
import {
  Sparkles,
  Users,
  Cpu,
  Database,
  Zap,
  Layers,
  ArrowRight,
  MousePointer2,
  CheckCircle2,
  Server,
  HardDrive,
  Bot,
  Activity,
} from "lucide-react";

export function AuthCanvasPreview() {
  const [activeTab, setActiveTab] = React.useState<"ai" | "realtime" | "flow">(
    "ai"
  );
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [promptText, setPromptText] = React.useState(
    "Design a real-time collaborative system with Redis cache, PostgreSQL, and AI core"
  );

  // Trigger pulse effect on tab change
  const handleTabChange = (tab: "ai" | "realtime" | "flow") => {
    setActiveTab(tab);
    if (tab === "ai") {
      setIsGenerating(true);
      const timer = setTimeout(() => setIsGenerating(false), 2000);
      return () => clearTimeout(timer);
    }
  };

  return (
    <div className="w-full flex flex-col gap-4 max-w-[620px]">
      {/* Top Bar: Mode Selector & Live Collaborator Avatars */}
      <div className="flex items-center justify-between gap-2 bg-[#111115] border border-[#1E1E24] rounded-xl p-2 shadow-lg">
        {/* Mode Tabs */}
        <div className="flex items-center gap-1 bg-[#09090C] border border-[#1A1A20] rounded-lg p-1">
          <button
            type="button"
            onClick={() => handleTabChange("ai")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              activeTab === "ai"
                ? "bg-[#2E1065] text-[#C084FC] border border-[#7C3AED]/40 shadow-[0_0_10px_rgba(124,58,237,0.3)]"
                : "text-[#A0A0A0] hover:text-white hover:bg-[#16161B]"
            }`}
          >
            <Sparkles className="h-3.5 w-3.5 text-[#C084FC] stroke-[1.5]" />
            <span>AI Architect</span>
          </button>

          <button
            type="button"
            onClick={() => handleTabChange("realtime")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              activeTab === "realtime"
                ? "bg-[#1E3A5F] text-[#60A5FA] border border-[#2563EB]/40 shadow-[0_0_10px_rgba(37,99,235,0.3)]"
                : "text-[#A0A0A0] hover:text-white hover:bg-[#16161B]"
            }`}
          >
            <Users className="h-3.5 w-3.5 text-[#60A5FA] stroke-[1.5]" />
            <span>Multiplayer</span>
          </button>

          <button
            type="button"
            onClick={() => handleTabChange("flow")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              activeTab === "flow"
                ? "bg-[#064E3B] text-[#34D399] border border-[#059669]/40 shadow-[0_0_10px_rgba(16,185,129,0.3)]"
                : "text-[#A0A0A0] hover:text-white hover:bg-[#16161B]"
            }`}
          >
            <Activity className="h-3.5 w-3.5 text-[#34D399] stroke-[1.5]" />
            <span>Signal Flow</span>
          </button>
        </div>

        {/* Live Collaborator Presence Badge */}
        <div className="flex items-center gap-2 pr-2">
          <div className="flex -space-x-2 overflow-hidden">
            <div className="inline-block h-6 w-6 rounded-full ring-2 ring-[#111115] bg-[#2563EB] text-[10px] font-bold text-white flex items-center justify-center">
              SA
            </div>
            <div className="inline-block h-6 w-6 rounded-full ring-2 ring-[#111115] bg-[#059669] text-[10px] font-bold text-white flex items-center justify-center">
              AK
            </div>
            <div className="inline-block h-6 w-6 rounded-full ring-2 ring-[#111115] bg-[#7C3AED] text-[10px] font-bold text-white flex items-center justify-center">
              AI
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] font-mono text-[#34D399] bg-[#064E3B]/40 border border-[#059669]/30 rounded-full px-2 py-0.5">
            <span className="h-1.5 w-1.5 rounded-full bg-[#34D399] animate-pulse" />
            <span>3 editing live</span>
          </div>
        </div>
      </div>

      {/* Main Canvas Visual Showcase Box */}
      <div className="relative w-full h-[360px] bg-[#08080A] border border-[#1E1E24] rounded-2xl overflow-hidden shadow-2xl group">
        {/* CSS Canvas Dot Grid Pattern */}
        <div
          className="absolute inset-0 opacity-40 pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(#27272A 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />

        {/* Canvas Header Pill Overlay */}
        <div className="absolute top-3 left-3 z-20 flex items-center gap-2 bg-[#0D0D12]/90 backdrop-blur-md border border-[#27272A] rounded-lg px-3 py-1.5 shadow-md">
          <Layers className="h-3.5 w-3.5 text-[#38BDF8] stroke-[1.5]" />
          <span className="text-xs font-mono font-medium text-[#F0F0F0]">
            SaaS_Core_Architecture.bp
          </span>
          <span className="text-[10px] font-mono text-[#888892]">v2.4</span>
        </div>

        {/* Animated SVG Connecting Edges */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
          <defs>
            <linearGradient id="edge-blue" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#2563EB" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#38BDF8" stopOpacity="0.8" />
            </linearGradient>
            <linearGradient id="edge-purple" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#7C3AED" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#C084FC" stopOpacity="0.8" />
            </linearGradient>

            {/* Glowing signal pulse filter */}
            <filter id="glow-pulse" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Path 1: Client -> API Gateway */}
          <path
            d="M 110 90 Q 180 90 220 140"
            fill="none"
            stroke="url(#edge-blue)"
            strokeWidth="2"
            strokeDasharray="4 4"
          />
          {activeTab === "flow" && (
            <circle r="4" fill="#38BDF8" filter="url(#glow-pulse)">
              <animateMotion
                path="M 110 90 Q 180 90 220 140"
                dur="2s"
                repeatCount="indefinite"
              />
            </circle>
          )}

          {/* Path 2: API Gateway -> Auth Service */}
          <path
            d="M 330 140 L 410 85"
            fill="none"
            stroke="url(#edge-blue)"
            strokeWidth="2"
          />
          {activeTab === "flow" && (
            <circle r="4" fill="#60A5FA" filter="url(#glow-pulse)">
              <animateMotion
                path="M 330 140 L 410 85"
                dur="1.5s"
                repeatCount="indefinite"
              />
            </circle>
          )}

          {/* Path 3: API Gateway -> Postgres DB */}
          <path
            d="M 330 160 L 410 230"
            fill="none"
            stroke="#16A34A"
            strokeWidth="2"
            strokeDasharray="3 3"
          />
          {activeTab === "flow" && (
            <circle r="4" fill="#4ADE80" filter="url(#glow-pulse)">
              <animateMotion
                path="M 330 160 L 410 230"
                dur="1.8s"
                repeatCount="indefinite"
              />
            </circle>
          )}

          {/* Path 4: API Gateway -> Redis Cache */}
          <path
            d="M 270 180 L 270 240"
            fill="none"
            stroke="#0EA5E9"
            strokeWidth="2"
          />

          {/* Path 5: API Gateway -> AI Engine (Purple AI Path) */}
          <path
            d="M 330 150 Q 430 150 450 150"
            fill="none"
            stroke="url(#edge-purple)"
            strokeWidth="2.5"
          />
          <circle r="4" fill="#C084FC" filter="url(#glow-pulse)">
            <animateMotion
              path="M 330 150 Q 430 150 450 150"
              dur="1.2s"
              repeatCount="indefinite"
            />
          </circle>
        </svg>

        {/* Canvas Architecture Nodes */}

        {/* Node 1: Client Web App */}
        <div className="absolute top-[65px] left-[25px] w-[110px] bg-[#111115]/90 border border-[#27272A] border-l-4 border-l-[#F0F0F0] rounded-xl p-2.5 shadow-lg backdrop-blur-md transition-all hover:border-[#38BDF8]">
          <div className="flex items-center gap-1.5">
            <Server className="h-3.5 w-3.5 text-[#F0F0F0]" />
            <span className="text-[11px] font-mono font-semibold text-[#F0F0F0]">
              Client_App
            </span>
          </div>
          <span className="text-[9px] font-mono text-[#888892] block mt-0.5">
            React / Next.js
          </span>
        </div>

        {/* Node 2: API Gateway */}
        <div className="absolute top-[120px] left-[200px] w-[130px] bg-[#111115]/90 border border-[#2563EB]/40 border-l-4 border-l-[#2563EB] rounded-xl p-2.5 shadow-[0_0_20px_rgba(37,99,235,0.15)] backdrop-blur-md transition-all">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Cpu className="h-3.5 w-3.5 text-[#60A5FA]" />
              <span className="text-[11px] font-mono font-semibold text-[#F0F0F0]">
                API_Gateway
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between mt-1">
            <span className="text-[9px] font-mono text-[#888892]">
              port: 443
            </span>
            <span className="text-[9px] font-mono text-[#38BDF8] bg-[#1E3A5F] px-1 rounded">
              REST / WS
            </span>
          </div>
        </div>

        {/* Node 3: Auth Service */}
        <div className="absolute top-[60px] left-[390px] w-[125px] bg-[#111115]/90 border border-[#27272A] border-l-4 border-l-[#2563EB] rounded-xl p-2.5 shadow-lg backdrop-blur-md">
          <div className="flex items-center gap-1.5">
            <Zap className="h-3.5 w-3.5 text-[#60A5FA]" />
            <span className="text-[11px] font-mono font-semibold text-[#F0F0F0]">
              Clerk_Auth
            </span>
          </div>
          <span className="text-[9px] font-mono text-[#888892] block mt-0.5">
            OAuth + JWT
          </span>
        </div>

        {/* Node 4: PostgreSQL Database */}
        <div className="absolute top-[210px] left-[390px] w-[130px] bg-[#111115]/90 border border-[#16A34A]/40 border-l-4 border-l-[#16A34A] rounded-xl p-2.5 shadow-[0_0_15px_rgba(22,163,74,0.15)] backdrop-blur-md">
          <div className="flex items-center gap-1.5">
            <Database className="h-3.5 w-3.5 text-[#4ADE80]" />
            <span className="text-[11px] font-mono font-semibold text-[#F0F0F0]">
              Postgres_DB
            </span>
          </div>
          <span className="text-[9px] font-mono text-[#888892] block mt-0.5">
            Aiven Cluster
          </span>
        </div>

        {/* Node 5: Redis Cache */}
        <div className="absolute top-[230px] left-[205px] w-[120px] bg-[#111115]/90 border border-[#0EA5E9]/40 border-l-4 border-l-[#0EA5E9] rounded-xl p-2.5 shadow-md backdrop-blur-md">
          <div className="flex items-center gap-1.5">
            <HardDrive className="h-3.5 w-3.5 text-[#38BDF8]" />
            <span className="text-[11px] font-mono font-semibold text-[#F0F0F0]">
              Redis_Cache
            </span>
          </div>
          <span className="text-[9px] font-mono text-[#888892] block mt-0.5">
            Sub-ms TTL
          </span>
        </div>

        {/* Node 6: AI Core Engine (Purple Highlight) */}
        <div className="absolute top-[125px] left-[450px] w-[135px] bg-[#1A0C2E]/90 border border-[#7C3AED] border-l-4 border-l-[#7C3AED] rounded-xl p-2.5 shadow-[0_0_25px_rgba(124,58,237,0.3)] backdrop-blur-md animate-pulse">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Bot className="h-3.5 w-3.5 text-[#C084FC]" />
              <span className="text-[11px] font-mono font-semibold text-[#F0F0F0]">
                Ghost_AI
              </span>
            </div>
            <span className="text-[8px] font-mono font-bold text-[#C084FC] bg-[#2E1065] px-1 rounded border border-[#7C3AED]/40">
              AI
            </span>
          </div>
          <span className="text-[9px] font-mono text-[#C084FC] block mt-0.5">
            GPT-4o Agent
          </span>
        </div>

        {/* Live Multiplayer Cursors (Simulated Team Presence) */}

        {/* Cursor 1: Sarah (Lead Architect) */}
        <div
          className={`absolute z-30 transition-all duration-700 pointer-events-none ${
            activeTab === "realtime"
              ? "top-[100px] left-[230px]"
              : "top-[140px] left-[260px]"
          }`}
        >
          <MousePointer2 className="h-4 w-4 text-[#2563EB] fill-[#2563EB]" />
          <div className="ml-3 mt-0.5 bg-[#2563EB] text-white font-mono text-[9px] font-semibold px-1.5 py-0.5 rounded-md shadow-md whitespace-nowrap flex items-center gap-1">
            <span>Sarah (Architect)</span>
          </div>
        </div>

        {/* Cursor 2: Alex (Backend Dev) */}
        <div
          className={`absolute z-30 transition-all duration-700 pointer-events-none ${
            activeTab === "realtime"
              ? "top-[235px] left-[430px]"
              : "top-[200px] left-[410px]"
          }`}
        >
          <MousePointer2 className="h-4 w-4 text-[#059669] fill-[#059669]" />
          <div className="ml-3 mt-0.5 bg-[#059669] text-white font-mono text-[9px] font-semibold px-1.5 py-0.5 rounded-md shadow-md whitespace-nowrap">
            Alex (Backend)
          </div>
        </div>

        {/* Floating AI Prompt Box at the bottom */}
        <div className="absolute bottom-3 left-3 right-3 z-20 bg-[#111116]/95 border border-[#7C3AED]/50 rounded-xl p-3 shadow-[0_0_20px_rgba(124,58,237,0.2)] backdrop-blur-md">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <div className="h-6 w-6 rounded-lg bg-[#2E1065] border border-[#7C3AED]/40 flex items-center justify-center shrink-0">
                <Sparkles className="h-3.5 w-3.5 text-[#C084FC]" />
              </div>
              <p className="text-xs font-mono text-[#F0F0F0] truncate">
                {promptText}
              </p>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              {isGenerating ? (
                <span className="text-[10px] font-mono text-[#C084FC] bg-[#2E1065] px-2 py-1 rounded-md border border-[#7C3AED]/40 animate-pulse flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#C084FC] animate-ping" />
                  Generating...
                </span>
              ) : (
                <span className="text-[10px] font-mono text-[#34D399] bg-[#064E3B]/60 px-2 py-1 rounded-md border border-[#059669]/40 flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3 text-[#34D399]" />
                  Architecture Ready
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

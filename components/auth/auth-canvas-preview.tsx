"use client";

import * as React from "react";
import {
  Sparkles,
  Users,
  Cpu,
  Database,
  Zap,
  Layers,
  MousePointer2,
  CheckCircle2,
  Server,
  HardDrive,
  Bot,
  Activity,
  Network,
  GitBranch,
} from "lucide-react";

export function AuthCanvasPreview() {
  const [activeTab, setActiveTab] = React.useState<"ai" | "realtime" | "flow">(
    "ai"
  );

  return (
    <div className="w-full flex flex-col gap-2.5 max-w-[580px]">
      {/* Top Controls: Mode Tabs & Live Collaborator Avatar Stack */}
      <div className="flex items-center justify-between gap-2 bg-surface border border-default rounded-xl p-1.5 shadow-md">
        {/* Mode Selector Tabs */}
        <div className="flex items-center gap-1 bg-[#09090C] border border-[#1A1A20] rounded-lg p-1">
          <button
            type="button"
            onClick={() => setActiveTab("ai")}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
              activeTab === "ai"
                ? "bg-[#2E1065] text-[#C084FC] border border-[#7C3AED]/50 shadow-[0_0_12px_rgba(124,58,237,0.35)]"
                : "text-text-secondary hover:text-text-primary hover:bg-hover"
            }`}
          >
            <Sparkles className="h-3.5 w-3.5 text-[#C084FC] stroke-[1.5]" />
            <span>AI Architect</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("realtime")}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
              activeTab === "realtime"
                ? "bg-accent-dim text-[#60A5FA] border border-accent-primary/50 shadow-[0_0_12px_rgba(37,99,235,0.35)]"
                : "text-text-secondary hover:text-text-primary hover:bg-hover"
            }`}
          >
            <Users className="h-3.5 w-3.5 text-[#60A5FA] stroke-[1.5]" />
            <span>Multiplayer</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("flow")}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
              activeTab === "flow"
                ? "bg-[#064E3B] text-[#34D399] border border-[#059669]/50 shadow-[0_0_12px_rgba(16,185,129,0.35)]"
                : "text-text-secondary hover:text-text-primary hover:bg-hover"
            }`}
          >
            <Activity className="h-3.5 w-3.5 text-[#34D399] stroke-[1.5]" />
            <span>Signal Flow</span>
          </button>
        </div>

        {/* Centered Collaborator Avatar Stack */}
        <div className="flex items-center gap-1.5 pr-1">
          <div className="flex -space-x-2">
            <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full ring-2 ring-[#111115] bg-[#2563EB] text-[9px] font-bold text-white leading-none text-center shadow-sm">
              SA
            </div>
            <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full ring-2 ring-[#111115] bg-[#059669] text-[9px] font-bold text-white leading-none text-center shadow-sm">
              AK
            </div>
            <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full ring-2 ring-[#111115] bg-[#7C3AED] text-[9px] font-bold text-white leading-none text-center shadow-sm">
              AI
            </div>
          </div>
          <div className="flex items-center gap-1 text-[9px] font-mono text-[#34D399] bg-[#064E3B]/40 border border-[#059669]/30 rounded-full px-1.5 py-0.5">
            <span className="h-1.5 w-1.5 rounded-full bg-[#34D399] animate-pulse" />
            <span>3 live</span>
          </div>
        </div>
      </div>

      {/* Main Compact Canvas Display (Max Width 430px for node layout) */}
      <div className="relative w-full h-[270px] sm:h-[290px] bg-canvas border border-default rounded-2xl overflow-hidden shadow-2xl transition-all duration-300">
        {/* CSS Canvas Dot Grid Pattern */}
        <div
          className="absolute inset-0 opacity-35 pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(#27272A 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />

        {/* Top File Identifier Pill */}
        <div className="absolute top-2 left-2 z-20 flex items-center gap-1.5 bg-sidebar/90 backdrop-blur-md border border-default rounded-lg px-2 py-0.5 shadow-sm">
          <Layers className="h-3 w-3 text-[#38BDF8] stroke-[1.5]" />
          <span className="text-[11px] font-mono font-medium text-text-primary">
            {activeTab === "ai"
              ? "AI_Architecture.bp"
              : activeTab === "realtime"
              ? "Multiplayer_Sync.bp"
              : "Signal_Telemetry.bp"}
          </span>
          <span className="text-[9px] font-mono text-text-muted">v2.4</span>
        </div>

        {/* Dynamic SVG Connections */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
          <defs>
            <linearGradient id="edge-blue" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#2563EB" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#38BDF8" stopOpacity="0.8" />
            </linearGradient>
            <linearGradient id="edge-purple" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#7C3AED" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#C084FC" stopOpacity="0.9" />
            </linearGradient>
            <linearGradient id="edge-green" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#059669" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#34D399" stopOpacity="0.8" />
            </linearGradient>
            <filter id="glow-pulse" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="2.5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {activeTab === "ai" && (
            <>
              <path d="M 95 85 L 155 130" stroke="url(#edge-blue)" strokeWidth="2" strokeDasharray="3 3" fill="none" />
              <path d="M 255 130 L 305 75" stroke="url(#edge-purple)" strokeWidth="2.5" fill="none" />
              <path d="M 255 140 L 305 200" stroke="url(#edge-blue)" strokeWidth="2" fill="none" />
              <path d="M 195 160 L 195 215" stroke="url(#edge-blue)" strokeWidth="2" fill="none" />

              <circle r="4" fill="#C084FC" filter="url(#glow-pulse)">
                <animateMotion path="M 255 130 L 305 75" dur="1.2s" repeatCount="indefinite" />
              </circle>
            </>
          )}

          {activeTab === "realtime" && (
            <>
              <path d="M 95 85 L 155 130" stroke="#2563EB" strokeWidth="2" fill="none" />
              <path d="M 265 120 L 305 65" stroke="#2563EB" strokeWidth="2" fill="none" />
              <path d="M 265 140 L 305 195" stroke="#059669" strokeWidth="2.5" fill="none" />

              <circle r="3.5" fill="#60A5FA" filter="url(#glow-pulse)">
                <animateMotion path="M 95 85 L 155 130" dur="1.5s" repeatCount="indefinite" />
              </circle>
              <circle r="3.5" fill="#34D399" filter="url(#glow-pulse)">
                <animateMotion path="M 265 140 L 305 195" dur="1.2s" repeatCount="indefinite" />
              </circle>
            </>
          )}

          {activeTab === "flow" && (
            <>
              <path d="M 95 135 L 155 135" stroke="url(#edge-green)" strokeWidth="2" fill="none" />
              <path d="M 255 135 L 305 75" stroke="url(#edge-blue)" strokeWidth="2" fill="none" />
              <path d="M 255 135 L 305 190" stroke="url(#edge-green)" strokeWidth="2" fill="none" />
              <path d="M 195 160 L 195 215" stroke="url(#edge-purple)" strokeWidth="2" fill="none" />

              <circle r="4" fill="#34D399" filter="url(#glow-pulse)">
                <animateMotion path="M 95 135 L 155 135" dur="0.8s" repeatCount="indefinite" />
              </circle>
              <circle r="4" fill="#38BDF8" filter="url(#glow-pulse)">
                <animateMotion path="M 255 135 L 305 75" dur="1s" repeatCount="indefinite" />
              </circle>
              <circle r="4" fill="#4ADE80" filter="url(#glow-pulse)">
                <animateMotion path="M 255 135 L 305 190" dur="0.9s" repeatCount="indefinite" />
              </circle>
            </>
          )}
        </svg>

        {/* Compact Architecture Nodes (Max Right Coordinate <= 415px) */}

        {activeTab === "ai" && (
          <>
            {/* Node 1: Client (left 12px, w 100px -> right 112px) */}
            <div className="absolute top-[60px] left-[12px] w-[100px] bg-surface/95 border border-default border-l-4 border-l-[#F0F0F0] rounded-xl p-1.5 shadow-md backdrop-blur-md">
              <div className="flex items-center gap-1">
                <Server className="h-3 w-3 text-text-primary shrink-0" />
                <span className="text-[10px] font-mono font-semibold text-text-primary truncate">
                  User_Client
                </span>
              </div>
              <span className="text-[8px] font-mono text-text-muted block mt-0.5">
                Next.js App
              </span>
            </div>

            {/* Node 2: Gateway (left 140px, w 115px -> right 255px) */}
            <div className="absolute top-[110px] left-[140px] w-[115px] bg-surface/95 border border-accent-primary/40 border-l-4 border-l-[#2563EB] rounded-xl p-1.5 shadow-[0_0_15px_rgba(37,99,235,0.2)] backdrop-blur-md">
              <div className="flex items-center gap-1">
                <Cpu className="h-3 w-3 text-[#60A5FA] shrink-0" />
                <span className="text-[10px] font-mono font-semibold text-text-primary truncate">
                  API_Gateway
                </span>
              </div>
              <span className="text-[8px] font-mono text-[#38BDF8] block mt-0.5">
                REST / WS
              </span>
            </div>

            {/* Node 3: Blueprint AI Core (left 285px, w 130px -> right 415px) */}
            <div className="absolute top-[45px] left-[285px] w-[130px] bg-[#1A0C2E]/95 border border-[#7C3AED] border-l-4 border-l-[#7C3AED] rounded-xl p-1.5 shadow-[0_0_20px_rgba(124,58,237,0.35)] backdrop-blur-md animate-pulse">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 min-w-0">
                  <Bot className="h-3 w-3 text-[#C084FC] shrink-0" />
                  <span className="text-[10px] font-mono font-semibold text-text-primary truncate">
                    Blueprint_AI
                  </span>
                </div>
                <span className="text-[8px] font-mono font-bold text-[#C084FC] bg-[#2E1065] px-1 rounded border border-[#7C3AED]/40 shrink-0">
                  AI
                </span>
              </div>
              <span className="text-[8px] font-mono text-[#C084FC] block mt-0.5">
                GPT-4o Engine
              </span>
            </div>

            {/* Node 4: Postgres DB (left 285px, w 125px -> right 410px) */}
            <div className="absolute top-[180px] left-[285px] w-[125px] bg-surface/95 border border-[#16A34A]/40 border-l-4 border-l-[#16A34A] rounded-xl p-1.5 shadow-md backdrop-blur-md">
              <div className="flex items-center gap-1">
                <Database className="h-3 w-3 text-[#4ADE80] shrink-0" />
                <span className="text-[10px] font-mono font-semibold text-text-primary truncate">
                  Postgres_DB
                </span>
              </div>
              <span className="text-[8px] font-mono text-text-muted block mt-0.5">
                Aiven Postgres
              </span>
            </div>

            {/* Node 5: Redis Cache (left 145px, w 105px -> right 250px) */}
            <div className="absolute top-[195px] left-[145px] w-[105px] bg-surface/95 border border-[#0EA5E9]/40 border-l-4 border-l-[#0EA5E9] rounded-xl p-1.5 shadow-md backdrop-blur-md">
              <div className="flex items-center gap-1">
                <HardDrive className="h-3 w-3 text-[#38BDF8] shrink-0" />
                <span className="text-[10px] font-mono font-semibold text-text-primary truncate">
                  Redis_Cache
                </span>
              </div>
              <span className="text-[8px] font-mono text-text-muted block mt-0.5">
                Sub-ms Cache
              </span>
            </div>

            {/* AI Assistant Cursor */}
            <div className="absolute top-[75px] left-[250px] z-30 pointer-events-none transition-all duration-700">
              <MousePointer2 className="h-3.5 w-3.5 text-[#7C3AED] fill-[#7C3AED]" />
              <div className="ml-2.5 mt-0.5 bg-[#7C3AED] text-white font-mono text-[8px] font-semibold px-1 py-0.5 rounded shadow-md flex items-center gap-1 whitespace-nowrap">
                <span>Blueprint AI</span>
              </div>
            </div>
          </>
        )}

        {activeTab === "realtime" && (
          <>
            {/* Node 1: Client */}
            <div className="absolute top-[60px] left-[12px] w-[100px] bg-surface/95 border border-default border-l-4 border-l-[#F0F0F0] rounded-xl p-1.5 shadow-md">
              <div className="flex items-center gap-1">
                <Server className="h-3 w-3 text-text-primary shrink-0" />
                <span className="text-[10px] font-mono font-semibold text-text-primary truncate">
                  User_Client
                </span>
              </div>
              <span className="text-[8px] font-mono text-text-muted block mt-0.5">
                React Frontend
              </span>
            </div>

            {/* Node 2: Gateway (Selected by Sarah) */}
            <div className="absolute top-[105px] left-[140px] w-[125px] bg-surface/95 border-2 border-[#2563EB] border-l-4 border-l-[#2563EB] rounded-xl p-1.5 shadow-[0_0_15px_rgba(37,99,235,0.3)]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 min-w-0">
                  <Cpu className="h-3 w-3 text-[#60A5FA] shrink-0" />
                  <span className="text-[10px] font-mono font-semibold text-text-primary truncate">
                    API_Gateway
                  </span>
                </div>
                <span className="text-[8px] font-mono font-bold text-white bg-[#2563EB] px-1 rounded shrink-0">
                  SA
                </span>
              </div>
              <span className="text-[8px] font-mono text-[#60A5FA] block mt-0.5">
                Editing routes...
              </span>
            </div>

            {/* Node 3: Auth Service (left 285px, w 120px -> right 405px) */}
            <div className="absolute top-[45px] left-[285px] w-[120px] bg-surface/95 border border-default border-l-4 border-l-[#2563EB] rounded-xl p-1.5 shadow-md">
              <div className="flex items-center gap-1">
                <Zap className="h-3 w-3 text-[#60A5FA] shrink-0" />
                <span className="text-[10px] font-mono font-semibold text-text-primary truncate">
                  Clerk_Auth
                </span>
              </div>
              <span className="text-[8px] font-mono text-text-muted block mt-0.5">
                JWT Auth
              </span>
            </div>

            {/* Node 4: Postgres DB (left 285px, w 130px -> right 415px) */}
            <div className="absolute top-[175px] left-[285px] w-[130px] bg-surface/95 border-2 border-[#059669] border-l-4 border-l-[#16A34A] rounded-xl p-1.5 shadow-[0_0_15px_rgba(5,150,105,0.3)]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 min-w-0">
                  <Database className="h-3 w-3 text-[#4ADE80] shrink-0" />
                  <span className="text-[10px] font-mono font-semibold text-text-primary truncate">
                    Postgres_DB
                  </span>
                </div>
                <span className="text-[8px] font-mono font-bold text-white bg-[#059669] px-1 rounded shrink-0">
                  AK
                </span>
              </div>
              <span className="text-[8px] font-mono text-[#34D399] block mt-0.5">
                Running migration...
              </span>
            </div>

            {/* Cursor 1: Sarah */}
            <div className="absolute top-[90px] left-[170px] z-30 pointer-events-none transition-all duration-700">
              <MousePointer2 className="h-3.5 w-3.5 text-[#2563EB] fill-[#2563EB]" />
              <div className="ml-2.5 mt-0.5 bg-[#2563EB] text-white font-mono text-[8px] font-semibold px-1 py-0.5 rounded shadow-md whitespace-nowrap">
                Sarah (Architect)
              </div>
            </div>

            {/* Cursor 2: Alex */}
            <div className="absolute top-[195px] left-[310px] z-30 pointer-events-none transition-all duration-700">
              <MousePointer2 className="h-3.5 w-3.5 text-[#059669] fill-[#059669]" />
              <div className="ml-2.5 mt-0.5 bg-[#059669] text-white font-mono text-[8px] font-semibold px-1 py-0.5 rounded shadow-md whitespace-nowrap">
                Alex (Backend)
              </div>
            </div>
          </>
        )}

        {activeTab === "flow" && (
          <>
            {/* Node 1: Ingress */}
            <div className="absolute top-[110px] left-[12px] w-[100px] bg-surface/95 border border-default border-l-4 border-l-[#F0F0F0] rounded-xl p-1.5 shadow-md">
              <div className="flex items-center gap-1">
                <Network className="h-3 w-3 text-text-primary shrink-0" />
                <span className="text-[10px] font-mono font-semibold text-text-primary truncate">
                  CDN_Ingress
                </span>
              </div>
              <span className="text-[8px] font-mono text-text-muted block mt-0.5">
                Cloudflare
              </span>
            </div>

            {/* Node 2: Queue */}
            <div className="absolute top-[110px] left-[140px] w-[115px] bg-surface/95 border border-[#059669]/50 border-l-4 border-l-[#059669] rounded-xl p-1.5 shadow-[0_0_12px_rgba(5,150,105,0.2)]">
              <div className="flex items-center gap-1">
                <GitBranch className="h-3 w-3 text-[#34D399] shrink-0" />
                <span className="text-[10px] font-mono font-semibold text-text-primary truncate">
                  Kafka_Queue
                </span>
              </div>
              <span className="text-[8px] font-mono text-[#34D399] block mt-0.5">
                14.2k msgs/s
              </span>
            </div>

            {/* Node 3: Worker (left 285px, w 120px -> right 405px) */}
            <div className="absolute top-[50px] left-[285px] w-[120px] bg-surface/95 border border-accent-primary/50 border-l-4 border-l-[#2563EB] rounded-xl p-1.5 shadow-md">
              <div className="flex items-center gap-1">
                <Cpu className="h-3 w-3 text-[#60A5FA] shrink-0" />
                <span className="text-[10px] font-mono font-semibold text-text-primary truncate">
                  Worker_Node
                </span>
              </div>
              <span className="text-[8px] font-mono text-[#60A5FA] block mt-0.5">
                Async Execution
              </span>
            </div>

            {/* Node 4: Storage Sink (left 285px, w 120px -> right 405px) */}
            <div className="absolute top-[170px] left-[285px] w-[120px] bg-surface/95 border border-[#16A34A]/50 border-l-4 border-l-[#16A34A] rounded-xl p-1.5 shadow-md">
              <div className="flex items-center gap-1">
                <Database className="h-3 w-3 text-[#4ADE80] shrink-0" />
                <span className="text-[10px] font-mono font-semibold text-text-primary truncate">
                  Storage_Sink
                </span>
              </div>
              <span className="text-[8px] font-mono text-[#4ADE80] block mt-0.5">
                Postgres + Blob
              </span>
            </div>
          </>
        )}

        {/* Dynamic Bottom Status Card */}
        <div className="absolute bottom-2 left-2 right-2 z-20 bg-sidebar/95 border border-default rounded-xl p-2 shadow-xl backdrop-blur-md">
          <div className="flex items-center justify-between gap-1.5">
            <div className="flex items-center gap-1.5 flex-1 min-w-0">
              <div
                className={`h-5 w-5 rounded-md border flex items-center justify-center shrink-0 ${
                  activeTab === "ai"
                    ? "bg-[#2E1065] border-[#7C3AED]/40 text-[#C084FC]"
                    : activeTab === "realtime"
                    ? "bg-accent-dim border-accent-primary/40 text-[#60A5FA]"
                    : "bg-[#064E3B] border-[#059669]/40 text-[#34D399]"
                }`}
              >
                {activeTab === "ai" ? (
                  <Sparkles className="h-3 w-3" />
                ) : activeTab === "realtime" ? (
                  <Users className="h-3 w-3" />
                ) : (
                  <Activity className="h-3 w-3" />
                )}
              </div>
              <p className="text-[11px] font-mono text-text-primary truncate">
                {activeTab === "ai"
                  ? '✦ AI Prompt: "Design SaaS architecture with Redis & AI"'
                  : activeTab === "realtime"
                  ? '👥 Collaborative Room: "Sarah & Alex editing live"'
                  : "⚡ Telemetry: 14.2k req/sec | 100% Integrity"}
              </p>
            </div>
            <div className="shrink-0">
              <span
                className={`text-[9px] font-mono px-1.5 py-0.5 rounded border flex items-center gap-1 ${
                  activeTab === "ai"
                    ? "text-[#C084FC] bg-[#2E1065] border-[#7C3AED]/40"
                    : activeTab === "realtime"
                    ? "text-[#60A5FA] bg-accent-dim border-accent-primary/40"
                    : "text-[#34D399] bg-[#064E3B] border-[#059669]/40"
                }`}
              >
                <CheckCircle2 className="h-2.5 w-2.5" />
                {activeTab === "ai"
                  ? "AI Ready"
                  : activeTab === "realtime"
                  ? "Sync Active"
                  : "Flow Live"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

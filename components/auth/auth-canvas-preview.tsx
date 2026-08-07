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
  Share2,
  GitBranch,
} from "lucide-react";

export function AuthCanvasPreview() {
  const [activeTab, setActiveTab] = React.useState<"ai" | "realtime" | "flow">(
    "ai"
  );

  return (
    <div className="w-full flex flex-col gap-3 max-w-[620px]">
      {/* Top Controls: Mode Tabs & Live Collaborator Avatar Stack */}
      <div className="flex items-center justify-between gap-2 bg-[#111115] border border-[#1E1E24] rounded-xl p-1.5 shadow-md">
        {/* Mode Selector Tabs */}
        <div className="flex items-center gap-1 bg-[#09090C] border border-[#1A1A20] rounded-lg p-1">
          <button
            type="button"
            onClick={() => setActiveTab("ai")}
            className={`flex items-center gap-1.5 px-3 py-1.2 rounded-md text-xs font-medium transition-all ${
              activeTab === "ai"
                ? "bg-[#2E1065] text-[#C084FC] border border-[#7C3AED]/50 shadow-[0_0_12px_rgba(124,58,237,0.35)]"
                : "text-[#A0A0A0] hover:text-white hover:bg-[#16161B]"
            }`}
          >
            <Sparkles className="h-3.5 w-3.5 text-[#C084FC] stroke-[1.5]" />
            <span>AI Architect</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("realtime")}
            className={`flex items-center gap-1.5 px-3 py-1.2 rounded-md text-xs font-medium transition-all ${
              activeTab === "realtime"
                ? "bg-[#1E3A5F] text-[#60A5FA] border border-[#2563EB]/50 shadow-[0_0_12px_rgba(37,99,235,0.35)]"
                : "text-[#A0A0A0] hover:text-white hover:bg-[#16161B]"
            }`}
          >
            <Users className="h-3.5 w-3.5 text-[#60A5FA] stroke-[1.5]" />
            <span>Multiplayer</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("flow")}
            className={`flex items-center gap-1.5 px-3 py-1.2 rounded-md text-xs font-medium transition-all ${
              activeTab === "flow"
                ? "bg-[#064E3B] text-[#34D399] border border-[#059669]/50 shadow-[0_0_12px_rgba(16,185,129,0.35)]"
                : "text-[#A0A0A0] hover:text-white hover:bg-[#16161B]"
            }`}
          >
            <Activity className="h-3.5 w-3.5 text-[#34D399] stroke-[1.5]" />
            <span>Signal Flow</span>
          </button>
        </div>

        {/* Perfectly Centered Collaborator Avatar Stack */}
        <div className="flex items-center gap-2 pr-1.5">
          <div className="flex -space-x-2">
            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full ring-2 ring-[#111115] bg-[#2563EB] text-[10px] font-bold text-white leading-none text-center shadow-sm">
              SA
            </div>
            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full ring-2 ring-[#111115] bg-[#059669] text-[10px] font-bold text-white leading-none text-center shadow-sm">
              AK
            </div>
            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full ring-2 ring-[#111115] bg-[#7C3AED] text-[10px] font-bold text-white leading-none text-center shadow-sm">
              AI
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-[10px] font-mono text-[#34D399] bg-[#064E3B]/40 border border-[#059669]/30 rounded-full px-2 py-0.5">
            <span className="h-1.5 w-1.5 rounded-full bg-[#34D399] animate-pulse" />
            <span>3 live</span>
          </div>
        </div>
      </div>

      {/* Main Interactive Canvas Display */}
      <div className="relative w-full h-[280px] sm:h-[300px] bg-[#08080A] border border-[#1E1E24] rounded-2xl overflow-hidden shadow-2xl transition-all duration-300">
        {/* CSS Canvas Dot Grid Pattern */}
        <div
          className="absolute inset-0 opacity-35 pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(#27272A 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />

        {/* Top File Identifier Pill */}
        <div className="absolute top-2.5 left-2.5 z-20 flex items-center gap-2 bg-[#0D0D12]/90 backdrop-blur-md border border-[#27272A] rounded-lg px-2.5 py-1 shadow-sm">
          <Layers className="h-3.5 w-3.5 text-[#38BDF8] stroke-[1.5]" />
          <span className="text-xs font-mono font-medium text-[#F0F0F0]">
            {activeTab === "ai"
              ? "AI_Generated_System.bp"
              : activeTab === "realtime"
              ? "Collaborative_Workspace.bp"
              : "High_Throughput_Telemetry.bp"}
          </span>
          <span className="text-[10px] font-mono text-[#888892]">v2.4</span>
        </div>

        {/* Dynamic SVG Connections & Signal Flows */}
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

          {/* Connected Edges */}
          {activeTab === "ai" && (
            <>
              {/* Client -> Gateway */}
              <path d="M 100 85 L 200 135" stroke="url(#edge-blue)" strokeWidth="2" strokeDasharray="3 3" fill="none" />
              {/* Gateway -> Blueprint AI Core */}
              <path d="M 315 135 L 415 80" stroke="url(#edge-purple)" strokeWidth="2.5" fill="none" />
              {/* Gateway -> Postgres */}
              <path d="M 315 145 L 415 210" stroke="url(#edge-blue)" strokeWidth="2" fill="none" />
              {/* Gateway -> Redis */}
              <path d="M 260 170 L 260 220" stroke="url(#edge-blue)" strokeWidth="2" fill="none" />

              {/* AI Pulse */}
              <circle r="4" fill="#C084FC" filter="url(#glow-pulse)">
                <animateMotion path="M 315 135 L 415 80" dur="1.2s" repeatCount="indefinite" />
              </circle>
            </>
          )}

          {activeTab === "realtime" && (
            <>
              {/* Client -> Gateway */}
              <path d="M 100 85 L 200 135" stroke="#2563EB" strokeWidth="2" fill="none" />
              {/* Gateway -> Auth */}
              <path d="M 315 125 L 400 70" stroke="#2563EB" strokeWidth="2" fill="none" />
              {/* Gateway -> Postgres DB */}
              <path d="M 315 145 L 400 205" stroke="#059669" strokeWidth="2.5" fill="none" />

              {/* Active Selection Edge Animations */}
              <circle r="3.5" fill="#60A5FA" filter="url(#glow-pulse)">
                <animateMotion path="M 100 85 L 200 135" dur="1.5s" repeatCount="indefinite" />
              </circle>
              <circle r="3.5" fill="#34D399" filter="url(#glow-pulse)">
                <animateMotion path="M 315 145 L 400 205" dur="1.2s" repeatCount="indefinite" />
              </circle>
            </>
          )}

          {activeTab === "flow" && (
            <>
              {/* Multi-node Telemetry Flow Grid */}
              <path d="M 90 135 L 180 135" stroke="url(#edge-green)" strokeWidth="2" fill="none" />
              <path d="M 285 135 L 380 75" stroke="url(#edge-blue)" strokeWidth="2" fill="none" />
              <path d="M 285 135 L 380 195" stroke="url(#edge-green)" strokeWidth="2" fill="none" />
              <path d="M 235 165 L 235 220" stroke="url(#edge-purple)" strokeWidth="2" fill="none" />

              {/* Rapid Signal Particles */}
              <circle r="4" fill="#34D399" filter="url(#glow-pulse)">
                <animateMotion path="M 90 135 L 180 135" dur="0.8s" repeatCount="indefinite" />
              </circle>
              <circle r="4" fill="#38BDF8" filter="url(#glow-pulse)">
                <animateMotion path="M 285 135 L 380 75" dur="1s" repeatCount="indefinite" />
              </circle>
              <circle r="4" fill="#4ADE80" filter="url(#glow-pulse)">
                <animateMotion path="M 285 135 L 380 195" dur="0.9s" repeatCount="indefinite" />
              </circle>
              <circle r="4" fill="#C084FC" filter="url(#glow-pulse)">
                <animateMotion path="M 235 165 L 235 220" dur="0.7s" repeatCount="indefinite" />
              </circle>
            </>
          )}
        </svg>

        {/* Canvas Architecture Nodes */}

        {activeTab === "ai" && (
          <>
            {/* Node 1: Client */}
            <div className="absolute top-[60px] left-[20px] w-[110px] bg-[#111115]/95 border border-[#27272A] border-l-4 border-l-[#F0F0F0] rounded-xl p-2 shadow-md backdrop-blur-md">
              <div className="flex items-center gap-1.5">
                <Server className="h-3.5 w-3.5 text-[#F0F0F0]" />
                <span className="text-[11px] font-mono font-semibold text-[#F0F0F0]">
                  User_Client
                </span>
              </div>
              <span className="text-[9px] font-mono text-[#888892] block mt-0.5">
                Next.js App
              </span>
            </div>

            {/* Node 2: Gateway */}
            <div className="absolute top-[110px] left-[185px] w-[130px] bg-[#111115]/95 border border-[#2563EB]/40 border-l-4 border-l-[#2563EB] rounded-xl p-2 shadow-[0_0_15px_rgba(37,99,235,0.2)] backdrop-blur-md">
              <div className="flex items-center gap-1.5">
                <Cpu className="h-3.5 w-3.5 text-[#60A5FA]" />
                <span className="text-[11px] font-mono font-semibold text-[#F0F0F0]">
                  API_Gateway
                </span>
              </div>
              <span className="text-[9px] font-mono text-[#38BDF8] block mt-0.5">
                REST / WebSocket
              </span>
            </div>

            {/* Node 3: Blueprint AI Core (Purple Highlight) */}
            <div className="absolute top-[50px] left-[395px] w-[140px] bg-[#1A0C2E]/95 border border-[#7C3AED] border-l-4 border-l-[#7C3AED] rounded-xl p-2 shadow-[0_0_25px_rgba(124,58,237,0.35)] backdrop-blur-md animate-pulse">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Bot className="h-3.5 w-3.5 text-[#C084FC]" />
                  <span className="text-[11px] font-mono font-semibold text-[#F0F0F0]">
                    Blueprint_AI
                  </span>
                </div>
                <span className="text-[8px] font-mono font-bold text-[#C084FC] bg-[#2E1065] px-1 rounded border border-[#7C3AED]/40">
                  AI
                </span>
              </div>
              <span className="text-[9px] font-mono text-[#C084FC] block mt-0.5">
                GPT-4o Engine
              </span>
            </div>

            {/* Node 4: Postgres DB */}
            <div className="absolute top-[185px] left-[395px] w-[135px] bg-[#111115]/95 border border-[#16A34A]/40 border-l-4 border-l-[#16A34A] rounded-xl p-2 shadow-md backdrop-blur-md">
              <div className="flex items-center gap-1.5">
                <Database className="h-3.5 w-3.5 text-[#4ADE80]" />
                <span className="text-[11px] font-mono font-semibold text-[#F0F0F0]">
                  Postgres_DB
                </span>
              </div>
              <span className="text-[9px] font-mono text-[#888892] block mt-0.5">
                Aiven Postgres
              </span>
            </div>

            {/* Node 5: Redis Cache */}
            <div className="absolute top-[200px] left-[190px] w-[120px] bg-[#111115]/95 border border-[#0EA5E9]/40 border-l-4 border-l-[#0EA5E9] rounded-xl p-2 shadow-md backdrop-blur-md">
              <div className="flex items-center gap-1.5">
                <HardDrive className="h-3.5 w-3.5 text-[#38BDF8]" />
                <span className="text-[11px] font-mono font-semibold text-[#F0F0F0]">
                  Redis_Cache
                </span>
              </div>
              <span className="text-[9px] font-mono text-[#888892] block mt-0.5">
                Sub-ms Cache
              </span>
            </div>

            {/* AI Assistant Cursor */}
            <div className="absolute top-[80px] left-[350px] z-30 transition-all duration-700 pointer-events-none">
              <MousePointer2 className="h-4 w-4 text-[#7C3AED] fill-[#7C3AED]" />
              <div className="ml-3 mt-0.5 bg-[#7C3AED] text-white font-mono text-[9px] font-semibold px-1.5 py-0.5 rounded-md shadow-md flex items-center gap-1">
                <span>Blueprint AI (Assistant)</span>
              </div>
            </div>
          </>
        )}

        {activeTab === "realtime" && (
          <>
            {/* Node 1: Client */}
            <div className="absolute top-[60px] left-[20px] w-[110px] bg-[#111115]/95 border border-[#27272A] border-l-4 border-l-[#F0F0F0] rounded-xl p-2 shadow-md">
              <div className="flex items-center gap-1.5">
                <Server className="h-3.5 w-3.5 text-[#F0F0F0]" />
                <span className="text-[11px] font-mono font-semibold text-[#F0F0F0]">
                  User_Client
                </span>
              </div>
              <span className="text-[9px] font-mono text-[#888892] block mt-0.5">
                React Frontend
              </span>
            </div>

            {/* Node 2: Gateway (Selected by Sarah) */}
            <div className="absolute top-[105px] left-[180px] w-[140px] bg-[#111115]/95 border-2 border-[#2563EB] border-l-4 border-l-[#2563EB] rounded-xl p-2 shadow-[0_0_20px_rgba(37,99,235,0.3)]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Cpu className="h-3.5 w-3.5 text-[#60A5FA]" />
                  <span className="text-[11px] font-mono font-semibold text-[#F0F0F0]">
                    API_Gateway
                  </span>
                </div>
                <span className="text-[8px] font-mono font-bold text-white bg-[#2563EB] px-1 rounded">
                  SA
                </span>
              </div>
              <span className="text-[9px] font-mono text-[#60A5FA] block mt-0.5">
                Editing routes...
              </span>
            </div>

            {/* Node 3: Auth Service */}
            <div className="absolute top-[45px] left-[380px] w-[125px] bg-[#111115]/95 border border-[#27272A] border-l-4 border-l-[#2563EB] rounded-xl p-2 shadow-md">
              <div className="flex items-center gap-1.5">
                <Zap className="h-3.5 w-3.5 text-[#60A5FA]" />
                <span className="text-[11px] font-mono font-semibold text-[#F0F0F0]">
                  Clerk_Auth
                </span>
              </div>
              <span className="text-[9px] font-mono text-[#888892] block mt-0.5">
                JWT Auth
              </span>
            </div>

            {/* Node 4: Postgres DB (Selected by Alex) */}
            <div className="absolute top-[180px] left-[380px] w-[145px] bg-[#111115]/95 border-2 border-[#059669] border-l-4 border-l-[#16A34A] rounded-xl p-2 shadow-[0_0_20px_rgba(5,150,105,0.3)]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Database className="h-3.5 w-3.5 text-[#4ADE80]" />
                  <span className="text-[11px] font-mono font-semibold text-[#F0F0F0]">
                    Postgres_DB
                  </span>
                </div>
                <span className="text-[8px] font-mono font-bold text-white bg-[#059669] px-1 rounded">
                  AK
                </span>
              </div>
              <span className="text-[9px] font-mono text-[#34D399] block mt-0.5">
                Running migration...
              </span>
            </div>

            {/* Cursor 1: Sarah (Lead Architect) */}
            <div className="absolute top-[90px] left-[210px] z-30 transition-all duration-700 pointer-events-none">
              <MousePointer2 className="h-4 w-4 text-[#2563EB] fill-[#2563EB]" />
              <div className="ml-3 mt-0.5 bg-[#2563EB] text-white font-mono text-[9px] font-semibold px-1.5 py-0.5 rounded-md shadow-md whitespace-nowrap">
                Sarah (Architect)
              </div>
            </div>

            {/* Cursor 2: Alex (Backend Dev) */}
            <div className="absolute top-[205px] left-[420px] z-30 transition-all duration-700 pointer-events-none">
              <MousePointer2 className="h-4 w-4 text-[#059669] fill-[#059669]" />
              <div className="ml-3 mt-0.5 bg-[#059669] text-white font-mono text-[9px] font-semibold px-1.5 py-0.5 rounded-md shadow-md whitespace-nowrap">
                Alex (Backend)
              </div>
            </div>
          </>
        )}

        {activeTab === "flow" && (
          <>
            {/* Node 1: Ingress */}
            <div className="absolute top-[110px] left-[15px] w-[105px] bg-[#111115]/95 border border-[#27272A] border-l-4 border-l-[#F0F0F0] rounded-xl p-2 shadow-md">
              <div className="flex items-center gap-1.5">
                <Network className="h-3.5 w-3.5 text-[#F0F0F0]" />
                <span className="text-[11px] font-mono font-semibold text-[#F0F0F0]">
                  CDN_Ingress
                </span>
              </div>
              <span className="text-[9px] font-mono text-[#888892] block mt-0.5">
                Cloudflare
              </span>
            </div>

            {/* Node 2: Gateway Router */}
            <div className="absolute top-[110px] left-[165px] w-[125px] bg-[#111115]/95 border border-[#059669]/50 border-l-4 border-l-[#059669] rounded-xl p-2 shadow-[0_0_15px_rgba(5,150,105,0.2)]">
              <div className="flex items-center gap-1.5">
                <GitBranch className="h-3.5 w-3.5 text-[#34D399]" />
                <span className="text-[11px] font-mono font-semibold text-[#F0F0F0]">
                  Kafka_Queue
                </span>
              </div>
              <span className="text-[9px] font-mono text-[#34D399] block mt-0.5">
                14.2k msgs/s
              </span>
            </div>

            {/* Node 3: Worker Cluster */}
            <div className="absolute top-[50px] left-[360px] w-[130px] bg-[#111115]/95 border border-[#2563EB]/50 border-l-4 border-l-[#2563EB] rounded-xl p-2 shadow-md">
              <div className="flex items-center gap-1.5">
                <Cpu className="h-3.5 w-3.5 text-[#60A5FA]" />
                <span className="text-[11px] font-mono font-semibold text-[#F0F0F0]">
                  Worker_Node
                </span>
              </div>
              <span className="text-[9px] font-mono text-[#60A5FA] block mt-0.5">
                Async Job Execution
              </span>
            </div>

            {/* Node 4: Database Sink */}
            <div className="absolute top-[175px] left-[360px] w-[130px] bg-[#111115]/95 border border-[#16A34A]/50 border-l-4 border-l-[#16A34A] rounded-xl p-2 shadow-md">
              <div className="flex items-center gap-1.5">
                <Database className="h-3.5 w-3.5 text-[#4ADE80]" />
                <span className="text-[11px] font-mono font-semibold text-[#F0F0F0]">
                  Storage_Sink
                </span>
              </div>
              <span className="text-[9px] font-mono text-[#4ADE80] block mt-0.5">
                Postgres + Blob
              </span>
            </div>
          </>
        )}

        {/* Dynamic Bottom Status Card */}
        <div className="absolute bottom-2.5 left-2.5 right-2.5 z-20 bg-[#111116]/95 border border-[#272732] rounded-xl p-2.5 shadow-xl backdrop-blur-md">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <div
                className={`h-6 w-6 rounded-lg border flex items-center justify-center shrink-0 ${
                  activeTab === "ai"
                    ? "bg-[#2E1065] border-[#7C3AED]/40 text-[#C084FC]"
                    : activeTab === "realtime"
                    ? "bg-[#1E3A5F] border-[#2563EB]/40 text-[#60A5FA]"
                    : "bg-[#064E3B] border-[#059669]/40 text-[#34D399]"
                }`}
              >
                {activeTab === "ai" ? (
                  <Sparkles className="h-3.5 w-3.5" />
                ) : activeTab === "realtime" ? (
                  <Users className="h-3.5 w-3.5" />
                ) : (
                  <Activity className="h-3.5 w-3.5" />
                )}
              </div>
              <p className="text-xs font-mono text-[#F0F0F0] truncate">
                {activeTab === "ai"
                  ? '✦ AI Prompt: "Design microservice backend with caching & AI engine"'
                  : activeTab === "realtime"
                  ? '👥 Collaborative Room: "Sarah & Alex editing live"'
                  : "⚡ Telemetry: 14.2k req/sec | 100% Signal Integrity"}
              </p>
            </div>
            <div className="shrink-0">
              <span
                className={`text-[10px] font-mono px-2 py-0.5 rounded-md border flex items-center gap-1 ${
                  activeTab === "ai"
                    ? "text-[#C084FC] bg-[#2E1065] border-[#7C3AED]/40"
                    : activeTab === "realtime"
                    ? "text-[#60A5FA] bg-[#1E3A5F] border-[#2563EB]/40"
                    : "text-[#34D399] bg-[#064E3B] border-[#059669]/40"
                }`}
              >
                <CheckCircle2 className="h-3 w-3" />
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

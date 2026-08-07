import * as React from "react";
import { Cpu, PanelLeft, Loader2 } from "lucide-react";

export default function GlobalLoading() {
  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        backgroundColor: "#0A0A0A",
        color: "#F0F0F0",
        display: "flex",
        flexDirection: "column",
        fontFamily: "var(--font-sans), system-ui, sans-serif",
      }}
    >
      {/* Sleek Dark Topbar Header matching EditorNavbar exactly */}
      <header
        style={{
          height: "48px",
          backgroundColor: "#0E0E10",
          borderBottom: "1px solid #1E1E24",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 16px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {/* Sidebar Icon Placeholder */}
          <div
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "8px",
              backgroundColor: "#141418",
              border: "1px solid #222226",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#888892",
            }}
          >
            <PanelLeft style={{ width: "16px", height: "16px" }} strokeWidth={1.5} />
          </div>

          {/* Blueprint AI Brand Identity */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div
              style={{
                width: "28px",
                height: "28px",
                borderRadius: "6px",
                backgroundColor: "#2563EB",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Cpu style={{ width: "16px", height: "16px", color: "#FFF" }} strokeWidth={1.5} />
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <span style={{ fontSize: "12px", fontWeight: 700, color: "#F0F0F0" }}>Blueprint</span>
              <span
                style={{
                  fontSize: "10px",
                  fontFamily: "var(--font-mono), monospace",
                  color: "#7C3AED",
                  backgroundColor: "#2E1065",
                  border: "1px solid rgba(124, 58, 237, 0.4)",
                  borderRadius: "4px",
                  padding: "1px 5px",
                }}
              >
                AI
              </span>
            </div>
          </div>

          <span style={{ color: "#333338", fontSize: "12px", fontFamily: "monospace" }}>/</span>

          {/* Workspace Title Placeholder */}
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <span style={{ fontSize: "12px", fontWeight: 600, color: "#F0F0F0" }}>
              Loading Workspace...
            </span>
            <span style={{ fontSize: "10px", color: "#666670" }}>Workspace</span>
          </div>
        </div>

        {/* Right Section Loading Indicator */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#888892" }}>
          <Loader2 className="animate-spin" style={{ width: "16px", height: "16px", color: "#2563EB" }} />
        </div>
      </header>

      {/* Main Centered Loading Body */}
      <main
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "48px 24px",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "20px",
            textAlign: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "44px",
              height: "44px",
              borderRadius: "12px",
              backgroundColor: "#141418",
              border: "1px solid #222226",
              boxShadow: "0 0 20px rgba(37, 99, 235, 0.15)",
            }}
          >
            <Loader2
              className="animate-spin"
              style={{ width: "22px", height: "22px", color: "#2563EB" }}
              strokeWidth={2}
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <h2 style={{ fontSize: "15px", fontWeight: 600, color: "#F0F0F0", margin: 0 }}>
              Authenticating & Preparing Workspace
            </h2>
            <p style={{ fontSize: "12px", color: "#888892", margin: 0 }}>
              Verifying session token and synchronizing design canvas...
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

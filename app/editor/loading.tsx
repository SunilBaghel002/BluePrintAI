import * as React from "react";
import { Cpu, Loader2, LayoutGrid } from "lucide-react";

export default function EditorLoading() {
  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        backgroundColor: "#0A0A0A",
        color: "#F0F0F0",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Top Navbar Skeleton */}
      <header
        style={{
          height: "48px",
          backgroundColor: "#0D0D0D",
          borderBottom: "1px solid #1A1A1A",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 16px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
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
          <span style={{ fontSize: "14px", fontWeight: 600, color: "#F0F0F0" }}>Blueprint</span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#A0A0A0" }}>
          <Loader2 className="animate-spin" style={{ width: "16px", height: "16px", color: "#2563EB" }} />
          <span style={{ fontSize: "12px" }}>Loading projects...</span>
        </div>
      </header>

      {/* Main Content Area Skeleton */}
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
            gap: "16px",
            textAlign: "center",
          }}
        >
          <div
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "12px",
              backgroundColor: "#111111",
              border: "1px solid #1A1A1A",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#2563EB",
            }}
          >
            <LayoutGrid style={{ width: "24px", height: "24px" }} strokeWidth={1.5} />
          </div>
          <div>
            <h2 style={{ fontSize: "16px", fontWeight: 600, color: "#F0F0F0", margin: 0 }}>
              Loading Editor Workspace
            </h2>
            <p style={{ fontSize: "12px", color: "#A0A0A0", marginTop: "4px" }}>
              Fetching your projects and real-time collaboration canvas...
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

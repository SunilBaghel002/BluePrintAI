import * as React from "react";
import { Cpu, Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        width: "100%",
        backgroundColor: "#0A0A0A",
        color: "#F0F0F0",
        fontFamily: 'var(--font-sans), system-ui, -apple-system, sans-serif',
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "24px",
        }}
      >
        {/* Blueprint Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "40px",
              height: "40px",
              borderRadius: "10px",
              backgroundColor: "#2563EB",
              boxShadow: "0 0 16px rgba(37, 99, 235, 0.3)",
            }}
          >
            <Cpu style={{ width: "22px", height: "22px", color: "#FFFFFF" }} strokeWidth={1.5} />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span
              style={{
                fontSize: "20px",
                fontWeight: 600,
                color: "#F0F0F0",
                letterSpacing: "-0.02em",
              }}
            >
              Blueprint
            </span>
            <span
              style={{
                fontFamily: "var(--font-mono), monospace",
                fontSize: "11px",
                fontWeight: 500,
                color: "#7C3AED",
                backgroundColor: "#2E1065",
                border: "1px solid rgba(124, 58, 237, 0.4)",
                borderRadius: "4px",
                padding: "2px 6px",
              }}
            >
              AI
            </span>
          </div>
        </div>

        {/* Loading Spinner & Status */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            color: "#A0A0A0",
            fontSize: "13px",
            fontWeight: 400,
          }}
        >
          <Loader2
            className="animate-spin"
            style={{
              width: "18px",
              height: "18px",
              color: "#2563EB",
            }}
            strokeWidth={2}
          />
          <span>Authenticating & preparing workspace...</span>
        </div>
      </div>
    </div>
  );
}

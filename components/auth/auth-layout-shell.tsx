import * as React from "react";
import { Sparkles, Users, FileCode2, Cpu, ArrowRight } from "lucide-react";

interface AuthLayoutShellProps {
  children: React.ReactNode;
}

const features = [
  {
    icon: Sparkles,
    title: "AI Architecture Generation",
    description:
      "Describe your system, AI maps it to nodes and edges on a live canvas.",
    accent: "var(--ai-primary)",
    dimBg: "var(--ai-dim)",
  },
  {
    icon: Users,
    title: "Real-time Collaboration",
    description:
      "Live cursors, presence indicators, and shared node editing across your team.",
    accent: "var(--accent-primary)",
    dimBg: "var(--accent-dim)",
  },
  {
    icon: FileCode2,
    title: "Instant Spec Generation",
    description:
      "Export a complete Markdown technical spec directly from the canvas graph.",
    accent: "var(--state-info)",
    dimBg: "rgba(14, 165, 233, 0.12)",
  },
] as const;

export function AuthLayoutShell({ children }: AuthLayoutShellProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        minHeight: "100vh",
        width: "100%",
      }}
    >
      {/* ── Left Panel ── */}
      <div
        style={{
          width: "50%",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "var(--bg-sidebar)",
          borderRight: "1px solid var(--border-default)",
          padding: "48px 56px",
          flexShrink: 0,
        }}
      >
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "36px",
              height: "36px",
              borderRadius: "8px",
              backgroundColor: "var(--accent-primary)",
            }}
          >
            <Cpu
              style={{ width: "20px", height: "20px", color: "#FFFFFF" }}
              strokeWidth={1.5}
            />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "18px",
                fontWeight: 600,
                color: "var(--text-primary)",
                letterSpacing: "-0.02em",
              }}
            >
              Blueprint
            </span>
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "10px",
                fontWeight: 500,
                color: "var(--ai-primary)",
                backgroundColor: "var(--ai-dim)",
                border: "1px solid rgba(124, 58, 237, 0.3)",
                borderRadius: "4px",
                padding: "2px 6px",
              }}
            >
              AI
            </span>
          </div>
        </div>

        {/* Center: Headline + Features */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "40px",
            maxWidth: "420px",
          }}
        >
          {/* Tagline */}
          <div>
            <h1
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "32px",
                fontWeight: 700,
                lineHeight: 1.15,
                letterSpacing: "-0.03em",
                color: "var(--text-primary)",
                margin: 0,
              }}
            >
              Design systems at the
              <br />
              speed of thought.
            </h1>
            <p
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "14px",
                fontWeight: 400,
                lineHeight: 1.6,
                color: "var(--text-secondary)",
                marginTop: "16px",
                maxWidth: "380px",
              }}
            >
              Describe your architecture in plain English. Blueprint AI maps it
              to a shared canvas your whole team can refine in real time.
            </p>
          </div>

          {/* Feature Cards */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {features.map((feature) => (
              <div
                key={feature.title}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "14px",
                  padding: "14px 16px",
                  backgroundColor: "var(--bg-surface)",
                  border: "1px solid var(--border-default)",
                  borderRadius: "8px",
                  transition: "border-color 0.2s ease",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "36px",
                    height: "36px",
                    borderRadius: "8px",
                    backgroundColor: feature.dimBg,
                    flexShrink: 0,
                  }}
                >
                  <feature.icon
                    style={{
                      width: "18px",
                      height: "18px",
                      color: feature.accent,
                    }}
                    strokeWidth={1.5}
                  />
                </div>
                <div>
                  <h3
                    style={{
                      fontFamily: "var(--font-sans)",
                      fontSize: "13px",
                      fontWeight: 600,
                      color: "var(--text-primary)",
                      margin: 0,
                      lineHeight: 1.3,
                    }}
                  >
                    {feature.title}
                  </h3>
                  <p
                    style={{
                      fontFamily: "var(--font-sans)",
                      fontSize: "12px",
                      fontWeight: 400,
                      color: "var(--text-secondary)",
                      margin: "4px 0 0",
                      lineHeight: 1.5,
                    }}
                  >
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* How it works */}
          <div>
            <p
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "11px",
                fontWeight: 500,
                color: "var(--text-muted)",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                marginBottom: "12px",
              }}
            >
              How it works
            </p>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                flexWrap: "wrap",
              }}
            >
              {["Sign up", "Describe your system", "AI generates canvas", "Collaborate & export"].map(
                (step, i) => (
                  <React.Fragment key={step}>
                    <span
                      style={{
                        fontFamily: "var(--font-sans)",
                        fontSize: "12px",
                        fontWeight: 500,
                        color: "var(--text-secondary)",
                        backgroundColor: "var(--bg-elevated)",
                        border: "1px solid var(--border-default)",
                        borderRadius: "6px",
                        padding: "4px 10px",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {step}
                    </span>
                    {i < 3 && (
                      <ArrowRight
                        style={{
                          width: "12px",
                          height: "12px",
                          color: "var(--text-muted)",
                          flexShrink: 0,
                        }}
                        strokeWidth={1.5}
                      />
                    )}
                  </React.Fragment>
                )
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <p
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "12px",
            fontWeight: 400,
            color: "var(--text-muted)",
            margin: 0,
          }}
        >
          © {new Date().getFullYear()} Blueprint AI. All rights reserved.
        </p>
      </div>

      {/* ── Right Panel ── */}
      <div
        style={{
          width: "50%",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "var(--bg-base)",
          padding: "48px 32px",
        }}
      >
        {children}
      </div>
    </div>
  );
}

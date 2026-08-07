"use client";

import * as React from "react";

interface BlueprintLogoProps {
  size?: "sm" | "md" | "lg";
  showBadge?: boolean;
  className?: string;
  onClick?: () => void;
}

export function BlueprintLogo({
  size = "md",
  showBadge = true,
  className = "",
  onClick,
}: BlueprintLogoProps) {
  // Dimension mappings
  const iconSizes = {
    sm: { container: "h-7 w-7", icon: 28, text: "text-xs", badge: "text-[9px]" },
    md: { container: "h-9 w-9", icon: 36, text: "text-base", badge: "text-[10px]" },
    lg: { container: "h-11 w-11", icon: 44, text: "text-xl", badge: "text-xs" },
  };

  const currentSize = iconSizes[size];

  return (
    <div
      onClick={onClick}
      className={`inline-flex items-center gap-2.5 select-none ${
        onClick ? "cursor-pointer" : ""
      } ${className}`}
    >
      {/* Custom Vector Blueprint Mark */}
      <div
        className={`relative flex items-center justify-center ${currentSize.container} rounded-xl bg-gradient-to-br from-[#1E3A5F] via-[#0E1A2E] to-[#120B24] border border-[#2563EB]/30 shadow-[0_0_15px_rgba(37,99,235,0.2)] shrink-0 overflow-hidden group`}
      >
        {/* Subtle background glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(37,99,235,0.3),transparent_70%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_70%,rgba(124,58,237,0.25),transparent_70%)]" />

        <svg
          width={currentSize.icon - 10}
          height={currentSize.icon - 10}
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="relative z-10 transform group-hover:scale-105 transition-transform duration-300"
        >
          <defs>
            <linearGradient
              id="bp-blue-purple"
              x1="2"
              y1="2"
              x2="30"
              y2="30"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0%" stopColor="#3B82F6" />
              <stop offset="50%" stopColor="#2563EB" />
              <stop offset="100%" stopColor="#7C3AED" />
            </linearGradient>
            <linearGradient
              id="bp-cyan-glow"
              x1="0"
              y1="0"
              x2="32"
              y2="32"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0%" stopColor="#38BDF8" />
              <stop offset="100%" stopColor="#818CF8" />
            </linearGradient>
          </defs>

          {/* Blueprint Node Connection Lines */}
          <path
            d="M8 8 L24 8 L24 24 L8 24 Z"
            stroke="url(#bp-blue-purple)"
            strokeWidth="1.75"
            strokeDasharray="3 3"
            strokeLinecap="round"
            className="opacity-70"
          />

          {/* Diagonal Cross System Edges */}
          <path
            d="M8 8 L24 24 M24 8 L8 24"
            stroke="url(#bp-blue-purple)"
            strokeWidth="1.25"
            strokeLinecap="round"
            className="opacity-40"
          />

          {/* Central AI Intelligence Core */}
          <circle
            cx="16"
            cy="16"
            r="4.5"
            fill="#0F172A"
            stroke="url(#bp-cyan-glow)"
            strokeWidth="1.75"
          />
          <circle cx="16" cy="16" r="2" fill="#7C3AED" />

          {/* Outer Architecture Corner Nodes */}
          <circle cx="8" cy="8" r="2.5" fill="#2563EB" stroke="#60A5FA" strokeWidth="1" />
          <circle cx="24" cy="8" r="2.5" fill="#0EA5E9" stroke="#38BDF8" strokeWidth="1" />
          <circle cx="24" cy="24" r="2.5" fill="#7C3AED" stroke="#C084FC" strokeWidth="1" />
          <circle cx="8" cy="24" r="2.5" fill="#16A34A" stroke="#4ADE80" strokeWidth="1" />
        </svg>
      </div>

      {/* Brand Typography */}
      <div className="flex items-center gap-1.5">
        <span
          className={`font-sans font-bold tracking-tight text-[#F0F0F0] ${currentSize.text}`}
        >
          Blueprint
        </span>
        {showBadge && (
          <span
            className={`font-mono font-semibold text-[#C084FC] bg-[#2E1065]/90 border border-[#7C3AED]/40 rounded-md px-1.5 py-0.5 leading-none shadow-[0_0_8px_rgba(124,58,237,0.25)] ${currentSize.badge}`}
          >
            AI
          </span>
        )}
      </div>
    </div>
  );
}

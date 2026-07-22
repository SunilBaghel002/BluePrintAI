"use client";

import * as React from "react";

interface KeyboardShortcutsOptions {
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  onUndo?: () => void;
  onRedo?: () => void;
}

export function useKeyboardShortcuts({
  onZoomIn,
  onZoomOut,
  onUndo,
  onRedo,
}: KeyboardShortcutsOptions) {
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;

      // Ignore shortcuts when typing in inputs, textareas, or content-editable fields
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable ||
          target.getAttribute("role") === "textbox")
      ) {
        return;
      }

      const isModifier = e.metaKey || e.ctrlKey;
      const isShift = e.shiftKey;

      // Cmd/Ctrl + Shift + Z OR Cmd/Ctrl + Y -> Redo
      if ((isModifier && isShift && e.key.toLowerCase() === "z") || (isModifier && e.key.toLowerCase() === "y")) {
        e.preventDefault();
        onRedo?.();
        return;
      }

      // Cmd/Ctrl + Z -> Undo
      if (isModifier && !isShift && e.key.toLowerCase() === "z") {
        e.preventDefault();
        onUndo?.();
        return;
      }

      // '+' or '=' -> Zoom In
      if (!isModifier && (e.key === "+" || e.key === "=")) {
        e.preventDefault();
        onZoomIn?.();
        return;
      }

      // '-' -> Zoom Out
      if (!isModifier && e.key === "-") {
        e.preventDefault();
        onZoomOut?.();
        return;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onZoomIn, onZoomOut, onUndo, onRedo]);
}

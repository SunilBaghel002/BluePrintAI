"use client";

import * as React from "react";
import { EditorNavbar } from "@/components/editor/editor-navbar";
import { ProjectSidebar } from "@/components/editor/project-sidebar";

export default function EditorPage() {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  return (
    <div className="min-h-screen bg-base text-text-primary flex flex-col">
      <EditorNavbar
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
      />

      <ProjectSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <main className="flex-1 pt-12 flex items-center justify-center bg-canvas">
        <div className="text-center space-y-2">
          <h2 className="font-mono text-sm font-semibold text-text-primary">
            Canvas Editor
          </h2>
          <p className="font-mono text-xs text-text-secondary">
            Project canvas placeholder
          </p>
        </div>
      </main>
    </div>
  );
}

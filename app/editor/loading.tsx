import * as React from "react";
import { LoadingShell } from "@/components/ui/loading-shell";

export default function EditorLoading() {
  return (
    <LoadingShell
      title="Loading Editor Workspace"
      subtitle="Fetching your projects and real-time collaboration canvas..."
    />
  );
}

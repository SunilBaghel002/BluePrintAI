import * as React from "react";
import { LoadingShell } from "@/components/ui/loading-shell";

export default function GlobalLoading() {
  return (
    <LoadingShell
      title="Authenticating & Preparing Workspace"
      subtitle="Verifying session token and synchronizing design canvas..."
    />
  );
}

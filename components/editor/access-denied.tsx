import * as React from "react";
import Link from "next/link";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AccessDenied() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-base p-4 text-text-primary">
      <div className="flex max-w-sm flex-col items-center rounded-xl border border-border bg-surface p-6 text-center shadow-xl">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-elevated text-text-muted">
          <Lock className="h-6 w-6 stroke-[1.5]" />
        </div>

        <h1 className="mt-4 text-lg font-semibold text-text-primary">
          Access Denied
        </h1>

        <p className="mt-2 text-xs text-text-secondary">
          You do not have permission to view this project workspace or it does not exist.
        </p>

        <Button
          asChild
          className="mt-6 w-full bg-accent-primary text-xs font-medium text-white hover:bg-accent-hover"
        >
          <Link href="/editor">Return to Workspaces</Link>
        </Button>
      </div>
    </div>
  );
}

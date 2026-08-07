"use client";

import * as React from "react";
import { Download, FileText, Loader2, AlertCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { specDetailSchema, type SpecDetailParsed } from "@/lib/validations/spec-params";

interface SpecPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  specId: string | null;
  specDate?: string;
}

export function SpecPreviewModal({
  isOpen,
  onClose,
  projectId,
  specId,
  specDate,
}: SpecPreviewModalProps) {
  const [specDetail, setSpecDetail] = React.useState<SpecDetailParsed | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!isOpen || !specId || !projectId) {
      setSpecDetail(null);
      setError(null);
      return;
    }

    let isMounted = true;
    const controller = new AbortController();
    setIsLoading(true);
    setError(null);

    fetch(`/api/projects/${projectId}/specs/${specId}`, {
      signal: controller.signal,
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Failed to load spec content (Status ${res.status})`);
        }
        return res.json();
      })
      .then((data) => {
        if (!isMounted) return;
        if (data.spec) {
          const parseResult = specDetailSchema.safeParse(data.spec);
          if (parseResult.success) {
            setSpecDetail(parseResult.data);
          } else {
            console.error("Spec detail schema validation failed:", parseResult.error);
            setError("Received invalid specification data shape from server");
          }
        } else {
          setError(data.error || "Spec not found");
        }
      })
      .catch((err: unknown) => {
        if (!isMounted) return;
        if (err instanceof Error && err.name === "AbortError") {
          return; // Silently ignore fetch abort
        }
        const errorMessage =
          err instanceof Error ? err.message : "Failed to load specification document";
        setError(errorMessage);
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [isOpen, specId, projectId]);

  const handleDownload = () => {
    if (!specId || !projectId) return;
    const downloadUrl = `/api/projects/${projectId}/specs/${specId}/download`;
    window.open(downloadUrl, "_blank");
  };

  const formattedDate = specDate
    ? specDate
    : specDetail?.createdAt
    ? new Date(specDetail.createdAt).toLocaleString("en-US", {
        timeZone: "UTC",
        dateStyle: "medium",
        timeStyle: "short",
      })
    : "Technical Specification";

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl h-[85vh] bg-[#111111] border-[#1A1A1A] text-[#F0F0F0] p-0 flex flex-col overflow-hidden rounded-xl gap-0 shadow-2xl">
        {/* Header */}
        <DialogHeader className="p-4 border-b border-[#1A1A1A] flex flex-row items-center justify-between space-y-0 shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#1E3A5F] text-[#2563EB] border border-[#2563EB]/30">
              <FileText className="h-5 w-5 stroke-[1.5]" />
            </div>
            <div className="flex flex-col">
              <DialogTitle className="text-sm font-semibold text-[#F0F0F0] leading-none">
                Architecture Spec Preview
              </DialogTitle>
              <DialogDescription className="text-xs text-[#A0A0A0] mt-1 leading-none">
                {formattedDate}
              </DialogDescription>
            </div>
          </div>

          <div className="flex items-center gap-2 pr-6">
            <Button
              type="button"
              size="sm"
              onClick={handleDownload}
              disabled={isLoading || !specDetail}
              className="h-8 px-3 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-medium rounded-md transition-colors flex items-center gap-1.5 disabled:opacity-50"
            >
              <Download className="h-3.5 w-3.5 stroke-[1.5]" />
              Download Spec
            </Button>
          </div>
        </DialogHeader>

        {/* Content Body */}
        <div className="flex-1 overflow-hidden relative bg-[#080808]">
          {isLoading ? (
            <div className="flex h-full w-full flex-col items-center justify-center text-[#A0A0A0]">
              <Loader2 className="h-6 w-6 animate-spin text-[#2563EB]" />
              <span className="mt-3 text-xs font-mono">Fetching specification document...</span>
            </div>
          ) : error ? (
            <div className="flex h-full w-full flex-col items-center justify-center text-red-400 p-6 text-center">
              <AlertCircle className="h-8 w-8 stroke-[1.5] mb-2" />
              <span className="text-sm font-semibold">{error}</span>
              <span className="text-xs text-[#A0A0A0] mt-1 max-w-md">
                Ensure you have proper access permissions and the file storage configuration is active.
              </span>
            </div>
          ) : (
            <ScrollArea className="h-full w-full p-6">
              <div className="max-w-2xl mx-auto space-y-4 text-xs leading-relaxed text-[#F0F0F0] font-sans selection:bg-[#2563EB]/30 selection:text-white">
                <pre className="whitespace-pre-wrap font-mono text-[11px] leading-relaxed bg-[#111111] p-4 rounded-lg border border-[#1A1A1A] text-[#F0F0F0] overflow-x-auto">
                  {specDetail?.content}
                </pre>
              </div>
            </ScrollArea>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

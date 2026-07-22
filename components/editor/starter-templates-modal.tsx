"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { LayoutTemplate, ArrowRight } from "lucide-react";
import { CANVAS_TEMPLATES, CanvasTemplate } from "./starter-templates";
import { CanvasNode } from "@/types/canvas";

interface StarterTemplatesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTemplate: (template: CanvasTemplate) => void;
}

function TemplatePreview({ template }: { template: CanvasTemplate }) {
  const { viewBox, nodes, edges } = React.useMemo(() => {
    if (!template.nodes.length) {
      return { viewBox: "0 0 100 100", nodes: [], edges: [] };
    }

    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;

    template.nodes.forEach((n) => {
      const w = (n.style?.width as number) || 120;
      const h = (n.style?.height as number) || 80;
      minX = Math.min(minX, n.position.x);
      minY = Math.min(minY, n.position.y);
      maxX = Math.max(maxX, n.position.x + w);
      maxY = Math.max(maxY, n.position.y + h);
    });

    const padding = 30;
    const viewWidth = Math.max(100, maxX - minX + padding * 2);
    const viewHeight = Math.max(100, maxY - minY + padding * 2);
    const vb = `${minX - padding} ${minY - padding} ${viewWidth} ${viewHeight}`;

    return { viewBox: vb, nodes: template.nodes, edges: template.edges };
  }, [template]);

  const getNodeCenter = (node: CanvasNode) => {
    const w = (node.style?.width as number) || 120;
    const h = (node.style?.height as number) || 80;
    return {
      x: node.position.x + w / 2,
      y: node.position.y + h / 2,
    };
  };

  return (
    <div className="relative h-[150px] w-full rounded-lg bg-[#08080A] border border-[#1E1E24] overflow-hidden flex items-center justify-center p-2">
      <svg
        viewBox={viewBox}
        className="h-full w-full max-h-[140px] max-w-[100%] overflow-visible"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Render Edges */}
        {edges.map((edge) => {
          const sourceNode = nodes.find((n) => n.id === edge.source);
          const targetNode = nodes.find((n) => n.id === edge.target);
          if (!sourceNode || !targetNode) return null;

          const p1 = getNodeCenter(sourceNode);
          const p2 = getNodeCenter(targetNode);

          return (
            <line
              key={edge.id}
              x1={p1.x}
              y1={p1.y}
              x2={p2.x}
              y2={p2.y}
              stroke="#555560"
              strokeWidth="2"
              strokeDasharray="4 4"
            />
          );
        })}

        {/* Render Nodes */}
        {nodes.map((node) => {
          const w = (node.style?.width as number) || 120;
          const h = (node.style?.height as number) || 80;
          const x = node.position.x;
          const y = node.position.y;
          const fill = (node.data?.color as string) || "#121215";
          const stroke = (node.data?.textColor as string) || "#F0F0F0";
          const shape = (node.data?.shape as string) || "rectangle";
          const label = (node.data?.label as string) || "";

          return (
            <g key={node.id}>
              {shape === "pill" ? (
                <rect
                  x={x}
                  y={y}
                  width={w}
                  height={h}
                  rx={h / 2}
                  fill={fill}
                  stroke={stroke}
                  strokeWidth={1.5}
                />
              ) : shape === "circle" ? (
                <circle
                  cx={x + w / 2}
                  cy={y + h / 2}
                  r={Math.min(w, h) / 2}
                  fill={fill}
                  stroke={stroke}
                  strokeWidth={1.5}
                />
              ) : shape === "diamond" ? (
                <polygon
                  points={`${x + w / 2},${y} ${x + w},${y + h / 2} ${x + w / 2},${y + h} ${x},${y + h / 2}`}
                  fill={fill}
                  stroke={stroke}
                  strokeWidth={1.5}
                />
              ) : shape === "cylinder" ? (
                <g>
                  <rect
                    x={x}
                    y={y + 8}
                    width={w}
                    height={h - 16}
                    fill={fill}
                    stroke={stroke}
                    strokeWidth={1.5}
                  />
                  <ellipse
                    cx={x + w / 2}
                    cy={y + 8}
                    rx={w / 2}
                    ry={8}
                    fill={fill}
                    stroke={stroke}
                    strokeWidth={1.5}
                  />
                  <ellipse
                    cx={x + w / 2}
                    cy={y + h - 8}
                    rx={w / 2}
                    ry={8}
                    fill={fill}
                    stroke={stroke}
                    strokeWidth={1.5}
                  />
                </g>
              ) : shape === "hexagon" ? (
                <polygon
                  points={`${x + w * 0.25},${y} ${x + w * 0.75},${y} ${x + w},${y + h / 2} ${x + w * 0.75},${y + h} ${x + w * 0.25},${y + h} ${x},${y + h / 2}`}
                  fill={fill}
                  stroke={stroke}
                  strokeWidth={1.5}
                />
              ) : (
                <rect
                  x={x}
                  y={y}
                  width={w}
                  height={h}
                  rx={6}
                  fill={fill}
                  stroke={stroke}
                  strokeWidth={1.5}
                />
              )}
              <text
                x={x + w / 2}
                y={y + h / 2}
                fill={stroke}
                fontSize={11}
                fontWeight={600}
                textAnchor="middle"
                dominantBaseline="central"
                fontFamily="var(--font-mono)"
              >
                {label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

export function StarterTemplatesModal({
  isOpen,
  onClose,
  onSelectTemplate,
}: StarterTemplatesModalProps) {
  const handleImport = (template: CanvasTemplate) => {
    onSelectTemplate(template);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl bg-[#0E0E10] border-[#1E1E24] text-[#F0F0F0] p-6 rounded-2xl shadow-2xl">
        <DialogHeader className="space-y-1">
          <div className="flex items-center gap-2 text-[#14B8A6]">
            <LayoutTemplate className="h-5 w-5 stroke-[1.5]" />
            <DialogTitle className="text-base font-semibold text-[#F0F0F0]">
              Starter Templates
            </DialogTitle>
          </div>
          <DialogDescription className="text-xs text-[#888892]">
            Select a pre-built architecture diagram to load onto your canvas. Importing a template will replace your current workspace.
          </DialogDescription>
        </DialogHeader>

        {/* Scrollable Template Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-4 max-h-[65vh] overflow-y-auto pr-1">
          {CANVAS_TEMPLATES.map((template) => (
            <div
              key={template.id}
              className="flex flex-col justify-between rounded-xl border border-[#1E1E24] bg-[#121215] p-3.5 hover:border-[#14B8A6]/50 transition-all group"
            >
              <div className="space-y-2">
                <TemplatePreview template={template} />
                <div className="pt-1">
                  <h4 className="text-xs font-semibold text-[#F0F0F0] group-hover:text-[#14B8A6] transition-colors">
                    {template.name}
                  </h4>
                  <p className="text-[11px] text-[#888892] mt-1 leading-relaxed line-clamp-3">
                    {template.description}
                  </p>
                </div>
              </div>

              <div className="pt-4">
                <Button
                  type="button"
                  size="sm"
                  onClick={() => handleImport(template)}
                  className="w-full h-8 bg-[#14B8A6] text-black font-semibold text-xs hover:bg-[#14B8A6]/90 transition-colors flex items-center justify-center gap-1.5 rounded-lg"
                >
                  Import Template
                  <ArrowRight className="h-3.5 w-3.5 stroke-[2]" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}

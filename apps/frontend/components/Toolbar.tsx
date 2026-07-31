"use client";
import React from "react";
import Square from "@/icons/Sqaure";
import Circle from "@/icons/Circle";
import Line from "@/icons/Line";
import Ellipse from "@/icons/Ellipse";
import Pencil from "@/icons/Pencil";
import Eraser from "@/icons/Eraser";
import Hand from "@/icons/Hand";
import Select from "@/icons/Select";

type Shape = "rectangle" | "circle" | "line" | "ellipse" | "pencil" | "hand" | "select" | "eraser";

interface ToolbarProps {
  activeTool: Shape;
  onToolChange: (tool: Shape) => void;
}

interface ToolItem {
  id: Shape;
  label: string;
  icon: (size: number, color: string) => React.ReactNode;
}

const TOOL_SIZE = 22;

const tools: ToolItem[] = [
  { id: "rectangle", label: "Rectangle", icon: (s, c) => <Square size={s} color={c} /> },
  { id: "circle", label: "Circle", icon: (s, c) => <Circle size={s} color={c} /> },
  { id: "ellipse", label: "Ellipse", icon: (s, c) => <Ellipse size={s} color={c} /> },
  { id: "line", label: "Line", icon: (s, c) => <Line size={s} color={c} /> },
  { id: "pencil", label: "Pencil", icon: (s, c) => <Pencil size={s} color={c} /> },
  { id: "eraser", label: "Eraser", icon: (s, c) => <Eraser size={s} color={c} /> },
  { id: "hand", label: "Panning", icon: (s, c) => <Hand size={s} color={c} /> },
  { id: "select" , label: "Select" , icon: (s,c) => <Select size={s} color={c} />},
];

function ToolButton({ tool, activeTool, onToolChange }: { tool: ToolItem; activeTool: Shape; onToolChange: (t: Shape) => void }) {
  return (
    <div className="relative group">
      <button
        className={`p-2 rounded-lg transition-all duration-200 cursor-pointer hover:bg-zinc-800 ${
          activeTool === tool.id ? "bg-indigo-500/20 ring-1 ring-indigo-500" : ""
        }`}
        onClick={() => onToolChange(tool.id)}
      >
        {tool.icon(TOOL_SIZE, activeTool === tool.id ? "#818cf8" : "#a1a1aa")}
      </button>
      <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-1 rounded-md bg-zinc-800 text-white text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
        {tool.label}
      </div>
    </div>
  );
}

export default function Toolbar({ activeTool, onToolChange }: ToolbarProps) {
  return (
    <div className="fixed top-5 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2 px-3 py-2 rounded-xl bg-zinc-900/90 backdrop-blur-md border border-zinc-800 shadow-2xl">
      <div className="flex items-center gap-1">
        {tools.map((tool) => (
          <ToolButton key={tool.id} tool={tool} activeTool={activeTool} onToolChange={onToolChange} />
        ))}
      </div>
    </div>
  );
}
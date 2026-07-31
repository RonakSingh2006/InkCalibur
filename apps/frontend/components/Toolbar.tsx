"use client";
import React, { useRef } from "react";
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
  color: string;
  onColorChange: (color: string) => void;
  scale: number;
  onScaleChange: (scale: number) => void;
}

interface ToolItem {
  id: Shape;
  label: string;
  icon: (size: number, color: string) => React.ReactNode;
}

const TOOL_SIZE = 22;
const ZOOM_STEP = 0.1;
const MIN_ZOOM = 0.1;
const MAX_ZOOM = 10;

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

function ColorPicker({ color, onColorChange }: { color: string; onColorChange: (color: string) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="relative group">
      <button
        className="p-2 rounded-lg transition-all duration-200 cursor-pointer hover:bg-zinc-800"
        onClick={() => inputRef.current?.click()}
      >
        <div
          className="w-5.5 h-5.5 rounded-md border-2 border-zinc-600"
          style={{ backgroundColor: color }}
        />
      </button>
      <input
        ref={inputRef}
        type="color"
        value={color}
        onChange={(e) => onColorChange(e.target.value)}
        className="absolute opacity-0 w-0 h-0 pointer-events-none"
      />
      <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-1 rounded-md bg-zinc-800 text-white text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
        Stroke Color
      </div>
    </div>
  );
}

function ZoomControls({ scale, onScaleChange }: { scale: number; onScaleChange: (scale: number) => void }) {
  const zoomPercent = Math.round(scale * 100);

  return (
    <div className="flex items-center gap-1">
      <div className="relative group">
        <button
          className="p-2 rounded-lg transition-all duration-200 cursor-pointer hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 text-lg font-bold leading-none"
          onClick={() => onScaleChange(Math.max(MIN_ZOOM, scale - ZOOM_STEP))}
          disabled={scale <= MIN_ZOOM}
        >
          −
        </button>
        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-1 rounded-md bg-zinc-800 text-white text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
          Zoom Out
        </div>
      </div>

      <div className="relative group">
        <span className="px-2 py-1 text-xs text-zinc-400 font-mono min-w-12 text-center select-none">
          {zoomPercent}%
        </span>
        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-1 rounded-md bg-zinc-800 text-white text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
          Zoom Level
        </div>
      </div>

      <div className="relative group">
        <button
          className="p-2 rounded-lg transition-all duration-200 cursor-pointer hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 text-lg font-bold leading-none"
          onClick={() => onScaleChange(Math.min(MAX_ZOOM, scale + ZOOM_STEP))}
          disabled={scale >= MAX_ZOOM}
        >
          +
        </button>
        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-1 rounded-md bg-zinc-800 text-white text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
          Zoom In
        </div>
      </div>
    </div>
  );
}

export default function Toolbar({ activeTool, onToolChange, color, onColorChange, scale, onScaleChange }: ToolbarProps) {
  return (
    <div className="fixed top-5 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2 px-3 py-2 rounded-xl bg-zinc-900/90 backdrop-blur-md border border-zinc-800 shadow-2xl">
      <div className="flex items-center gap-1">
        {tools.map((tool) => (
          <ToolButton key={tool.id} tool={tool} activeTool={activeTool} onToolChange={onToolChange} />
        ))}
      </div>
      <div className="w-px h-6 bg-zinc-700 mx-1" />
      <ColorPicker color={color} onColorChange={onColorChange} />
      <div className="w-px h-6 bg-zinc-700 mx-1" />
      <ZoomControls scale={scale} onScaleChange={onScaleChange} />
    </div>
  );
}
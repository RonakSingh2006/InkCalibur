"use client";
import React from "react";

interface FeatureCardProps {
  title: string;
  desc: string;
  icon: (size: number, color: string) => React.ReactNode;
}

export default function FeatureCard({ title, desc, icon }: FeatureCardProps) {
  return (
    <div className="group relative rounded-2xl border border-zinc-800 bg-zinc-900/60 backdrop-blur-sm p-6 hover:border-indigo-500/50 hover:bg-zinc-900 transition-all duration-300">
      <div className="absolute inset-0 bg-linear-to-br from-indigo-500/0 to-indigo-500/0 group-hover:from-indigo-500/5 group-hover:to-purple-500/5 rounded-2xl transition-all duration-300" />
      <div className="relative flex flex-col items-start gap-4">
        <div className="size-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
          {icon(24, "#818cf8")}
        </div>
        <div>
          <h4 className="text-white font-semibold text-lg mb-1.5">{title}</h4>
          <p className="text-zinc-400 text-sm leading-relaxed">{desc}</p>
        </div>
      </div>
    </div>
  );
}
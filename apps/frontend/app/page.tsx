"use client"
import Button from "@/components/Button";
import FeatureCard from "@/components/FeatureCard";
import { useRouter } from "next/navigation";
import checkUser from "@/lib/checkUser";

import Pencil from "@/icons/Pencil";
import Line from "@/icons/Line";
import Eraser from "@/icons/Eraser";
import Hand from "@/icons/Hand";
import Select from "@/icons/Select";
import Download from "@/icons/Download";
import Share from "@/icons/Share";

export default function Home() {
  const router = useRouter();

  const launchApp = async () => {
    const check = await checkUser();
    if (check) router.push("/dashboard");
    else router.push("/signin");
  };

  return (
    <main className="min-h-screen bg-linear-to-br from-black via-zinc-900 to-black text-white">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-6 max-w-7xl mx-auto w-full">
        <h1
          className="text-2xl font-bold tracking-wide cursor-pointer"
          onClick={() => router.push("/")}
        >
          Ink
          <span className="text-indigo-500">Calibur</span>
        </h1>

        <div className="hidden md:flex gap-6 text-sm text-zinc-300">
          <a href="#features" className="hover:text-white transition-colors">Features</a>
          <a href="#about" className="hover:text-white transition-colors">About</a>
          <a href="#open" className="hover:text-white transition-colors">Open App</a>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative flex flex-col items-center text-center px-6 pt-24 pb-32 overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-100 bg-indigo-600/20 blur-[120px] rounded-full pointer-events-none" />

        <div className="relative">
          <span className="inline-block px-4 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-sm font-medium mb-8">
            🚀 Real-time Collaborative Drawing Canvas
          </span>

          <h2 className="text-4xl md:text-6xl font-extrabold leading-tight max-w-4xl">
            Sketch ideas at the speed of thought with{" "}
            <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-400 to-purple-400">
              InkCalibur
            </span>
          </h2>

        <p className="mt-6 text-zinc-400 max-w-2xl text-lg mx-auto">
          A fast, collaborative drawing canvas.
          Draw diagrams, brainstorm ideas, and collaborate in real-time.
        </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="secondary" size="medium" text="Launch App" onClick={launchApp} />
            <Button variant="primary" size="medium" text="View on GitHub" onClick={() => window.open("https://github.com/RonakSingh2006/InkCalibur", "_blank")} />
          </div>
        </div>
      </section>

      {/* Features */}
      <section
        id="features"
        className="px-8 py-24 bg-zinc-950 border-t border-zinc-800"
      >
        <div className="max-w-6xl mx-auto">
          <h3 className="text-3xl font-bold text-center mb-4">Why InkCalibur?</h3>
          <p className="text-zinc-400 text-center mb-16 max-w-2xl mx-auto">
            Everything you need for a seamless drawing experience — from tools to real-time sync.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard
              title="Infinite Canvas"
              desc="Draw freely without limits. Zoom up to 1000% and pan anywhere to create endlessly."
              icon={(s, c) => <Hand size={s} color={c} />}
            />
            <FeatureCard
              title="Real-time Collaboration"
              desc="Work together with your team using WebSockets. Every change syncs instantly across all users."
              icon={(s, c) => <Select size={s} color={c} />}
            />
            <FeatureCard
              title="Versatile Drawing Tools"
              desc="Rectangle, circle, ellipse, line & freehand pencil — draw anything you need with ease."
              icon={(s, c) => <Pencil size={s} color={c} />}
            />
            <FeatureCard
              title="Precision Shapes"
              desc="Create exact geometric shapes with customizable stroke color and adjustable stroke width."
              icon={(s, c) => <Line size={s} color={c} />}
            />
            <FeatureCard
              title="Smart Eraser"
              desc="Remove unwanted shapes with one click. Hover preview shows exactly what will be erased."
              icon={(s, c) => <Eraser size={s} color={c} />}
            />
            <FeatureCard
              title="Export & Manage"
              desc="Download your work as a PNG image or clear the canvas to start fresh whenever you need."
              icon={(s, c) => <Download size={s} color={c} />}
            />
            <FeatureCard
              title="Public & Private Rooms"
              desc="Create public rooms for open collaboration or password-protected private rooms for your team only."
              icon={(s, c) => <Share size={s} color={c} />}
            />
            <FeatureCard
              title="Invite Links"
              desc="Share a unique invite link so anyone can join your room instantly — no manual room search needed."
              icon={(s, c) => <Share size={s} color={c} />}
            />
            <FeatureCard
              title="Email OTP Auth"
              desc="Secure signup with email verification via 6-digit OTP codes that expire in 5 minutes."
              icon={(s, c) => <Select size={s} color={c} />}
            />
          </div>
        </div>
      </section>

      {/* About / Stats */}
      <section
        id="about"
        className="px-8 py-24 max-w-6xl mx-auto"
      >
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h3 className="text-3xl font-bold mb-6">Built for creators & devs</h3>
            <p className="text-zinc-400 text-lg leading-relaxed">
              InkCalibur is designed for engineers, designers, and students who
              want a simple yet powerful way to visualize ideas. No clutter.
              No distractions. Just ideas on canvas.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5 text-center">
              <div className="text-3xl font-extrabold text-indigo-400">8</div>
              <div className="text-zinc-500 text-xs mt-1">Drawing Tools</div>
            </div>
            <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5 text-center">
              <div className="text-3xl font-extrabold text-indigo-400">∞</div>
              <div className="text-zinc-500 text-xs mt-1">Canvas Space</div>
            </div>
            <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5 text-center">
              <div className="text-3xl font-extrabold text-indigo-400">5</div>
              <div className="text-zinc-500 text-xs mt-1">Min OTP Expiry</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section
        id="open"
        className="px-8 py-24 text-center bg-linear-to-br from-zinc-900 via-zinc-800 to-black"
      >
        <h3 className="text-3xl md:text-4xl font-extrabold mb-6">
          Ready to draw?
        </h3>
        <p className="mb-8 text-indigo-100">
          Open InkCalibur and start sketching instantly.
        </p>

        <Button variant="secondary" size="large" text="Open InkCalibur" onClick={launchApp} />
      </section>

      {/* Footer */}
      <footer className="px-8 py-8 text-center text-zinc-500 text-sm border-t border-zinc-800">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <h1 className="text-lg font-bold text-white cursor-pointer" onClick={() => router.push("/")}>
            Ink<span className="text-indigo-500">Calibur</span>
          </h1>
          <p>© {new Date().getFullYear()} InkCalibur. Built By Ronak Singh</p>
          <div className="flex gap-4 text-zinc-400">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#about" className="hover:text-white transition-colors">About</a>
            <a
              href="https://github.com/RonakSingh2006/InkCalibur"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              GitHub
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}
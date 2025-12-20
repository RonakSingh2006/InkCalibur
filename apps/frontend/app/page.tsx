"use client"
import Button from "@/components/Button";
import Card from "@/components/Card";

export default function Home() {
  return (
    <main className="min-h-screen bg-linear-to-br from-black via-zinc-900 to-black text-white">
   
      <nav className="flex items-center justify-between px-8 py-6">

        <h1 className="text-2xl font-bold tracking-wide">
          Ink
          <span className="text-indigo-500">Calibur</span>
        </h1>

        <div className="hidden md:flex gap-6 text-sm text-zinc-300">
          <a href="#features" className="hover:text-white">Features</a>
          <a href="#about" className="hover:text-white">About</a>
          <a href="#open" className="hover:text-white">Open App</a>
        </div>

      </nav>


      <section className="flex flex-col items-center text-center px-6 pt-20 pb-32">

        <h2 className="text-4xl md:text-6xl font-extrabold leading-tight max-w-4xl">
          Sketch ideas at the speed of thought with{" "}
          <span className="text-indigo-500">InkCalibur</span>
        </h2>

        <p className="mt-6 text-zinc-400 max-w-2xl text-lg">
          A fast, collaborative whiteboard inspired by Excalidraw.
          Draw diagrams, brainstorm ideas, and collaborate in real-time.
        </p>

        <div className="mt-10 flex gap-4">

          <Button variant="secondary" size="medium" text="Launch App" onClick={()=>{}}/>

          <Button variant="primary" size="medium" text="View on GitHub" onClick={()=>{}}/>

        </div>
      </section>

     
      <section
        id="features"
        className="px-8 py-24 bg-zinc-950 border-t border-zinc-800"
      >
        <h3 className="text-3xl font-bold text-center mb-16">Why InkCalibur?</h3>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">

          <Card title="Infinite Canvas" desc="Draw freely without limits. Zoom, pan, and create endlessly."/>
          <Card title="Real-time Collaboration" desc="Work together with your team using WebSockets."/>
          <Card title="Hand-drawn Feel" desc="Natural sketch-style strokes just like Excalidraw."/>
          
        </div>

      </section>

      <section
        id="about"
        className="px-8 py-24 text-center max-w-4xl mx-auto"
      >
        <h3 className="text-3xl font-bold mb-6">Built for creators & devs</h3>
        <p className="text-zinc-400 text-lg">
          InkCalibur is designed for engineers, designers, and students who
          want a simple yet powerful way to visualize ideas. No clutter.
          No distractions. Just ideas on canvas.
        </p>
      </section>

    
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
        
        <Button variant="secondary" size="large" text="Open InkCalibur" onClick={()=>{}}/>
      </section>


      <footer className="px-8 py-8 text-center text-zinc-500 text-sm border-t border-zinc-800">
        © {new Date().getFullYear()} InkCalibur. Built By Ronak Singh
      </footer>
    </main>
  );
}

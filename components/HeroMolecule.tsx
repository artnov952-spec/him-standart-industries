"use client";
import { useEffect, useRef, useState } from "react";
import { clamp, easeMoleculePose, moleculeTarget, type MoleculePose } from "@/lib/hero-molecule-motion";
import type { createMoleculeScene } from "./molecule-scene";

type Mode = "loading" | "fine" | "coarse" | "reduced";
type Scene = NonNullable<ReturnType<typeof createMoleculeScene>>;
export default function HeroMolecule() {
  const hostRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const posterRef = useRef<HTMLImageElement>(null);
  const [mode, setMode] = useState<Mode>("loading");
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const coarse = window.matchMedia("(max-width: 800px), (pointer: coarse), (hover: none)");
    const update = () => setMode(reduced.matches ? "reduced" : coarse.matches ? "coarse" : "fine");
    update(); reduced.addEventListener("change", update); coarse.addEventListener("change", update);
    return () => { reduced.removeEventListener("change", update); coarse.removeEventListener("change", update); };
  }, []);
  useEffect(() => {
    const host = hostRef.current, canvas = canvasRef.current, poster = posterRef.current;
    const hero = host?.closest<HTMLElement>(".hero");
    if (!host || !canvas || !poster || !hero || mode === "loading") return;
    host.dataset.renderer = "poster";
    if (mode === "reduced") { host.dataset.motion = "reduced"; poster.style.transform = "none"; return; }
    let disposed = false, raf = 0, lastTime = 0, idleId = 0, timeoutId = 0;
    let engine: Scene | null = null, loading = false, failed = false;
    let bounds = hero.getBoundingClientRect(), scrollDirty = true;
    let visible = bounds.bottom > 0 && bounds.top < window.innerHeight;
    let pageVisible = document.visibilityState !== "hidden";
    const input = { x: 0, y: 0, scroll: 0 };
    let pose: MoleculePose = moleculeTarget(input, mode === "coarse");
    const status = (value: string) => { if (host.dataset.motion !== value) host.dataset.motion = value; };
    const stop = () => { if (raf) window.cancelAnimationFrame(raf); raf = 0; lastTime = 0; };
    function requestFrame() {
      if (disposed || !visible || !pageVisible || raf) return;
      lastTime = 0; raf = window.requestAnimationFrame(frame);
    }
    function frame(time: number) {
      raf = 0;
      if (disposed || !visible || !pageVisible) { status("paused"); return; }
      if (scrollDirty) { bounds = hero!.getBoundingClientRect(); input.scroll = clamp(-bounds.top / Math.max(1, bounds.height), 0, 1); scrollDirty = false; }
      const step = easeMoleculePose(pose, moleculeTarget(input, mode === "coarse"), lastTime ? (time - lastTime) / 1000 : 1 / 60);
      pose = step.pose; lastTime = time;
      if (engine) engine.render(pose);
      else poster!.style.transform = mode === "coarse" ? `translate3d(0,${(-pose.y * 50).toFixed(2)}px,0)` : `perspective(1000px) rotateX(${pose.rx.toFixed(5)}rad) rotateY(${pose.ry.toFixed(5)}rad) translate3d(${(pose.x * 40).toFixed(2)}px,${(-pose.y * 40).toFixed(2)}px,0)`;
      // Observable presentation values, written only after the frame is rendered.
      host!.dataset.pose = [pose.rx, pose.ry, pose.rz, pose.x, pose.y].map(value => value.toFixed(4)).join(",");
      status(step.settled ? "settled" : "active");
      if (!step.settled) raf = window.requestAnimationFrame(frame);
    }
    function resize() {
      scrollDirty = true;
      if (engine) { const rect = host!.getBoundingClientRect(); engine.resize(rect.width, rect.height); }
      requestFrame();
    }
    async function initialize() {
      idleId = 0; timeoutId = 0;
      if (disposed || !visible || !pageVisible || mode !== "fine" || engine || failed || loading) return;
      loading = true;
      try {
        const { createMoleculeScene } = await import("./molecule-scene");
        if (disposed || !visible || !pageVisible) return;
        engine = createMoleculeScene(canvas!);
        if (!engine) { failed = true; return; }
        const rect = host!.getBoundingClientRect(); engine.resize(rect.width, rect.height);
        // One quiet arrival, then on-demand motion. No permanent idle RAF loop.
        pose = { ...pose, ry: pose.ry + .065, rx: pose.rx - .025 };
        engine.render(pose); host!.dataset.renderer = "webgl";
        requestFrame();
      } catch { failed = true; host!.dataset.renderer = "poster"; }
      finally { loading = false; }
    }
    function queueScene() {
      if (mode !== "fine" || engine || loading || failed || idleId || timeoutId || !visible || !pageVisible) return;
      if (typeof window.requestIdleCallback === "function") idleId = window.requestIdleCallback(() => { void initialize(); }, { timeout: 1200 });
      else timeoutId = window.setTimeout(() => { void initialize(); }, 300);
    }
    const pointerMove = (event: PointerEvent) => {
      if (mode !== "fine" || (event.pointerType !== "mouse" && event.pointerType !== "pen")) return;
      input.x = clamp((event.clientX - bounds.left) / Math.max(1, bounds.width) * 2 - 1, -1, 1);
      input.y = clamp((event.clientY - bounds.top) / Math.max(1, bounds.height) * 2 - 1, -1, 1);
      requestFrame();
    };
    const pointerLeave = () => { input.x = 0; input.y = 0; requestFrame(); };
    const scroll = () => { scrollDirty = true; requestFrame(); };
    const visibility = () => {
      pageVisible = document.visibilityState !== "hidden";
      if (!pageVisible) { stop(); status("paused"); }
      else { scrollDirty = true; queueScene(); requestFrame(); }
    };
    const contextLost = (event: Event) => {
      event.preventDefault();
      if (disposed) return;
      failed = true; engine?.dispose(); engine = null; host.dataset.renderer = "poster"; requestFrame();
    };
    const observer = new IntersectionObserver(entries => {
      visible = Boolean(entries[0]?.isIntersecting);
      if (visible) { scrollDirty = true; queueScene(); requestFrame(); }
      else { stop(); status("paused"); }
    }, { threshold: 0 });
    observer.observe(hero);
    const sizeObserver = new ResizeObserver(resize); sizeObserver.observe(host);
    hero.addEventListener("pointermove", pointerMove, { passive: true });
    hero.addEventListener("pointerleave", pointerLeave, { passive: true });
    window.addEventListener("scroll", scroll, { passive: true });
    window.addEventListener("resize", resize, { passive: true });
    document.addEventListener("visibilitychange", visibility);
    canvas.addEventListener("webglcontextlost", contextLost);
    queueScene(); requestFrame();
    return () => {
      disposed = true; stop();
      if (idleId) window.cancelIdleCallback(idleId);
      if (timeoutId) window.clearTimeout(timeoutId);
      observer.disconnect(); sizeObserver.disconnect();
      hero.removeEventListener("pointermove", pointerMove); hero.removeEventListener("pointerleave", pointerLeave);
      window.removeEventListener("scroll", scroll); window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", visibility); canvas.removeEventListener("webglcontextlost", contextLost);
      engine?.dispose(); host.dataset.renderer = "poster"; host.dataset.motion = "poster";
      poster.style.transform = "none";
    };
  }, [mode]);
  return <div ref={hostRef} className="hero-molecule" data-renderer="poster" data-motion="poster" aria-hidden="true"><img ref={posterRef} className="hero-molecule-poster" src="/assets/hero-graphite-smooth-v2.webp" width="1100" height="700" style={{ objectPosition: "center" }} alt="" fetchPriority="high" /><canvas ref={canvasRef} className="hero-molecule-canvas" /></div>;
}

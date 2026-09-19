"use client";

import { useEffect, useRef } from "react";

const CHARS = "0123456789$%NVDA".split("");
const SIZE = 16;

export default function Matrix() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    let last = 0;
    let w = 0;
    let h = 0;
    let cols: number[] = [];

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = r.width;
      h = r.height;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.fillStyle = "#050505";
      ctx.fillRect(0, 0, w, h);
      ctx.font = `${SIZE - 2}px monospace`;
      cols = Array.from({ length: Math.ceil(w / SIZE) }, () => Math.random() * (h / SIZE));
      if (reduce) drawStatic();
    };

    const drawStatic = () => {
      ctx.fillStyle = "#050505";
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = "rgba(200,240,0,0.25)";
      for (let x = 0; x < w; x += SIZE) {
        for (let y = SIZE; y < h; y += SIZE * 2) {
          if (Math.random() > 0.5) ctx.fillText(CHARS[Math.floor(Math.random() * CHARS.length)], x, y);
        }
      }
    };

    const draw = (t: number) => {
      raf = requestAnimationFrame(draw);
      if (t - last < 70) return; // ~14fps, easy on phone batteries
      last = t;
      ctx.fillStyle = "rgba(5,5,5,0.14)";
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = "rgba(200,240,0,0.4)";
      cols.forEach((y, i) => {
        ctx.fillText(CHARS[Math.floor(Math.random() * CHARS.length)], i * SIZE, y * SIZE);
        cols[i] = y * SIZE > h && Math.random() > 0.975 ? 0 : y + 1;
      });
    };

    resize();
    window.addEventListener("resize", resize);
    if (!reduce) raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={ref} className="matrix" aria-hidden="true" />;
                        }

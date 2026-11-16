export const FPS = 30;
export const WIDTH = 1920;
export const HEIGHT = 1080;

export const colors = {
  bg: "#0f172a",
  fg: "#f1f5f9",
  muted: "#64748b",
  accent: "#38bdf8",
  mid: "#facc15",
  found: "#4ade80",
  discarded: "#334155",
};

export const font = "'Segoe UI', Inter, Helvetica, Arial, sans-serif";
export const mono = "Consolas, 'Fira Code', monospace";

/** Seconds -> frames, rounded up, plus a short tail pause. */
export const secondsToFrames = (s: number, tail = 0.4) => Math.ceil((s + tail) * FPS);

import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { colors, font, mono } from "../theme";

/**
 * Scene 6: recap.
 * Left: the pseudocode types in. Right: four step cards appear as each is
 * spoken, and the matching code lines light up. Ends on "O(log n)".
 * Cue times (s) measured from public/audio/scene6.wav pauses (ffmpeg silencedetect).
 */
const CUE = {
  code: 0.2, // "So that's binary search."
  steps: [1.9, 3.3, 4.3, 5.8], // sorted list / check the middle / throw away half / repeat
  outro: 7.9, // "Simple, and seriously fast."
};

const STEPS = [
  { title: "Sorted list", color: colors.accent },
  { title: "Check the middle", color: colors.mid },
  { title: "Throw away half", color: "#f87171" },
  { title: "Repeat", color: colors.found },
];

/** code lines; `step` = which step card lights this line up */
const CODE: { text: string; step?: number }[] = [
  { text: "def binary_search(a, target):  # a is sorted", step: 0 },
  { text: "    low, high = 0, len(a) - 1" },
  { text: "    while low <= high:", step: 3 },
  { text: "        mid = (low + high) // 2", step: 1 },
  { text: "        if a[mid] == target: return mid", step: 1 },
  { text: "        if a[mid] < target: low = mid + 1", step: 2 },
  { text: "        else:               high = mid - 1", step: 2 },
  { text: "    return -1  # not found" },
];

export const Scene6Recap: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
  const sp = (sec: number, damping = 200) => spring({ frame: frame - sec * fps, fps, config: { damping } });

  const activeStep = CUE.steps.reduce((acc, at, i) => (t >= at ? i : acc), -1);
  const outroIn = sp(CUE.outro);
  // once the outro starts, every line is part of the answer: drop per-step highlighting
  const highlightOn = 1 - outroIn;

  return (
    <AbsoluteFill style={{ backgroundColor: colors.bg, color: colors.fg, fontFamily: font }}>
      <div style={{ position: "absolute", top: 80, width: "100%", textAlign: "center", fontSize: 68, fontWeight: 700, opacity: sp(0) }}>
        Binary search, in four steps
      </div>

      {/* left: code */}
      <div
        style={{
          position: "absolute",
          left: 90,
          top: 230,
          width: 1060,
          padding: "28px 0",
          borderRadius: 18,
          background: "#1e293b",
          fontFamily: mono,
          fontSize: 31,
          lineHeight: 1.75,
        }}
      >
        {CODE.map((line, i) => {
          // type in line by line
          const start = CUE.code + i * 0.18;
          const chars = Math.floor(interpolate(t, [start, start + 0.35], [0, line.text.length], clamp));
          const lit = line.step !== undefined && line.step === activeStep;
          const color = lit ? STEPS[line.step!].color : undefined;
          return (
            <div
              key={i}
              style={{
                padding: "0 32px",
                whiteSpace: "pre",
                color: lit ? colors.fg : colors.muted,
                background: lit ? `${color}${alphaHex(0.18 * highlightOn)}` : "transparent",
                borderLeft: `6px solid ${lit ? `${color}${alphaHex(highlightOn)}` : "transparent"}`,
              }}
            >
              {line.text.slice(0, chars) || " "}
            </div>
          );
        })}
      </div>

      {/* right: step cards */}
      <div style={{ position: "absolute", right: 90, top: 230, width: 600, display: "flex", flexDirection: "column", gap: 22 }}>
        {STEPS.map((st, i) => {
          const inn = sp(CUE.steps[i], 16);
          const lit = i === activeStep;
          return (
            <div
              key={st.title}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 24,
                height: 96,
                padding: "0 28px",
                borderRadius: 16,
                border: `4px solid ${lit ? st.color : `${st.color}55`}`,
                background: lit ? `${st.color}22` : "transparent",
                opacity: Math.min(inn, 1),
                transform: `translateX(${(1 - Math.min(inn, 1)) * 60}px) scale(${lit ? 1.03 : 1})`,
              }}
            >
              <div style={{ fontFamily: mono, fontSize: 44, fontWeight: 700, color: st.color }}>{i + 1}</div>
              <div style={{ fontSize: 42, fontWeight: 600 }}>{st.title}</div>
            </div>
          );
        })}
      </div>

      {/* outro */}
      <div
        style={{
          position: "absolute",
          bottom: 90,
          width: "100%",
          textAlign: "center",
          fontSize: 64,
          fontWeight: 700,
          opacity: outroIn,
          transform: `translateY(${(1 - outroIn) * 30}px)`,
        }}
      >
        Simple, and seriously fast: <span style={{ color: colors.found, fontFamily: mono }}>O(log n)</span>
      </div>
    </AbsoluteFill>
  );
};

/** 0..1 -> two-digit hex alpha suffix for #rrggbb colors */
const alphaHex = (a: number) =>
  Math.round(Math.max(0, Math.min(1, a)) * 255)
    .toString(16)
    .padStart(2, "0");

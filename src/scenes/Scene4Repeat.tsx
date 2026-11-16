import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { ArrayRow, type Pointer } from "../components/ArrayRow";
import { TARGET, VALUES } from "../data";
import { colors, font, mono } from "../theme";

/**
 * Scene 4: repeat.
 * Starts where Scene 3 ended (0..7 discarded, low=8, high=15, 1 check done).
 * 73 -> toss 8..11, low=12 · 85 -> toss 13..15, high=12 · 79 -> found.
 * Cue times (s) measured from public/audio/scene4.wav pauses (ffmpeg silencedetect).
 */
const CUE = {
  mid73: 2.0, // "Seventy-three?"
  toss73: 3.1, // "Too small, toss the left."
  mid85: 4.7, // "Eighty-five?"
  toss85: 5.7, // "Too big, toss the right."
  mid79: 7.3, // "Seventy-nine?"
  found: 8.0, // "Found it!"
  endCard: 9.1, // "Four checks, instead of up to sixteen."
};

const STEPS = [
  { at: CUE.mid73, mid: 11, op: "<" },
  { at: CUE.mid85, mid: 13, op: ">" },
  { at: CUE.mid79, mid: 12, op: "=" },
] as const;

export const Scene4Repeat: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const s = (sec: number) => sec * fps;
  const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
  const sp = (sec: number, damping = 200) => spring({ frame: frame - s(sec), fps, config: { damping } });

  const toss73 = interpolate(t, [CUE.toss73, CUE.toss73 + 0.8], [0, 1], clamp);
  const toss85 = interpolate(t, [CUE.toss85, CUE.toss85 + 0.8], [0, 1], clamp);
  const lowMove = sp(CUE.toss73 + 0.5);
  const highMove = sp(CUE.toss85 + 0.5);
  const foundPop = sp(CUE.found, 10);
  const endIn = sp(CUE.endCard);

  // current step (-1 = before the first new check)
  const stepIdx = STEPS.reduce((acc, st, i) => (t >= st.at ? i : acc), -1);
  const step = stepIdx >= 0 ? STEPS[stepIdx] : null;
  const stepIn = step ? sp(step.at) : 0;
  const checks = 1 + (stepIdx + 1);

  // is the current mid still "live" (not yet discarded / resolved)?
  const midLive =
    step !== null &&
    ((step.mid === 11 && toss73 < 0.5) || (step.mid === 13 && toss85 < 0.5) || (step.mid === 12 && t < CUE.found));

  const discard = (i: number) => {
    if (i <= 7) return 1;
    if (i >= 8 && i <= 11) return toss73;
    if (i >= 13) return toss85;
    return 0;
  };

  const highlight = (i: number) => {
    if (i === 12 && t >= CUE.found) return colors.found;
    if (midLive && step && i === step.mid) return colors.mid;
    return undefined;
  };

  const final = t >= CUE.found;

  const lowAt = interpolate(lowMove, [0, 1], [8, 12]);
  const highAt = interpolate(highMove, [0, 1], [15, 12]);
  const ptrOpacity = final ? 1 - foundPop : 1;
  // once low and high meet on the same cell, show one merged label instead of overlapping text
  const merged = Math.abs(highAt - lowAt) < 0.6;
  const boundPointers: Pointer[] = merged
    ? [{ label: "low = high", at: highAt, color: colors.accent, opacity: ptrOpacity }]
    : [
        { label: "low", at: lowAt, color: colors.accent, opacity: ptrOpacity },
        { label: "high", at: highAt, color: colors.accent, opacity: ptrOpacity },
      ];

  return (
    <AbsoluteFill style={{ backgroundColor: colors.bg, color: colors.fg, fontFamily: font, alignItems: "center" }}>
      {/* checks counter */}
      <div style={{ position: "absolute", top: 60, right: 90, fontSize: 44, fontFamily: mono, color: colors.muted }}>
        checks: <span style={{ color: colors.fg, fontWeight: 700 }}>{checks}</span>
      </div>

      <div style={{ marginTop: 120, fontSize: 56, fontWeight: 600 }}>
        Looking for <span style={{ color: colors.found, fontFamily: mono }}>{TARGET}</span>
      </div>

      {/* comparison for the current step */}
      <div
        style={{
          marginTop: 60,
          height: 110,
          fontSize: 72,
          fontFamily: mono,
          fontWeight: 700,
          opacity: step ? stepIn : 0,
          transform: `scale(${0.8 + 0.2 * stepIn})`,
        }}
      >
        {step && (
          <>
            <span style={{ color: step.op === "=" && final ? colors.found : colors.mid }}>{VALUES[step.mid]}</span>
            <span> {step.op} </span>
            <span style={{ color: colors.found }}>{TARGET}</span>
          </>
        )}
      </div>

      <div style={{ marginTop: 60 }}>
        <ArrayRow
          values={VALUES}
          discard={discard}
          highlight={highlight}
          pointers={[
            ...boundPointers,
            {
              label: final ? "found" : "mid",
              at: step ? step.mid : 11,
              color: final ? colors.found : colors.mid,
              opacity: final ? foundPop : midLive ? stepIn : 0,
            },
          ]}
        />
      </div>

      {/* end card */}
      <div
        style={{
          marginTop: 20,
          fontSize: 64,
          fontWeight: 700,
          opacity: endIn,
          transform: `translateY(${(1 - endIn) * 30}px)`,
        }}
      >
        <span style={{ color: colors.found }}>4 checks</span>
        <span style={{ color: colors.muted }}> instead of up to </span>
        <span>16</span>
      </div>
    </AbsoluteFill>
  );
};

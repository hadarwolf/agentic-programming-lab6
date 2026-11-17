import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { CELL, mix, rowWidth, STEP } from "../components/ArrayRow";
import { colors, font, mono, WIDTH } from "../theme";

const N = 1000;
/** Deterministic "random" unsorted values 1..999 for a 1,000-item list. */
const valueAt = (i: number) => {
  let h = Math.imul(i ^ 0x5bd1e995, 0x27d4eb2d);
  h ^= h >>> 15;
  h = Math.imul(h, 0x165667b1);
  h ^= h >>> 13;
  return ((h >>> 0) % 999) + 1;
};
/** Left edge of cell 0: same as Scene 2's centered 16-cell row, so the cut lines up. */
const ROW_LEFT = (WIDTH - rowWidth(16)) / 2;
/** Screen slot (in cells) where the scan pointer parks while the row scrolls under it. */
const PARK = 3;

/**
 * Scene 1: hook.
 * A long unsorted row slides in and runs off-screen -> "A list of 1,000 numbers" ->
 * a pointer checks cells one by one, slowly at first, then the row streaks past
 * as the counter races to 1,000 -> "Luckily, there's a much faster way."
 *
 * Layout mirrors Scene 2/3 (header / big-text slot / row). Cue times come from
 * pauses in public/audio/scene1.wav.
 */
export const Scene1Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const t = frame / fps;
  const s = (sec: number) => sec * fps;
  const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

  // 0.2 s "Say you're hunting...": row slides in from the right
  const rowIn = spring({ frame: frame - s(0.2), fps, config: { damping: 200 }, durationInFrames: s(1.2) });
  // 2.2 s "...a list of a thousand": header
  const headerIn = spring({ frame: frame - s(2.2), fps, config: { damping: 200 } });
  // 3.3–5.0 s "If you check them one at a time": slow, visible steps (0 -> 8)
  // 5.0–6.8 s "that could take a thousand tries": races to 1,000
  const SCAN_START = 3.3;
  const SLOW_END = 5.0;
  const FAST_END = 6.8;
  const SLOW_CHECKS = 8;
  const scanAt = (sec: number) =>
    sec < SLOW_END
      ? interpolate(sec, [SCAN_START, SLOW_END], [0, SLOW_CHECKS], clamp)
      : interpolate(sec, [SLOW_END, FAST_END], [SLOW_CHECKS, N], { ...clamp, easing: Easing.in(Easing.cubic) });
  const pos = scanAt(t);
  const scanning = t >= SCAN_START;
  const current = Math.min(Math.floor(pos), N - 1); // cell being checked
  const checks = scanning ? Math.min(Math.floor(pos) + 1, N) : 0;
  const done = t >= FAST_END;
  // camera follows the pointer once it passes the park slot
  const scroll = Math.max(0, pos - PARK) * STEP;
  // motion blur proportional to how many cells fly past per frame
  const cellsPerFrame = pos - scanAt((frame - 1) / fps);
  const blur = Math.min(cellsPerFrame * 0.6, 8);

  const counterIn = spring({ frame: frame - s(SCAN_START), fps, config: { damping: 200 } });
  // 7.3 s "Luckily," / 8.0 s "there's a much faster way."
  const swap = spring({ frame: frame - s(7.4), fps, config: { damping: 200 } });
  const fasterIn = spring({ frame: frame - s(8.0), fps, config: { damping: 14 } });
  const fadeOut = interpolate(frame, [durationInFrames - 10, durationInFrames - 1], [1, 0], clamp);

  // only render cells that can be on screen
  const slideX = (1 - rowIn) * WIDTH;
  const first = Math.max(0, Math.floor(scroll / STEP) - 2);
  const last = Math.min(N - 1, first + Math.ceil(WIDTH / STEP) + 4);
  const visible = Array.from({ length: last - first + 1 }, (_, k) => first + k);
  const pointerX = ROW_LEFT + current * STEP - scroll + slideX + CELL / 2;

  return (
    <AbsoluteFill style={{ backgroundColor: colors.bg, color: colors.fg, fontFamily: font, alignItems: "center", opacity: fadeOut }}>
      {/* header (same slot as Scene 2/3's "Looking for 79") */}
      <div style={{ marginTop: 120, fontSize: 56, fontWeight: 600, position: "relative", width: WIDTH, textAlign: "center" }}>
        <div style={{ opacity: headerIn * (1 - swap), transform: `translateY(${(1 - headerIn) * -30}px)` }}>
          A list of <span style={{ color: colors.accent, fontFamily: mono }}>1,000</span> numbers
        </div>
        <div
          style={{
            position: "absolute",
            inset: 0,
            color: colors.found,
            opacity: Math.min(fasterIn, 1),
            transform: `scale(${0.85 + 0.15 * Math.min(fasterIn, 1.05)})`,
          }}
        >
          There's a much faster way
        </div>
      </div>

      {/* big-text slot: the check counter */}
      <div
        style={{
          marginTop: 60,
          height: 110,
          fontSize: 72,
          fontFamily: mono,
          fontWeight: 700,
          opacity: counterIn * (1 - 0.5 * swap),
          color: done ? "#f87171" : colors.mid,
          position: "relative",
        }}
      >
        checks: {checks.toLocaleString("en-US")}
        {/* struck through on "Luckily," */}
        <div
          style={{
            position: "absolute",
            left: -10,
            right: -10,
            top: 42, // middle of the 72px text line (the slot itself is 110px tall)
            height: 6,
            borderRadius: 3,
            background: "#f87171",
            transformOrigin: "left",
            transform: `scaleX(${swap})`,
          }}
        />
      </div>

      {/* the row, running off both edges */}
      <div
        style={{
          marginTop: 60,
          position: "relative",
          width: WIDTH,
          height: CELL + 170,
          opacity: 1 - swap,
          filter: blur > 0.3 ? `blur(${blur}px)` : undefined,
        }}
      >
        {visible.map((i) => {
          const checked = scanning && (i < current || done);
          const isCurrent = scanning && i === current && !done;
          const d = checked ? 1 : 0;
          const border = isCurrent ? colors.mid : mix(colors.accent, colors.discarded, d);
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: ROW_LEFT + i * STEP - scroll + slideX,
                top: 0,
                width: CELL,
                height: CELL,
                borderRadius: 14,
                border: `4px solid ${border}`,
                background: isCurrent ? `${colors.mid}22` : "transparent",
                color: isCurrent ? colors.mid : mix(colors.fg, colors.muted, d),
                opacity: 1 - 0.55 * d,
                boxShadow: isCurrent ? `0 0 28px ${colors.mid}88` : "none",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                fontSize: 40,
                fontWeight: 700,
              }}
            >
              {valueAt(i)}
            </div>
          );
        })}

        {/* scan pointer */}
        <div
          style={{
            position: "absolute",
            top: CELL + 44,
            left: pointerX - 60,
            width: 120,
            textAlign: "center",
            color: colors.mid,
            fontFamily: mono,
            fontWeight: 700,
            opacity: scanning && !done ? 1 : 0,
          }}
        >
          <div style={{ fontSize: 40, lineHeight: 1 }}>▲</div>
          <div style={{ fontSize: 30 }}>check</div>
        </div>

        {/* "...1,000 items" hint at the right edge: the list keeps going */}
        <div
          style={{
            position: "absolute",
            right: 30,
            top: CELL + 50,
            fontSize: 34,
            color: colors.muted,
            opacity: headerIn * (scanning ? 0 : 1),
          }}
        >
          …and it keeps going →
        </div>
      </div>
    </AbsoluteFill>
  );
};

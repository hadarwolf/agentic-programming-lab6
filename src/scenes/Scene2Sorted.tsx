import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { CELL, rowWidth, STEP } from "../components/ArrayRow";
import { TARGET, VALUES } from "../data";
import { colors, font, mono } from "../theme";

/** A fixed scramble of VALUES (same 16 numbers, unsorted). */
const SHUFFLED = [57, 12, 91, 34, 79, 3, 64, 21, 98, 42, 8, 73, 27, 85, 15, 51];

/**
 * Scene 2: sorted is the key.
 * A long scrambled row collapses into 16 cells -> they sort themselves
 * (smallest settle first) -> indices + "smallest → largest" -> target 79
 * appears -> a "?" hovers where Scene 3's comparison bubble will be.
 *
 * Layout mirrors Scene3FirstCheck (badge / bubble slot / row), so the cut
 * between the two scenes doesn't jump. Cue times come from pauses in
 * public/audio/scene2.wav.
 */
export const Scene2Sorted: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const s = (sec: number) => sec * fps;
  const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

  const n = VALUES.length;
  const center = rowWidth(n) / 2 - CELL / 2;

  // 0.0–1.0 s "There's just one rule": spread-out row collapses in
  const collapse = spring({ frame, fps, config: { damping: 200 }, durationInFrames: s(0.9) });
  // 1.27–2.5 s "has to be sorted": each cell travels to its sorted slot, smallest first
  const SORT_START = 1.2;
  const SORT_STAGGER = 0.06;
  // 4.66 s "smallest to largest": indices and direction label
  const orderIn = interpolate(frame, [s(4.65), s(5.25)], [0, 1], clamp);
  const labelOut = interpolate(frame, [s(7.3), s(7.7)], [1, 0], clamp);
  // ~6.27 s "seventy-nine": target badge
  const targetIn = spring({ frame: frame - s(6.25), fps, config: { damping: 14 } });
  // 7.8 s "Where would you start?": hovering question mark, fades before the cut
  const qIn = spring({ frame: frame - s(7.8), fps, config: { damping: 12 } });
  const qOut = interpolate(frame, [durationInFrames - 8, durationInFrames - 1], [1, 0], clamp);
  const bob = Math.sin((frame / fps) * Math.PI * 2 * 0.9) * 8;

  return (
    <AbsoluteFill style={{ backgroundColor: colors.bg, color: colors.fg, fontFamily: font, alignItems: "center" }}>
      {/* target badge (same spot as Scene 3) */}
      <div
        style={{
          marginTop: 120,
          fontSize: 56,
          fontWeight: 600,
          opacity: targetIn,
          transform: `translateY(${(1 - targetIn) * -30}px)`,
        }}
      >
        Looking for <span style={{ color: colors.found, fontFamily: mono }}>{TARGET}</span>
      </div>

      {/* bubble slot: "?" here, "42 < 79" in Scene 3 */}
      <div
        style={{
          marginTop: 60,
          height: 110,
          fontSize: 72,
          fontFamily: mono,
          fontWeight: 700,
          color: colors.mid,
          opacity: Math.min(qIn, 1) * qOut,
          transform: `translateY(${bob}px) scale(${0.6 + 0.4 * Math.min(qIn, 1.1)})`,
        }}
      >
        ?
      </div>

      <div style={{ marginTop: 60, position: "relative", width: rowWidth(n), height: CELL + 170 }}>
        {SHUFFLED.map((v) => {
          const from = SHUFFLED.indexOf(v);
          const to = VALUES.indexOf(v);
          const p = spring({
            frame: frame - s(SORT_START + to * SORT_STAGGER),
            fps,
            config: { damping: 18, mass: 0.8 },
          });
          const slotFrom = from * STEP;
          // collapse: start 1.8x spread out around the center (off-screen at the ends)
          const xStart = center + (slotFrom - center) * (1 + 0.8 * (1 - collapse));
          const x = interpolate(p, [0, 1], [xStart, to * STEP]);
          // arc: cells moving right go over the top, moving left go underneath
          const dist = Math.abs(to - from);
          const lift = dist === 0 ? 0 : Math.min(40 + dist * 10, 130) * Math.sin(Math.PI * Math.min(Math.max(p, 0), 1));
          const y = to > from ? -lift : lift;
          return (
            <div key={v} style={{ position: "absolute", left: x, top: y, width: CELL, opacity: collapse, zIndex: dist }}>
              <div
                style={{
                  width: CELL,
                  height: CELL,
                  borderRadius: 14,
                  border: `4px solid ${colors.accent}`,
                  background: colors.bg,
                  color: colors.fg,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  fontSize: 40,
                  fontWeight: 700,
                  fontFamily: font,
                }}
              >
                {v}
              </div>
            </div>
          );
        })}

        {/* indices fade in once the row is in order (same position/style as ArrayRow) */}
        {VALUES.map((_, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: i * STEP,
              top: CELL + 6,
              width: CELL,
              textAlign: "center",
              fontSize: 20,
              color: colors.muted,
              fontFamily: mono,
              opacity: interpolate(frame, [s(4.3 + i * 0.03), s(4.6 + i * 0.03)], [0, 1], clamp),
            }}
          >
            {i}
          </div>
        ))}

        {/* "smallest → largest" where Scene 3's pointers will sit */}
        <div
          style={{
            position: "absolute",
            top: CELL + 56,
            left: 0,
            width: rowWidth(n),
            display: "flex",
            alignItems: "center",
            gap: 24,
            fontSize: 34,
            color: colors.accent,
            opacity: orderIn * labelOut,
          }}
        >
          <span>smallest</span>
          <div
            style={{
              flex: 1,
              height: 4,
              borderRadius: 2,
              background: `linear-gradient(90deg, ${colors.accent}33, ${colors.accent})`,
              transformOrigin: "left",
              transform: `scaleX(${orderIn})`,
            }}
          />
          <span>largest ▶</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

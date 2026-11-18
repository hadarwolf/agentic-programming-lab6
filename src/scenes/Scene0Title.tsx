import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { colors, font, mono } from "../theme";

/**
 * Scene 0: title card, so the audience knows the topic up front.
 * "BINARY SEARCH" springs in (narrated "Binary search."), a row of 7 cells
 * draws underneath with the middle one lit, then the subtitle. Fades out
 * into Scene 1.
 */
const CELLS = 7;

export const Scene0Title: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
  const sp = (sec: number, damping = 200) => spring({ frame: frame - sec * fps, fps, config: { damping } });

  const titleIn = sp(0, 14);
  const subIn = sp(0.9);
  const midLit = sp(1.2, 12);
  const out = interpolate(frame, [durationInFrames - 10, durationInFrames - 1], [1, 0], clamp);

  return (
    <AbsoluteFill
      style={{ backgroundColor: colors.bg, color: colors.fg, fontFamily: font, alignItems: "center", justifyContent: "center", opacity: out }}
    >
      <div
        style={{
          fontSize: 150,
          fontWeight: 800,
          letterSpacing: 18,
          opacity: Math.min(titleIn, 1),
          transform: `scale(${0.85 + 0.15 * titleIn})`,
        }}
      >
        BINARY <span style={{ color: colors.accent }}>SEARCH</span>
      </div>

      <div style={{ display: "flex", gap: 14, marginTop: 50 }}>
        {Array.from({ length: CELLS }).map((_, i) => {
          const inn = sp(0.25 + i * 0.06);
          const isMid = i === Math.floor(CELLS / 2);
          const lit = isMid ? midLit : 0;
          return (
            <div
              key={i}
              style={{
                width: 70,
                height: 70,
                borderRadius: 12,
                border: `4px solid ${isMid && lit > 0.5 ? colors.mid : colors.accent}`,
                background: isMid ? `rgba(250, 204, 21, ${0.25 * Math.min(lit, 1)})` : "transparent",
                opacity: Math.min(inn, 1),
                transform: `translateY(${(1 - Math.min(inn, 1)) * 30}px) scale(${1 + 0.12 * Math.min(lit, 1)})`,
              }}
            />
          );
        })}
      </div>

      <div
        style={{
          marginTop: 50,
          fontSize: 46,
          color: colors.muted,
          fontFamily: mono,
          opacity: subIn,
          transform: `translateY(${(1 - subIn) * 20}px)`,
        }}
      >
        find anything in a sorted list, fast
      </div>
    </AbsoluteFill>
  );
};

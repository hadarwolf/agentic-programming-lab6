import { AbsoluteFill, Audio, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { colors, font } from "./theme";

const CELLS = [3, 8, 15, 21, 34, 42, 57, 73, 88];

export const TestClip: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const titleIn = spring({ frame, fps, config: { damping: 200 } });

  return (
    <AbsoluteFill style={{ backgroundColor: colors.bg, color: colors.fg, fontFamily: font, justifyContent: "center", alignItems: "center", gap: 80 }}>
      <Audio src={staticFile("audio/test.wav")} />
      <div style={{ fontSize: 120, fontWeight: 700, opacity: titleIn, transform: `translateY(${(1 - titleIn) * 40}px)` }}>
        Binary Search
      </div>
      <div style={{ display: "flex", gap: 16 }}>
        {CELLS.map((n, i) => {
          const o = interpolate(frame, [20 + i * 4, 30 + i * 4], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          const isMid = i === 4 && frame > 75;
          return (
            <div
              key={n}
              style={{
                width: 110, height: 110, borderRadius: 14, opacity: o,
                display: "flex", justifyContent: "center", alignItems: "center", fontSize: 48, fontWeight: 600,
                border: `4px solid ${isMid ? colors.mid : colors.accent}`,
                color: isMid ? colors.mid : colors.fg,
              }}
            >
              {n}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

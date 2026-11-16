import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { ArrayRow } from "../components/ArrayRow";
import { TARGET, VALUES } from "../data";
import { colors, font, mono } from "../theme";

/**
 * Scene 3: first check.
 * low/high at the ends -> mid (index 7, value 42) lights up -> "42 < 79" ->
 * left half (0..7) greys out -> low slides to 8.
 */
export const Scene3FirstCheck: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = (sec: number) => sec * fps;
  const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

  const MID = 7;
  const pointersIn = interpolate(frame, [0, s(0.6)], [0, 1], clamp);
  const midOn = spring({ frame: frame - s(1.2), fps, config: { damping: 14 } });
  const compareIn = spring({ frame: frame - s(3.2), fps, config: { damping: 200 } });
  const discardT = interpolate(frame, [s(6.2), s(7.2)], [0, 1], clamp);
  const lowMove = spring({ frame: frame - s(7.6), fps, config: { damping: 200 } });

  return (
    <AbsoluteFill style={{ backgroundColor: colors.bg, color: colors.fg, fontFamily: font, alignItems: "center" }}>
      {/* target badge */}
      <div style={{ marginTop: 120, fontSize: 56, fontWeight: 600 }}>
        Looking for <span style={{ color: colors.found, fontFamily: mono }}>{TARGET}</span>
      </div>

      {/* comparison bubble */}
      <div
        style={{
          marginTop: 60,
          height: 110,
          fontSize: 72,
          fontFamily: mono,
          fontWeight: 700,
          opacity: compareIn,
          transform: `scale(${0.8 + 0.2 * compareIn})`,
        }}
      >
        <span style={{ color: colors.mid }}>{VALUES[MID]}</span>
        <span style={{ color: colors.fg }}> &lt; </span>
        <span style={{ color: colors.found }}>{TARGET}</span>
      </div>

      <div style={{ marginTop: 60 }}>
        <ArrayRow
          values={VALUES}
          discard={(i) => (i <= MID ? discardT : 0)}
          highlight={(i) => (i === MID && midOn > 0.05 && discardT < 0.5 ? colors.mid : undefined)}
          pointers={[
            { label: "low", at: interpolate(lowMove, [0, 1], [0, MID + 1]), color: colors.accent, opacity: pointersIn },
            { label: "mid", at: MID, color: colors.mid, opacity: midOn * (1 - discardT) },
            { label: "high", at: VALUES.length - 1, color: colors.accent, opacity: pointersIn },
          ]}
        />
      </div>

      {/* caption once the half is discarded */}
      <div style={{ marginTop: 20, fontSize: 44, color: colors.muted, opacity: discardT }}>
        Everything left of 42 is smaller too: half the list, gone.
      </div>
    </AbsoluteFill>
  );
};

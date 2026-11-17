import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { colors, font, mono } from "../theme";

/**
 * Scene 5: why it's fast.
 * Left: rows of 16 -> 8 -> 4 -> 2 -> 1 blocks appear in time with the spoken numbers.
 * Right: chart of n (linear scan) vs log2 n (binary search) draws in.
 * Bottom: "1,000,000 items -> 20 checks".
 * Cue times (s) measured from public/audio/scene5.wav pauses (ffmpeg silencedetect).
 */
const CUE = {
  rows: [2.1, 2.85, 3.25, 3.6, 3.95], // "sixteen, eight, four, two, one"
  chart: 4.75, // "So n items take about log base two of n checks."
  logLabel: 6.2, // "...log base two of n"
  million: 8.0, // "That's why a million items..."
  twenty: 9.85, // "...need only twenty." (word starts ~9.9 s)
};
const COUNTS = [16, 8, 4, 2, 1];
const LINEAR = "#f87171";

// chart geometry
const CW = 760;
const CH = 440;
const NMAX = 64;
const x = (n: number) => (n / NMAX) * CW;
const y = (v: number) => CH - (v / NMAX) * CH;
const linePath = `M ${x(1)} ${y(1)} L ${x(NMAX)} ${y(NMAX)}`;
const logPath =
  "M " +
  Array.from({ length: NMAX }, (_, i) => i + 1)
    .map((n) => `${x(n).toFixed(1)} ${y(Math.log2(n)).toFixed(1)}`)
    .join(" L ");

export const Scene5WhyFast: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
  const sp = (sec: number, damping = 200) => spring({ frame: frame - sec * fps, fps, config: { damping } });

  const titleIn = sp(0);
  const chartIn = sp(CUE.chart);
  const drawLinear = interpolate(t, [CUE.chart + 0.3, CUE.chart + 1.3], [0, 1], clamp);
  const drawLog = interpolate(t, [CUE.chart + 0.9, CUE.chart + 1.9], [0, 1], clamp);
  const logLabelIn = sp(CUE.logLabel);
  const millionIn = sp(CUE.million);
  const twentyIn = sp(CUE.twenty, 10);

  return (
    <AbsoluteFill style={{ backgroundColor: colors.bg, color: colors.fg, fontFamily: font }}>
      {/* title */}
      <div
        style={{
          position: "absolute",
          top: 90,
          width: "100%",
          textAlign: "center",
          fontSize: 60,
          fontWeight: 700,
          opacity: titleIn,
          transform: `translateY(${(1 - titleIn) * -20}px)`,
        }}
      >
        Every check cuts the list <span style={{ color: colors.mid }}>in half</span>
      </div>

      {/* left: halving rows */}
      <div style={{ position: "absolute", left: 110, top: 260 }}>
        {COUNTS.map((c, r) => {
          const inn = sp(CUE.rows[r], 16);
          const isLast = r === COUNTS.length - 1;
          return (
            <div
              key={c}
              style={{
                display: "flex",
                alignItems: "center",
                height: 74,
                opacity: Math.min(inn, 1),
                transform: `translateX(${(1 - Math.min(inn, 1)) * -40}px)`,
              }}
            >
              <div style={{ width: 80, fontFamily: mono, fontSize: 40, fontWeight: 700, color: isLast ? colors.found : colors.fg }}>
                {c}
              </div>
              <div style={{ display: "flex", gap: 6 }}>
                {Array.from({ length: c }).map((_, i) => (
                  <div
                    key={i}
                    style={{
                      width: 38,
                      height: 38,
                      borderRadius: 7,
                      border: `3px solid ${isLast ? colors.found : colors.accent}`,
                      background: isLast ? `${colors.found}33` : "transparent",
                    }}
                  />
                ))}
              </div>
            </div>
          );
        })}
        <div style={{ marginTop: 14, fontSize: 34, color: colors.muted, opacity: sp(CUE.rows[4] + 0.3) }}>
          16 items → <span style={{ color: colors.found, fontWeight: 700 }}>4 halvings</span>
        </div>
      </div>

      {/* right: chart */}
      <div style={{ position: "absolute", right: 120, top: 230, opacity: chartIn }}>
        <svg width={CW + 60} height={CH + 70} viewBox={`-50 -10 ${CW + 60} ${CH + 70}`} style={{ overflow: "visible" }}>
          {/* axes */}
          <line x1={0} y1={CH} x2={CW} y2={CH} stroke={colors.muted} strokeWidth={3} />
          <line x1={0} y1={0} x2={0} y2={CH} stroke={colors.muted} strokeWidth={3} />
          <text x={CW} y={CH + 45} fill={colors.muted} fontSize={28} textAnchor="end" fontFamily={font}>
            items (n) →
          </text>
          <text x={-18} y={10} fill={colors.muted} fontSize={28} textAnchor="end" fontFamily={font} transform={`rotate(-90 -18 10)`}>
            checks
          </text>
          {/* linear scan */}
          <path d={linePath} stroke={LINEAR} strokeWidth={6} fill="none" strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - drawLinear} />
          {/* sits above-left of the line so the stroke never crosses it */}
          <text x={x(30)} y={y(30) - 40} fill={LINEAR} fontSize={34} fontWeight={700} textAnchor="end" fontFamily={mono} opacity={drawLinear}>
            one by one: n
          </text>
          {/* binary search */}
          <path d={logPath} stroke={colors.found} strokeWidth={6} fill="none" strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - drawLog} />
          <text x={x(NMAX) - 10} y={y(Math.log2(NMAX)) - 22} fill={colors.found} fontSize={34} fontWeight={700} textAnchor="end" fontFamily={mono} opacity={logLabelIn}>
            binary search: log₂ n
          </text>
        </svg>
      </div>

      {/* bottom: a million -> twenty */}
      <div
        style={{
          position: "absolute",
          bottom: 70,
          width: "100%",
          textAlign: "center",
          fontSize: 76,
          fontWeight: 700,
          opacity: millionIn,
          transform: `translateY(${(1 - millionIn) * 30}px)`,
        }}
      >
        <span style={{ fontFamily: mono }}>1,000,000</span>
        <span style={{ color: colors.muted }}> items → </span>
        <span
          style={{
            display: "inline-block",
            color: colors.found,
            fontFamily: mono,
            opacity: Math.min(twentyIn, 1),
            transform: `scale(${0.5 + 0.5 * twentyIn})`,
          }}
        >
          20
        </span>
        <span style={{ color: colors.muted, opacity: Math.min(twentyIn, 1) }}> checks</span>
      </div>
    </AbsoluteFill>
  );
};

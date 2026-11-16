import React from "react";
import { colors, font, mono } from "../theme";

export const CELL = 96;
export const GAP = 12;
export const STEP = CELL + GAP;

/** x-center (px, relative to row's left edge) of cell i. Accepts fractional i for sliding pointers. */
export const cellCenter = (i: number) => i * STEP + CELL / 2;
export const rowWidth = (n: number) => n * STEP - GAP;

export type Pointer = {
  label: string;
  /** index (may be fractional while animating) */
  at: number;
  color: string;
  opacity?: number;
};

type Props = {
  values: number[];
  /** 0 = normal, 1 = fully discarded (greyed) */
  discard?: (i: number) => number;
  /** border/text color override per cell, e.g. mid or found */
  highlight?: (i: number) => string | undefined;
  /** per-cell entrance opacity */
  appear?: (i: number) => number;
  pointers?: Pointer[];
  showIndices?: boolean;
};

/** A horizontal row of array cells with optional low/mid/high pointers underneath. */
export const ArrayRow: React.FC<Props> = ({ values, discard, highlight, appear, pointers = [], showIndices = true }) => {
  return (
    <div style={{ position: "relative", width: rowWidth(values.length), height: CELL + 170, fontFamily: font }}>
      {values.map((v, i) => {
        const d = discard ? discard(i) : 0;
        const h = highlight ? highlight(i) : undefined;
        const a = appear ? appear(i) : 1;
        const border = h ?? mix(colors.accent, colors.discarded, d);
        return (
          <div key={i} style={{ position: "absolute", left: i * STEP, top: 0, width: CELL, opacity: a }}>
            <div
              style={{
                width: CELL,
                height: CELL,
                borderRadius: 14,
                border: `4px solid ${border}`,
                background: h ? `${h}22` : "transparent",
                color: h ?? mix(colors.fg, colors.muted, d),
                opacity: 1 - 0.55 * d,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                fontSize: 40,
                fontWeight: 700,
                boxShadow: h ? `0 0 28px ${h}88` : "none",
              }}
            >
              {v}
            </div>
            {showIndices && (
              <div style={{ textAlign: "center", marginTop: 6, fontSize: 20, color: colors.muted, fontFamily: mono }}>{i}</div>
            )}
          </div>
        );
      })}
      {pointers.map((p) => (
        <div
          key={p.label}
          style={{
            position: "absolute",
            top: CELL + 44,
            left: cellCenter(p.at) - 130,
            width: 260,
            textAlign: "center",
            color: p.color,
            opacity: p.opacity ?? 1,
            fontFamily: mono,
            fontWeight: 700,
          }}
        >
          <div style={{ fontSize: 40, lineHeight: 1 }}>▲</div>
          <div style={{ fontSize: 30 }}>{p.label}</div>
        </div>
      ))}
    </div>
  );
};

/** Linear blend between two #rrggbb colors. */
export const mix = (a: string, b: string, t: number) => {
  const pa = parseInt(a.slice(1), 16);
  const pb = parseInt(b.slice(1), 16);
  const ch = (shift: number) => Math.round(((pa >> shift) & 255) * (1 - t) + ((pb >> shift) & 255) * t);
  return `#${((1 << 24) | (ch(16) << 16) | (ch(8) << 8) | ch(0)).toString(16).slice(1)}`;
};

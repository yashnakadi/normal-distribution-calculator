import React, { useMemo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { normalPDF } from "./stats-utils";

interface NormalCurveChartProps {
  title?: string;
  shadedRegion?: "left" | "right" | "between" | "none";
  zLeft?: number;
  zRight?: number;
  height?: number;
  color?: string;
}

export function NormalCurveChart({
  title,
  shadedRegion = "none",
  zLeft = -2,
  zRight = 2,
  height = 220,
  color = "#3b82f6",
}: NormalCurveChartProps) {
  const data = useMemo(() => {
    const points: {
      x: number;
      y: number;
      shaded: number | null;
    }[] = [];
    const numPoints = 300;
    const step = 8 / numPoints;

    for (let i = 0; i <= numPoints; i++) {
      const x = -4 + i * step;
      const y = normalPDF(x);
      let shaded: number | null = null;

      if (shadedRegion === "left" && x <= zLeft) {
        shaded = y;
      } else if (shadedRegion === "right" && x >= zRight) {
        shaded = y;
      } else if (shadedRegion === "between" && x >= zLeft && x <= zRight) {
        shaded = y;
      }

      points.push({
        x: parseFloat(x.toFixed(4)),
        y,
        shaded,
      });
    }
    return points;
  }, [shadedRegion, zLeft, zRight]);

  const referenceLines = useMemo(() => {
    const lines: number[] = [];
    if (shadedRegion === "left" || shadedRegion === "between") {
      if (zLeft > -4 && zLeft < 4) lines.push(zLeft);
    }
    if (shadedRegion === "right" || shadedRegion === "between") {
      if (zRight > -4 && zRight < 4) lines.push(zRight);
    }
    return lines;
  }, [shadedRegion, zLeft, zRight]);

  return (
    <div className="w-full">
      {title && (
        <p className="text-center text-muted-foreground mb-2 text-[0.8rem]">
          {title}
        </p>
      )}
      <ResponsiveContainer width="100%" height={height}>
        <AreaChart data={data} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
          <defs>
            <linearGradient id={`shade-${color.replace('#','')}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.6} />
              <stop offset="100%" stopColor={color} stopOpacity={0.15} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.5} />
          <XAxis
            dataKey="x"
            type="number"
            domain={[-4, 4]}
            ticks={[-4, -3, -2, -1, 0, 1, 2, 3, 4]}
            tick={{ fontSize: 11, fill: "#6b7280" }}
            axisLine={{ stroke: "#d1d5db" }}
          />
          <YAxis hide />
          <Tooltip
            formatter={(value: number) => value.toFixed(4)}
            labelFormatter={(label: number) => `z = ${label.toFixed(2)}`}
            contentStyle={{
              backgroundColor: "rgba(255,255,255,0.95)",
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
              fontSize: "12px",
            }}
          />
          <Area
            type="monotone"
            dataKey="y"
            stroke="#94a3b8"
            strokeWidth={2}
            fill="none"
            dot={false}
            isAnimationActive={false}
          />
          <Area
            type="monotone"
            dataKey="shaded"
            stroke="none"
            fill={`url(#shade-${color.replace('#','')})`}
            dot={false}
            isAnimationActive={false}
            connectNulls={false}
          />
          {referenceLines.map((z, i) => (
            <ReferenceLine
              key={i}
              x={z}
              stroke={color}
              strokeDasharray="4 4"
              strokeWidth={1.5}
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

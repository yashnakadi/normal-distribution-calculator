import React, { useState, useMemo } from "react";
import { SectionCard } from "./SectionCard";
import { BarChart3, Info } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { normalPDF, fmt } from "./stats-utils";

export function SamplingDistribution() {
  const XBar = <span style={{ textDecoration: "overline", display: "inline-block", marginLeft: "1px", verticalAlign: "baseline" }}>X</span>;
  const [sampleN, setSampleN] = useState("4");
  const [sigma, setSigma] = useState("5");

  const result = useMemo(() => {
    const n = parseFloat(sampleN);
    const s = parseFloat(sigma);
    if (isNaN(n) || n <= 0 || isNaN(s) || s <= 0) return null;
    return {
      sdXBar: s / Math.sqrt(n),
    };
  }, [sampleN, sigma]);

  const chartData = useMemo(() => {
    if (!result) return [];
    const sdOrig = parseFloat(sigma);
    const sdSamp = result.sdXBar;
    const points: { x: number; original: number; sampling: number }[] = [];
    for (let i = 0; i <= 200; i++) {
      const x = -4 + (8 * i) / 200;
      points.push({
        x: parseFloat(x.toFixed(3)),
        original: normalPDF(x),
        sampling: normalPDF(x * (sdSamp / sdOrig)) * (sdOrig / sdSamp),
      });
    }
    return points;
  }, [result, sigma]);

  return (
    <SectionCard
      title={
        <span>
          Sampling Distribution of {XBar}
        </span>
      }
      subtitle="Standard deviation of the sample mean: σ / √n"
      icon={<BarChart3 size={16} />}
      accentColor="bg-teal-500"
    >
      {/* Explanation */}
      <div className="mb-8 p-4 rounded-xl bg-teal-50 dark:bg-teal-950/40 border border-teal-100 dark:border-teal-900 flex gap-3">
        <Info size={18} className="text-teal-500 shrink-0 mt-0.5" />
        <div className="text-[0.8rem] text-teal-800 dark:text-teal-200 space-y-1">
          <p>
            When you take a <strong>sample of size n</strong> from a population, the sample mean {XBar} has a
            <strong> smaller spread</strong> than the original population.
          </p>
          <p className="text-teal-600 dark:text-teal-400">
            Enter the <strong>population standard deviation (σ)</strong> and <strong>sample size (n)</strong>.
            The result is σ<sub style={{ fontSize: "0.75em", lineHeight: 0 }}>{XBar}</sub> = σ / √n.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Spreadsheet-style calculator */}
        <div className="space-y-6">
          {/* Table */}
          <div className="rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
            {/* Header row */}
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-slate-100 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
                  <th className="text-left text-[0.78rem] text-muted-foreground py-2.5 px-5 w-[35%]"></th>
                  <th className="text-center text-[0.78rem] text-muted-foreground py-2.5 px-4 w-[45%]">Fill in</th>
                  <th className="text-center text-[0.78rem] text-muted-foreground py-2.5 px-4 w-[20%]">Formula</th>
                </tr>
              </thead>
              <tbody>
                {/* Sample n row */}
                <tr className="border-b border-slate-100 dark:border-slate-700">
                  <td className="py-4 px-5">
                    <span className="text-[0.9rem] text-slate-700 dark:text-slate-200">Sample n =</span>
                  </td>
                  <td className="py-4 px-4">
                    <input
                      type="number"
                      step="any"
                      value={sampleN}
                      onChange={(e) => setSampleN(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border-[3px] border-yellow-400 bg-yellow-50 dark:bg-yellow-900/30 text-slate-700 dark:text-slate-200 text-center text-[0.95rem] focus:outline-none focus:ring-2 focus:ring-yellow-400/40 focus:border-yellow-500 transition-all"
                    />
                  </td>
                  <td className="py-4 px-4 text-center">
                    <span className="text-[0.85rem] text-muted-foreground">—</span>
                  </td>
                </tr>

                {/* SD σ row */}
                <tr className="border-b-2 border-slate-200 dark:border-slate-700">
                  <td className="py-4 px-5">
                    <span className="text-[0.9rem] text-slate-700 dark:text-slate-200">SD: &nbsp;σ =</span>
                  </td>
                  <td className="py-4 px-4">
                    <input
                      type="number"
                      step="any"
                      value={sigma}
                      onChange={(e) => setSigma(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border-[3px] border-yellow-400 bg-yellow-50 dark:bg-yellow-900/30 text-slate-700 dark:text-slate-200 text-center text-[0.95rem] focus:outline-none focus:ring-2 focus:ring-yellow-400/40 focus:border-yellow-500 transition-all"
                    />
                  </td>
                  <td className="py-4 px-4 text-center">
                    <span className="text-[0.85rem] text-muted-foreground">—</span>
                  </td>
                </tr>

                {/* Answer sub-header */}
                <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-700">
                  <td className="py-2 px-5"></td>
                  <td className="py-2 px-4 text-center">
                    <span className="text-[0.78rem] text-muted-foreground">Answer</span>
                  </td>
                  <td className="py-2 px-4"></td>
                </tr>

                {/* SD of X̄ result row */}
                <tr className="bg-teal-50/30 dark:bg-teal-950/30">
                  <td className="py-4 px-5">
                    <span className="text-[0.9rem] text-slate-700 dark:text-slate-200">SD of {XBar} =</span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="w-full px-3 py-2.5 rounded-lg border border-teal-200 dark:border-teal-800 bg-teal-50 dark:bg-teal-900/40 text-teal-700 dark:text-teal-300 text-center text-[0.95rem] tabular-nums">
                      {result ? fmt(result.sdXBar) : "—"}
                    </div>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <span className="text-[0.95rem] text-slate-600 dark:text-slate-400 whitespace-nowrap">σ / √n</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Computation breakdown */}
          {result && (
            <div className="p-5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
              <div className="text-[0.82rem] text-muted-foreground mb-3">Computation</div>
              <div className="text-[0.92rem] text-slate-700 dark:text-slate-200 tabular-nums space-y-1.5">
                <p>
                  σ<sub style={{ fontSize: "0.75em", lineHeight: 0 }}>{XBar}</sub> = σ / √n
                </p>
                <p>
                  σ<sub style={{ fontSize: "0.75em", lineHeight: 0 }}>{XBar}</sub> = {parseFloat(sigma)} / √{parseFloat(sampleN)}
                  {" = "}
                  {parseFloat(sigma)} / {fmt(Math.sqrt(parseFloat(sampleN)))}
                </p>
                <p className="text-teal-600 dark:text-teal-400">
                  <strong>σ<sub style={{ fontSize: "0.75em", lineHeight: 0 }}>{XBar}</sub> = {fmt(result.sdXBar)}</strong>
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Chart */}
        <div className="flex flex-col">
          <p className="text-[0.82rem] text-muted-foreground text-center mb-3 tracking-wide uppercase">
            Population vs Sampling Distribution
          </p>
          <div className="flex-1 min-h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                <defs>
                  <linearGradient id="shadeTeal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#14b8a6" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#14b8a6" stopOpacity={0.05} />
                  </linearGradient>
                  <linearGradient id="shadeGray" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#94a3b8" stopOpacity={0.2} />
                    <stop offset="100%" stopColor="#94a3b8" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.5} />
                <XAxis
                  dataKey="x"
                  type="number"
                  domain={[-4, 4]}
                  ticks={[-4, -2, 0, 2, 4]}
                  tick={{ fontSize: 11, fill: "#6b7280" }}
                />
                <YAxis hide />
                <Area
                  type="monotone"
                  dataKey="original"
                  stroke="#94a3b8"
                  strokeWidth={1.5}
                  fill="url(#shadeGray)"
                  dot={false}
                  isAnimationActive={false}
                  name="Population (σ)"
                />
                <Area
                  type="monotone"
                  dataKey="sampling"
                  stroke="#14b8a6"
                  strokeWidth={2}
                  fill="url(#shadeTeal)"
                  dot={false}
                  isAnimationActive={false}
                  name="Sampling (σ/√n)"
                />
                <ReferenceLine x={0} stroke="#d1d5db" strokeDasharray="4 4" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-6 mt-3">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-slate-400" />
              <span className="text-[0.75rem] text-muted-foreground">Population (σ)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-teal-500" />
              <span className="text-[0.75rem] text-muted-foreground">Sampling Dist. (σ/√n)</span>
            </div>
          </div>
        </div>
      </div>
    </SectionCard>
  );
}
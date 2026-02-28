import React, { useState, useMemo } from "react";
import { SectionCard } from "./SectionCard";
import { Combine, Info } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Cell,
  Tooltip,
  LabelList,
} from "recharts";

import { fmt } from "./stats-utils";

function XBar() {
  return <span style={{ textDecoration: "overline" }}>X</span>;
}
function YBar() {
  return <span style={{ textDecoration: "overline" }}>Y</span>;
}

export function LinearCombination() {
  const [muX, setMuX] = useState("20");
  const [muY, setMuY] = useState("20");
  const [sigmaX, setSigmaX] = useState("4");
  const [sigmaY, setSigmaY] = useState("4");
  const [nX, setNX] = useState("10");
  const [nY, setNY] = useState("15");
  const [aX, setAX] = useState("1");
  const [bY, setBY] = useState("1");

  const results = useMemo(() => {
    const mx = parseFloat(muX);
    const my = parseFloat(muY);
    const sx = parseFloat(sigmaX);
    const sy = parseFloat(sigmaY);
    const nx = parseFloat(nX);
    const ny = parseFloat(nY);
    const a = parseFloat(aX);
    const b = parseFloat(bY);

    if (
      [mx, my, sx, sy, nx, ny, a, b].some(isNaN) ||
      nx <= 0 ||
      ny <= 0 ||
      sx <= 0 ||
      sy <= 0
    ) {
      return null;
    }

    const muU = a * mx + b * my;
    const varCompX = (a * a * sx * sx) / nx;
    const varCompY = (b * b * sy * sy) / ny;
    const varU = varCompX + varCompY;
    const sigmaU = Math.sqrt(varU);

    return { muU, sigmaU, varCompX, varCompY, varU };
  }, [muX, muY, sigmaX, sigmaY, nX, nY, aX, bY]);

  const chartData = useMemo(() => {
    if (!results) return [];
    const a = parseFloat(aX);
    const b = parseFloat(bY);
    const sx = parseFloat(sigmaX);
    const sy = parseFloat(sigmaY);
    const nx = parseFloat(nX);
    const ny = parseFloat(nY);

    return [
      {
        name: "a·σ_X / √n_X",
        value: (Math.abs(a) * sx) / Math.sqrt(nx),
        color: "#6366f1",
      },
      {
        name: "b·σ_Y / √n_Y",
        value: (Math.abs(b) * sy) / Math.sqrt(ny),
        color: "#a855f7",
      },
      { name: "σ_U", value: results.sigmaU, color: "#ec4899" },
    ];
  }, [results, aX, bY, sigmaX, sigmaY, nX, nY]);

  const inputCell =
    "w-full px-4 py-3 rounded-xl border-[3px] border-yellow-400 bg-yellow-50 dark:bg-yellow-900/30 text-slate-700 dark:text-slate-200 text-center text-[0.95rem] focus:outline-none focus:ring-2 focus:ring-yellow-400/40 focus:border-yellow-500 transition-all";

  return (
    <SectionCard
      title={
        <span>
          Linear Combination U = a·<XBar /> + b·<YBar />
        </span>
      }
      subtitle="Calculate mean and standard deviation of a linear combination"
      icon={<Combine size={16} />}
      accentColor="bg-pink-500"
    >
      {/* Info Banner */}
      <div className="mb-8 p-4 rounded-xl bg-pink-50 dark:bg-pink-950/40 border border-pink-100 dark:border-pink-900 flex gap-3">
        <Info size={18} className="text-pink-500 shrink-0 mt-0.5" />
        <div className="text-[0.8rem] text-pink-800 dark:text-pink-200 space-y-1">
          <p>
            Combine two <strong>independent sample means</strong> <XBar /> and{" "}
            <YBar /> into a single variable U = a·<XBar /> + b·<YBar />.
          </p>
          <p className="text-pink-600 dark:text-pink-400">
            Enter the <strong>population means</strong>,{" "}
            <strong>standard deviations</strong>,
            <strong> sample sizes</strong>, and{" "}
            <strong>coefficients a, b</strong>. The calculator finds μ
            <sub>U</sub> and σ<sub>U</sub>.
          </p>
        </div>
      </div>

      {/* Main: Table + Chart side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Spreadsheet-style table */}
        <div className="rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-slate-100 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
                <th className="text-left text-[0.78rem] text-muted-foreground py-2.5 px-5 w-[35%]"></th>
                <th className="text-center text-[0.78rem] text-muted-foreground py-2.5 px-4 w-[30%]">
                  Population X
                </th>
                <th className="text-center text-[0.78rem] text-muted-foreground py-2.5 px-4 w-[30%]">
                  Population Y
                </th>
              </tr>
            </thead>
            <tbody>
              {/* Mean row */}
              <tr className="border-b border-slate-100 dark:border-slate-700">
                <td className="py-4 px-5">
                  <span className="text-[0.9rem] text-slate-700 dark:text-slate-200">
                    Mean (μ) =
                  </span>
                </td>
                <td className="py-4 px-4">
                  <input
                    type="number"
                    step="any"
                    value={muX}
                    onChange={(e) => setMuX(e.target.value)}
                    className={inputCell}
                  />
                </td>
                <td className="py-4 px-4">
                  <input
                    type="number"
                    step="any"
                    value={muY}
                    onChange={(e) => setMuY(e.target.value)}
                    className={inputCell}
                  />
                </td>
              </tr>

              {/* SD row */}
              <tr className="border-b border-slate-100 dark:border-slate-700">
                <td className="py-4 px-5">
                  <span className="text-[0.9rem] text-slate-700 dark:text-slate-200">
                    SD (σ) =
                  </span>
                </td>
                <td className="py-4 px-4">
                  <input
                    type="number"
                    step="any"
                    value={sigmaX}
                    onChange={(e) => setSigmaX(e.target.value)}
                    className={inputCell}
                  />
                </td>
                <td className="py-4 px-4">
                  <input
                    type="number"
                    step="any"
                    value={sigmaY}
                    onChange={(e) => setSigmaY(e.target.value)}
                    className={inputCell}
                  />
                </td>
              </tr>

              {/* Sample size row */}
              <tr className="border-b border-slate-100 dark:border-slate-700">
                <td className="py-4 px-5">
                  <span className="text-[0.9rem] text-slate-700 dark:text-slate-200">
                    Sample size (n) =
                  </span>
                </td>
                <td className="py-4 px-4">
                  <input
                    type="number"
                    step="any"
                    value={nX}
                    onChange={(e) => setNX(e.target.value)}
                    className={inputCell}
                  />
                </td>
                <td className="py-4 px-4">
                  <input
                    type="number"
                    step="any"
                    value={nY}
                    onChange={(e) => setNY(e.target.value)}
                    className={inputCell}
                  />
                </td>
              </tr>

              {/* Coefficients row — a under Pop X, b under Pop Y */}
              <tr className="border-b-2 border-slate-200 dark:border-slate-700">
                <td className="py-4 px-5">
                  <span className="text-[0.9rem] text-slate-700 dark:text-slate-200">
                    Coefficients (a, b) =
                  </span>
                </td>
                <td className="py-4 px-4">
                  <input
                    type="number"
                    step="any"
                    value={aX}
                    onChange={(e) => setAX(e.target.value)}
                    className={inputCell}
                    placeholder="a"
                  />
                </td>
                <td className="py-4 px-4">
                  <input
                    type="number"
                    step="any"
                    value={bY}
                    onChange={(e) => setBY(e.target.value)}
                    className={inputCell}
                    placeholder="b"
                  />
                </td>
              </tr>

              {/* Answer sub-header */}
              <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-700">
                <td className="py-2 px-5" colSpan={4}>
                  <span className="text-[0.78rem] text-muted-foreground">
                    Answer
                  </span>
                </td>
              </tr>

              {/* μ_U result row */}
              <tr className="bg-pink-50/40 dark:bg-pink-950/30 border-b border-slate-100 dark:border-slate-700">
                <td className="py-4 px-5">
                  <span className="text-[0.9rem] text-slate-700 dark:text-slate-200">
                    μ<sub>U</sub> =
                  </span>
                </td>
                <td className="py-4 px-4" colSpan={2}>
                  <div className="w-full px-3 py-2.5 rounded-lg border border-pink-200 dark:border-pink-800 bg-pink-50 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300 text-center text-[0.95rem] tabular-nums">
                    {results ? fmt(results.muU) : "—"}
                  </div>
                </td>
              </tr>

              {/* σ_U result row */}
              <tr className="bg-pink-50/40 dark:bg-pink-950/30">
                <td className="py-4 px-5">
                  <span className="text-[0.9rem] text-slate-700 dark:text-slate-200">
                    σ<sub>U</sub> =
                  </span>
                </td>
                <td className="py-4 px-4" colSpan={2}>
                  <div className="w-full px-3 py-2.5 rounded-lg border border-pink-200 dark:border-pink-800 bg-pink-50 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300 text-center text-[0.95rem] tabular-nums">
                    {results ? fmt(results.sigmaU) : "—"}
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Chart */}
        <div className="flex flex-col">
          <p className="text-[0.82rem] text-muted-foreground text-center mb-3 tracking-wide uppercase">
            Standard Deviation Components
          </p>
          <div className="flex-1 min-h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 20, right: 10, left: 10, bottom: 5 }}
                barCategoryGap="25%"
              >
                <defs>
                  <linearGradient id="gradX" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#818cf8" stopOpacity={0.9} />
                    <stop offset="100%" stopColor="#6366f1" stopOpacity={0.7} />
                  </linearGradient>
                  <linearGradient id="gradY" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#c084fc" stopOpacity={0.9} />
                    <stop offset="100%" stopColor="#a855f7" stopOpacity={0.7} />
                  </linearGradient>
                  <linearGradient id="gradU" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f472b6" stopOpacity={0.9} />
                    <stop offset="100%" stopColor="#ec4899" stopOpacity={0.7} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#e5e7eb"
                  opacity={0.5}
                />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 11, fill: "#6b7280" }}
                  axisLine={{ stroke: "#e2e8f0" }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "#6b7280" }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  formatter={(value: number) => value.toFixed(6)}
                  contentStyle={{
                    backgroundColor: "rgba(255,255,255,0.95)",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                />
                <Bar dataKey="value" radius={[6, 6, 0, 0]} barSize={56}>
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={`url(#grad${index === 0 ? "X" : index === 1 ? "Y" : "U"})`}
                    />
                  ))}
                  <LabelList
                    dataKey="value"
                    position="top"
                    formatter={(v: number) => v.toFixed(3)}
                    style={{ fontSize: 11, fill: "#6b7280" }}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-6 mt-3">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-indigo-500" />
              <span className="text-[0.75rem] text-muted-foreground">
                X component
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-purple-500" />
              <span className="text-[0.75rem] text-muted-foreground">
                Y component
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-pink-500" />
              <span className="text-[0.75rem] text-muted-foreground">
                σ<sub>U</sub> (combined)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Computation breakdown */}
      {results && (
        <div className="mt-8 p-5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
          <div className="text-[0.82rem] text-muted-foreground mb-3">
            Computation
          </div>
          <div className="text-[0.92rem] text-slate-700 dark:text-slate-200 tabular-nums space-y-1.5">
            <p>
              <span className="inline-block w-3 h-3 rounded-sm bg-indigo-500 mr-2 align-middle" />
              Var<sub>X</sub> = a²·σ²<sub>X</sub> / n<sub>X</sub> ={" "}
              {parseFloat(aX)}²·{parseFloat(sigmaX)}² / {parseFloat(nX)} ={" "}
              <strong>{fmt(results.varCompX)}</strong>
            </p>
            <p>
              <span className="inline-block w-3 h-3 rounded-sm bg-purple-500 mr-2 align-middle" />
              Var<sub>Y</sub> = b²·σ²<sub>Y</sub> / n<sub>Y</sub> ={" "}
              {parseFloat(bY)}²·{parseFloat(sigmaY)}² / {parseFloat(nY)} ={" "}
              <strong>{fmt(results.varCompY)}</strong>
            </p>
            <p>
              <span className="inline-block w-3 h-3 rounded-sm bg-pink-500 mr-2 align-middle" />
              Var<sub>U</sub> = {fmt(results.varCompX)} +{" "}
              {fmt(results.varCompY)} ={" "}
              <strong>{fmt(results.varU)}</strong>
            </p>
            <p className="text-pink-600 dark:text-pink-400">
              <strong>
                σ<sub>U</sub> = √{fmt(results.varU)} ={" "}
                {fmt(results.sigmaU)}
              </strong>
            </p>
          </div>
        </div>
      )}
    </SectionCard>
  );
}
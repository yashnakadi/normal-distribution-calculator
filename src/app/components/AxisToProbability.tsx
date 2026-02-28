import React, { useState, useMemo } from "react";
import { SectionCard } from "./SectionCard";
import { InputField, ResultField } from "./InputField";
import { NormalCurveChart } from "./NormalCurveChart";
import { normalCDF, fmt } from "./stats-utils";
import { ArrowRight, Info } from "lucide-react";

export function AxisToProbability() {
  const [mean, setMean] = useState("60000");
  const [sd, setSd] = useState("4000");
  const [valueA, setValueA] = useState("144.035");
  const [valueB, setValueB] = useState("72000");

  const results = useMemo(() => {
    const mu = parseFloat(mean);
    const sigma = parseFloat(sd);
    const a = parseFloat(valueA);
    const b = parseFloat(valueB);

    if (isNaN(mu) || isNaN(sigma) || sigma <= 0) {
      return null;
    }

    const zA = isNaN(a) ? 0 : (a - mu) / sigma;
    const zB = isNaN(b) ? 0 : (b - mu) / sigma;
    const probLeftA = isNaN(a) ? 0 : normalCDF(zA);
    const probRightB = isNaN(b) ? 0 : 1 - normalCDF(zB);
    const probBetween =
      !isNaN(a) && !isNaN(b) ? normalCDF(zB) - normalCDF(zA) : 0;

    return {
      zA: fmt(zA),
      zB: fmt(zB),
      probLeftA: fmt(probLeftA),
      probRightB: fmt(probRightB),
      probBetween: fmt(probBetween),
      zANum: zA,
      zBNum: zB,
    };
  }, [mean, sd, valueA, valueB]);

  return (
    <SectionCard
      title="X-Values to Probabilities"
      subtitle="Convert axis numbers into associated probabilities"
      icon={<ArrowRight size={16} />}
      accentColor="bg-blue-500"
    >
      {/* How-to explanation */}
      <div className="mb-8 p-4 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900 flex gap-3">
        <Info size={18} className="text-blue-500 shrink-0 mt-0.5" />
        <div className="text-[0.8rem] text-blue-800 dark:text-blue-200 space-y-1">
          <p>
            Enter the <strong>Mean (μ)</strong> and <strong>Standard Deviation (σ)</strong> of your normal distribution,
            then provide two x-axis values <strong>A</strong> and <strong>B</strong> (where A &lt; B).
          </p>
          <p className="text-blue-600 dark:text-blue-400">
            The calculator will find the z-scores and three key probabilities:
            the area to the <strong>left of A</strong>, the area to the <strong>right of B</strong>,
            and the area <strong>between A and B</strong>.
          </p>
        </div>
      </div>

      {/* Input groups side by side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Distribution Parameters */}
        <div className="p-5 rounded-xl bg-slate-50/70 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-4">
          <h3 className="text-[0.82rem] text-muted-foreground tracking-wide uppercase">
            Distribution Parameters
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <InputField
              label="Mean (μ)"
              value={mean}
              onChange={setMean}
              hint="Center of distribution"
            />
            <InputField
              label="Std Dev (σ)"
              value={sd}
              onChange={setSd}
              hint="Spread of distribution"
            />
          </div>
        </div>

        {/* X-axis values */}
        <div className="p-5 rounded-xl bg-slate-50/70 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-4">
          <h3 className="text-[0.82rem] text-muted-foreground tracking-wide uppercase">
            X-Axis Values
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <InputField
              label="Value A (lower bound)"
              value={valueA}
              onChange={setValueA}
              hint="Left boundary on x-axis"
            />
            <InputField
              label="Value B (upper bound)"
              value={valueB}
              onChange={setValueB}
              hint="Right boundary on x-axis"
            />
          </div>
        </div>
      </div>

      {results && (
        <>
          {/* Z-scores */}
          <div className="mb-8 p-5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
            <h3 className="text-[0.82rem] text-muted-foreground tracking-wide uppercase mb-4">
              Standardized Z-Scores
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* z(A) */}
              <div className="flex items-start gap-4 p-4 rounded-lg bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                <div className="w-10 h-10 rounded-lg bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400 flex items-center justify-center text-[0.8rem] shrink-0">
                  z<sub>A</sub>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[0.78rem] text-muted-foreground mb-1">
                    z = (A − μ) / σ
                  </div>
                  <div className="text-[1rem] text-red-600 dark:text-red-400 tabular-nums">
                    {results.zA}
                  </div>
                  <div className="text-[0.72rem] text-muted-foreground mt-1">
                    ({valueA} − {mean}) / {sd}
                  </div>
                </div>
              </div>

              {/* z(B) */}
              <div className="flex items-start gap-4 p-4 rounded-lg bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center text-[0.8rem] shrink-0">
                  z<sub>B</sub>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[0.78rem] text-muted-foreground mb-1">
                    z = (B − μ) / σ
                  </div>
                  <div className="text-[1rem] text-blue-600 dark:text-blue-400 tabular-nums">
                    {results.zB}
                  </div>
                  <div className="text-[0.72rem] text-muted-foreground mt-1">
                    ({valueB} − {mean}) / {sd}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Probability results heading */}
          <h3 className="text-[0.82rem] text-muted-foreground tracking-wide uppercase mb-4">
            Probability Results
          </h3>

          {/* Three probability cards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* P(X < A) */}
            <div className="p-5 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-100 dark:border-red-900 flex flex-col">
              <span className="text-[0.88rem] text-red-700 dark:text-red-400 mb-1">
                Probability Left of A
              </span>
              <p className="text-[0.73rem] text-red-400 dark:text-red-500 mb-3">
                P(X &lt; A) — Area to the <strong>left</strong> of value A
              </p>
              <div className="px-3 py-2.5 rounded-lg bg-white dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 tabular-nums text-[0.95rem] mb-4 text-center">
                {results.probLeftA}
              </div>
              <div className="mt-auto">
                <NormalCurveChart
                  shadedRegion="left"
                  zLeft={Math.max(results.zANum, -4)}
                  height={140}
                  color="#ef4444"
                />
              </div>
            </div>

            {/* P(B < X) */}
            <div className="p-5 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900 flex flex-col">
              <span className="text-[0.88rem] text-blue-700 dark:text-blue-400 mb-1">
                Probability Right of B
              </span>
              <p className="text-[0.73rem] text-blue-400 dark:text-blue-500 mb-3">
                P(B &lt; X) — Area to the <strong>right</strong> of value B
              </p>
              <div className="px-3 py-2.5 rounded-lg bg-white dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 tabular-nums text-[0.95rem] mb-4 text-center">
                {results.probRightB}
              </div>
              <div className="mt-auto">
                <NormalCurveChart
                  shadedRegion="right"
                  zRight={Math.min(results.zBNum, 4)}
                  height={140}
                  color="#3b82f6"
                />
              </div>
            </div>

            {/* P(A < X < B) */}
            <div className="p-5 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900 flex flex-col">
              <span className="text-[0.88rem] text-emerald-700 dark:text-emerald-400 mb-1">
                Probability Between A &amp; B
              </span>
              <p className="text-[0.73rem] text-emerald-400 dark:text-emerald-500 mb-3">
                P(A &lt; X &lt; B) — Area <strong>between</strong> A and B
              </p>
              <div className="px-3 py-2.5 rounded-lg bg-white dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 tabular-nums text-[0.95rem] mb-4 text-center">
                {results.probBetween}
              </div>
              <div className="mt-auto">
                <NormalCurveChart
                  shadedRegion="between"
                  zLeft={Math.max(results.zANum, -4)}
                  zRight={Math.min(results.zBNum, 4)}
                  height={140}
                  color="#10b981"
                />
              </div>
            </div>
          </div>
        </>
      )}
    </SectionCard>
  );
}
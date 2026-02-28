import React, { useState, useMemo } from "react";
import { SectionCard } from "./SectionCard";
import { InputField, ResultField } from "./InputField";
import { NormalCurveChart } from "./NormalCurveChart";
import { inverseNormalCDF, fmt } from "./stats-utils";
import { ArrowLeft, Info } from "lucide-react";

export function ProbabilityToAxis() {
  const [meanStr, setMeanStr] = useState("60000");
  const [sdStr, setSdStr] = useState("4000");

  // Right-sided
  const [alphaRight, setAlphaRight] = useState("0.000025");
  // Left-sided
  const [alphaLeft, setAlphaLeft] = useState("0.02");

  const rightResults = useMemo(() => {
    const alpha = parseFloat(alphaRight);
    const mu = parseFloat(meanStr);
    const sigma = parseFloat(sdStr);
    if (isNaN(alpha) || alpha <= 0 || alpha >= 1 || isNaN(mu) || isNaN(sigma) || sigma <= 0)
      return null;

    // Right-sided: P(X > x_alpha) = alpha => x_alpha = mu + z * sigma where z = inverseNormalCDF(1 - alpha)
    const zAlpha = inverseNormalCDF(1 - alpha);
    const xAlpha = mu + zAlpha * sigma;
    return { zAlpha: fmt(zAlpha), xAlpha: fmt(xAlpha), zNum: zAlpha };
  }, [alphaRight, meanStr, sdStr]);

  const leftResults = useMemo(() => {
    const alpha = parseFloat(alphaLeft);
    const mu = parseFloat(meanStr);
    const sigma = parseFloat(sdStr);
    if (isNaN(alpha) || alpha <= 0 || alpha >= 1 || isNaN(mu) || isNaN(sigma) || sigma <= 0)
      return null;

    // Left-sided: P(X < x_{1-alpha}) = alpha => z = inverseNormalCDF(alpha)
    const z1Alpha = inverseNormalCDF(alpha);
    const x1Alpha = mu + z1Alpha * sigma;
    return { z1Alpha: fmt(z1Alpha), x1Alpha: fmt(x1Alpha), zNum: z1Alpha };
  }, [alphaLeft, meanStr, sdStr]);

  return (
    <SectionCard
      title="Probabilities to X-Values"
      subtitle="Convert probabilities into associated axis numbers"
      icon={<ArrowLeft size={16} />}
      accentColor="bg-violet-500"
    >
      <div className="space-y-6">
        {/* Top explanation */}
        <div className="p-4 rounded-xl bg-violet-50 dark:bg-violet-950/40 border border-violet-100 dark:border-violet-900 flex gap-3">
          <Info size={18} className="text-violet-500 shrink-0 mt-0.5" />
          <div className="text-[0.8rem] text-violet-800 dark:text-violet-200 space-y-1">
            <p>
              Given a <strong>probability (α)</strong>, find the corresponding x-axis value on the normal distribution.
              Enter the <strong>Mean (μ)</strong> and <strong>Standard Deviation (σ)</strong> first.
            </p>
            <p className="text-violet-600 dark:text-violet-400">
              <strong>Right-sided:</strong> finds x such that P(X &gt; x) = α &nbsp;|&nbsp;
              <strong>Left-sided:</strong> finds x such that P(X &lt; x) = α
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <InputField label="Mean (μ)" value={meanStr} onChange={setMeanStr} />
          <InputField label="Std Dev (σ)" value={sdStr} onChange={setSdStr} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Right-sided */}
          <div className="p-5 rounded-xl bg-orange-50 dark:bg-orange-950/30 border border-orange-100 dark:border-orange-900 space-y-5">
            <div>
              <h3 className="text-[0.9rem] text-orange-700 dark:text-orange-400">Right-Sided Axis Number</h3>
              <p className="text-[0.72rem] text-orange-500 dark:text-orange-400 mt-1">
                Enter α = the probability in the <strong>right tail</strong>. Finds x where P(X &gt; x) = α.
              </p>
            </div>
            <div className="flex items-center gap-4">
              <label className="text-[0.82rem] text-muted-foreground whitespace-nowrap shrink-0">
                α (Prob. to RIGHT)
              </label>
              <input
                type="number"
                step="any"
                value={alphaRight}
                onChange={(e) => setAlphaRight(e.target.value)}
                className="flex-1 min-w-0 px-4 py-3 rounded-xl border-[3px] border-yellow-400 bg-yellow-50 dark:bg-yellow-900/30 text-slate-700 dark:text-slate-200 text-center text-[0.95rem] focus:outline-none focus:ring-2 focus:ring-yellow-400/40 focus:border-yellow-500 transition-all"
              />
            </div>
            {rightResults && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <span className="text-[0.75rem] text-orange-500 dark:text-orange-400">Z-Score (z<sub>α</sub>)</span>
                    <div className="px-3 py-2.5 rounded-lg bg-white dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 text-orange-600 dark:text-orange-400 tabular-nums text-[0.9rem] text-center">
                      {rightResults.zAlpha}
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <span className="text-[0.75rem] text-orange-500 dark:text-orange-400">X-Value (x<sub>α</sub>)</span>
                    <div className="px-3 py-2.5 rounded-lg bg-white dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 text-orange-600 dark:text-orange-400 tabular-nums text-[0.9rem] text-center">
                      {rightResults.xAlpha}
                    </div>
                  </div>
                </div>
                <NormalCurveChart
                  shadedRegion="right"
                  zRight={Math.min(rightResults.zNum, 4)}
                  height={160}
                  color="#f97316"
                />
              </>
            )}
          </div>

          {/* Left-sided */}
          <div className="p-5 rounded-xl bg-purple-50 dark:bg-purple-950/30 border border-purple-100 dark:border-purple-900 space-y-5">
            <div>
              <h3 className="text-[0.9rem] text-purple-700 dark:text-purple-400">Left-Sided Axis Number</h3>
              <p className="text-[0.72rem] text-purple-500 dark:text-purple-400 mt-1">
                Enter α = the probability in the <strong>left tail</strong>. Finds x where P(X &lt; x) = α.
              </p>
            </div>
            <div className="flex items-center gap-4">
              <label className="text-[0.82rem] text-muted-foreground whitespace-nowrap shrink-0">
                α (Prob. to LEFT)
              </label>
              <input
                type="number"
                step="any"
                value={alphaLeft}
                onChange={(e) => setAlphaLeft(e.target.value)}
                className="flex-1 min-w-0 px-4 py-3 rounded-xl border-[3px] border-yellow-400 bg-yellow-50 dark:bg-yellow-900/30 text-slate-700 dark:text-slate-200 text-center text-[0.95rem] focus:outline-none focus:ring-2 focus:ring-yellow-400/40 focus:border-yellow-500 transition-all"
              />
            </div>
            {leftResults && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <span className="text-[0.75rem] text-purple-500 dark:text-purple-400">Z-Score (z<sub>1−α</sub>)</span>
                    <div className="px-3 py-2.5 rounded-lg bg-white dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 text-purple-600 dark:text-purple-400 tabular-nums text-[0.9rem] text-center">
                      {leftResults.z1Alpha}
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <span className="text-[0.75rem] text-purple-500 dark:text-purple-400">X-Value (x<sub>1−α</sub>)</span>
                    <div className="px-3 py-2.5 rounded-lg bg-white dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 text-purple-600 dark:text-purple-400 tabular-nums text-[0.9rem] text-center">
                      {leftResults.x1Alpha}
                    </div>
                  </div>
                </div>
                <NormalCurveChart
                  shadedRegion="left"
                  zLeft={Math.max(leftResults.zNum, -4)}
                  height={160}
                  color="#a855f7"
                />
              </>
            )}
          </div>
        </div>
      </div>
    </SectionCard>
  );
}
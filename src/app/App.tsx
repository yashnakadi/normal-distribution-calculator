import { AxisToProbability } from "./components/AxisToProbability";
import { ProbabilityToAxis } from "./components/ProbabilityToAxis";
import { SamplingDistribution } from "./components/SamplingDistribution";
import { LinearCombination } from "./components/LinearCombination";
import { SettingsDropdown } from "./components/SettingsDropdown";
import { Activity } from "lucide-react";
import React from "react";

export default function App() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-violet-500 rounded-xl flex items-center justify-center text-white">
            <Activity size={20} />
          </div>
          <div>
            <h1 className="text-[1.25rem]">Normal Distribution Calculator</h1>
            <p className="text-[0.78rem] text-muted-foreground">
              Interactive probability and statistics toolkit
            </p>
          </div>
          <div className="ml-auto">
            <SettingsDropdown />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Quick summary cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <QuickCard
            label="Sampling Dist."
            description="σ / √n"
            color="bg-teal-500"
            href="#sampling-distribution"
          />
          <QuickCard
            label="X → Probability"
            description="Z-scores & areas"
            color="bg-blue-500"
            href="#x-to-probability"
          />
          <QuickCard
            label="Probability → X"
            description="Inverse normal"
            color="bg-violet-500"
            href="#probability-to-x"
          />
          <QuickCard
            label="Linear Combo"
            description={<>U = a<span style={{ textDecoration: "overline" }}>X</span> + b<span style={{ textDecoration: "overline" }}>Y</span></>}
            color="bg-pink-500"
            href="#linear-combination"
          />
        </div>

        <div id="sampling-distribution" className="scroll-mt-24">
          <SamplingDistribution />
        </div>
        <div id="x-to-probability" className="scroll-mt-24">
          <AxisToProbability />
        </div>
        <div id="probability-to-x" className="scroll-mt-24">
          <ProbabilityToAxis />
        </div>
        <div id="linear-combination" className="scroll-mt-24">
          <LinearCombination />
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-[0.78rem] text-muted-foreground">
          Normal Distribution Calculator — Built for statistics students and professionals
        </div>
      </footer>
    </div>
  );
}

function QuickCard({
  label,
  description,
  color,
  href,
}: {
  label: string;
  description: React.ReactNode;
  color: string;
  href: string;
}) {
  return (
    <a
      href={href}
      onClick={(e) => {
        e.preventDefault();
        document.querySelector(href)?.scrollIntoView({ behavior: "smooth", block: "start" });
      }}
      className="flex items-center gap-3 p-4 rounded-xl bg-card border border-border hover:shadow-md hover:border-slate-300 dark:hover:border-slate-600 transition-all cursor-pointer"
    >
      <div
        className={`w-2 h-10 rounded-full ${color}`}
      />
      <div>
        <p className="text-[0.85rem]">{label}</p>
        <p className="text-[0.75rem] text-muted-foreground">{description}</p>
      </div>
    </a>
  );
}
import React from "react";

interface InputFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  hint?: string;
  className?: string;
  labelClassName?: string;
}

export function InputField({
  label,
  value,
  onChange,
  hint,
  className = "",
  labelClassName = "",
}: InputFieldProps) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <label className={`text-[0.8rem] text-muted-foreground whitespace-nowrap ${labelClassName}`}>
        {label}
      </label>
      <input
        type="number"
        step="any"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-3 rounded-xl border-[3px] border-yellow-400 bg-yellow-50 dark:bg-yellow-900/30 text-slate-700 dark:text-slate-200 text-center text-[0.95rem] focus:outline-none focus:ring-2 focus:ring-yellow-400/40 focus:border-yellow-500 transition-all"
      />
      {hint && (
        <span className="text-[0.7rem] text-muted-foreground/70">{hint}</span>
      )}
    </div>
  );
}

interface ResultFieldProps {
  label: string;
  value: string | number;
  color?: string;
  className?: string;
}

export function ResultField({
  label,
  value,
  color = "text-foreground",
  className = "",
}: ResultFieldProps) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <label className="text-[0.85rem] text-muted-foreground whitespace-nowrap min-w-fit">
        {label}
      </label>
      <div
        className={`px-3 py-2 rounded-lg bg-primary/5 border border-primary/10 ${color} min-w-[100px] text-[0.9rem] tabular-nums`}
      >
        {value}
      </div>
    </div>
  );
}
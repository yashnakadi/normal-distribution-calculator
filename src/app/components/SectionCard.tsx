import React from "react";

interface SectionCardProps {
  title: React.ReactNode;
  subtitle?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  accentColor?: string;
}

export function SectionCard({
  title,
  subtitle,
  icon,
  children,
  className = "",
  accentColor = "bg-blue-500",
}: SectionCardProps) {
  return (
    <div
      className={`bg-card rounded-2xl border border-border shadow-sm overflow-hidden ${className}`}
    >
      <div className="px-6 py-4 border-b border-border flex items-center gap-3">
        {icon && (
          <div className={`w-8 h-8 ${accentColor} rounded-lg flex items-center justify-center text-white`}>
            {icon}
          </div>
        )}
        <div>
          <h2 className="text-[1rem]">{title}</h2>
          {subtitle && (
            <p className="text-[0.78rem] text-muted-foreground">{subtitle}</p>
          )}
        </div>
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}
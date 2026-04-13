// src/components/UIComponents.js
import React from "react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

// ─── KPI Card ─────────────────────────────────────────────────────────────────
export function KPICard({ title, value, change, period, icon: Icon, format = "number", color = "indigo" }) {
  const isPositive = change > 0;
  const isNeutral = change === 0;

  const colorMap = {
    indigo: "from-indigo-500 to-indigo-600",
    emerald: "from-emerald-500 to-emerald-600",
    rose: "from-rose-500 to-rose-600",
    amber: "from-amber-500 to-amber-600",
    violet: "from-violet-500 to-violet-600",
    cyan: "from-cyan-500 to-cyan-600",
  };

  const formatValue = (val) => {
    if (format === "currency") {
      if (val >= 1000000) return `₹${(val / 1000000).toFixed(1)}M`;
      if (val >= 1000) return `₹${(val / 1000).toFixed(0)}K`;
      return `₹${val}`;
    }
    if (format === "percent") return `${val}%`;
    if (format === "roas") return `${val}x`;
    if (val >= 1000000) return `${(val / 1000000).toFixed(1)}M`;
    if (val >= 1000) return `${(val / 1000).toFixed(0)}K`;
    return val;
  };

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className={`p-2.5 rounded-xl bg-gradient-to-br ${colorMap[color]} bg-opacity-10`}>
          {Icon && <Icon size={20} className={`text-${color}-600`} />}
        </div>
        <div
          className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${
            isNeutral
              ? "bg-gray-100 text-gray-600"
              : isPositive
              ? "bg-emerald-50 text-emerald-700"
              : "bg-rose-50 text-rose-700"
          }`}
        >
          {isNeutral ? (
            <Minus size={12} />
          ) : isPositive ? (
            <TrendingUp size={12} />
          ) : (
            <TrendingDown size={12} />
          )}
          {Math.abs(change)}%
        </div>
      </div>
      <div className="space-y-1">
        <p className="text-2xl font-bold text-gray-900">{formatValue(value)}</p>
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="text-xs text-gray-400">{period}</p>
      </div>
    </div>
  );
}

// ─── Section Header ───────────────────────────────────────────────────────────
export function SectionHeader({ title, subtitle, action }) {
  return (
    <div className="flex items-start justify-between mb-6">
      <div>
        <h2 className="text-lg font-bold text-gray-900">{title}</h2>
        {subtitle && <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>}
      </div>
      {action && action}
    </div>
  );
}

// ─── Badge ────────────────────────────────────────────────────────────────────
export function Badge({ children, variant = "default" }) {
  const variants = {
    default: "bg-gray-100 text-gray-700",
    active: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    paused: "bg-amber-50 text-amber-700 border border-amber-200",
    completed: "bg-blue-50 text-blue-700 border border-blue-200",
    reel: "bg-violet-50 text-violet-700",
    carousel: "bg-cyan-50 text-cyan-700",
    static: "bg-gray-50 text-gray-600",
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${variants[variant] || variants.default}`}>
      {children}
    </span>
  );
}

// ─── Content Score Bar ────────────────────────────────────────────────────────
export function ContentScoreBar({ score }) {
  const color =
    score >= 85 ? "bg-emerald-500" : score >= 65 ? "bg-amber-500" : "bg-rose-500";
  const textColor =
    score >= 85 ? "text-emerald-700" : score >= 65 ? "text-amber-700" : "text-rose-700";

  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full ${color} transition-all duration-700`}
          style={{ width: `${score}%` }}
        />
      </div>
      <span className={`text-xs font-bold w-7 text-right ${textColor}`}>{score}</span>
    </div>
  );
}

// ─── Loading Skeleton ─────────────────────────────────────────────────────────
export function SkeletonCard({ height = "h-40" }) {
  return (
    <div className={`bg-gray-50 rounded-2xl ${height} animate-pulse`} />
  );
}

// ─── Empty State ──────────────────────────────────────────────────────────────
export function EmptyState({ icon: Icon, title, description }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      {Icon && <Icon size={40} className="text-gray-300 mb-3" />}
      <p className="text-sm font-medium text-gray-600">{title}</p>
      {description && <p className="text-xs text-gray-400 mt-1">{description}</p>}
    </div>
  );
}

// ─── Platform Tag ─────────────────────────────────────────────────────────────
export function PlatformTag({ platform }) {
  const colors = {
    Instagram: "bg-gradient-to-r from-purple-500 to-pink-500 text-white",
    YouTube: "bg-red-500 text-white",
    Google: "bg-blue-500 text-white",
    Facebook: "bg-blue-700 text-white",
  };
  return (
    <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium ${colors[platform] || "bg-gray-200 text-gray-700"}`}>
      {platform}
    </span>
  );
}

// ─── Stat Row ─────────────────────────────────────────────────────────────────
export function StatRow({ label, value, highlight }) {
  return (
    <div className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0">
      <span className="text-xs text-gray-500">{label}</span>
      <span className={`text-xs font-semibold ${highlight ? "text-indigo-600" : "text-gray-800"}`}>
        {value}
      </span>
    </div>
  );
}

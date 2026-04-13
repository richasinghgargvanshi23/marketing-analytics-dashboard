// src/pages/Campaigns.js
import React from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell,
} from "recharts";
import { Target, DollarSign, TrendingUp, MousePointer } from "lucide-react";
import { SectionHeader, Badge, PlatformTag, StatRow, SkeletonCard } from "../components/UIComponents";
import { useCampaigns } from "../hooks/useAnalytics";

const statusVariantMap = {
  Active: "active",
  Paused: "paused",
  Completed: "completed",
};

const ROAS_COLORS = ["#6366f1", "#8b5cf6", "#06b6d4", "#10b981"];

export default function Campaigns() {
  const { campaigns, loading, filter, setFilter } = useCampaigns();

  const filters = ["all", "active", "paused", "completed"];

  const roasChartData = campaigns?.map((c) => ({
    name: c.name.split(" ").slice(0, 2).join(" "),
    roas: c.roas,
    cac: c.cac,
  }));

  const formatCurrency = (val) => {
    if (val >= 1000000) return `₹${(val / 1000000).toFixed(1)}M`;
    if (val >= 1000) return `₹${(val / 1000).toFixed(0)}K`;
    return `₹${val}`;
  };

  return (
    <div className="space-y-8">
      {/* Filter Tabs */}
      <div className="flex gap-2">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-xl text-sm font-medium capitalize transition-colors ${
              filter === f
                ? "bg-indigo-600 text-white shadow-sm"
                : "bg-white text-gray-600 border border-gray-200 hover:border-indigo-200"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* ROAS Chart */}
      {campaigns && (
        <section>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <SectionHeader title="ROAS by Campaign" subtitle="Return on ad spend comparison" />
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={roasChartData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}x`} />
                  <Tooltip formatter={(v) => [`${v}x`, "ROAS"]} />
                  <Bar dataKey="roas" radius={[6, 6, 0, 0]} maxBarSize={40}>
                    {roasChartData.map((_, i) => (
                      <Cell key={i} fill={ROAS_COLORS[i % ROAS_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <SectionHeader title="CAC by Campaign" subtitle="Customer acquisition cost (₹)" />
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={roasChartData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${v}`} />
                  <Tooltip formatter={(v) => [`₹${v}`, "CAC"]} />
                  <Bar dataKey="cac" radius={[6, 6, 0, 0]} maxBarSize={40} fill="#e0e7ff">
                    {roasChartData.map((_, i) => (
                      <Cell key={i} fill={i === roasChartData.findIndex((d) => d.cac === Math.min(...roasChartData.map((x) => x.cac))) ? "#10b981" : "#e0e7ff"} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>
      )}

      {/* Campaign Cards */}
      <section>
        <SectionHeader
          title="All Campaigns"
          subtitle={`${campaigns?.length || 0} campaigns found`}
        />
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => <SkeletonCard key={i} height="h-40" />)}
          </div>
        ) : (
          <div className="space-y-4">
            {campaigns?.map((camp) => (
              <div key={camp.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                {/* Header */}
                <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-gray-900">{camp.name}</h3>
                      <Badge variant={statusVariantMap[camp.status]}>{camp.status}</Badge>
                    </div>
                    <div className="flex items-center gap-1.5">
                      {camp.platform.map((p) => <PlatformTag key={p} platform={p} />)}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-400">{camp.startDate} → {camp.endDate}</p>
                    <p className="text-sm font-semibold text-gray-700 mt-0.5">
                      Budget: {formatCurrency(camp.budget)}
                    </p>
                  </div>
                </div>

                {/* Key Metrics Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
                  {[
                    { label: "Spent", value: formatCurrency(camp.spent), icon: DollarSign, color: "text-gray-700" },
                    { label: "Revenue", value: formatCurrency(camp.revenue), icon: TrendingUp, color: "text-emerald-600" },
                    { label: "CAC", value: `₹${camp.cac}`, icon: Target, color: "text-indigo-600" },
                    { label: "ROAS", value: `${camp.roas}x`, icon: TrendingUp, color: camp.roas >= 5 ? "text-emerald-600" : "text-amber-600" },
                    { label: "Conversions", value: camp.conversions.toLocaleString(), icon: MousePointer, color: "text-gray-700" },
                    { label: "Clicks", value: `${(camp.clicks / 1000).toFixed(1)}K`, icon: MousePointer, color: "text-gray-700" },
                    { label: "CTR", value: `${camp.ctr}%`, icon: Target, color: "text-gray-700" },
                    { label: "Conv. Rate", value: `${camp.conversionRate}%`, icon: TrendingUp, color: "text-gray-700" },
                  ].map((m) => (
                    <div key={m.label} className="bg-gray-50 rounded-xl p-3">
                      <p className="text-xs text-gray-400 mb-1">{m.label}</p>
                      <p className={`text-sm font-bold ${m.color}`}>{m.value}</p>
                    </div>
                  ))}
                </div>

                {/* Spend Progress Bar */}
                <div className="mt-4">
                  <div className="flex justify-between text-xs text-gray-400 mb-1">
                    <span>Budget utilization</span>
                    <span>{Math.round((camp.spent / camp.budget) * 100)}%</span>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-indigo-500 rounded-full transition-all"
                      style={{ width: `${Math.min(100, (camp.spent / camp.budget) * 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

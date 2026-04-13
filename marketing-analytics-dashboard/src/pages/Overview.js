// src/pages/Overview.js
import React from "react";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import {
  DollarSign, TrendingUp, Users, Eye, Target, Zap,
} from "lucide-react";
import { KPICard, SectionHeader, SkeletonCard } from "../components/UIComponents";
import { useOverviewKPIs, useReachVsImpressions, useContentScores } from "../hooks/useAnalytics";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-gray-100 rounded-xl p-3 shadow-lg">
        <p className="text-xs font-semibold text-gray-700 mb-2">{label}</p>
        {payload.map((p) => (
          <div key={p.name} className="flex items-center gap-2 text-xs">
            <div className="w-2 h-2 rounded-full" style={{ background: p.color }} />
            <span className="text-gray-500">{p.name}:</span>
            <span className="font-semibold text-gray-800">
              {p.value >= 1000000
                ? `${(p.value / 1000000).toFixed(1)}M`
                : p.value >= 1000
                ? `${(p.value / 1000).toFixed(0)}K`
                : p.value}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function Overview() {
  const { data: kpis, loading: kpiLoading } = useOverviewKPIs();
  const { data: reachData, loading: reachLoading } = useReachVsImpressions();
  const { data: scoreData, loading: scoreLoading } = useContentScores();

  const kpiConfig = kpis
    ? [
        { title: "Total Revenue", value: kpis.totalRevenue.value, change: kpis.totalRevenue.change, period: kpis.totalRevenue.period, icon: DollarSign, format: "currency", color: "emerald" },
        { title: "Total Ad Spend", value: kpis.totalSpend.value, change: kpis.totalSpend.change, period: kpis.totalSpend.period, icon: Target, format: "currency", color: "indigo" },
        { title: "Avg. CAC", value: kpis.avgCAC.value, change: kpis.avgCAC.change, period: kpis.avgCAC.period, icon: Users, format: "currency", color: "violet" },
        { title: "Avg. ROAS", value: kpis.avgROAS.value, change: kpis.avgROAS.change, period: kpis.avgROAS.period, icon: TrendingUp, format: "roas", color: "cyan" },
        { title: "Total Reach", value: kpis.totalReach.value, change: kpis.totalReach.change, period: kpis.totalReach.period, icon: Eye, format: "number", color: "amber" },
        { title: "Avg. Engagement Rate", value: kpis.avgEngagementRate.value, change: kpis.avgEngagementRate.change, period: kpis.avgEngagementRate.period, icon: Zap, format: "percent", color: "rose" },
      ]
    : [];

  return (
    <div className="space-y-8">
      {/* KPI Grid */}
      <section>
        <SectionHeader
          title="Performance Overview"
          subtitle="Key metrics across all campaigns and platforms"
        />
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {kpiLoading
            ? Array(6).fill(0).map((_, i) => <SkeletonCard key={i} height="h-32" />)
            : kpiConfig.map((kpi) => <KPICard key={kpi.title} {...kpi} />)}
        </div>
      </section>

      {/* Reach vs Impressions */}
      <section>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <SectionHeader
            title="Reach vs Impressions Trend"
            subtitle="Monthly organic reach and total impressions across platforms"
          />
          {reachLoading ? (
            <SkeletonCard height="h-64" />
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={reachData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                <defs>
                  <linearGradient id="reachGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="impressionsGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="engagementsGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} tickFormatter={(v) => v >= 1000000 ? `${(v / 1000000).toFixed(1)}M` : `${(v / 1000).toFixed(0)}K`} />
                <Tooltip content={<CustomTooltip />} />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: "12px", paddingTop: "16px" }} />
                <Area type="monotone" dataKey="impressions" name="Impressions" stroke="#06b6d4" strokeWidth={2} fill="url(#impressionsGrad)" />
                <Area type="monotone" dataKey="reach" name="Reach" stroke="#6366f1" strokeWidth={2} fill="url(#reachGrad)" />
                <Area type="monotone" dataKey="engagements" name="Engagements" stroke="#10b981" strokeWidth={2} fill="url(#engagementsGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </section>

      {/* Content Score by Type */}
      <section>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <SectionHeader
            title="Content Performance Score by Type"
            subtitle="Average content scores and reach contribution by format"
          />
          {scoreLoading ? (
            <SkeletonCard height="h-64" />
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={scoreData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                <XAxis dataKey="category" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                <YAxis yAxisId="score" orientation="left" domain={[0, 100]} tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                <YAxis yAxisId="reach" orientation="right" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`} />
                <Tooltip content={<CustomTooltip />} />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: "12px", paddingTop: "16px" }} />
                <Bar yAxisId="score" dataKey="score" name="Content Score" fill="#6366f1" radius={[6, 6, 0, 0]} maxBarSize={40} />
                <Bar yAxisId="reach" dataKey="reach" name="Total Reach" fill="#e0e7ff" radius={[6, 6, 0, 0]} maxBarSize={40} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </section>
    </div>
  );
}

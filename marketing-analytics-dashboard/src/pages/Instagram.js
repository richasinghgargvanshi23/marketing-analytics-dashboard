// src/pages/Instagram.js
import React, { useState } from "react";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from "recharts";
import { Heart, MessageCircle, Eye, Users, TrendingUp } from "lucide-react";
import {
  SectionHeader, Badge, ContentScoreBar, StatRow, SkeletonCard,
} from "../components/UIComponents";
import {
  useInstagramProfile, useInstagramInsights, useInstagramTopPosts,
} from "../hooks/useAnalytics";
import { instagramMetrics } from "../data/mockData";

const SCORE_COLORS = ["#6366f1", "#8b5cf6", "#06b6d4", "#10b981", "#f59e0b", "#ef4444"];

export default function Instagram() {
  const [activeMetric, setActiveMetric] = useState("followers");
  const { data: profile, loading: profileLoading } = useInstagramProfile();
  const { data: insights, loading: insightsLoading } = useInstagramInsights();
  const { data: posts, loading: postsLoading } = useInstagramTopPosts();

  const metrics = [
    { key: "followers", label: "Followers", color: "#6366f1" },
    { key: "reach", label: "Reach", color: "#06b6d4" },
    { key: "impressions", label: "Impressions", color: "#10b981" },
  ];

  return (
    <div className="space-y-8">
      {/* Profile Summary */}
      <section>
        <div className="bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 rounded-2xl p-6 text-white">
          {profileLoading ? (
            <div className="animate-pulse flex gap-4">
              <div className="w-16 h-16 rounded-full bg-white/20" />
              <div className="space-y-2 flex-1">
                <div className="h-4 bg-white/20 rounded w-32" />
                <div className="h-3 bg-white/20 rounded w-48" />
              </div>
            </div>
          ) : profile ? (
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center text-2xl font-bold">
                {profile.username?.[0]?.toUpperCase() || "B"}
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold">@{profile.username}</h3>
                <p className="text-white/80 text-sm">Instagram Business Account</p>
              </div>
              <div className="grid grid-cols-3 gap-6 text-center">
                <div>
                  <p className="text-xl font-bold">{(profile.followers / 1000).toFixed(1)}K</p>
                  <p className="text-white/70 text-xs">Followers</p>
                </div>
                <div>
                  <p className="text-xl font-bold">{profile.following}</p>
                  <p className="text-white/70 text-xs">Following</p>
                </div>
                <div>
                  <p className="text-xl font-bold">{profile.posts}</p>
                  <p className="text-white/70 text-xs">Posts</p>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </section>

      {/* Growth Chart */}
      <section>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <SectionHeader title="Growth Trends" subtitle="Weekly follower and engagement data" />
          <div className="flex gap-2 mb-5">
            {metrics.map((m) => (
              <button
                key={m.key}
                onClick={() => setActiveMetric(m.key)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  activeMetric === m.key
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>
          {insightsLoading ? (
            <SkeletonCard height="h-56" />
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={insights} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} tickFormatter={(v) => v >= 1000 ? `${(v / 1000).toFixed(0)}K` : v} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey={activeMetric}
                  stroke={metrics.find((m) => m.key === activeMetric)?.color}
                  strokeWidth={2.5}
                  dot={{ fill: metrics.find((m) => m.key === activeMetric)?.color, r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </section>

      {/* Engagement by Content Type */}
      <section>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <SectionHeader
            title="Engagement by Content Type"
            subtitle="Average engagement rate per format"
          />
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={instagramMetrics.engagementByType} layout="vertical" margin={{ top: 0, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" horizontal={false} />
              <XAxis type="number" domain={[0, 12]} tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}%`} />
              <YAxis type="category" dataKey="type" tick={{ fontSize: 12, fill: "#374151" }} axisLine={false} tickLine={false} width={70} />
              <Tooltip formatter={(val) => [`${val}%`, "Avg. Engagement"]} />
              <Bar dataKey="avgEngagement" radius={[0, 6, 6, 0]} maxBarSize={20}>
                {instagramMetrics.engagementByType.map((_, i) => (
                  <Cell key={i} fill={SCORE_COLORS[i % SCORE_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Top Posts Table */}
      <section>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <SectionHeader
            title="Top Performing Posts"
            subtitle="Ranked by content score and engagement"
          />
          {postsLoading ? (
            <SkeletonCard height="h-64" />
          ) : (
            <div className="space-y-4">
              {posts?.map((post) => (
                <div key={post.id} className="flex gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg flex-shrink-0 flex items-center justify-center">
                    <span className="text-2xl">📷</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant={post.type?.toLowerCase()}>{post.type}</Badge>
                      <span className="text-xs text-gray-400">{post.postedAt}</span>
                    </div>
                    <p className="text-sm text-gray-700 truncate mb-2">{post.caption}</p>
                    <div className="flex flex-wrap gap-4">
                      <span className="flex items-center gap-1 text-xs text-gray-500">
                        <Heart size={12} className="text-rose-400" />
                        {post.likes?.toLocaleString()}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-gray-500">
                        <MessageCircle size={12} className="text-blue-400" />
                        {post.comments?.toLocaleString()}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-gray-500">
                        <Eye size={12} className="text-indigo-400" />
                        {post.reach?.toLocaleString()}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-gray-500">
                        <TrendingUp size={12} className="text-emerald-400" />
                        {post.engagementRate}%
                      </span>
                    </div>
                  </div>
                  <div className="w-28 flex-shrink-0">
                    <p className="text-xs text-gray-500 mb-1.5">Content Score</p>
                    <ContentScoreBar score={post.contentScore} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

// src/pages/YouTube.js
import React, { useState } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import { Play, ThumbsUp, MessageSquare, Clock, BarChart2, Users } from "lucide-react";
import {
  SectionHeader, ContentScoreBar, StatRow, SkeletonCard, Badge,
} from "../components/UIComponents";
import {
  useYouTubeChannel, useYouTubeAnalytics, useYouTubeTopVideos,
} from "../hooks/useAnalytics";

export default function YouTube() {
  const [activeMetric, setActiveMetric] = useState("views");
  const { data: channel, loading: channelLoading } = useYouTubeChannel();
  const { data: analytics, loading: analyticsLoading } = useYouTubeAnalytics("2024-11-01", "2024-12-06");
  const { data: videos, loading: videosLoading } = useYouTubeTopVideos(5);

  const channelStats = channel
    ? [
        { label: "Subscribers", value: `${(channel.subscribers / 1000).toFixed(1)}K`, icon: Users },
        { label: "Total Views", value: `${(channel.totalViews / 1000000).toFixed(2)}M`, icon: Play },
        { label: "Total Videos", value: channel.totalVideos, icon: BarChart2 },
      ]
    : [];

  const metricOptions = [
    { key: "views", label: "Views", color: "#ef4444" },
    { key: "watchTime", label: "Watch Time (hrs)", color: "#f59e0b" },
    { key: "subscribers", label: "Subscribers", color: "#6366f1" },
  ];

  return (
    <div className="space-y-8">
      {/* Channel Summary */}
      <section>
        <div className="bg-gradient-to-br from-red-600 to-red-800 rounded-2xl p-6 text-white">
          {channelLoading ? (
            <div className="animate-pulse flex gap-4">
              <div className="w-16 h-16 rounded-full bg-white/20" />
              <div className="space-y-2 flex-1">
                <div className="h-4 bg-white/20 rounded w-40" />
                <div className="h-3 bg-white/20 rounded w-24" />
              </div>
            </div>
          ) : channel ? (
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center">
                <Play size={24} />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold">{channel.name}</h3>
                <p className="text-white/70 text-sm">YouTube Channel</p>
              </div>
              <div className="grid grid-cols-3 gap-6 text-center">
                {channelStats.map((s) => (
                  <div key={s.label}>
                    <p className="text-xl font-bold">{s.value}</p>
                    <p className="text-white/70 text-xs">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </section>

      {/* Analytics Chart */}
      <section>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <SectionHeader
            title="Channel Analytics"
            subtitle="Weekly views, watch time, and subscriber growth"
          />
          <div className="flex gap-2 mb-5">
            {metricOptions.map((m) => (
              <button
                key={m.key}
                onClick={() => setActiveMetric(m.key)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  activeMetric === m.key
                    ? "bg-red-600 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>
          {analyticsLoading ? (
            <SkeletonCard height="h-56" />
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={analytics} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} tickFormatter={(v) => v >= 1000 ? `${(v / 1000).toFixed(0)}K` : v} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey={activeMetric}
                  stroke={metricOptions.find((m) => m.key === activeMetric)?.color}
                  strokeWidth={2.5}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </section>

      {/* Top Videos */}
      <section>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <SectionHeader
            title="Top Performing Videos"
            subtitle="Ranked by views and content score"
          />
          {videosLoading ? (
            <SkeletonCard height="h-72" />
          ) : (
            <div className="space-y-4">
              {videos?.map((video, idx) => (
                <div key={video.id} className="flex gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                  <div className="relative flex-shrink-0">
                    <div className="w-24 h-14 bg-gradient-to-br from-red-100 to-orange-100 rounded-lg flex items-center justify-center">
                      <Play size={20} className="text-red-500" />
                    </div>
                    <span className="absolute -top-1.5 -left-1.5 w-5 h-5 bg-red-600 text-white text-xs font-bold rounded-full flex items-center justify-center">
                      {idx + 1}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate mb-1">{video.title}</p>
                    <p className="text-xs text-gray-400 mb-2">{video.publishedAt}</p>
                    <div className="flex flex-wrap gap-4">
                      <span className="flex items-center gap-1 text-xs text-gray-500">
                        <Play size={11} className="text-red-400" />
                        {video.views?.toLocaleString()} views
                      </span>
                      <span className="flex items-center gap-1 text-xs text-gray-500">
                        <ThumbsUp size={11} className="text-blue-400" />
                        {video.likes?.toLocaleString()}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-gray-500">
                        <MessageSquare size={11} className="text-emerald-400" />
                        {video.comments?.toLocaleString()}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-gray-500">
                        <Clock size={11} className="text-amber-400" />
                        {video.avgViewDuration} avg
                      </span>
                    </div>
                  </div>
                  <div className="w-28 flex-shrink-0">
                    <p className="text-xs text-gray-500 mb-1.5">Content Score</p>
                    <ContentScoreBar score={video.contentScore} />
                    <p className="text-xs text-gray-400 mt-1">CTR: {video.ctr}%</p>
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

// src/utils/apiService.js
// Real API integration layer — swap mock data for live calls

import axios from "axios";
import {
  instagramMetrics,
  youtubeMetrics,
  campaignData,
  overviewKPIs,
  reachVsImpressionsData,
  contentScoreBreakdown,
} from "../data/mockData";

const USE_MOCK = true; // Set to false when you have real API keys

// ─── Instagram Graph API ─────────────────────────────────────────────────────
// Docs: https://developers.facebook.com/docs/instagram-api
// Required permissions: instagram_basic, instagram_manage_insights, pages_show_list

const INSTAGRAM_ACCESS_TOKEN = process.env.REACT_APP_INSTAGRAM_ACCESS_TOKEN;
const INSTAGRAM_ACCOUNT_ID = process.env.REACT_APP_INSTAGRAM_ACCOUNT_ID;
const IG_BASE = "https://graph.facebook.com/v18.0";

export async function fetchInstagramProfile() {
  if (USE_MOCK) return instagramMetrics.profile;
  const res = await axios.get(`${IG_BASE}/${INSTAGRAM_ACCOUNT_ID}`, {
    params: {
      fields: "name,biography,followers_count,follows_count,media_count,profile_picture_url",
      access_token: INSTAGRAM_ACCESS_TOKEN,
    },
  });
  return res.data;
}

export async function fetchInstagramInsights(period = "week") {
  if (USE_MOCK) return instagramMetrics.weeklyGrowth;
  const res = await axios.get(`${IG_BASE}/${INSTAGRAM_ACCOUNT_ID}/insights`, {
    params: {
      metric: "reach,impressions,follower_count,profile_views",
      period,
      access_token: INSTAGRAM_ACCESS_TOKEN,
    },
  });
  return res.data.data;
}

export async function fetchInstagramTopPosts(limit = 10) {
  if (USE_MOCK) return instagramMetrics.topPosts;
  const res = await axios.get(`${IG_BASE}/${INSTAGRAM_ACCOUNT_ID}/media`, {
    params: {
      fields: "id,caption,media_type,thumbnail_url,timestamp,like_count,comments_count",
      limit,
      access_token: INSTAGRAM_ACCESS_TOKEN,
    },
  });
  // Fetch insights for each post
  const posts = await Promise.all(
    res.data.data.map(async (post) => {
      const insights = await axios.get(`${IG_BASE}/${post.id}/insights`, {
        params: {
          metric: "reach,impressions,engagement",
          access_token: INSTAGRAM_ACCESS_TOKEN,
        },
      });
      return { ...post, insights: insights.data.data };
    })
  );
  return posts;
}

// ─── YouTube Data API v3 ──────────────────────────────────────────────────────
// Docs: https://developers.google.com/youtube/v3/docs
// Required scopes: https://www.googleapis.com/auth/youtube.readonly
//                  https://www.googleapis.com/auth/yt-analytics.readonly

const YT_API_KEY = process.env.REACT_APP_YOUTUBE_API_KEY;
const YT_CHANNEL_ID = process.env.REACT_APP_YOUTUBE_CHANNEL_ID;
const YT_BASE = "https://www.googleapis.com/youtube/v3";
const YTA_BASE = "https://youtubeanalytics.googleapis.com/v2";

export async function fetchYouTubeChannelStats() {
  if (USE_MOCK) return youtubeMetrics.channel;
  const res = await axios.get(`${YT_BASE}/channels`, {
    params: {
      part: "snippet,statistics,contentDetails",
      id: YT_CHANNEL_ID,
      key: YT_API_KEY,
    },
  });
  const ch = res.data.items[0];
  return {
    name: ch.snippet.title,
    subscribers: parseInt(ch.statistics.subscriberCount),
    totalViews: parseInt(ch.statistics.viewCount),
    totalVideos: parseInt(ch.statistics.videoCount),
  };
}

export async function fetchYouTubeAnalytics(startDate, endDate) {
  if (USE_MOCK) return youtubeMetrics.weeklyStats;
  // Requires OAuth2 access token for analytics
  const accessToken = process.env.REACT_APP_YOUTUBE_ACCESS_TOKEN;
  const res = await axios.get(`${YTA_BASE}/reports`, {
    params: {
      ids: `channel==${YT_CHANNEL_ID}`,
      startDate,
      endDate,
      metrics: "views,estimatedMinutesWatched,subscribersGained",
      dimensions: "day",
    },
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  return res.data.rows;
}

export async function fetchYouTubeTopVideos(maxResults = 10) {
  if (USE_MOCK) return youtubeMetrics.topVideos;
  const res = await axios.get(`${YT_BASE}/search`, {
    params: {
      part: "snippet",
      channelId: YT_CHANNEL_ID,
      order: "viewCount",
      maxResults,
      key: YT_API_KEY,
    },
  });
  const videoIds = res.data.items.map((v) => v.id.videoId).join(",");
  const stats = await axios.get(`${YT_BASE}/videos`, {
    params: {
      part: "statistics,contentDetails",
      id: videoIds,
      key: YT_API_KEY,
    },
  });
  return stats.data.items.map((v, i) => ({
    ...res.data.items[i].snippet,
    ...v.statistics,
    duration: v.contentDetails.duration,
  }));
}

// ─── Campaign Data (your backend / Google Sheets / Airtable) ─────────────────
export async function fetchCampaigns() {
  if (USE_MOCK) return campaignData;
  const res = await axios.get("/api/campaigns"); // Your backend endpoint
  return res.data;
}

export async function fetchOverviewKPIs() {
  if (USE_MOCK) return overviewKPIs;
  const res = await axios.get("/api/kpis");
  return res.data;
}

export async function fetchReachVsImpressions() {
  if (USE_MOCK) return reachVsImpressionsData;
  const res = await axios.get("/api/reach-impressions");
  return res.data;
}

export async function fetchContentScores() {
  if (USE_MOCK) return contentScoreBreakdown;
  const res = await axios.get("/api/content-scores");
  return res.data;
}

// ─── Content Performance Score Algorithm ─────────────────────────────────────
// Score = weighted sum of normalized metrics
export function calculateContentScore(post) {
  const weights = {
    engagementRate: 0.35,
    reachToFollowersRatio: 0.25,
    savesRate: 0.20,
    sharesRate: 0.12,
    commentsToLikesRatio: 0.08,
  };

  const normalize = (val, min, max) =>
    Math.min(100, Math.max(0, ((val - min) / (max - min)) * 100));

  const scores = {
    engagementRate: normalize(post.engagementRate, 0, 15),
    reachToFollowersRatio: normalize((post.reach / post.followersAtTime) * 100, 0, 50),
    savesRate: normalize(post.saves / post.reach * 100, 0, 5),
    sharesRate: normalize(post.shares / post.reach * 100, 0, 3),
    commentsToLikesRatio: normalize(post.comments / (post.likes || 1) * 100, 0, 20),
  };

  return Math.round(
    Object.entries(weights).reduce(
      (acc, [key, weight]) => acc + (scores[key] || 0) * weight,
      0
    )
  );
}

// ─── CAC Calculator ───────────────────────────────────────────────────────────
export function calculateCAC(totalSpend, newCustomers) {
  if (!newCustomers || newCustomers === 0) return 0;
  return (totalSpend / newCustomers).toFixed(2);
}

// ─── ROAS Calculator ─────────────────────────────────────────────────────────
export function calculateROAS(revenue, adSpend) {
  if (!adSpend || adSpend === 0) return 0;
  return (revenue / adSpend).toFixed(2);
}

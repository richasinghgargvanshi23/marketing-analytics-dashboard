// src/hooks/useAnalytics.js
import { useState, useEffect, useCallback } from "react";
import {
  fetchInstagramInsights,
  fetchInstagramTopPosts,
  fetchInstagramProfile,
  fetchYouTubeChannelStats,
  fetchYouTubeAnalytics,
  fetchYouTubeTopVideos,
  fetchCampaigns,
  fetchOverviewKPIs,
  fetchReachVsImpressions,
  fetchContentScores,
} from "../utils/apiService";

// Generic fetcher hook
function useFetch(fetchFn, deps = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await fetchFn();
      setData(result);
    } catch (err) {
      setError(err.message || "Failed to fetch data");
    } finally {
      setLoading(false);
    }
  }, deps); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    load();
  }, [load]);

  return { data, loading, error, refetch: load };
}

// ─── Overview KPIs ────────────────────────────────────────────────────────────
export function useOverviewKPIs() {
  return useFetch(fetchOverviewKPIs);
}

// ─── Instagram ────────────────────────────────────────────────────────────────
export function useInstagramProfile() {
  return useFetch(fetchInstagramProfile);
}

export function useInstagramInsights(period = "week") {
  return useFetch(() => fetchInstagramInsights(period), [period]);
}

export function useInstagramTopPosts(limit = 10) {
  return useFetch(() => fetchInstagramTopPosts(limit), [limit]);
}

// ─── YouTube ──────────────────────────────────────────────────────────────────
export function useYouTubeChannel() {
  return useFetch(fetchYouTubeChannelStats);
}

export function useYouTubeAnalytics(startDate, endDate) {
  return useFetch(() => fetchYouTubeAnalytics(startDate, endDate), [startDate, endDate]);
}

export function useYouTubeTopVideos(limit = 5) {
  return useFetch(() => fetchYouTubeTopVideos(limit), [limit]);
}

// ─── Campaigns ────────────────────────────────────────────────────────────────
export function useCampaigns() {
  const { data, loading, error, refetch } = useFetch(fetchCampaigns);
  const [filter, setFilter] = useState("all"); // all | active | paused | completed

  const filtered =
    data && filter !== "all"
      ? data.filter((c) => c.status.toLowerCase() === filter.toLowerCase())
      : data;

  return { campaigns: filtered, loading, error, refetch, filter, setFilter };
}

// ─── Reach vs Impressions ─────────────────────────────────────────────────────
export function useReachVsImpressions() {
  return useFetch(fetchReachVsImpressions);
}

// ─── Content Score ────────────────────────────────────────────────────────────
export function useContentScores() {
  return useFetch(fetchContentScores);
}

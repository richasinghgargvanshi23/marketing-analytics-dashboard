# MarketPulse — Marketing Analytics Dashboard

A full-stack marketing analytics dashboard built with React. Tracks social media metrics from **Instagram** and **YouTube**, visualizes campaign performance, and computes key marketing KPIs like **CAC**, **ROAS**, **engagement rate**, and a custom **content performance score**.

> Built by a CSE student to demonstrate bridging data engineering and marketing — relevant for performance marketing and growth teams at companies like Nykaa, Mamaearth, Swiggy, etc.

---

## Screenshots

| Overview | Instagram | Campaigns |
|----------|-----------|-----------|
| KPIs, reach/impressions trend, content score chart | Profile stats, growth charts, top posts with content scoring | Campaign cards with CAC, ROAS, budget utilization |

---

## Features

- **Overview Dashboard** — 6 KPI cards (Revenue, Spend, CAC, ROAS, Reach, Engagement Rate) + trend charts
- **Instagram Analytics** — Follower growth, reach vs impressions, engagement by content type (Reels, Carousels, Static, Stories), top posts with content scores
- **YouTube Analytics** — Channel stats, weekly views/watch time/subscribers, top video performance with CTR and content scoring
- **Campaign Tracker** — Multi-platform campaign cards with CAC, ROAS, CTR, conversion rate, budget utilization bars; filterable by status
- **Content Performance Score** — Weighted algorithm scoring posts on engagement rate, reach ratio, saves, shares, and comment-to-like ratio
- **Real API Ready** — Toggle `USE_MOCK = false` in `apiService.js` to connect Instagram Graph API and YouTube Data API v3

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, React Router v6 |
| Charts | Recharts |
| Styling | Tailwind CSS |
| Icons | Lucide React |
| HTTP | Axios |
| APIs | Instagram Graph API, YouTube Data API v3 |

---

## Getting Started

### 1. Clone the repo
```bash
git clone https://github.com/YOUR_USERNAME/marketing-analytics-dashboard.git
cd marketing-analytics-dashboard
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up environment variables
```bash
cp .env.example .env.local
# Edit .env.local with your API keys
```

### 4. Run in development
```bash
npm start
# Opens http://localhost:3000
```

### 5. Build for production
```bash
npm run build
```

---

## Connecting Real APIs

The project ships in **mock data mode**. To use live data:

1. Open `src/utils/apiService.js`
2. Set `const USE_MOCK = false;`
3. Add your credentials to `.env.local`

### Instagram Graph API Setup
1. Create a Facebook Developer App at [developers.facebook.com](https://developers.facebook.com/apps/)
2. Add Instagram Basic Display + Instagram Graph API products
3. Connect a Business/Creator Instagram account
4. Generate a long-lived access token (60-day expiry, refresh before expiry)
5. Required permissions: `instagram_basic`, `instagram_manage_insights`, `pages_show_list`

### YouTube Data API v3 Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a project → Enable **YouTube Data API v3** and **YouTube Analytics API**
3. Create credentials: API Key (for public data) + OAuth 2.0 Client ID (for analytics)
4. Add your Channel ID (found in YouTube Studio → Settings → Channel → Advanced)

---

## Project Structure

```
src/
├── data/
│   └── mockData.js          # Mock data for all metrics
├── utils/
│   └── apiService.js        # API integration layer + score algorithms
├── hooks/
│   └── useAnalytics.js      # Custom React hooks for data fetching
├── components/
│   └── UIComponents.js      # Reusable UI: KPICard, Badge, ContentScoreBar, etc.
└── pages/
    ├── Overview.js           # Main dashboard with KPIs and trend charts
    ├── Instagram.js          # Instagram-specific analytics
    ├── YouTube.js            # YouTube-specific analytics
    └── Campaigns.js          # Campaign performance table
```

---

## Key Algorithms

### Content Performance Score
```
Score = 0.35 × engagementRate
      + 0.25 × reachToFollowersRatio
      + 0.20 × savesRate
      + 0.12 × sharesRate
      + 0.08 × commentsToLikesRatio
```
All sub-scores normalized to [0, 100] before weighting.

### CAC (Customer Acquisition Cost)
```
CAC = Total Ad Spend / Number of New Customers
```

### ROAS (Return on Ad Spend)
```
ROAS = Campaign Revenue / Ad Spend
```

---

## Extending This Project

- **Add Google Ads API** — Pull ad performance data directly from Google Ads
- **Add Sheets/Airtable backend** — Let non-technical team members input campaign data
- **Email reports** — Use NodeMailer or SendGrid to auto-send weekly PDF reports
- **Date range picker** — Let users filter all charts by custom date ranges
- **Multi-brand support** — Add authentication and brand switching

---

## License

MIT — free to use, modify, and deploy.

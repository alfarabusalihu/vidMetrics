# VidMetrics: YouTube Competitor Analysis Dashboard

VidMetrics is a high-end SaaS dashboard built with **Next.js 15**, **Tailwind CSS 4**, and **Framer Motion**. It identifies "crushing" competitor content by analyzing performance, virality, and engagement metrics in seconds.

## ✨ Core Features
- **Auto-Analysis**: Instant analysis on YouTube URL detection.
- **Crushing Score**: A weighted algorithm (40/40/20) for identifying high-performing content.
- **Deep Analysis Modal**: Immersive workspace for detailed video statistics.
- **Modular Dashboard**: Clean, responsive layout with Sidebar and Grid views.
- **Diagnostic API**: Built-in health checks at `/api/hello`.

## 🛠️ Tech Stack
- **Framework**: Next.js 15.1 (App Router)
- **Styling**: Tailwind CSS 4, Shadcn/UI (Base UI)
- **Animations**: Framer Motion
- **Language**: TypeScript

## 🚀 Getting Started

### 1. Prerequisites
- Node.js 20+
- A Google Cloud Console project with the **YouTube Data API v3** enabled.

### 2. Environment Variables
Create a `.env.local` file in the root directory:
```env
YOUTUBE_API_KEY=YOUR_YOUTUBE_API_KEY
```

### 3. Installation
```bash
npm install
```

### 4. Development
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to see the dashboard.

## 🐳 Docker Support
You can run VidMetrics as a container:

```bash
# Build
docker build -t vidmetrics .

# Run
docker run -p 3000:3000 --env-file .env.local vidmetrics
```

## 📈 Methodology: The Crushing Score
The **Crushing Score** is calculated out of 100 based on:
1. **Performance (40%)**: View count relative to the channel's 50-video median.
2. **Virality (40%)**: Views relative to the total subscriber count.
3. **Engagement (20%)**: Likes and comments relative to the view count.

A score of **70+** is classified as "Crushing".

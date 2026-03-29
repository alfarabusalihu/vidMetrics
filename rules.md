# VidMetrics Architectural Standards & Technical Manual

### 📐 Layout & Aesthetic Standards
- **Above the Fold First**: The homepage is designed as a single-screen, no-scroll experience.
- **Header Positioning**: The header is `absolute top-0`, allowing the underlying canvas to breathe and preventing height-shift during transitions.
- **Seamless Minimalist UI**: The "Transparent Marquee" and "Borderless Header" define the brand identity. The initial state is pure white/neutral-50, only applying glassmorphism (backdrop-blur-3xl) during active analysis.
- **Typography**: Strictly **Geist Sans (Font Black)** for headings, utilizing `tracking-tighter` for that premium SaaS feel.

### 🍱 Component Logic
- **ShortsOverview**: Automatically identifies Shorts (duration < 60s) and categorizes their performance separately to avoid skewing long-form medians.
- **LoadingDiamond**: A responsive SVG-based loading indicator that scales across devices (`size` prop).
- **SearchInput**: Features a "Loading-to-Reset" transition state, managing its own internal validity state before triggering the global analysis.

### 📈 Metrics & Scoring Logic (The Crushing Score)
The **Crushing Score** is calculated as a weighted average:
1. **Performance (40%)**: `(current_views / median_views) * factor`. Capped at 100.
2. **Virality (40%)**: `(views / subscriber_count) * virality_factor`. Measures content "punch-up" effectiveness.
3. **Engagement (20%)**: `((likes + comments) / views) * engagement_factor`. Measures audience resonance.

### 🧪 API & Data Flow
- **YouTube API v3**: Primary source of truth. Fetches channel basic info + snippets for recent 50 videos + statistics for those videos.
- **Zod Validation**: ALL external API responses (YouTube/Gemini) MUST be parsed through schemas in `lib/youtube.ts` before reaching the application state to ensure runtime safety.
- **Server-Side Cache**: Implements a `Map`-based singleton in `lib/cache.ts` with a **24-hour TTL** to protect API quotas and improve response times.

### 🛡️ Production & Deployment
- **Dockerfile**: Uses a multi-stage Alpine build with `output: 'standalone'` enabled for minimal image size.
- **CI/CD**: Ensure `YOUTUBE_API_KEY` and `GEMINI_API_KEY` are provided as build-time or runtime secrets.
- **Performance**: Use `npm run build` to generate the production bundle; never deploy the development server.

# VidMetrics: Advanced Competitor Intelligence Dashboard

VidMetrics is a premium, enterprise-grade analysis tool built with **Next.js 15**, **React 19**, and **Tailwind CSS 4**. It empowers creators and agencies to identify "Crushing" content strategies by analyzing competitor performance, virality, and engagement in seconds.

---

## ✨ Premium Features
- **Shorts Performance Analysis**: Dedicated vertical-form content overview to track the "Shorts-to-Growth" pipeline.
- **Crushing Score Engine**: A proprietary 100-point algorithm (Performance, Virality, Engagement) identifying outlier content.
- **AI-Driven Strategic Reports**: One-click generation of deep market analysis using **Google Gemini 1.5 Pro**.
- **Fluid Visual Experience**: Premium layout with 60fps animations via **Framer Motion** and a responsive grid system.
- **Enterprise Data Integrity**: Strict **Zod-based** runtime validation for all external API dependencies.

---

## 🚀 Getting Started (Step-by-Step)

### 1. Prerequisites
- **Node.js 20.x** or higher.
- **Google Cloud Account**: A project with the **YouTube Data API v3** enabled.

### 2. Configure Environment
Create a `.env.local` file in the root directory:
```env
# YouTube Data API v3 Key
YOUTUBE_API_KEY=your_key_here

# Google Gemini API Key (Optional: for AI Reports)
GEMINI_API_KEY=your_key_here
```

### 3. Installation
```bash
# Clone the repository and install dependencies
npm install
```

### 4. Development & Production
```bash
# Run the development server
npm run dev

# Build for production
npm run build
npm run start
```
Open [http://localhost:3000](http://localhost:3000) to begin analysis.

---

## 🛠️ The Tech Stack
- **Framework**: Next.js 15 (App Router)
- **State Management**: Zustand (Client-side), In-Memory Server Cache (API layer)
- **Validation**: Zod (Schema Enforcement)
- **Styling**: Tailwind CSS 4.0 + Shadcn UI
- **Icons**: Lucide React
- **PDF Generation**: jsPDF + html2canvas

---

## 🐳 Docker Deployment
VidMetrics is container-ready with a multi-stage production build.

```bash
# Build the production image
docker build -t vidmetrics-prod .

# Run the container (Mapping Port 3000)
docker run -p 3000:3000 --env-file .env.local vidmetrics-prod
```

---

## 🧠 The AI Senior Developer Journey
This project was built and audited using a **"Collaboration-First"** AI workflow. Rather than simple code generation, we utilized the AI tool (**Antigravity**) as a **Senior Developer and Lead Auditor**:

1. **Strategic Refactoring**: The AI identified original "monolithic" components and suggested a modular, boxed-out design for maximum responsiveness.
2. **Performance Audit**: Upon request, the AI acted as a **Senior Performance Engineer** to identify potential YouTube API quota leaks, leading to the implementation of a **Server-Side TTL Cache**.
3. **Runtime Safety**: The AI enforced a **Zod migration**, moving the codebase from loose type-casting to strict runtime schema validation for more resilient data flows.
4. **UX Polish**: The AI suggested and implemented the **"Loading Diamond" to "Close Button"** morphing animation system, elevating the UX to a premium standard.

---

## 📦 Deployment Checklist (Production)

Before deploying to a production server or cloud provider:
1. **API Quotas**: Ensure your YouTube API Quota is monitored (Default is 10,000 units/day).
2. **Environment Variables**: Set `YOUTUBE_API_KEY` and `GEMINI_API_KEY` in your production environment (e.g., Vercel, Railway, or AWS).
3. **Standalone Build**: The project is optimized for `standalone` mode (see `next.config.ts`). This is already handled by the `Dockerfile`.
4. **Caching Strategy**: The current **Server-Side Cache** uses an in-memory `Map` with a 24-hour TTL. For multi-instance scaling, consider migrating to a Redis store.

---

## 📈 Methodology: The Scored Analysis
- **Performance (40%)**: View count relative to historical medians.
- **Virality (40%)**: View impact normalized against subscriber count.
- **Engagement (20%)**: Audience interaction (L+C/V) efficiency.

A score of **70+** is classified as "Crushing".

---

## 📜 Architectural Rules & Standards
For a detailed guide on the internal design system and logic, refer to: [rules.md](file:///d:/Projects/vidmetrics/vidmetrics-client/rules.md)

# <p align="center">🪙 FX Checker</p>

<p align="center">
  <img src="https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1200&q=80" alt="FX Checker Banner" style="border-radius: 12px; border: 2px solid #B5FF2E; box-shadow: 0 10px 30px rgba(181, 255, 46, 0.15);" width="100%" />
</p>

<p align="center">
  <a href="https://fxcheckerr.vercel.app/"><img src="https://img.shields.io/badge/Live_App-fxcheckerr.vercel.app-B5FF2E?style=for-the-badge&logo=vercel&logoColor=black" alt="Live Demo" /></a>
  <img src="https://img.shields.io/badge/Status-Active_Live-success?style=for-the-badge&logo=github&color=30BA4F" alt="Status" />
  <img src="https://img.shields.io/badge/Security-Hardened-0052FF?style=for-the-badge&logo=express" alt="Security" />
</p>

---

## 🌟 Overview
**FX Checker** is a high-performance, responsive currency conversion platform engineered with full-stack Node/Express middleware, real-time FX currency tracking, interactive trend visualizers, and an integrated **Gemini 3.5 AI Financial Assistant**. 

Designed for both precision and utility, the platform caches previous user queries, dynamic interactive charts, and premium SEO-friendly URL configurations (e.g., `/convert/USD-EUR`), wrapped in a lush, high-contrast visual design and fortified with robust enterprise-grade request rate limits.

---

## 🎯 Key Interactive Highlights

```
  ┌─────────────────────────────────────────────────────────────┐
  │                        FX CHECKER                           │
  ├───────────────┬──────────────────────────────┬──────────────┤
  │ 📊 Live Rates │  💬 AI Financial Consultant  │ 📈 Charts    │
  │ Real-time-FX  │  Smart market forecasts info │ Period Trends│
  └───────────────┴──────────────────────────────┴──────────────┘
```

### ⚡ Client Experience
*   **Real-Time Calculations:** Instant inputs with live cross-rate mathematics.
*   **Aesthetic Data Sparklines:** Beautiful historical charts to visually analyze conversion trends over customizable epochs.
*   **Offline Support (Smart Caches):** Offline history retrieval & dynamic favorited pairs powered by HTML5 client states.
*   **SEO-Optimized URLs:** Responsive, human-readable route updates (e.g. `/convert/EUR-USD`) optimized for Google indexing.

### 🛡️ Enterprise Protection Shield (Back-end)
*   **Hardened Headers:** Defensive middlewares protecting against Clickjacking, MIME sniffing, and XSS.
*   **Anti-DDoS Weight Limit:** Incoming raw payload bodies hard-capped at `< 15kb` to prevent malicious server flooding.
*   **Sliding Window Rate-Limiter:** State-of-the-art request throttle tracking IP access within a 1-minute window, guarding the Gemini resources from brute abuse.

---

## 🛠️ Technology Stack & Architectures

| Core Category | Stack Choice | Key Responsibility |
| :--- | :--- | :--- |
| **Frontend Frame** | React 18, Vite | Responsive UI & rendering cycles |
| **Styling Concept** | Tailwind CSS, Inter & Fira Mono | Modern Typography, dark theme visual accents |
| **Animations** | `motion` (Framer) | Staggered lists & tactile feedback loops |
| **Server Engine** | Express Node Backend | Gateway controller & secure proxies |
| **Generative Brain** | `@google/genai` (Gemini 3.5 Flash) | Contextual market sentiment analysis chatbot |

---

## 🚀 Setting Up Locally

Follow this simple guide to deploy your own instance of FX Checker locally.

<details>
<summary>📂 View Step-by-Step Installation</summary>

### 1. Repository Setup
Clone the codebase to your terminal workspace:
```bash
git clone https://github.com/ganeshhraikwar/FxChecker.git
cd FxChecker
```

### 2. Dependency Resolution
Install packages cleanly via npm:
```bash
npm install
```

### 3. Setup Gemini AI Keys 🗝️
Obtain a token key from Google AI Studio and write a `.env` configuration file in the project's root:
```env
GEMINI_API_KEY=your_secured_gemini_api_key_here
```
</details>

<details>
<summary>💻 Command Reference (Run / Build / Launch)</summary>

#### Start Local Development:
```bash
npm run dev
```

#### Production Compile:
```bash
# Compiles React static routes and bundles TS Express middleware CJS
npm run build
```

#### Start Compiled App:
```bash
npm run start
```
</details>

---

## 🎯 Search Engine Optimization & Google Search Console
This codebase comes with tailored search indicators out-of-the-box:
*   `sitemap.xml`: Configured targeting core exchange pairs for immediate indexing.
*   `robots.txt`: Defined crawling layouts for polite user-agent crawls.
*   `google-site-verification`: Pre-indexed site verified hooks for seamless Google GSC tracking.

---

<p align="center" style="margin-top: 40px;">
  💡 Crafted with precision by <b>Ganesh Raikwar</b>. Keep tracking, keep trading! 🚀
</p>

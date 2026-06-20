# 🪙 FX Checker

<p align="center">
  <img src="https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1200&q=80" alt="FX Checker Banner" width="100%" style="border-radius: 12px; margin-bottom: 20px;" />
</p>

A next-generation, high-performance, and enterprise-grade secure currency conversion platform. **FX Checker** combines ultra-responsive data fetching, robust offline capabilities, beautiful dynamic-routed clean URLs, and an AI-powered financial market analyst assistant.

🔗 **Live Platform:** [fxcheckerr.vercel.app](https://fxcheckerr.vercel.app/)

---

## ✨ Key Features

- **⚡ Live Rate Updates:** Accurate and modern exchange rate conversions with immediate interactive feedback.
- **📈 Dynamic Chart Visuals:** Comprehensive historic currency movement charts to observe market trends dynamically.
- **🔒 Shield-Grade Security:** Hardened server endpoints with strict payload protection (15KB limit), clickjacking defensive headers, rate-limiting (sliding window protection), and safe global error catchers.
- **💬 AI Market Analyst Chat:** Embedded helper leveraging the power of Gemini 3.5 to answer your direct financial queries and analyze foreign exchange pairs.
- **📂 Offline History & Favorites:** Fully optimized local caching. Save priority pairs and recall past conversions instantaneously without consuming network calls.
- **🌍 Dynamic SEO-Clean Routing:** Intuitive paths that automatically clean the standard parameters (e.g. `https://fxcheckerr.vercel.app/convert/USD-EUR`) to drive premium SEO and browser navigation indexing.

---

## 🛠️ Built With

- **Frontend core:** React, Vite, TypeScript
- **Styling framework:** Tailwind CSS
- **Motion engine:** `motion` (by Framer)
- **Visual Charts:** Native Lucide & high fidelity chart components
- **Backend framework:** Express (built-in Node middleware layout)
- **AI Integration:** Google GenAI SDK (`@google/genai`) and Gemini 3.5

---

## 🚀 Getting Started

Follow the simple instructions below to clone, configure, and boot the application locally.

### 📋 Prerequisites

Ensure you have **Node.js** (v18+) and **npm** installed on your workstation.

### 🔧 Installation & Configuration

1. **Clone the repository:**
   ```bash
   git clone https://github.com/ganeshhraikwar/FxChecker.git
   cd FxChecker
   ```

2. **Install project dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env` file in the root directory and append your server-side Gemini API key:
   ```env
   GEMINI_API_KEY=your_actual_gemini_api_key_here
   ```

### 💻 Running the App

- **Launch Development Server:**
  Runs the Express + Vite server with Hot Module Replacement on Port 3000:
  ```bash
  npm run dev
  ```

- **Compile Production Bundle:**
  Builds the client application assets and bundles the secure Express backend into a single optimize file:
  ```bash
  npm run build
  ```

- **Boot Production Server:**
  Starts the compiled server locally for verification:
  ```bash
  npm run start
  ```

---

## 🛡️ Premium Security Architecture

FX Checker implements modern corporate-level protections:
- **Payload Constraints:** Prevents body buffer/flooding attempts by hard-limiting incoming JSON objects.
- **XSS, Sniffing & Clickjacking Prevention:** Custom response headers configured to strictly isolate frame layers and prevent clickjacking.
- **Sliding Window Protection IP Limiter:** Protects Gemini API resources by tracking and cooling down request spikes dynamically per-visitor.

---

<p align="center">
  Crafted with care by <b>Ganesh Raikwar</b>. Keep tracking, keep trading! 🚀
</p>

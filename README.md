# Executive CV Profiler & Web Intelligence

> AI-Powered Executive Profiling, Web Grounding, Behavioral Persona Tuning, and Interactive Avatar Simulation Sandbox.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![React](https://img.shields.io/badge/React-19.0-blue)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-6.2-646CFF)](https://vitejs.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.1-38B2AC)](https://tailwindcss.com/)
[![Gemini API](https://img.shields.io/badge/Gemini_API-3.6_Flash-4285F4)](https://ai.google.dev/)

Executive CV Profiler & Web Intelligence is an enterprise-grade web application designed to analyze executive resumes, enrich candidate histories with live web research grounding via Gemini 3.6 Flash, synthesize cognitive archetypes, and generate customizable character avatar prompts for group behavioral simulations.

---

## 🌟 Key Features

* **📄 Multi-Format Resume Parsing & OCR**:
  * Upload PDF, DOCX, and TXT files for automated extraction.
  * Server-side PDF parsing (`pdf-parse`) and DOCX processing (`mammoth`).
  * Multimodal Gemini 3.6 Flash OCR for scanned images and image-based PDFs.

* **⚡ Client-Side Anydoc WASM Converter**:
  * Local, privacy-first WebAssembly document parsing powered by `@firecrawl/anydoc-wasm`.
  * Converts PDF, DOCX, PPTX, XLSX, ODT, RTF, EPUB, and CSV directly to GitHub-Flavored Markdown inside the browser in milliseconds without using LLM tokens.

* **🌐 Google Search Grounding & Web Research**:
  * Live web search integration via Gemini with Google Search grounding.
  * Verifies career accomplishments, patents, public articles, speaking engagements, and company histories.

* **🧠 Structured Cognitive & Behavioral Synthesis**:
  * Infers Primary Cognitive Archetype, Risk Profile, Team Role, Communication Style, and Leadership Stance.
  * Generates formatted executive Markdown reports and visual dashboard cards.

* **🤖 Custom LLM Character Avatar Prompt Generation**:
  * Synthesizes candidate data into a structured system prompt ready for injection into any LLM framework (Gemini, ChatGPT, Claude, AutoGen, CrewAI).
  * Outlines core identity, decision biases, speech vocabulary, and simulation directives.

* **🎛️ Interactive Persona Tuning & Live Prompt Regeneration**:
  * Customize personality methods, risk profiles, team roles, and text descriptions via an interactive modal.
  * Client-side prompt re-synthesis (`generateAvatarSystemPrompt`) instantly updates system prompts without re-querying the backend.

* **🎮 Group Activity Simulation Sandbox**:
  * Interactive chat environment to test the generated avatar in real time across 4 scenarios:
    * 🛠️ **Strategic Problem Solving**
    * 🎯 **Executive Decision Making**
    * 📈 **Forecasting & Risk Assessment**
    * 💡 **Innovation & Ideation**

* **⚖️ Side-by-Side Candidate Benchmarking**:
  * Compare multiple candidate profiles stored in `localStorage` side by side across skills, leadership styles, and risk profiles.

* **🔑 Bring Your Own Key (BYOK)**:
  * Users can configure their own custom Google Gemini API key directly in the navigation bar settings modal.
  * Direct one-click link to [Google AI Studio](https://aistudio.google.com/app/apikey) to generate an API key instantly.
  * API keys are stored securely in browser `localStorage` and transmitted via `X-Gemini-Api-Key` headers.

---

## 🏗️ Architecture & Dual Parsing Model

```
 ┌─────────────────────────────────────────────────────────────────────────┐
 │                            BROWSER (CLIENT)                             │
 │  ┌────────────────────────┐  ┌────────────────────┐  ┌───────────────┐  │
 │  │ Anydoc WASM Converter  │  │ Interactive Editor │  │ Candidate     │  │
 │  │ (Local Rust/WASM)      │  │ & Prompt Engine    │  │ Compare Matrix│  │
 │  └───────────┬────────────┘  └─────────┬──────────┘  └───────────────┘  │
 └──────────────│─────────────────────────│────────────────────────────────┘
                │                         │
                ▼                         ▼
 ┌─────────────────────────────────────────────────────────────────────────┐
 │                         EXPRESS BACKEND (SERVER)                        │
 │  ┌────────────────────────┐  ┌────────────────────┐  ┌───────────────┐  │
 │  │ /api/convert-document  │  │ /api/analyze-cv    │  │ /api/simulate-│  │
 │  │ (PDF/DOCX Parsing)     │  │ (Search Grounding) │  │ avatar (Chat) │  │
 │  └────────────────────────┘  └─────────┬──────────┘  └───────────────┘  │
 └────────────────────────────────────────│────────────────────────────────┘
                                          ▼
                         ┌─────────────────────────────────┐
                         │      GEMINI 3.6 FLASH API       │
                         └─────────────────────────────────┘
```

---

## 🛠️ Tech Stack

* **Frontend**: React 19, TypeScript, Vite 6, Tailwind CSS 4, Motion (framer-motion), Lucide Icons, React Markdown.
* **Document Engine**: `@firecrawl/anydoc-wasm` (client-side Rust WASM converter), `pdf-parse`, `mammoth`, `multer`.
* **Backend**: Node.js, Express, `tsx` (dev runtime), `esbuild` (production bundle).
* **AI Model**: Google GenAI SDK (`@google/genai`) with `gemini-3.6-flash`.

---

## 🚀 Getting Started

### Prerequisites

* Node.js 18+ or Node.js 20+
* npm or bun
* A Google Gemini API Key ([Get one at Google AI Studio](https://aistudio.google.com/))

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/executive-cv-profiler.git
   cd executive-cv-profiler
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure environment variables**:
   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
   Open `.env` and set your `GEMINI_API_KEY`:
   ```env
   GEMINI_API_KEY="your-gemini-api-key-here"
   APP_URL="http://localhost:3000"
   ```

4. **Run the development server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🐳 Docker & Production Deployment

A production-ready multi-stage `Dockerfile` and `docker-compose.yml` configuration are included in the repository.

```bash
# Build Docker image
docker build -t executive-cv-profiler .

# Run container
docker run -p 3000:3000 -e GEMINI_API_KEY="your-gemini-key" executive-cv-profiler
```

For detailed deployment guides across **Google Cloud Run**, **AWS**, **Fly.io**, **Render**, and **Kubernetes**, see [DEPLOYMENT.md](DEPLOYMENT.md). For security architecture and threat model analysis, see [SECURITY.md](SECURITY.md). For third-party open-source code attribution, see [CREDITS.md](CREDITS.md).

---

## 📜 Available Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts the Express server with Vite middleware in development mode on port 3000. |
| `npm run build` | Bundles client static assets with Vite and compiles `server.ts` into `dist/server.cjs` via esbuild. |
| `npm run start` | Launches the production server using `node dist/server.cjs`. |
| `npm run lint` | Runs TypeScript type checking (`tsc --noEmit`). |
| `npm run clean` | Cleans the build output directory (`dist/`). |

---

## 🔌 API Reference

### `POST /api/analyze-cv`
* **Content-Type**: `multipart/form-data` or `application/json`
* **Parameters**: `cvFile` (file upload) or `cvText` / `url`
* **Returns**: JSON object containing candidate profile, skills, BNF personality speculation, leadership style, web grounding sources, and `simulationAvatarPrompt`.

### `POST /api/convert-document`
* **Content-Type**: `multipart/form-data`
* **Parameters**: `document` (file)
* **Returns**: Converted markdown string and conversion metadata.

### `POST /api/simulate-avatar`
* **Content-Type**: `application/json`
* **Body**: `{ systemPrompt, scenario, userMessage, conversationHistory, candidateName }`
* **Returns**: `{ reply: string }`

---

## 🤝 Contributing

Contributions are welcome! Please check out [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines on submitting pull requests and reporting issues.

---

## 📄 License

This project is open-source under the [MIT License](LICENSE).

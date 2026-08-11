# 🛡️ Security Architecture & Threat Vulnerability Assessment

> **Executive CV Profiler & Web Intelligence**  
> *Document Version: 1.0.0 | Last Updated: August 2026*

This document provides a comprehensive security review, threat model analysis, data protection architecture, and vulnerability assessment for the **Executive CV Profiler & Web Intelligence** application. It outlines the security controls, data isolation boundaries, API handling rules, and threat mitigation strategies embedded across the platform.

---

## 🔐 1. Executive Summary & Security Principles

The Executive CV Profiler processes sensitive candidate profiles, executive resumes, and behavioral synthesis models. The system's security posture is built on four core architectural pillars:

1. **Client-Side Privacy Priority**: Document parsing is executed client-side via WebAssembly (`@firecrawl/anydoc-wasm`) whenever possible, ensuring file binaries do not leave the user's browser during conversion.
2. **Server-Side API Key Isolation**: Gemini API credentials and third-party secrets are strictly maintained server-side (`process.env.GEMINI_API_KEY`) or supplied ephemerally per request via `X-Gemini-Api-Key` headers. Secrets are never exposed to browser bundles or client DOM states.
3. **Stateless Operations & Zero Data Retention**: Resume payloads and converted text are processed ephemerally in-memory. The backend does not store candidate documents or profiles on disk or in persistent databases.
4. **Defense-in-Depth & Sandboxing**: Applications run inside containerized Cloud Run environments behind reverse proxies with strict memory bounds, input validation, and content length caps.

---

## 🏗️ 2. System Security Architecture & Data Boundaries

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          CLIENT BROWSER (User Sandbox)                      │
│                                                                             │
│   ┌──────────────────────────┐   ┌──────────────────────────────────────┐   │
│   │ Client Document Upload   │──▶│ Local WASM Converter (Rust/WASM)    │   │
│   │ (PDF, DOCX, TXT, CSV)    │   │ Zero server network traffic          │   │
│   └──────────────────────────┘   └──────────────────────────────────────┘   │
│                 │                                                           │
│                 │ (Multipart Payload over TLS)                              │
│                 ▼                                                           │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │ LocalStorage Engine (Stored User Key `gemini_byok_api_key`)         │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────┬───────────────────────────────────────────┘
                                  │ HTTPS (TLS 1.3)
                                  │ Header: X-Gemini-Api-Key (Optional)
                                  ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                        CONTAINERIZED BACKEND (Express / Node)               │
│                                                                             │
│   ┌──────────────────────────┐   ┌──────────────────────────────────────┐   │
│   │ Rate Limiter & Cors      │──▶│ Payload Sanitizer & Validation       │   │
│   └──────────────────────────┘   └──────────────────────────────────────┘   │
│                                                     │                       │
│                                                     ▼                       │
│                                  ┌──────────────────────────────────────┐   │
│                                  │ Gemini API Gateway Proxy             │   │
│                                  │ Uses Server Key or Request BYOK Key  │   │
│                                  └──────────────────┬───────────────────┘   │
└─────────────────────────────────────────────────────│───────────────────────┘
                                                      │ HTTPS (Google Infrastructure)
                                                      ▼
                                   ┌──────────────────────────────────────┐
                                   │ Google Gemini API & Grounding Engine │
                                   └──────────────────────────────────────┘
```

---

## 🧩 3. Comprehensive Threat Modeling & Vulnerability Matrix

We apply the **STRIDE** threat model framework (Spoofing, Tampering, Repudiation, Information Disclosure, Denial of Service, Elevation of Privilege) to analyze potential attack vectors and verified countermeasures:

| Threat Category | Potential Attack Vector | Severity | Implemented Risk Mitigation / Countermeasure |
| :--- | :--- | :---: | :--- |
| **Information Disclosure** | Leakage of Gemini API Keys in client JavaScript bundles | **CRITICAL** | API keys are kept server-side in `process.env`. Frontend code never imports keys. When Bring Your Own Key (BYOK) is active, keys are passed via encrypted HTTP headers (`X-Gemini-Api-Key`) directly to server proxies. |
| **Tampering / Injection** | **Prompt Injection** via uploaded CV text (e.g., system prompt overrides embedded inside resumes) | **HIGH** | Strict system instructions isolate user-provided resume text within demarcated XML blocks (`<cv_content>...</cv_content>`). Gemini system prompts strictly enforce output JSON schemas, ignoring text directives inside input blocks. |
| **Denial of Service** | Resource exhaustion via large file uploads (e.g., 500MB PDF bomb) | **HIGH** | Express body parsers enforce a strict `10MB` payload limit. `multer` upload handlers reject oversized files at the socket level before memory allocation. |
| **Information Disclosure** | Persistence of sensitive executive resume data on disk | **MEDIUM** | Zero server disk logging. Uploaded files are processed in-memory buffers (`multer.memoryStorage()`) and automatically garbage collected after request completion. |
| **Denial of Service** | Unauthenticated API abuse and rate limit starvation | **MEDIUM** | Server supports BYOK headers (`X-Gemini-Api-Key`) to isolate per-user quotas. Public endpoints run on containerized Cloud Run with autoscaling rate limits. |
| **Spoofing / SSRF** | Server-Side Request Forgery via malicious web links in URL analysis | **MEDIUM** | Web research is delegated exclusively to Google Search Grounding inside Google's sandboxed search infrastructure. The backend node process does not execute arbitrary HTTP fetches against external IP addresses. |
| **Cross-Site Scripting (XSS)** | Injection of malicious scripts inside rendered Markdown reports | **LOW** | Client renders AI analysis using `ReactMarkdown` with strict element sanitization, preventing raw `dangerouslySetInnerHTML` execution. |

---

## 🔑 4. API Key & Credential Management (BYOK)

The application supports a **Bring Your Own Key (BYOK)** architecture to protect shared quotas and allow enterprise governance:

1. **Storage Isolation**: User keys entered in `ApiKeyModal` are saved strictly within browser `localStorage` (`gemini_byok_api_key`).
2. **Transit Security**: Keys are transmitted over HTTPS via the `X-Gemini-Api-Key` custom header.
3. **No Database Logging**: The server does not write custom API keys to logs, metrics, or persistent files. Keys exist in request-scoped execution stacks only.
4. **Precedence**:
   * **Priority 1**: Ephemeral Key from request header `X-Gemini-Api-Key`.
   * **Priority 2**: Server-side default environment variable `GEMINI_API_KEY`.

---

## 📄 5. Document Handling & Parsing Security

### Client-Side WASM Converter (`@firecrawl/anydoc-wasm`)
* **Execution Boundary**: Runs inside the browser's isolated WebAssembly sandbox.
* **Data Privacy**: Documents uploaded via the Anydoc modal are parsed directly in browser memory. No binary bytes or converted text are sent over the network during conversion.

### Server-Side Document Parsing (`/api/convert-document` / `/api/analyze-cv`)
* **In-Memory Buffer Processing**: Files uploaded via standard HTTP POST are handled using `multer.memoryStorage()`.
* **No Disk Artifacts**: Files are never written to `/tmp` or permanent storage.
* **Supported MIME Validation**: Upload streams strictly validate MIME types (`application/pdf`, `application/vnd.openxmlformats-officedocument.wordprocessingml.document`, `text/plain`, `image/*`).

---

## 🔒 6. Network Security & Transport Controls

* **TLS Enforcement**: All production communications require TLS 1.3 (HTTPS). Plain HTTP requests are automatically redirected by edge proxies.
* **CORS Restrictions**: Express middleware configures cross-origin restrictions to prevent unauthorized cross-domain fetch requests.
* **Container Hardening**:
  * Runs on non-root user execution where applicable.
  * Alpine Linux base image (`node:20-alpine`) minimizes attack surface.
  * Health check probes (`/api/health`) verify service availability without exposing stack traces or debug metrics.

---

## 📋 7. Incident Response & Security Vulnerability Reporting

If you discover a security vulnerability or security bug within this application, please report it responsibly:

* **Reporting Channel**: Please open a confidential report via GitHub Security Advisories or create an issue on the GitHub repository.
* **Disclosure Policy**: Please allow up to 48 hours for an initial response before public disclosure.
* **Patch Process**: Verified security issues will be patched immediately and deployed via CI/CD pipelines.

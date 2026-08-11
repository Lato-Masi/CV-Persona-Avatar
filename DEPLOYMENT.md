# 🚀 Deployment & Installation Guide

This document provides comprehensive instructions for installing, building, and deploying the **Executive CV Profiler & Web Intelligence** application across various hosting platforms using Docker and containerized runtimes.

---

## 📋 Prerequisites

Before deploying, ensure you have:
* **Google Gemini API Key**: Obtain a free API key from [Google AI Studio](https://aistudio.google.com/app/apikey).
* **Docker & Docker Compose**: Installed on your system or build host ([Install Docker](https://docs.docker.com/get-docker/)).
* **Node.js 20+**: (Optional) Required only for non-containerized local execution.

---

## 🐳 Option 1: Quick Deployment with Docker

### 1. Build the Docker Image
```bash
docker build -t executive-cv-profiler:latest .
```

### 2. Run the Container
Pass your `GEMINI_API_KEY` as an environment variable:
```bash
docker run -d \
  --name cv-profiler \
  -p 3000:3000 \
  -e GEMINI_API_KEY="your-gemini-api-key-here" \
  executive-cv-profiler:latest
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🐙 Option 2: Docker Compose

Create a `docker-compose.yml` file in the project root:

```yaml
version: '3.8'

services:
  cv-profiler:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - PORT=3000
      - GEMINI_API_KEY=${GEMINI_API_KEY}
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "wget", "--spider", "http://localhost:3000/api/health"]
      interval: 30s
      timeout: 5s
      retries: 3
```

Start the application:
```bash
GEMINI_API_KEY="your-gemini-api-key" docker compose up -d
```

---

## ☁️ Option 3: Google Cloud Run Deployment

Google Cloud Run provides fully managed serverless container execution.

### Step-by-Step Google Cloud Run Setup:

1. **Authenticate Google Cloud SDK**:
   ```bash
   gcloud auth login
   gcloud config set project YOUR_PROJECT_ID
   ```

2. **Build and Submit Container to Google Artifact Registry**:
   ```bash
   # Enable Artifact Registry & Cloud Run APIs
   gcloud services enable artifactregistry.googleapis.com run.googleapis.com

   # Create repository
   gcloud artifacts repositories create cv-profiler-repo \
     --repository-format=docker \
     --location=us-central1

   # Submit image build
   gcloud builds submit --tag us-central1-docker.pkg.dev/YOUR_PROJECT_ID/cv-profiler-repo/app:v1
   ```

3. **Deploy to Cloud Run**:
   ```bash
   gcloud run deploy executive-cv-profiler \
     --image us-central1-docker.pkg.dev/YOUR_PROJECT_ID/cv-profiler-repo/app:v1 \
     --platform managed \
     --region us-central1 \
     --allow-unauthenticated \
     --port 3000 \
     --set-env-vars GEMINI_API_KEY="your-gemini-api-key"
   ```

---

## 🚀 Option 4: Deploying to Render / Fly.io / DigitalOcean

### Render
1. Connect your GitHub repository to [Render.com](https://render.com).
2. Create a new **Web Service**.
3. Select **Docker** as the runtime.
4. Set Environment Variable: `GEMINI_API_KEY`.
5. Set Internal Port: `3000`.

### Fly.io
1. Install `flyctl` CLI and authenticate:
   ```bash
   fly auth login
   ```
2. Launch app using the included Dockerfile:
   ```bash
   fly launch --no-deploy
   ```
3. Set secret environment variable:
   ```bash
   fly secrets set GEMINI_API_KEY="your-gemini-api-key"
   ```
4. Deploy:
   ```bash
   fly deploy
   ```

---

## ☸️ Option 5: Kubernetes Deployment Manifests

For Kubernetes deployment, use the following `deployment.yaml`:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: cv-profiler-deployment
  labels:
    app: cv-profiler
spec:
  replicas: 2
  selector:
    matchLabels:
      app: cv-profiler
  template:
    metadata:
      labels:
        app: cv-profiler
    spec:
      containers:
      - name: cv-profiler
        image: your-registry/executive-cv-profiler:latest
        ports:
        - containerPort: 3000
        env:
        - name: GEMINI_API_KEY
          valueFrom:
            secretKeyRef:
              name: gemini-secret
              key: api-key
        resources:
          limits:
            memory: "512Mi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /api/health
            port: 3000
          initialDelaySeconds: 10
          periodSeconds: 30
---
apiVersion: v1
kind: Service
metadata:
  name: cv-profiler-service
spec:
  type: ClusterIP
  ports:
  - port: 80
    targetPort: 3000
  selector:
    app: cv-profiler
```

---

## 🔍 Health Check & Troubleshooting

* **Health Endpoint**: Test container health at `GET /api/health`. Returns `{"status":"ok"}`.
* **Logs Inspection**: Check container logs with `docker logs -f cv-profiler`.
* **API Key Rate Limits**: If using a shared key, users can supply their own API key via the **API Key (BYOK)** modal in the navigation bar.

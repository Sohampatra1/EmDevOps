# Embedded DevOps EU Accelerator

A premium, interactive web application to accelerate your Embedded Systems and DevOps career for the German/European market. This platform features AI-driven company research, interactive deep-dive curriculums, memory-retention flashcards, and more.

## Quick Start: Run via Docker (Recommended)

If you just want to run the application immediately (e.g., on an Ubuntu server, Termux, or local machine) without installing Node.js or Postgres manually, you can use the pre-built Docker image.

### Method 1: The Quick One-Liner (No cloning required)
If you only need the web interface and want to connect it to an external database, you can pull and run the image directly:

```bash
docker run -p 3000:3000 \
  -e DATABASE_URL="postgresql://user:pass@host:5432/db" \
  -e GROQ_API_KEY="your_api_key_here" \
  sohampatra/emdevops:latest
```

### Method 2: Full Stack via Docker Compose (Best for full setup)
This runs the web application, a local PostgreSQL database, and Redis cache automatically.

1. **Clone the repository** to get the configuration files:
```bash
git clone https://github.com/Sohampatra1/EmDevOps.git
cd EmDevOps
```

2. **Configure Environment Variables**:
```bash
cp .env.example .env
# Edit .env and add your GROQ_API_KEY. The database strings are already pre-configured for Docker!
nano .env
```

3. **Modify `docker-compose.yml`**:
Ensure the `web` service in `docker-compose.yml` points to the pre-built image:
```yaml
services:
  web:
    image: sohampatra/emdevops:latest
    # ... rest of config
```

4. **Start the Stack**:
```bash
docker compose up -d
```

5. **Initialize the Database**:
Because this creates a brand new PostgreSQL container, you must push the database tables once:
```bash
docker compose exec web npx prisma db push
```

The app is now live at `http://localhost:3000` (or your server's IP address:3000).

---

## Local Development (Native)

If you want to contribute or modify the code directly:

1. **Install Prerequisites**: PostgreSQL (native), Node.js (v20+), and pnpm.
2. **Install Dependencies**:
   ```bash
   pnpm install
   ```
3. **Environment Setup**:
   Copy `.env.example` to `.env` and fill in your local Postgres connection string and AI keys.
4. **Database Sync**:
   ```bash
   pnpm --filter web exec prisma db push
   ```
5. **Start Development Server**:
   ```bash
   pnpm dev
   ```
The development server will start at `http://localhost:3000`.

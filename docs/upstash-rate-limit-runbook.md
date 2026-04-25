# Upstash Redis — Rate Limiter Runbook (Wave 3, 2026-04-25)

## Architecture

```
Client request
     │
     ▼
api/index.ts (Express)
     │
     ▼
POST /api/auth/login
     │
     ├─ ratelimit("login:<IP>")  ←── api-lib/ratelimit.ts
     │       │
     │       ├── UPSTASH env set?  ──yes──▶  @upstash/ratelimit
     │       │                               slidingWindow(50, "1 m")
     │       └──────────────────  ──no───▶  In-memory Map fallback
     │
     ├── 429 if !success  (headers: X-RateLimit-*, Retry-After)
     └── proceed if success
```

**Limit:** 50 requests per IP per sliding 60-second window.  
**Applied to:** `POST /api/auth/login` (most abuse-prone endpoint).

---

## Step 1 — Provision Upstash Redis (free tier)

1. Go to https://console.upstash.com/
2. Click **Create Database**
3. Name: `restaumargin-rl`, Region: `eu-west-1` (Paris), Type: **Regional**
4. Click **Create**
5. In the database detail page, copy:
   - **UPSTASH_REDIS_REST_URL** (format: `https://xxx.upstash.io`)
   - **UPSTASH_REDIS_REST_TOKEN** (long JWT)

Free tier limits: 10 000 commands/day, 256 MB storage — sufficient for rate limiting.

---

## Step 2 — Add environment variables

### Vercel
Dashboard → Project → **Settings → Environment Variables**:
| Name | Value | Environments |
|---|---|---|
| `UPSTASH_REDIS_REST_URL` | `https://xxx.upstash.io` | Production, Preview |
| `UPSTASH_REDIS_REST_TOKEN` | `<token>` | Production, Preview |

### Local dev (`/api/.env` or root `.env`)
```
UPSTASH_REDIS_REST_URL=https://xxx.upstash.io
UPSTASH_REDIS_REST_TOKEN=<token>
```

> **Without these variables**: the rate limiter falls back to an in-memory Map.
> The fallback is single-process only (does not share state across Vercel serverless instances).
> This is acceptable for dev; production MUST use Upstash.

---

## Step 3 — Verify it works

### Happy path
```bash
curl -X POST https://www.restaumargin.fr/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"Wrong1"}' \
  -I 2>&1 | grep -E "HTTP|X-RateLimit|Retry"
```
Expected headers:
```
HTTP/2 401
X-RateLimit-Limit: 50
X-RateLimit-Remaining: 49
X-RateLimit-Reset: 1745600460
```

### Trigger 429
```bash
for i in $(seq 1 55); do
  curl -s -o /dev/null -w "%{http_code}\n" \
    -X POST https://www.restaumargin.fr/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"bot@test.com","password":"Bad1"}'
done
```
Requests 51-55 should return `429`.

---

## Step 4 — Monitor

In the Upstash console, the **Data Browser** shows live keys with TTL.
Rate limit keys follow the pattern: `restaumargin:rl:login:<IP>`.

You can also check Upstash metrics (commands/day, latency p99) in the Analytics tab.

---

## Tuning the limit

Edit `api-lib/ratelimit.ts`:
```typescript
const MAX_REQUESTS = 50;          // requests per window
const WINDOW_MS    = 60_000;      // in-memory window (ms)

// For Upstash:
Ratelimit.slidingWindow(50, '1 m')  // change both values together
```

Redeploy after changing these values; Upstash reads config at startup.

---

## Incident response

| Scenario | Action |
|---|---|
| Upstash outage | Vercel functions auto-fallback to in-memory (no redeploy needed) |
| Rate limit too aggressive | Raise `MAX_REQUESTS` → commit → push → auto-deploy |
| False positives (office NAT) | Implement user-id based limiting in addition to IP |
| Redis cost spike | Check Upstash "Commands" chart; reduce TTL or add caching |

---

## Security notes

- Rate limiting is **per IP** using `x-forwarded-for` (first hop, Vercel sets this reliably).
- `Retry-After` header is RFC 7231 compliant.
- Limit is intentionally generous (50/min) to avoid impacting real users on shared IPs (corporate NAT).
  Reduce to 20/min for stricter environments.

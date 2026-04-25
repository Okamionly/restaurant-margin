# Cloudflare Stream — Runbook (Wave 3, 2026-04-25)

## Why Cloudflare Stream

`station-demo.mp4` is 9.8 MB. Serving it from Vercel / the git repo:
- Bloats the Vite bundle / static build
- Eats Vercel Hobby bandwidth on every page visit
- No adaptive bitrate (ABR) — mobile users get the full 9.8 MB

Cloudflare Stream delivers adaptive HLS/DASH from a global CDN and bills per minute
viewed (first 1 000 min/month free on the free plan).

---

## Step 1 — Obtain credentials

1. Log in to https://dash.cloudflare.com
2. Top-right → **Account** → copy your **Account ID**
3. Profile → **API Tokens** → Create Token → template: _Stream: Edit_ → Generate
4. Copy the token (shown once)

---

## Step 2 — Upload the video

```bash
export CF_ACCOUNT_ID="<your_account_id>"
export CF_API_TOKEN="<your_api_token>"

curl -X POST \
  -H "Authorization: Bearer $CF_API_TOKEN" \
  -F file=@client/public/images/hero/station-demo.mp4 \
  https://api.cloudflare.com/client/v4/accounts/$CF_ACCOUNT_ID/stream
```

The response JSON contains `result.uid` — that is your **Video ID**.

Example response snippet:
```json
{
  "result": {
    "uid": "abcdef1234567890abcdef1234567890",
    "readyToStream": false,
    ...
  }
}
```

Wait ~60 s for encoding to complete, then check:
```bash
curl -H "Authorization: Bearer $CF_API_TOKEN" \
  https://api.cloudflare.com/client/v4/accounts/$CF_ACCOUNT_ID/stream/<VIDEO_UID>
```
`readyToStream: true` means the video is live.

---

## Step 3 — Retrieve embed code

The iframe URL pattern is:
```
https://customer-<subdomain>.cloudflarestream.com/<VIDEO_UID>/iframe
```

Find your subdomain on the Stream dashboard (appears in the **Embed** tab of any uploaded video).
It looks like `customer-inu5okyp5g2t5fku`.

Full iframe example:
```html
<iframe
  src="https://customer-inu5okyp5g2t5fku.cloudflarestream.com/abcdef1234567890/iframe"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
  allowfullscreen
  loading="lazy"
  style="width:100%; height:100%; border:0;"
></iframe>
```

---

## Step 4 — Configure environment variable

### Local dev (`.env` in `/client`)
```
VITE_CLOUDFLARE_STREAM_VIDEO_ID=abcdef1234567890abcdef1234567890
```

### Vercel
Dashboard → Project → **Settings → Environment Variables**:
| Name | Value | Environments |
|---|---|---|
| `VITE_CLOUDFLARE_STREAM_VIDEO_ID` | `<VIDEO_UID>` | Production, Preview |

> Note: the `VITE_` prefix exposes the variable to the Vite build. Never store secrets with this prefix.

---

## Step 5 — Remove the local video (after prod validation)

Once the Stream embed is live and validated in production:
```bash
git rm client/public/images/hero/station-demo.mp4
git commit -m "chore: remove station-demo.mp4 — migrated to Cloudflare Stream"
```

---

## Fallback behavior

The component in `client/src/pages/StationLanding.tsx` checks `import.meta.env.VITE_CLOUDFLARE_STREAM_VIDEO_ID`:
- **Set** → Cloudflare Stream iframe (production path)
- **Not set** → `<video src="/images/hero/station-demo.mp4">` (local dev / CI)

---

## Cost estimate

| Plan | Free tier | Overage |
|---|---|---|
| Free | 1 000 min/month viewed + 10 GB storage | $0.05/1 000 min, $5/TB storage |

For a product demo video with ~50 unique visitors/day at 2 min average watch time:
- 50 × 30 days × 2 min = 3 000 min/month → ~$0.10/month above free tier.

---

## Incident response

If the stream fails (Cloudflare outage):
- The fallback `<video>` tag is rendered automatically when the env var is cleared from Vercel.
- RTO: 5 min (redeploy without the env var → local video serves).
- RPO: N/A (video content is immutable).

#!/usr/bin/env bash
# RestauMargin — Lighthouse baseline runner
# Captures a Performance-only Lighthouse report and writes it to
# lighthouse-baseline.json so we can compare LCP / TTI / TBT before
# and after Wave 2 optimizations.
#
# Requires: node, npx (uses the on-the-fly @lhci/cli or lighthouse CLI).
# Usage:
#   bash client/scripts/lighthouse-baseline.sh                 # prod URL
#   LH_URL=http://localhost:5173 bash client/scripts/lighthouse-baseline.sh

set -euo pipefail

URL="${LH_URL:-https://www.restaumargin.fr/}"
OUT_PATH="${LH_OUT:-./lighthouse-baseline.json}"

echo "[lighthouse] target=$URL out=$OUT_PATH"

npx --yes lighthouse "$URL" \
  --output=json \
  --output-path="$OUT_PATH" \
  --only-categories=performance \
  --chrome-flags="--headless --no-sandbox"

echo "[lighthouse] report saved to $OUT_PATH"
node -e "const r = require('$OUT_PATH'); console.log('Performance score:', Math.round((r.categories.performance.score||0)*100)); ['first-contentful-paint','largest-contentful-paint','total-blocking-time','cumulative-layout-shift','speed-index','interactive'].forEach(k=>{const a=r.audits[k];if(a)console.log('  '+k+':', a.displayValue);});"

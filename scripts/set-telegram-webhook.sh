#!/usr/bin/env bash
# Register the Telegram webhook with your deployed Vercel app.
# Usage:
#   TELEGRAM_BOT_TOKEN=... TELEGRAM_WEBHOOK_SECRET=... APP_URL=https://your-domain \
#     bash scripts/set-telegram-webhook.sh
set -euo pipefail

: "${TELEGRAM_BOT_TOKEN:?set TELEGRAM_BOT_TOKEN}"
: "${APP_URL:?set APP_URL (e.g. https://otherhalf.example.com)}"
SECRET="${TELEGRAM_WEBHOOK_SECRET:-}"

curl -s "https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/setWebhook" \
  -H "Content-Type: application/json" \
  -d "{\"url\":\"${APP_URL}/api/telegram/webhook\",\"secret_token\":\"${SECRET}\",\"allowed_updates\":[\"message\"]}"
echo
echo "done. verify with:"
echo "  curl https://api.telegram.org/bot\${TELEGRAM_BOT_TOKEN}/getWebhookInfo"

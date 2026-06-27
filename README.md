# otherhalf — simulacra technologies

A web app that gives you a romantic "MBTI", builds an AI companion from the result,
and hands you a Telegram deeplink to talk to them. The companion remembers you via an
evolving memory dossier kept against your account.

## Flow

1. **Landing** (`index.html`) — age gate → begin.
2. **Quiz** (`onboarding.html`) — 12 forced-choice questions across 4 axes
   (pace · expression · closeness · mind), scored into one of 16 types.
3. **Paywall** (`/paywall`) — shows your type, then Stripe Checkout (pay before the link).
4. **Success** (`/success`) — confirms the subscription, then reveals
   `t.me/<bot>?start=<token>`.
5. **Telegram bot** (`/api/telegram/webhook`) — `/start <token>` links the chat to the
   account; every message loads the persona + dossier, calls the LLM, replies in
   character, and folds the exchange back into the dossier.

## Stack

- Static front-end + Vercel serverless functions (`api/**`). No framework.
- **Supabase** (Postgres) — apply `supabase/schema.sql`.
- **DeepSeek** (OpenAI-compatible) for the companion — swappable via `LLM_*` env vars.
- **Stripe** subscriptions.
- **Telegram** Bot API via webhook.

## Setup

1. Create the Supabase tables: run `supabase/schema.sql` in the SQL editor.
2. Set env vars (see `.env.example`) in Vercel.
3. Create a bot with @BotFather; set `TELEGRAM_BOT_TOKEN` and `TELEGRAM_BOT_USERNAME`.
4. Deploy, then register the webhook:
   ```
   TELEGRAM_BOT_TOKEN=... TELEGRAM_WEBHOOK_SECRET=... APP_URL=https://your-domain \
     bash scripts/set-telegram-webhook.sh
   ```
5. Point your Stripe webhook at `https://your-domain/api/stripe/webhook`
   (event `checkout.session.completed`) and set `STRIPE_WEBHOOK_SECRET`.

## Design

Minimal, sterile, black-on-white, lowercase. Base styles in `styles.css`; page-specific
styling is inline per page. No build step.

## Typology config

- `config/onboarding.json` — the 12 questions (each tagged with its axis + pole letters).
- `config/romantic-types.json` — axes, per-pole persona fragments, and the 16 type
  names/blurbs. Edit personas here to retune how each type's companion behaves.

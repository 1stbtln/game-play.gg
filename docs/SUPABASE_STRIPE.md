# Supabase auth + Stripe subscriptions

## 1. Supabase project

1. Create a project at [Supabase](https://supabase.com).
2. **Authentication → URL configuration**
   - Site URL: `NEXT_PUBLIC_SITE_URL` (e.g. `http://localhost:3000` or production URL).
   - Redirect URLs: add `http://localhost:3000/auth/callback` and your production `https://your-domain.com/auth/callback`.
3. Open **SQL Editor**, paste and run `supabase/migrations/001_gameplay_schema.sql`.
   - This drops legacy `votes` / `matches` / `rooms` / `profiles` tables if they exist, then creates GamePlay `profiles` + `subscriptions` and RLS policies.

## 2. Environment variables

Copy `.env.example` to `.env.local` and fill:

- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` (Project Settings → API).
- `SUPABASE_SERVICE_ROLE_KEY` (server only; never expose to the client).
- `NEXT_PUBLIC_SITE_URL` (no trailing slash).
- Stripe keys and **Price IDs** for Pro/Team monthly/yearly.

## 3. Stripe

1. Create **Products** with recurring prices for Pro and Team (monthly + yearly).
2. Copy each **Price ID** (`price_...`) into `STRIPE_PRICE_*` env vars.
3. **Developers → Webhooks → Add endpoint**  
   URL: `https://your-domain.com/api/stripe/webhook`  
   Events (minimum):
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
4. Set `STRIPE_WEBHOOK_SECRET` from the webhook signing secret.

Local testing: use [Stripe CLI](https://stripe.com/docs/stripe-cli) `stripe listen --forward-to localhost:3000/api/stripe/webhook`.

## 4. App behavior

- **Sign up / sign in**: `/auth/sign-up`, `/auth/sign-in` (email + password). Email confirmation uses `/auth/callback`.
- **Dashboard**: `/dashboard` requires a Supabase session.
- **Checkout**: Pricing “Get Pro” / Team buttons hit `/api/stripe/checkout?plan=…&interval=…` (must be signed in).
- **Subscriptions**: Webhook upserts `public.subscriptions`; `profiles.stripe_customer_id` is set after checkout.

## 5. Trigger syntax (Postgres)

If `EXECUTE FUNCTION` fails in the SQL editor, your instance may expect `EXECUTE PROCEDURE` for triggers—replace those lines in the migration accordingly.

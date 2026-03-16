# EdgeBet Football Deployment & Setup Guide

EdgeBet Football is a professional, subscription-based soccer betting insights platform. This guide covers everything needed to take the application from local development to production.

## 🚀 Quick Start Checklist

1. [ ] **Supabase Setup**: Database, Auth, and RLS policies.
2. [ ] **Stripe Setup**: Products, Prices, and Webhooks.
3. [ ] **Environment Variables**: Configure all secrets in Vercel.
4. [ ] **Build Verification**: Run `npm run build` locally.
5. [ ] **Domain Configuration**: Set `NEXT_PUBLIC_SITE_URL`.

---

## 🛠 Prerequisites

- **Supabase**: A project created at [supabase.com](https://supabase.com).
- **Stripe**: An account at [stripe.com](https://stripe.com) (Test mode recommended for initial setup).
- **Vercel**: An account at [vercel.com](https://vercel.com) for hosting.

---

## 🏗 1. Database & Auth (Supabase)

1. **Schema**: Run the contents of `supabase_improved_schema.sql` in the Supabase SQL Editor.
2. **Seed Data**: (Optional) Run `supabase_seed.sql` to populate initial fixtures.
3. **Auth Settings**:
   - Enable **Email/Password** provider.
   - Set **Site URL** to your production domain.
   - Add `http://localhost:3000/auth/callback` and `https://your-domain.com/auth/callback` to **Redirect URLs**.

---

## 💳 2. Payments (Stripe)

1. **Create Product**: Create a "Premium Subscription" product in Stripe.
2. **Add Price**: Add a recurring monthly price (e.g., $29.99).
3. **Webhook**:
   - Go to Developers -> Webhooks.
   - Add endpoint: `https://your-domain.com/api/stripe/webhook`.
   - Listen for: `checkout.session.completed`, `customer.subscription.deleted`, `customer.subscription.updated`.
   - Copy the **Webhook Secret**.

---

## 🔑 3. Environment Variables

Add these to your Vercel project settings:

| Variable | Description |
| :--- | :--- |
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase Anon Key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase Service Role Key (Keep secret!) |
| `STRIPE_SECRET_KEY` | Stripe Secret Key (sk_test_...) |
| `STRIPE_WEBHOOK_SECRET` | Stripe Webhook Signing Secret (whsec_...) |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe Publishable Key (pk_test_...) |
| `STRIPE_PREMIUM_PRICE_ID` | The ID of your Stripe price (price_...) |
| `NEXT_PUBLIC_SITE_URL` | Your production URL (e.g., https://edgebet.com) |

---

## 📦 4. Build & Deployment

### Local Build Test
```bash
npm run build
```

### Deploy to Vercel
1. Push your code to a GitHub repository.
2. Import the project in Vercel.
3. Configure the environment variables.
4. Deploy!

---

## 🛡 Security & Admin Access

To grant admin access to a user:
1. Find the user's ID in Supabase Auth.
2. In the SQL Editor, run:
```sql
UPDATE profiles SET role = 'admin' WHERE id = 'user-uuid-here';
```

---

## 📋 Deployment Checklist

### Pre-Launch
- [ ] Verify RLS policies are enabled on all tables.
- [ ] Test the full checkout flow in Stripe Test Mode.
- [ ] Verify that non-admin users cannot access `/admin/*` routes.
- [ ] Check metadata/OG tags using [SocialSharePreview](https://socialsharepreview.com/).
- [ ] Ensure `NEXT_PUBLIC_SITE_URL` is correct for production redirects.

### Post-Launch
- [ ] Switch Stripe to **Live Mode**.
- [ ] Update all environment variables with Live secrets.
- [ ] Perform a live transaction test.
- [ ] Monitor Supabase logs for any RLS violations.

---

## 📄 License
MIT

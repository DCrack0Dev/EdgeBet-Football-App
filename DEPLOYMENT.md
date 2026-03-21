# EdgeBet Football Deployment & Setup Guide

EdgeBet Football is a professional, subscription-based soccer betting insights platform. This guide covers everything needed to take the application from local development to production.

## 🚀 Quick Start Checklist

1. [ ] **Supabase Setup**: Database, Auth, and RLS policies.
2. [ ] **Peach Payments Setup**: Entity ID, Secret Token, and Webhooks.
3. [ ] **Environment Variables**: Configure all secrets in Vercel.
4. [ ] **Build Verification**: Run `npm run build` locally.
5. [ ] **Domain Configuration**: Set `NEXT_PUBLIC_SITE_URL`.

---

## 🛠 Prerequisites

- **Supabase**: A project created at [supabase.com](https://supabase.com).
- **Peach Payments**: An account at [peachpayments.com](https://peachpayments.com) (Sandbox/Test mode recommended for initial setup).
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

## 💳 2. Payments (Peach Payments)

1. **Entity ID**: Retrieve your **Entity ID** from the Peach Payments Dashboard.
2. **Secret Token**: Retrieve your **Secret Token** from the Peach Payments Dashboard.
3. **Webhook**:
   - Go to Checkout -> Settings.
   - Add endpoint: `https://your-domain.com/api/peach/webhook`.
   - Ensure the webhook is configured for **Hosted Checkout**.
   - Copy the **Webhook Secret** (if separate, or use your Secret Token).

---

## 🔑 3. Environment Variables

Add these to your Vercel project settings:

| Variable | Description |
| :--- | :--- |
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase Anon Key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase Service Role Key (Keep secret!) |
| `PEACH_ENTITY_ID` | Peach Payments Entity ID |
| `PEACH_SECRET_TOKEN` | Peach Payments Secret Token |
| `PEACH_API_BASE_URL` | Peach API Base URL (Test: https://testsecure.peachpayments.com/checkout/initiate) |
| `PEACH_WEBHOOK_SECRET` | Peach Payments Webhook Signing Secret |
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

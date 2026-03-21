

EdgeBet Football is a high-performance, subscription-based soccer betting insights platform. Built for serious bettors, it provides data-driven daily slips, deep technical match analysis, and transparent performance auditing through a premium "Dark Mode" experience.

![EdgeBet Preview](public/og-image.png)

EdgeBet Football is designed to bridge the gap between casual betting and professional sports trading. By combining a clean, high-fidelity UI with robust data structures, it offers users a centralized hub for:
- **Daily Expert Slips**: Curated betting combinations (Safe, Balanced, Aggressive).
- **Match Analysis**: In-depth technical reports and tactical edges.
- **Performance Auditing**: A transparent, searchable history of all past results.
- **Personalization**: A dedicated "Saved Picks" hub for tracking individual interests.



- **Expert Daily Slips**: Categorized by risk level (Safe, Balanced, Aggressive, Combo).
- **Match Analysis**: Technical reports, goal trends, and tactical insights.
- **Premium Content Gating**: Multi-tier access (Free vs. Premium) powered by Peach Payments.
- **Transparent Audit Log**: Verified history of past performance with filtering.
- **Personalized Hub**: Save individual picks and slips to your profile.
- **Real-time Notifications**: Instant alerts for new content and result updates.
- **Admin Command Center**: Complete management of leagues, teams, matches, and picks.
- **Mobile Responsive**: Fully optimized for a seamless experience on any device.
- **SEO Optimized**: Dynamic metadata and Open Graph tags for social sharing.



- **Framework**: [Next.js 14/15](https://nextjs.org/) (App Router, Server Components)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Database**: [Supabase](https://supabase.com/) (PostgreSQL)
- **Authentication**: [Supabase Auth](https://supabase.com/auth)
- **Payments**: [Peach Payments](https://www.peachpayments.com/) (Hosted Checkout & Webhooks)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Animations**: [Tailwind Animate](https://github.com/jamiebuilds/tailwind-animate)
- **Deployment**: [Vercel](https://vercel.com/)




- Node.js 18.x or higher
- A Supabase account and project
- A Peach Payments account (Sandbox/Test mode recommended for setup)


Create a `.env.local` file in the root directory and populate it with your credentials:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Peach Payments Configuration (South Africa)
PEACH_ENTITY_ID=your_peach_entity_id
PEACH_SECRET_TOKEN=your_peach_secret_token
PEACH_API_BASE_URL=https://testsecure.peachpayments.com/checkout/initiate
PEACH_WEBHOOK_SECRET=your_peach_webhook_secret

# App Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```


1. **Database Schema**: Execute the contents of `supabase_improved_schema.sql` in your Supabase SQL Editor. This sets up all tables, enums, and RLS policies.
2. **Seed Data**: (Optional) Execute `supabase_seed.sql` to populate the database with demo leagues, teams, and matches.
3. **Auth Redirects**: In Supabase Dashboard -> Auth -> URL Configuration, add `http://localhost:3000/api/auth/callback` to the Redirect URLs.


1. Log in to your Peach Payments Dashboard and retrieve your **Entity ID** and **Secret Token**.
2. Set up a Webhook in the Peach Dashboard pointing to `YOUR_DOMAIN/api/peach/webhook`.
3. Ensure the webhook is configured for `Hosted Checkout` and includes the HMAC signature.
4. For recurring billing, ensure `createRegistration` is supported for your merchant account.

)
1. Push your code to a GitHub repository.
2. Connect the repository to Vercel.
3. Add all environment variables from `.env.local` to the Vercel project settings.
4. Ensure `NEXT_PUBLIC_SITE_URL` is set to your production domain (e.g., `https://edgebetfootball.com`).
5. Update Supabase Auth Redirect URLs to include `https://your-domain.com/api/auth/callback`.



To grant a user administrative privileges:
1. Sign up as a user in the application.
2. Go to your Supabase SQL Editor and run:
   ```sql
   -- Promote a user to admin
   UPDATE profiles SET role = 'admin' WHERE email = 'your-email@example.com';

   -- Demote a user to regular user
   UPDATE profiles SET role = 'user' WHERE email = 'your-email@example.com';
   ```
3. Admins gain access to the `/admin` dashboard for content management.
4. **Security Note**: Admin checks are enforced via Supabase RLS policies and Next.js Middleware. Never share your service role key.

The project uses `supabase_improved_schema.sql` as the definitive source of truth. If you make changes to the schema:
- Ensure PostgreSQL Enums are updated if adding new risk levels or statuses.
- Update RLS policies to reflect new data access requirements.
- Maintain the `handle_new_user` trigger to ensure profile creation on signup.



EdgeBet is optimized for **Vercel**.
1. Connect your GitHub repository to Vercel.
2. Add all environment variables from `.env.local` to the Vercel project settings.
3. Ensure `NEXT_PUBLIC_SITE_URL` is set to your production domain (e.g., `https://edgebet-football.vercel.app`).
4. Update your Stripe Webhook URL to point to your production endpoint.



- [ ] **Automated Data**: Integration with high-frequency Football Data APIs (API-Football, Opta).
- [ ] **Advanced Analytics**: Expected Goals (xG) and player-specific tactical breakdowns.
- [ ] **Community Features**: Match-specific discussion threads and user "vibe" polls.
- [ ] **PWA Support**: Offline access and push notifications for mobile users.
- [ ] **Staking Strategy**: Built-in Kelly Criterion and bankroll management tools.


MIT

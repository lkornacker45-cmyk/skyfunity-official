# SkyFunity – Supabase Account & Ticket Setup

The UI is implemented at `/account`, but **it is not live until Supabase is configured**. Do not put any Supabase service_role key in the frontend.

1. Create a project at https://supabase.com/dashboard and wait for its database to be ready.
2. Open **SQL Editor** in Supabase. Paste and run the entire `supabase/schema.sql` file. It creates profiles, tickets, ticket messages, staff roles and row-level security (RLS).
3. Under **Authentication → Providers → Email**, enable Email authentication and **Confirm email**. Configure a real SMTP provider for production email delivery. Set **Site URL** to `https://skyfunity-official.vercel.app` and add `https://skyfunity-official.vercel.app/account` to allowed Redirect URLs. Set appropriate password and abuse protection settings.
4. In **Vercel → Project → Settings → Environment Variables**, add:
   - `NEXT_PUBLIC_SUPABASE_URL`: Project URL (Supabase → Settings → API)
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: publishable/anon key (Supabase → Settings → API)
   Do not use a service_role key. Add for Production (and Preview if desired), then redeploy.
5. Register a test player, confirm the email and test a ticket. In Supabase **Authentication → Users**, find the UUID of a trusted staff member. In SQL Editor, promote manually:
   `update public.profiles set role = 'team' where id = 'REAL-STAFF-UUID';`
   Only a database administrator should do this. Never let users choose `role` during signup.
6. Test security with **two different player accounts**: player A must not see player B's tickets or messages. Team should see and reply to both and change ticket status.
7. Review and update `/datenschutz` before launch: add your company identity/contact, Supabase as a processor, authentication data, ticket contents, retention, legal basis, location/transfer information and DPA details as appropriate. Define ticket deletion/retention policies and rate limits.

### Notes
- Existing `/admin` is a **separate legacy administration system**. Ticket team roles are assigned in Supabase, not through the old admin password.
- No Minecraft server account is automatically created; the Minecraft name is a profile field only.
- Current app uses Supabase Auth client sessions; the database RLS policies enforce access regardless of the UI.
- For high-volume production, add CAPTCHA / signup abuse prevention, ticket rate limiting, and stronger operational monitoring.
- Password recovery email is sent via Supabase; make sure your email templates and recovery flow are tested before inviting players.

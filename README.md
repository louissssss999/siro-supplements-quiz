# SiRo Supplements Quiz

A modern, mobile-responsive multi-step survey built with React and Tailwind CSS.

## Notifications + Data Export Setup (Supabase)

Use Supabase to store each response, send notifications, and export data.

1. Create a Supabase project.
2. Run this SQL in Supabase SQL Editor:

```sql
create table if not exists public.survey_responses (
	id bigint generated always as identity primary key,
	created_at timestamptz not null default now(),
	language text,
	brands jsonb,
	products jsonb,
	product_ratings jsonb,
	other_product_details jsonb,
	associations jsonb,
	improvement text,
	recommend int,
	age text,
	gender text,
	zip text,
	answers_json jsonb
);

alter table public.survey_responses enable row level security;

drop policy if exists "Allow anonymous inserts" on public.survey_responses;

create policy "Allow anonymous inserts"
on public.survey_responses
for insert
to anon
with check (true);

grant usage on schema public to anon;
grant insert on table public.survey_responses to anon;
grant usage, select on sequence public.survey_responses_id_seq to anon;
```

3. Create `.env` with your Supabase public values:

```bash
VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_ANON_PUBLIC_KEY
```

4. Start app and submit test responses:

```bash
npm run dev
```

### Get notified for every response

In Supabase Dashboard:

1. Go to `Database > Webhooks`.
2. Create webhook on table `survey_responses`, event `INSERT`.
3. Target your notification endpoint:
	 - Slack Incoming Webhook URL, or
	 - Make/Zapier webhook that sends email/Slack/Teams.

Every new survey row will trigger a notification.

### Export data

Options:

1. Supabase Table Editor: `survey_responses` -> `Export CSV`.
2. SQL export in SQL Editor:

```sql
select * from public.survey_responses order by created_at desc;
```

## Getting Started

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open the local Vite URL shown in the terminal to view the premium survey component.

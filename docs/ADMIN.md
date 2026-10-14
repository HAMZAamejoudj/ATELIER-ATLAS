# MOROCCAN TRAVERTINE — Admin dashboard

## Local preview (no Supabase yet)

In development, if `NEXT_PUBLIC_SUPABASE_URL` is not set, **`/atlasadmin` opens without login** so you can work on the UI. To keep that after adding Supabase, set `ATLAS_SKIP_ADMIN_AUTH=true` in `.env.local`.

## Supabase project (MCP)

- **Project ref:** `xhoqdmbrflehxgizvjvf`
- **URL:** `https://xhoqdmbrflehxgizvjvf.supabase.co`
- Schema migrations `atlas_initial_schema` + `atlas_storage_buckets` are applied via Supabase MCP.

## Setup

1. Create a **new Supabase project** (or use the linked project above).
2. Run SQL migrations in `supabase/migrations/` if not already applied.
3. Copy `.env.example` → `.env.local` and fill Supabase + NextAuth values.
   - **Required for `/login`:** paste the real **`service_role`** key (not the anon key) into `SUPABASE_SERVICE_ROLE_KEY`. If it still says `PASTE_SERVICE_ROLE_KEY_HERE`, sign-in will always show “Invalid email or password”.
4. `npm run dev` → open `/login` then `/atlasadmin`.

Default admin (change after first login):

- Email: `admin@atelier-atlas.com`
- Password: `AtelierAtlas#2026`

## Seed catalog from static TS data

```bash
npm run seed
```

Imports all `*-data.ts` products and mock blog posts into Postgres.

## Routes

| Path | Purpose |
|------|---------|
| `/atlasadmin` | Dashboard |
| `/atlasadmin/products` | Products (EN/AR, USD, swatches, filters) |
| `/atlasadmin/blog` | Blog posts |
| `/atlasadmin/library` | Media library (`atlas-site` bucket) |
| `/atlasadmin/seo` | Global SEO |
| `/atlasadmin/static-pages` | About, contact, sur-mesure |
| `/atlasadmin/orders` | Order status (checkout in phase 2) |

## Phase 2

- Wire storefront pages to Supabase reads (replace `*-data.ts`).
- Stripe/PayPal checkout creating `Order` rows.

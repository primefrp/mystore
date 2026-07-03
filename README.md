# FoodStack Commerce

FoodStack Commerce is a modular foodstuff ecommerce SaaS for Nigerian food businesses. The first MVP is focused on the marketplace flow: seller storefronts, products, checkout, orders, delivery, and seller bank details for manual transfer payments.

## Project Docs

- [PRD](docs/PRD.md)
- [Technical Blueprint](docs/TECHNICAL_BLUEPRINT.md)

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Prisma
- PostgreSQL

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Database

Use Supabase PostgreSQL for the production database.

Create `.env` from `.env.example`, set `DATABASE_URL` to your Supabase Postgres connection string, then run:

```bash
npm run db:generate
npm run db:push
npm run db:seed
```

## MVP Areas

- `/` platform overview
- `/s/ajibola-food-market` sample storefront
- `/s/ajibola-food-market/checkout` checkout preview
- `/s/ajibola-food-market/order-confirmation/[orderId]` order confirmation
- `/admin` business admin preview
- `/admin/products` seller product management
- `/admin/orders` seller order management
- `/admin/settings/payments` seller bank account settings
- `/super-admin` SaaS owner preview

The app falls back to sample data for preview if the database is unavailable. Paystack is planned for a later payment phase.

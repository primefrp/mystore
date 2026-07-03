# Technical Blueprint and MVP Implementation Plan

## 1. Purpose

This document translates the PRD into a practical technical plan for building the modular food commerce SaaS.

The first version should prove three things:

- A business can have its own online foodstuff store.
- The platform can support many businesses safely.
- Optional modules such as training and investment can be enabled per business.

## 2. Recommended Tech Stack

### 2.1 Frontend and Backend

- Next.js with App Router
- TypeScript
- React Server Components where useful
- Server Actions or API routes for mutations
- Tailwind CSS
- shadcn/ui or a similar component system
- lucide-react for icons

Reason:

Next.js is a strong fit because the product needs public storefront pages, authenticated dashboards, API endpoints, and SEO-friendly product pages.

### 2.2 Database

- PostgreSQL
- Prisma ORM
- Supabase as the recommended hosted Postgres provider

Reason:

PostgreSQL is reliable for ecommerce, SaaS tenancy, orders, payments, and reporting. Supabase gives hosted Postgres with a friendly dashboard, while Prisma gives a clear schema and migration workflow.

### 2.3 Authentication

- Auth.js / NextAuth
- Email and password for MVP
- OAuth can be added later

Authentication must support:

- Super admin users
- Business users
- Customers

### 2.4 Payments

MVP:

- Pay on delivery
- Bank transfer
- Manual payment confirmation
- Seller bank account details managed by the business

Later:

- Paystack
- Flutterwave

### 2.5 File Storage

MVP options:

- Local storage for development
- Cloudinary, UploadThing, Supabase Storage, or S3-compatible storage for production

Files needed:

- Business logos
- Product images
- Payment proof uploads in a later manual-payment enhancement
- Training images and investment documents in later phases

### 2.6 Deployment

Recommended:

- Vercel for app hosting
- Neon, Supabase, Railway, or Render for PostgreSQL
- Cloudinary or S3-compatible storage for uploaded files

## 3. Architecture Overview

The product should be built as a modular multi-tenant SaaS.

Main layers:

- Public storefront
- Customer account area
- Business admin dashboard
- Super admin dashboard
- Shared backend services
- Tenant and feature access layer

Every tenant-owned record should include `businessId`.

Examples:

- `Product.businessId`
- `Order.businessId`
- `Category.businessId`
- `BankAccount.businessId`
- `BusinessFeature.businessId`

## 4. App Areas

### 4.1 Public Storefront

Purpose:

Let customers browse and buy from a specific business.

Suggested URL structure for MVP:

- `/s/[businessSlug]`
- `/s/[businessSlug]/products`
- `/s/[businessSlug]/products/[productSlug]`
- `/s/[businessSlug]/cart`
- `/s/[businessSlug]/checkout`
- `/s/[businessSlug]/order-confirmation/[orderId]`

Later:

- `business.platform.com`
- Custom domains

### 4.2 Customer Area

Purpose:

Let customers view their orders and later saved addresses or payment history.

Suggested routes:

- `/account`
- `/account/orders`
- `/account/orders/[orderId]`

For MVP, guest checkout can be allowed to reduce friction.

### 4.3 Business Admin Dashboard

Purpose:

Let business owners manage their store.

Suggested routes:

- `/admin`
- `/admin/products`
- `/admin/products/new`
- `/admin/products/[productId]`
- `/admin/categories`
- `/admin/orders`
- `/admin/orders/[orderId]`
- `/admin/customers`
- `/admin/settings`
- `/admin/settings/business`
- `/admin/settings/delivery`
- `/admin/settings/payments`
- `/admin/settings/features`

Business admin access must always be scoped to one business.

### 4.4 Super Admin Dashboard

Purpose:

Let the SaaS owner manage businesses and platform configuration.

Suggested routes:

- `/super-admin`
- `/super-admin/businesses`
- `/super-admin/businesses/new`
- `/super-admin/businesses/[businessId]`
- `/super-admin/subscription-plans`
- `/super-admin/features`
- `/super-admin/users`
- `/super-admin/audit-logs`

## 5. Tenant Resolution

MVP tenant resolution:

- Public storefront resolves business by URL slug: `/s/[businessSlug]`.
- Business admin resolves business from the authenticated user's active business.
- Super admin can select any business.

Later tenant resolution:

- Subdomain routing.
- Custom domain routing.

Rules:

- Never trust a client-provided `businessId` without verifying access.
- All business admin queries must be scoped by authenticated user's business membership.
- Super admin routes must require a platform-level role.

## 6. Feature Toggle System

Each business should have enabled features.

Core idea:

```text
Business
BusinessFeature
FeatureDefinition
SubscriptionPlan
SubscriptionPlanFeature
```

Feature checks should happen in:

- Navigation rendering
- Route access
- Server actions
- API handlers
- Admin forms

Example feature names:

- `storefront`
- `products`
- `orders`
- `manual_payments`
- `delivery`
- `training`
- `investment`
- `wholesale`
- `wallet`
- `referrals`
- `analytics`
- `staff_roles`
- `custom_domain`

Example behavior:

- If `training` is disabled, hide training navigation.
- If a disabled training URL is opened directly, return 404 or a clear access-denied page.
- If `investment` is disabled, block all investment mutations on the server.

## 7. Recommended Data Model Draft

This is a first-pass schema. It should be refined during implementation.

### 7.1 Users and Roles

```text
User
- id
- name
- email
- passwordHash
- platformRole: SUPER_ADMIN | SUPPORT | USER
- createdAt
- updatedAt

BusinessUser
- id
- businessId
- userId
- role: OWNER | ADMIN | SALES | INVENTORY | ORDER_MANAGER
- status: ACTIVE | INVITED | SUSPENDED
- createdAt
- updatedAt
```

### 7.2 Businesses

```text
Business
- id
- name
- slug
- logoUrl
- description
- email
- phone
- address
- currency
- themeColor
- status: ACTIVE | SUSPENDED | ARCHIVED
- createdAt
- updatedAt
```

### 7.3 Features and Plans

```text
FeatureDefinition
- id
- key
- name
- description
- isCore

BusinessFeature
- id
- businessId
- featureKey
- enabled
- source: PLAN | OVERRIDE
- createdAt
- updatedAt

SubscriptionPlan
- id
- name
- price
- billingInterval
- status

SubscriptionPlanFeature
- id
- planId
- featureKey

BusinessSubscription
- id
- businessId
- planId
- status
- currentPeriodStart
- currentPeriodEnd
```

### 7.4 Products and Inventory

```text
Category
- id
- businessId
- name
- slug
- description
- sortOrder
- isActive

Product
- id
- businessId
- categoryId
- name
- slug
- description
- price
- compareAtPrice
- stockQuantity
- unit
- status: ACTIVE | DRAFT | ARCHIVED
- isFeatured
- createdAt
- updatedAt

ProductImage
- id
- productId
- url
- altText
- sortOrder
```

### 7.5 Cart and Orders

```text
Cart
- id
- businessId
- customerId
- sessionId
- status: ACTIVE | CONVERTED | ABANDONED
- createdAt
- updatedAt

CartItem
- id
- cartId
- productId
- quantity
- unitPrice

Order
- id
- businessId
- customerId
- orderNumber
- customerName
- customerEmail
- customerPhone
- deliveryAddress
- deliveryMethod
- paymentMethod
- paymentStatus
- orderStatus
- subtotal
- deliveryFee
- total
- notes
- createdAt
- updatedAt

OrderItem
- id
- orderId
- productId
- productName
- quantity
- unit
- unitPrice
- total
```

### 7.6 Payments and Delivery

```text
Payment
- id
- businessId
- orderId
- amount
- method
- status: PENDING | PAID | FAILED | REFUNDED
- reference
- confirmedByUserId
- confirmedAt
- createdAt

DeliveryZone
- id
- businessId
- name
- fee
- isActive
```

### 7.7 Customers

```text
Customer
- id
- businessId
- userId
- name
- email
- phone
- defaultAddress
- createdAt
- updatedAt
```

For MVP, customer records can be business-specific. A later version can support a global customer identity across many businesses.

### 7.8 Training Module

```text
TrainingProgram
- id
- businessId
- title
- slug
- description
- price
- startDate
- endDate
- location
- onlineLink
- capacity
- instructor
- imageUrl
- status: DRAFT | PUBLISHED | CLOSED | ARCHIVED
- createdAt
- updatedAt

TrainingEnrollment
- id
- businessId
- trainingProgramId
- customerId
- customerName
- customerEmail
- customerPhone
- paymentStatus
- enrollmentStatus: PENDING | CONFIRMED | CANCELLED | COMPLETED
- createdAt
- updatedAt
```

### 7.9 Investment Module Later

Keep investment separate from ecommerce tables.

```text
InvestmentPlan
- id
- businessId
- name
- slug
- description
- minimumAmount
- maximumAmount
- durationDays
- expectedReturnText
- riskNote
- terms
- status
- createdAt
- updatedAt

InvestmentSubscription
- id
- businessId
- investmentPlanId
- customerId
- amount
- paymentStatus
- startDate
- maturityDate
- payoutStatus
- acceptedTermsAt
- createdAt
- updatedAt
```

## 8. Permission Model

### 8.1 Platform Permissions

Super admin can:

- Create businesses.
- Suspend businesses.
- Manage plans.
- Enable and disable features.
- View platform analytics.

Support admin can:

- View businesses.
- Assist with support.
- Not change billing or sensitive feature settings unless allowed.

### 8.2 Business Permissions

Owner can:

- Manage all business settings.
- Manage staff.
- Manage products, orders, payments, delivery, and marketplace settings.

Admin can:

- Manage products, orders, customers, and payment settings.

Order manager can:

- View and update orders.

Inventory manager can:

- Manage products and stock.

Sales can:

- View customers and create orders if manual order creation is added later.

## 9. MVP User Flows

### 9.1 Business Setup Flow

1. Super admin creates a business.
2. Super admin assigns business owner.
3. Business owner logs in.
4. Business owner completes business profile.
5. Business owner adds categories and products.
6. Business storefront becomes usable.

### 9.2 Customer Shopping Flow

1. Customer opens business storefront.
2. Customer browses products.
3. Customer adds products to cart.
4. Customer opens checkout.
5. Customer enters contact and delivery details.
6. Customer selects payment method.
7. System creates order.
8. Business owner receives order in admin dashboard.

### 9.3 Order Management Flow

1. Business owner opens orders.
2. Business owner reviews a new order.
3. Business owner confirms payment if manual.
4. Business owner updates order status.
5. Customer sees latest order status.

### 9.4 Seller Bank Account Flow

1. Business owner opens payment settings.
2. Business owner adds bank name, account name, and account number.
3. Business owner chooses the default account for checkout.
4. Customer chooses bank transfer during checkout.
5. Customer sees the seller's account details.
6. Business owner confirms payment manually after receiving transfer.

## 10. MVP Pages and Components

### 10.1 Public Storefront Pages

- Store home
- Product list
- Product detail
- Cart
- Checkout
- Order confirmation

### 10.2 Business Admin Pages

- Dashboard
- Products list
- Product create/edit
- Categories
- Orders list
- Order detail
- Customers list
- Business settings
- Delivery settings
- Payment settings

### 10.3 Super Admin Pages

- Platform dashboard
- Businesses list
- Business detail
- Create business
- Feature management
- Subscription plans

## 11. API and Server Actions

Suggested service boundaries:

- `businessService`
- `featureService`
- `productService`
- `cartService`
- `orderService`
- `paymentService`
- `deliveryService`
- `bankAccountService`
- `permissionService`

Server-side actions should validate:

- Authentication
- Tenant access
- Feature availability
- Input shape
- Business status

## 12. Validation Rules

Important validation:

- Business slug must be unique.
- Product slug must be unique per business.
- Product price must be greater than or equal to zero.
- Stock quantity must not be negative.
- Order total must be calculated on the server.
- Customer phone number is required for checkout.
- Seller bank account details must be validated before they are shown at checkout.
- Disabled modules cannot be accessed through direct URLs.

## 13. Testing Strategy

MVP test coverage should focus on high-risk areas.

Priority tests:

- Tenant isolation.
- Feature toggle access.
- Product CRUD.
- Cart total calculation.
- Checkout order creation.
- Order status updates.
- Seller bank account visibility at checkout.

Recommended tools:

- Vitest for unit tests.
- Playwright for end-to-end tests.
- Prisma test database for integration tests.

## 14. Implementation Milestones

### Milestone 1: Project Foundation

Deliverables:

- Next.js app scaffold.
- TypeScript configured.
- Tailwind configured.
- Prisma configured.
- PostgreSQL connection.
- Base layout.
- Authentication setup.

### Milestone 2: Multi-Tenant Core

Deliverables:

- Business model.
- User and business membership model.
- Super admin can create businesses.
- Business owner can access assigned dashboard.
- Tenant-aware route helpers.

### Milestone 3: Product Catalog

Deliverables:

- Category CRUD.
- Product CRUD.
- Product images.
- Inventory fields.
- Public product listing.
- Public product detail page.

### Milestone 4: Cart and Checkout

Deliverables:

- Cart functionality.
- Checkout form.
- Delivery method selection.
- Manual payment method selection.
- Seller bank account details shown for bank transfer.
- Order creation.
- Order confirmation page.

### Milestone 5: Order Management

Deliverables:

- Business admin order list.
- Order detail view.
- Payment status management.
- Order status management.
- Basic sales dashboard metrics.

### Milestone 6: Feature Toggle System

Deliverables:

- Feature definitions.
- Business feature settings.
- Super admin feature control.
- Route-level feature guards.
- Navigation hides disabled modules.

### Milestone 7: Seller Payment Settings

Deliverables:

- Bank account create and edit flow.
- Default account selection.
- Bank transfer instructions on checkout.
- Manual payment confirmation workflow.
- Payment status audit trail.

### Milestone 8: Production Readiness

Deliverables:

- Seed data.
- Basic audit logs.
- Error handling.
- Loading and empty states.
- Deployment setup.
- Basic Playwright checks.

## 15. Suggested Folder Structure

```text
app/
  (public)/
    s/
      [businessSlug]/
  (auth)/
  admin/
  super-admin/
components/
  admin/
  storefront/
  shared/
lib/
  auth/
  db/
  features/
  permissions/
  services/
  validators/
prisma/
  schema.prisma
  seed.ts
tests/
  unit/
  e2e/
docs/
```

## 16. Seed Data for Development

Create sample businesses:

- Ajibola Food Market
- Northern Grains Hub
- Lagos Bulk Foods

Create sample categories:

- Rice
- Beans
- Garri
- Oil
- Spices
- Food bundles

Create sample products:

- 50kg Local Rice
- 25kg Foreign Rice
- White Beans
- Brown Beans
- Yellow Garri
- White Garri
- Palm Oil
- Groundnut Oil
- Egusi
- Crayfish

Create sample seller bank accounts:

- Ajibola Food Market Ltd, GTBank
- Northern Grains Hub, Access Bank
- Lagos Bulk Foods, Zenith Bank

## 17. Important Engineering Decisions

### 17.1 Use URL Path Tenancy First

Start with `/s/[businessSlug]` before implementing subdomains.

Reason:

It is simpler for MVP, easier to test locally, and avoids early DNS complexity.

### 17.2 Use Manual Payments First

Start with bank transfer and pay on delivery. Each seller should provide bank name, account name, and account number in their admin settings.

Reason:

It lets the marketplace launch before Paystack setup, business verification, webhook handling, and online-payment reconciliation.

### 17.3 Add Paystack Later

Paystack should be added after manual checkout, order creation, and seller payment settings are stable.

Reason:

The first MVP needs to prove buying and selling foodstuff. Paystack is important, but it adds provider setup, callbacks, webhooks, transaction references, and settlement handling.

### 17.4 Keep Investment as a Separate Module

Investment should not share order tables directly.

Reason:

Investment plans have different lifecycle, terms, maturity dates, payout tracking, and compliance concerns.

## 18. Immediate Next Steps

1. Scaffold the Next.js application.
2. Add Tailwind, Prisma, authentication, and linting.
3. Create initial Prisma schema.
4. Add seed data for sample foodstuff businesses.
5. Build super admin business creation.
6. Build business admin product management.
7. Build public storefront product browsing.
8. Build cart and checkout.
9. Add seller bank account settings.
10. Add feature toggle system.

## 19. Open Technical Questions

- Should the app use server actions only, API routes only, or a mix?
- Which production file storage provider should be used?
- Should customers log in before checkout, or should guest checkout be the default?
- Should email notifications be added in MVP or after the first usable release?
- Should staff roles be included in MVP or released after the first client test?
- Should the SaaS owner manually onboard businesses first, or should businesses self-register?

## 20. Recommended MVP Build Order

The recommended build order is:

1. Project foundation.
2. Authentication.
3. Database schema.
4. Business tenancy.
5. Super admin business setup.
6. Business admin product management.
7. Public storefront.
8. Cart and checkout.
9. Orders.
10. Seller bank account settings.
11. Feature toggles.
12. Deployment.

This order gives us a usable foodstuff marketplace first, then adds the SaaS and module behavior needed to sell the platform to other businesses.

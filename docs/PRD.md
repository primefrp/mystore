# Product Requirements Document: Modular Food Commerce SaaS

## 1. Product Summary

This product is a multi-business ecommerce SaaS platform for foodstuff sellers and agribusiness operators. It allows businesses to sell Nigerian food items such as rice, beans, garri, palm oil, groundnut oil, yam flour, spices, frozen foods, and other groceries online.

The platform will support optional business modules such as investment plans, training programs, wholesale pricing, subscriptions, wallets, referrals, and analytics. Each business can enable only the features it needs, making the product useful for small food vendors, wholesalers, training providers, and agribusinesses.

## 2. Product Vision

To provide foodstuff and agribusiness sellers with an easy-to-use digital platform for selling products, managing customers, receiving orders, and offering optional services such as training and investment plans.

The long-term vision is to become a white-label SaaS platform that can power many independent food and agribusiness brands from one shared system.

## 3. Goals

- Allow multiple businesses to create and manage their own online foodstuff store.
- Let each business customize its brand, products, prices, delivery options, and enabled features.
- Support optional modules that can be activated per business.
- Provide a smooth shopping experience for customers.
- Give business owners a simple dashboard for managing products, orders, customers, and enabled modules.
- Give the SaaS owner a super admin dashboard for managing tenants, plans, billing, and feature access.
- Build the platform in a way that can grow into subscriptions, custom domains, staff accounts, analytics, and integrations.

## 4. Non-Goals for MVP

- Native mobile apps.
- Advanced warehouse automation.
- Full accounting system.
- Complex investment compliance workflows.
- Marketplace where many vendors sell under one shared public brand.
- AI-based recommendations.
- Offline POS system.

These can be considered in later phases.

## 5. Target Users

### 5.1 SaaS Owner

The platform owner who sells this software to different businesses.

Needs:

- Create and manage businesses.
- Enable or disable business features.
- Manage subscription plans.
- Monitor usage, revenue, and platform activity.
- Suspend or activate businesses.

### 5.2 Business Owner

A foodstuff seller, wholesaler, trainer, or agribusiness operator.

Needs:

- Create products and categories.
- Manage orders and customers.
- Configure payment, delivery, pickup, and business information.
- Enable optional features such as investment or training.
- Track sales performance.

### 5.3 Customer

A buyer who visits a business storefront.

Needs:

- Browse food items.
- Add products to cart.
- Place orders.
- Pay online or choose allowed payment options.
- Track order status.
- Register, log in, and view order history.

### 5.4 Student or Trainee

A customer who registers for training programs.

Needs:

- View available training programs.
- Register for free or paid classes.
- Access training details, schedule, and materials.
- Track enrollment status.

### 5.5 Investor

A customer who participates in an investment plan offered by a business.

Needs:

- View available plans.
- Understand plan terms, amount, duration, expected return, and risk notes.
- Subscribe to a plan.
- Track contribution, maturity date, payout status, and transaction records.

## 6. Core Product Structure

The product will have three main areas:

### 6.1 Public Storefront

Each business gets a public website where customers can shop.

Examples:

- `businessname.platform.com`
- `businessdomain.com` in later phases

Key storefront features:

- Homepage
- Product listing
- Product details
- Categories
- Search and filters
- Cart
- Checkout
- Customer account
- Order confirmation
- Optional pages for training and investment plans

### 6.2 Business Admin Dashboard

Each business owner logs in to manage their store.

Key admin features:

- Dashboard overview
- Product management
- Category management
- Inventory management
- Order management
- Customer management
- Business settings
- Delivery and pickup settings
- Payment settings
- Feature module settings
- Staff management in later phase

### 6.3 Super Admin Dashboard

The SaaS owner uses this area to manage the whole platform.

Key super admin features:

- Business tenant management
- Subscription plan management
- Feature access management
- Platform analytics
- Billing status
- Business activation and suspension
- Support and audit records

## 7. SaaS and Multi-Tenant Requirements

The platform must be built as a multi-tenant system from the beginning.

Every major record should belong to a business using a `business_id` or `tenant_id`.

Examples:

- Products belong to a business.
- Orders belong to a business.
- Customers can belong to one or many businesses depending on the account model.
- Investment plans belong to a business.
- Training programs belong to a business.
- Feature settings belong to a business.

Each business must have isolated data. A business owner must not see another business's orders, products, customers, investment plans, or training programs.

## 8. Feature Module System

The platform should use feature toggles per business.

Example modules:

- Storefront
- Product catalog
- Orders
- Payments
- Delivery
- Investment plans
- Training
- Wholesale pricing
- Subscriptions
- Wallet
- Referrals
- Analytics
- Staff roles
- Custom domain

Feature access should be controlled by:

- SaaS subscription plan.
- Manual super admin override.
- Business-specific settings.

Example behavior:

- If `investment` is disabled, investment pages and admin menu items should be hidden.
- If `training` is enabled, the business owner can create courses and customers can enroll.
- If `wholesale` is enabled, bulk pricing options appear on products.

## 9. Subscription and Packaging Model

Suggested SaaS plans:

### 9.1 Starter

For small foodstuff sellers.

Included:

- Online storefront
- Product catalog
- Cart and checkout
- Orders
- Basic delivery settings
- Basic dashboard

### 9.2 Growth

For growing stores and wholesalers.

Included:

- Everything in Starter
- Bulk pricing
- Customer records
- Sales analytics
- Staff accounts
- Coupons and discounts

### 9.3 Marketplace Pro

For marketplace sellers that need stronger selling, delivery, payment, and team features.

Included:

- Everything in Growth
- Seller bank account management
- Multiple payment methods
- Delivery zones
- Featured products
- Staff roles
- Advanced analytics

### 9.4 Enterprise

For larger businesses.

Included:

- Everything in Marketplace Pro
- Custom domain
- Multiple branches
- Priority support
- Custom feature configuration
- Advanced reporting

## 10. MVP Scope

The MVP should prove the main SaaS model and ecommerce workflow.

### 10.1 MVP Must-Have Features

- Multi-business setup.
- Business profile and branding.
- Public storefront per business.
- Product categories.
- Product management.
- Product listing and details.
- Cart.
- Checkout.
- Order creation.
- Order status management.
- Customer account or guest checkout.
- Business admin dashboard.
- Super admin dashboard.
- Feature toggle system.
- Basic SaaS plan structure.
- Seller bank account details for manual bank transfer payments.

### 10.2 Deferred Optional Modules

The MVP should not include training or investment plans. These modules remain part of the longer-term platform roadmap, but the first release should focus on a working marketplace experience.

Deferred modules:

- Training programs.
- Investment plans.
- Wallet.
- Referrals.
- Advanced analytics.
- Paystack online payment integration.

## 11. Core Requirements

### 11.1 Business Onboarding

Business owners should be able to create a business profile.

Required fields:

- Business name
- Business slug or subdomain
- Logo
- Contact email
- Phone number
- Address
- Business description
- Currency
- Default delivery method
- Theme color

Acceptance criteria:

- A business can be created by a super admin.
- A business has a unique slug.
- A business storefront can be accessed by its slug.
- Business settings are reflected on the storefront.

### 11.2 Product Management

Business owners should be able to manage foodstuff products.

Required fields:

- Product name
- Description
- Category
- Price
- Stock quantity
- Unit type, such as bag, paint bucket, derica, kg, carton, bottle, pack
- Images
- Availability status
- Optional discount price

Acceptance criteria:

- Admin can create, edit, archive, and delete products.
- Products are visible only on the correct business storefront.
- Out-of-stock products cannot be purchased unless backorder is enabled.
- Product units are clearly shown to customers.

### 11.3 Category Management

Business owners should be able to group products.

Example categories:

- Rice
- Beans
- Garri
- Oil
- Flour
- Spices
- Tubers
- Frozen foods
- Beverages
- Food bundles

Acceptance criteria:

- Admin can create, edit, and delete categories.
- Products can be assigned to categories.
- Customers can filter or browse by category.

### 11.4 Cart and Checkout

Customers should be able to add products to cart and place orders.

Checkout information:

- Customer name
- Phone number
- Email address
- Delivery address
- Delivery method
- Payment method
- Order notes

Acceptance criteria:

- Customer can add, update, and remove cart items.
- Cart total is calculated correctly.
- Checkout creates an order.
- Customer receives an order confirmation.
- Business owner sees the order in admin dashboard.

### 11.5 Order Management

Business owners should be able to manage order status.

Order statuses:

- Pending
- Confirmed
- Processing
- Ready for pickup
- Out for delivery
- Delivered
- Cancelled

Acceptance criteria:

- Admin can view order details.
- Admin can update order status.
- Customer can see order status.
- Order history is retained.

### 11.6 Payment

MVP payment options:

- Pay on delivery
- Bank transfer
- Manual payment confirmation
- Seller-managed bank account details

Later payment integrations:

- Paystack
- Flutterwave
- Stripe where applicable

Acceptance criteria:

- Business can choose allowed payment methods.
- Business can add and edit bank account details.
- Customer can select an allowed payment method during checkout.
- Customer can see the seller's bank name, account name, and account number when bank transfer is selected.
- Admin can mark manual payments as paid.

### 11.7 Delivery and Pickup

Business owners should configure delivery and pickup options.

MVP options:

- Pickup
- Local delivery
- Delivery fee by area

Acceptance criteria:

- Business can enable pickup or delivery.
- Customer can select an available method.
- Delivery fees are included in order total.

## 12. Optional Module Requirements

### 12.1 Training Module

Purpose:

Allow businesses to sell or manage training programs.

Program fields:

- Title
- Description
- Price
- Start date
- End date
- Location or online link
- Capacity
- Instructor
- Image
- Status

Enrollment fields:

- Customer
- Program
- Payment status
- Enrollment status
- Enrollment date

Acceptance criteria:

- Super admin can enable training for a business.
- Business admin can create training programs.
- Customers can view available training programs.
- Customers can enroll.
- Admin can view enrolled students.
- Training menu is hidden when the module is disabled.

### 12.2 Investment Plan Module

Purpose:

Allow businesses to publish and manage investment-style plans related to food or agribusiness.

Important note:

This module may involve financial, legal, or regulatory obligations depending on how businesses use it. The platform should include disclaimers, risk notes, documentation fields, and admin controls. The business using the module is responsible for compliance.

Plan fields:

- Plan name
- Description
- Minimum amount
- Maximum amount
- Duration
- Expected return
- Risk note
- Start date
- Maturity date
- Status
- Supporting documents

Investor record fields:

- Customer
- Plan
- Amount
- Payment status
- Start date
- Maturity date
- Payout status
- Notes

Acceptance criteria:

- Super admin can enable investment for a business.
- Business admin can create investment plans.
- Customers can view plan details and risk notes.
- Customers must accept terms before subscribing.
- Admin can track investors, amounts, maturity dates, and payouts.
- Investment menu is hidden when the module is disabled.

### 12.3 Wholesale Pricing Module

Purpose:

Allow businesses to offer bulk pricing.

Acceptance criteria:

- Admin can define bulk price tiers.
- Product page shows available bulk pricing.
- Cart uses the correct price based on quantity.

### 12.4 Food Subscription Module

Purpose:

Allow customers to subscribe to recurring food packages.

Example:

- Monthly rice and beans package.
- Family food bundle.
- Student food package.

Acceptance criteria:

- Admin can create subscription packages.
- Customer can subscribe.
- Admin can view active subscriptions.

### 12.5 Wallet Module

Purpose:

Allow customers to fund wallet balance and pay from wallet.

Acceptance criteria:

- Customer can view wallet balance.
- Admin can adjust wallet balance with audit trail.
- Customer can use wallet at checkout.

### 12.6 Referral Module

Purpose:

Allow customers to refer others and earn rewards.

Acceptance criteria:

- Customer receives referral code.
- New customer can sign up with referral code.
- Referral reward is tracked.

## 13. Data Model Draft

Core tables:

- users
- businesses
- business_users
- business_features
- subscription_plans
- business_subscriptions
- products
- product_categories
- product_images
- customers
- carts
- cart_items
- orders
- order_items
- payments
- delivery_zones
- audit_logs

Optional module tables:

- training_programs
- training_enrollments
- investment_plans
- investment_subscriptions
- wallet_accounts
- wallet_transactions
- referral_codes
- referral_rewards
- wholesale_price_tiers
- food_subscriptions

## 14. Roles and Permissions

### 14.1 Platform Roles

- Super admin
- Support admin

### 14.2 Business Roles

- Business owner
- Business admin
- Sales manager
- Inventory manager
- Order manager

### 14.3 Customer Roles

- Customer
- Student
- Investor

Users may have more than one role depending on enabled modules.

## 15. User Stories

### 15.1 SaaS Owner

- As a SaaS owner, I want to create a new business so that a client can start selling online.
- As a SaaS owner, I want to enable features for each business so that I can sell different pricing plans.
- As a SaaS owner, I want to suspend a business so that unpaid or inactive clients cannot continue using the platform.

### 15.2 Business Owner

- As a business owner, I want to upload products so that customers can buy my food items online.
- As a business owner, I want to manage orders so that I can process customer purchases.
- As a business owner, I want to configure delivery fees so that customers pay the right delivery amount.
- As a business owner, I want to enable training so that I can sell classes.
- As a business owner, I want to enable investment plans so that I can track investors and payouts.

### 15.3 Customer

- As a customer, I want to browse food items so that I can find what I need.
- As a customer, I want to add items to cart so that I can place an order.
- As a customer, I want to choose delivery or pickup so that I can receive my order conveniently.
- As a customer, I want to see my order status so that I know what is happening.

### 15.4 Student

- As a student, I want to see available training programs so that I can choose one.
- As a student, I want to enroll in a program so that I can attend training.

### 15.5 Investor

- As an investor, I want to view available plans so that I can decide whether to participate.
- As an investor, I want to track my plan so that I know my maturity date and payout status.

## 16. UX Requirements

The interface should be simple, business-focused, and easy for non-technical users.

Design direction:

- Clean dashboard layout.
- Clear navigation between products, orders, customers, and modules.
- Mobile-friendly storefront.
- Fast product browsing.
- Simple checkout.
- Clear order statuses.
- Nigerian food context in units, examples, and categories.
- Avoid unnecessary complexity for small businesses.

## 17. Notifications

MVP notifications:

- Order confirmation email or SMS placeholder.
- Admin notification when new order is placed.
- Payment confirmation status update.

Later notifications:

- WhatsApp order notification.
- Delivery status SMS.
- Training enrollment confirmation.
- Investment maturity reminder.

## 18. Analytics

MVP analytics:

- Total sales.
- Total orders.
- Pending orders.
- Top-selling products.
- Low-stock products.

Later analytics:

- Customer retention.
- Revenue by category.
- Training revenue.
- Investment subscription totals.
- Delivery performance.
- Monthly recurring revenue for SaaS owner.

## 19. Technical Requirements

- Multi-tenant architecture.
- Feature flag system per business.
- Role-based access control.
- Secure authentication.
- Responsive frontend.
- Admin dashboard.
- Public storefront routing by business slug or domain.
- Database records scoped by business.
- Payment integration-ready structure.
- Audit logs for sensitive actions.
- File uploads for product images, logos, documents, and training materials.

## 20. Security and Compliance Requirements

- Business data must be isolated by tenant.
- Admin routes must require authentication.
- Sensitive admin actions should be logged.
- Payment records should not store raw card data.
- Investment module should include risk notes and terms acceptance.
- Super admin should control which businesses can access investment features.
- Customer personal information should be protected.

## 21. Success Metrics

MVP success can be measured by:

- Number of businesses onboarded.
- Number of products created.
- Number of orders placed.
- Checkout completion rate.
- Number of active customers.
- Number of enabled optional modules.
- Number of bank-transfer orders manually confirmed.
- Monthly subscription revenue from businesses.

## 22. Suggested Build Phases

### Phase 1: Foundation

- App structure.
- Authentication.
- Multi-tenant business model.
- Business dashboard.
- Super admin dashboard.
- Feature toggle system.

### Phase 2: Ecommerce MVP

- Product categories.
- Product management.
- Storefront.
- Cart.
- Checkout.
- Orders.
- Delivery and pickup settings.

### Phase 3: Payments and Notifications

- Manual payment confirmation.
- Bank transfer instructions.
- Seller bank account settings.
- Email notifications.
- WhatsApp notification option.

### Phase 4: Online Payment Integration

- Paystack integration.
- Payment references.
- Webhook handling.
- Automatic payment status updates.

### Phase 5: Optional Modules

- Training module or investment module.
- Module-specific admin screens.
- Module-specific storefront pages.
- Feature visibility controls.

### Phase 6: SaaS Commercialization

- Business subscription plans.
- Billing records.
- Usage limits.
- Custom domains.
- Staff roles.
- Analytics.

## 23. Risks and Mitigations

### 23.1 Investment Compliance Risk

Risk:

Investment plans may involve legal or regulatory obligations.

Mitigation:

- Launch training before investment where possible.
- Add terms acceptance and risk notes.
- Require super admin approval before enabling investment.
- Avoid presenting investment returns as guaranteed unless the business has proper compliance.

### 23.2 Multi-Tenant Data Leakage

Risk:

One business may accidentally access another business's data.

Mitigation:

- Scope all queries by `business_id`.
- Add automated tests for tenant isolation.
- Use role-based permissions.

### 23.3 Feature Complexity

Risk:

Too many modules may make the product hard to use.

Mitigation:

- Hide disabled modules.
- Keep MVP focused.
- Add modules gradually.

### 23.4 Payment and Delivery Variation

Risk:

Different businesses may use different delivery and payment methods.

Mitigation:

- Start with configurable manual options.
- Add payment integrations later.
- Support flexible delivery zones.

## 24. Open Questions

- Should customers have one global account across all businesses or separate accounts per business?
- Should businesses self-register, or should the SaaS owner create businesses manually at first?
- When online payment is added, should Paystack be the first provider?
- Should each business get a subdomain in MVP, or should MVP use URL paths such as `/store/business-name`?
- Should the MVP include WhatsApp ordering from day one?
- What subscription pricing should be used for Starter, Growth, Marketplace Pro, and Enterprise?

## 25. Recommended MVP Decision

Build the first version with:

- Multi-business SaaS foundation.
- Foodstuff ecommerce storefront.
- Business admin dashboard.
- Super admin dashboard.
- Feature toggle system.
- Manual payment and delivery configuration.
- Seller bank account details for bank transfer.

Then add Paystack after the manual checkout and order flow is stable. Training and investment plans should remain later optional modules.

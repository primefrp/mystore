import type { FeatureKey } from "./types";

export const featureDefinitions: {
  key: FeatureKey;
  name: string;
  description: string;
  isCore: boolean;
}[] = [
  {
    description: "Public business website and product browsing.",
    isCore: true,
    key: "storefront",
    name: "Storefront",
  },
  {
    description: "Product catalog, categories, pricing, and stock.",
    isCore: true,
    key: "products",
    name: "Products",
  },
  {
    description: "Cart, checkout, and order management.",
    isCore: true,
    key: "orders",
    name: "Orders",
  },
  {
    description: "Seller bank details, bank transfer, and pay-on-delivery confirmation.",
    isCore: true,
    key: "manual_payments",
    name: "Bank Transfer",
  },
  {
    description: "Pickup and delivery fee configuration.",
    isCore: true,
    key: "delivery",
    name: "Delivery",
  },
  {
    description: "Programs, enrollments, and student records.",
    isCore: false,
    key: "training",
    name: "Training",
  },
  {
    description: "Plan subscriptions, maturity dates, and payouts.",
    isCore: false,
    key: "investment",
    name: "Investment",
  },
  {
    description: "Bulk price tiers for resellers and large buyers.",
    isCore: false,
    key: "wholesale",
    name: "Wholesale",
  },
  {
    description: "Customer balances and wallet transactions.",
    isCore: false,
    key: "wallet",
    name: "Wallet",
  },
  {
    description: "Referral codes, rewards, and customer growth.",
    isCore: false,
    key: "referrals",
    name: "Referrals",
  },
  {
    description: "Sales, product, customer, and module reporting.",
    isCore: false,
    key: "analytics",
    name: "Analytics",
  },
  {
    description: "Business staff permissions and team access.",
    isCore: false,
    key: "staff_roles",
    name: "Staff Roles",
  },
  {
    description: "Business-owned storefront domains.",
    isCore: false,
    key: "custom_domain",
    name: "Custom Domain",
  },
];

export const subscriptionPlans: {
  features: FeatureKey[];
  name: string;
  price: number;
}[] = [
  {
    features: ["storefront", "products", "orders", "manual_payments", "delivery"],
    name: "Starter",
    price: 12000,
  },
  {
    features: [
      "storefront",
      "products",
      "orders",
      "manual_payments",
      "delivery",
      "wholesale",
      "analytics",
      "staff_roles",
    ],
    name: "Growth",
    price: 28000,
  },
  {
    features: [
      "storefront",
      "products",
      "orders",
      "manual_payments",
      "delivery",
      "wholesale",
      "analytics",
      "staff_roles",
      "custom_domain",
    ],
    name: "Marketplace Pro",
    price: 55000,
  },
];

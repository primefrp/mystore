import type {
  BankAccount,
  Business,
  Category,
  FeatureKey,
  Order,
  Product,
  TrainingProgram,
} from "./types";

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

export const subscriptionPlans = [
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

export const sampleBusinesses: Business[] = [
  {
    address: "Ikeja, Lagos",
    currency: "NGN",
    description: "Retail and bulk Nigerian foodstuff for households, students, and small restaurants.",
    email: "orders@ajibolafoods.example",
    enabledFeatures: [
      "storefront",
      "products",
      "orders",
      "manual_payments",
      "delivery",
      "wholesale",
      "analytics",
    ],
    id: "biz_ajibola",
    name: "Ajibola Food Market",
    phone: "+234 801 234 0001",
    plan: "Marketplace Pro",
    slug: "ajibola-food-market",
    status: "ACTIVE",
    themeColor: "#047857",
  },
  {
    address: "Kano Municipal, Kano",
    currency: "NGN",
    description: "Bulk grains supplier focused on rice, beans, maize, millet, and wholesale delivery.",
    email: "sales@northerngrains.example",
    enabledFeatures: [
      "storefront",
      "products",
      "orders",
      "manual_payments",
      "delivery",
      "wholesale",
      "analytics",
    ],
    id: "biz_northern",
    name: "Northern Grains Hub",
    phone: "+234 802 345 0002",
    plan: "Growth",
    slug: "northern-grains-hub",
    status: "ACTIVE",
    themeColor: "#9a3412",
  },
  {
    address: "Yaba, Lagos",
    currency: "NGN",
    description: "Food bundles, oils, garri, beans, and pantry restock packages for busy homes.",
    email: "hello@lagosbulkfoods.example",
    enabledFeatures: ["storefront", "products", "orders", "manual_payments", "delivery"],
    id: "biz_lagos_bulk",
    name: "Lagos Bulk Foods",
    phone: "+234 803 456 0003",
    plan: "Starter",
    slug: "lagos-bulk-foods",
    status: "ACTIVE",
    themeColor: "#b45309",
  },
];

export const sampleBankAccounts: BankAccount[] = [
  {
    accountName: "Ajibola Food Market Ltd",
    accountNumber: "0123456789",
    bankName: "GTBank",
    businessId: "biz_ajibola",
    id: "bank_ajibola_gtb",
    isActive: true,
    isDefault: true,
  },
  {
    accountName: "Northern Grains Hub",
    accountNumber: "2233445566",
    bankName: "Access Bank",
    businessId: "biz_northern",
    id: "bank_northern_access",
    isActive: true,
    isDefault: true,
  },
  {
    accountName: "Lagos Bulk Foods",
    accountNumber: "3344556677",
    bankName: "Zenith Bank",
    businessId: "biz_lagos_bulk",
    id: "bank_lagos_zenith",
    isActive: true,
    isDefault: true,
  },
];

export const sampleCategories: Category[] = [
  { businessId: "biz_ajibola", id: "cat_rice", name: "Rice", slug: "rice" },
  { businessId: "biz_ajibola", id: "cat_beans", name: "Beans", slug: "beans" },
  { businessId: "biz_ajibola", id: "cat_garri", name: "Garri", slug: "garri" },
  { businessId: "biz_ajibola", id: "cat_oil", name: "Oil", slug: "oil" },
  { businessId: "biz_ajibola", id: "cat_spices", name: "Spices", slug: "spices" },
  { businessId: "biz_ajibola", id: "cat_bundles", name: "Food Bundles", slug: "food-bundles" },
];

export const sampleProducts: Product[] = [
  {
    businessId: "biz_ajibola",
    categoryId: "cat_rice",
    compareAtPrice: 82000,
    description: "Clean stone-free local rice suitable for homes, restaurants, and bulk buyers.",
    id: "prod_local_rice",
    isFeatured: true,
    name: "50kg Local Rice",
    price: 78000,
    slug: "50kg-local-rice",
    status: "ACTIVE",
    stockQuantity: 42,
    unit: "50kg bag",
  },
  {
    businessId: "biz_ajibola",
    categoryId: "cat_beans",
    description: "Freshly sourced brown beans, available in derica, paint bucket, and bag quantities.",
    id: "prod_brown_beans",
    isFeatured: true,
    name: "Brown Beans",
    price: 5200,
    slug: "brown-beans",
    status: "ACTIVE",
    stockQuantity: 130,
    unit: "paint bucket",
  },
  {
    businessId: "biz_ajibola",
    categoryId: "cat_garri",
    description: "Crisp yellow garri with smooth texture for drinking, eba, and household storage.",
    id: "prod_yellow_garri",
    isFeatured: true,
    name: "Yellow Garri",
    price: 3200,
    slug: "yellow-garri",
    status: "ACTIVE",
    stockQuantity: 88,
    unit: "paint bucket",
  },
  {
    businessId: "biz_ajibola",
    categoryId: "cat_oil",
    description: "Rich red palm oil packed in sealed bottles and kegs.",
    id: "prod_palm_oil",
    isFeatured: false,
    name: "Palm Oil",
    price: 14500,
    slug: "palm-oil",
    status: "ACTIVE",
    stockQuantity: 64,
    unit: "5 litre keg",
  },
  {
    businessId: "biz_ajibola",
    categoryId: "cat_spices",
    description: "Neatly processed egusi for soups, restaurants, and home cooking.",
    id: "prod_egusi",
    isFeatured: false,
    name: "Ground Egusi",
    price: 4500,
    slug: "ground-egusi",
    status: "ACTIVE",
    stockQuantity: 51,
    unit: "1kg pack",
  },
  {
    businessId: "biz_ajibola",
    categoryId: "cat_bundles",
    description: "A monthly pantry bundle with rice, beans, garri, oil, and soup ingredients.",
    id: "prod_family_bundle",
    isFeatured: true,
    name: "Family Food Bundle",
    price: 115000,
    slug: "family-food-bundle",
    status: "ACTIVE",
    stockQuantity: 18,
    unit: "bundle",
  },
];

export const sampleOrders: Order[] = [
  {
    businessId: "biz_ajibola",
    createdAt: "2026-06-20T06:20:00.000Z",
    customerName: "Chioma Okafor",
    customerPhone: "+234 806 111 2222",
    id: "ord_1001",
    orderNumber: "AFM-1001",
    orderStatus: "CONFIRMED",
    paymentStatus: "PENDING",
    total: 97200,
  },
  {
    businessId: "biz_ajibola",
    createdAt: "2026-06-20T07:10:00.000Z",
    customerName: "Musa Lawal",
    customerPhone: "+234 807 333 4444",
    id: "ord_1002",
    orderNumber: "AFM-1002",
    orderStatus: "PROCESSING",
    paymentStatus: "PAID",
    total: 156000,
  },
  {
    businessId: "biz_ajibola",
    createdAt: "2026-06-19T15:45:00.000Z",
    customerName: "Adaeze Nwankwo",
    customerPhone: "+234 809 555 6666",
    id: "ord_1003",
    orderNumber: "AFM-1003",
    orderStatus: "OUT_FOR_DELIVERY",
    paymentStatus: "PAID",
    total: 34800,
  },
];

export const sampleTrainingPrograms: TrainingProgram[] = [
  {
    businessId: "biz_ajibola",
    capacity: 40,
    description: "A practical class on sourcing, pricing, packaging, and selling Nigerian foodstuff online.",
    endDate: "2026-07-08",
    enrolled: 18,
    id: "train_food_business",
    instructor: "Bimpe Ajibola",
    location: "Ikeja, Lagos",
    price: 25000,
    slug: "foodstuff-business-starter-class",
    startDate: "2026-07-06",
    status: "PUBLISHED",
    title: "Foodstuff Business Starter Class",
  },
  {
    businessId: "biz_ajibola",
    capacity: 60,
    description: "Supplier selection, quality checks, logistics planning, and stock rotation for bulk buyers.",
    endDate: "2026-07-18",
    enrolled: 24,
    id: "train_bulk_sourcing",
    instructor: "Sani Bello",
    location: "Online",
    price: 35000,
    slug: "bulk-food-sourcing-workshop",
    startDate: "2026-07-18",
    status: "PUBLISHED",
    title: "Bulk Food Sourcing Workshop",
  },
];

export function getBusinessBySlug(slug: string) {
  return sampleBusinesses.find((business) => business.slug === slug);
}

export function getProductsForBusiness(businessId: string) {
  return sampleProducts.filter((product) => product.businessId === businessId);
}

export function getProductBySlug(businessId: string, slug: string) {
  return sampleProducts.find((product) => product.businessId === businessId && product.slug === slug);
}

export function getCategoriesForBusiness(businessId: string) {
  return sampleCategories.filter((category) => category.businessId === businessId);
}

export function getOrdersForBusiness(businessId: string) {
  return sampleOrders.filter((order) => order.businessId === businessId);
}

export function getBankAccountsForBusiness(businessId: string) {
  return sampleBankAccounts.filter((account) => account.businessId === businessId && account.isActive);
}

export function getDefaultBankAccount(businessId: string) {
  return getBankAccountsForBusiness(businessId).find((account) => account.isDefault);
}

export function getTrainingForBusiness(businessId: string) {
  return sampleTrainingPrograms.filter((program) => program.businessId === businessId);
}

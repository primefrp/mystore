export type FeatureKey =
  | "storefront"
  | "products"
  | "orders"
  | "manual_payments"
  | "delivery"
  | "training"
  | "investment"
  | "wholesale"
  | "wallet"
  | "referrals"
  | "analytics"
  | "staff_roles"
  | "custom_domain";

export type BusinessStatus = "ACTIVE" | "SUSPENDED" | "ARCHIVED";

export type ProductStatus = "ACTIVE" | "DRAFT" | "ARCHIVED";

export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PROCESSING"
  | "READY_FOR_PICKUP"
  | "OUT_FOR_DELIVERY"
  | "DELIVERED"
  | "CANCELLED";

export type PaymentStatus = "PENDING" | "PAID" | "FAILED" | "REFUNDED";

export type Business = {
  id: string;
  name: string;
  slug: string;
  description: string;
  email: string;
  phone: string;
  address: string;
  currency: string;
  themeColor: string;
  status: BusinessStatus;
  plan: string;
  enabledFeatures: FeatureKey[];
};

export type BankAccount = {
  id: string;
  businessId: string;
  bankName: string;
  accountName: string;
  accountNumber: string;
  isDefault: boolean;
  isActive: boolean;
};

export type Category = {
  id: string;
  businessId: string;
  name: string;
  slug: string;
};

export type Product = {
  id: string;
  businessId: string;
  categoryId: string;
  imageUrl?: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  stockQuantity: number;
  unit: string;
  status: ProductStatus;
  isFeatured: boolean;
};

export type Order = {
  id: string;
  businessId: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  total: number;
  createdAt: string;
};

export type TrainingProgram = {
  id: string;
  businessId: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  startDate: string;
  endDate: string;
  location: string;
  capacity: number;
  enrolled: number;
  instructor: string;
  status: "DRAFT" | "PUBLISHED" | "CLOSED" | "ARCHIVED";
};

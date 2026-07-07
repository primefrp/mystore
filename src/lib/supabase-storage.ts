import { slugify } from "@/lib/slug";

const DEFAULT_PRODUCT_IMAGE_BUCKET = "product-images";
const MAX_PRODUCT_IMAGE_SIZE = 5 * 1024 * 1024;
const ALLOWED_PRODUCT_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

type ProductImageUploadInput = {
  businessSlug: string;
  file: File;
  productName: string;
};

function getStorageConfig() {
  const supabaseUrl = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL ?? getSupabaseUrlFromDatabaseUrl();
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const bucket = process.env.SUPABASE_STORAGE_BUCKET ?? DEFAULT_PRODUCT_IMAGE_BUCKET;

  return {
    bucket,
    serviceRoleKey,
    supabaseUrl,
  };
}

function getSupabaseUrlFromDatabaseUrl() {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    return undefined;
  }

  try {
    const url = new URL(databaseUrl);
    const usernameProjectRef = url.username.startsWith("postgres.") ? url.username.split(".")[1] : undefined;
    const directHostProjectRef = url.hostname.startsWith("db.") && url.hostname.endsWith(".supabase.co") ? url.hostname.split(".")[1] : undefined;
    const projectRef = usernameProjectRef ?? directHostProjectRef;

    return projectRef ? `https://${projectRef}.supabase.co` : undefined;
  } catch {
    return undefined;
  }
}

function getFileExtension(file: File) {
  const nameExtension = file.name.split(".").pop()?.toLowerCase();

  if (nameExtension && /^[a-z0-9]+$/.test(nameExtension)) {
    return nameExtension === "jpg" ? "jpeg" : nameExtension;
  }

  if (file.type === "image/png") {
    return "png";
  }

  if (file.type === "image/webp") {
    return "webp";
  }

  if (file.type === "image/gif") {
    return "gif";
  }

  return "jpeg";
}

function getPublicStorageUrl(supabaseUrl: string, bucket: string, path: string) {
  const baseUrl = supabaseUrl.replace(/\/+$/, "");
  const encodedPath = path.split("/").map(encodeURIComponent).join("/");

  return `${baseUrl}/storage/v1/object/public/${encodeURIComponent(bucket)}/${encodedPath}`;
}

export function getSupabaseStorageSetupIssue() {
  const { serviceRoleKey, supabaseUrl } = getStorageConfig();

  if (!supabaseUrl) {
    return "SUPABASE_URL is missing. Add your project URL in Vercel to upload product images.";
  }

  if (!serviceRoleKey) {
    return "SUPABASE_SERVICE_ROLE_KEY is missing. Add it in Vercel so the server can upload product images.";
  }

  try {
    new URL(supabaseUrl);
  } catch {
    return "SUPABASE_URL is invalid. It should look like https://your-project-ref.supabase.co.";
  }

  return undefined;
}

export async function uploadProductImage({ businessSlug, file, productName }: ProductImageUploadInput) {
  if (file.size === 0) {
    return undefined;
  }

  if (!ALLOWED_PRODUCT_IMAGE_TYPES.has(file.type)) {
    throw new Error("Product image must be a JPG, PNG, WebP, or GIF file.");
  }

  if (file.size > MAX_PRODUCT_IMAGE_SIZE) {
    throw new Error("Product image must be 5MB or smaller.");
  }

  const setupIssue = getSupabaseStorageSetupIssue();

  if (setupIssue) {
    throw new Error(setupIssue);
  }

  const { bucket, serviceRoleKey, supabaseUrl } = getStorageConfig();
  const safeBusinessSlug = slugify(businessSlug) || "store";
  const safeProductName = slugify(productName) || "product";
  const extension = getFileExtension(file);
  const imagePath = `${safeBusinessSlug}/products/${safeProductName}-${Date.now()}.${extension}`;
  const uploadUrl = `${supabaseUrl?.replace(/\/+$/, "")}/storage/v1/object/${encodeURIComponent(bucket)}/${imagePath
    .split("/")
    .map(encodeURIComponent)
    .join("/")}`;
  const uploadResponse = await fetch(uploadUrl, {
    body: Buffer.from(await file.arrayBuffer()),
    headers: {
      apikey: serviceRoleKey ?? "",
      Authorization: `Bearer ${serviceRoleKey}`,
      "Cache-Control": "31536000",
      "Content-Type": file.type,
      "x-upsert": "false",
    },
    method: "POST",
  });

  if (!uploadResponse.ok) {
    const errorText = await uploadResponse.text();
    throw new Error(`Product image upload failed. Check the Supabase Storage bucket "${bucket}". ${errorText}`);
  }

  return getPublicStorageUrl(supabaseUrl ?? "", bucket, imagePath);
}

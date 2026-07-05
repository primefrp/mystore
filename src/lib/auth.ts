import { cookies } from "next/headers";

export const ACTIVE_BUSINESS_COOKIE = "foodstack-active-business";

export type SessionUser = {
  id: string;
  name: string;
  email: string;
  platformRole: "SUPER_ADMIN" | "SUPPORT" | "USER";
  activeBusinessId?: string;
};

export async function getCurrentUser(): Promise<SessionUser> {
  const activeBusinessSlug = await getActiveBusinessSlug();

  return {
    activeBusinessId: activeBusinessSlug,
    email: "store.owner@example.com",
    id: "current_store_owner",
    name: "Store Owner",
    platformRole: "USER",
  };
}

export async function getActiveBusinessSlug() {
  const cookieStore = await cookies();

  return cookieStore.get(ACTIVE_BUSINESS_COOKIE)?.value;
}

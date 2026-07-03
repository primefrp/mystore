export type SessionUser = {
  id: string;
  name: string;
  email: string;
  platformRole: "SUPER_ADMIN" | "SUPPORT" | "USER";
  activeBusinessId?: string;
};

export async function getCurrentUser(): Promise<SessionUser> {
  return {
    activeBusinessId: "biz_ajibola",
    email: "admin@foodstack.example",
    id: "user_super_admin",
    name: "Platform Admin",
    platformRole: "SUPER_ADMIN",
  };
}

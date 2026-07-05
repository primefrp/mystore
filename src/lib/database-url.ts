export function normalizeDatabaseUrl(value: string) {
  try {
    return new URL(value).toString();
  } catch {
    return value;
  }
}

export function getDatabaseUrlSetupIssue(value: string | undefined) {
  if (!value) {
    return "DATABASE_URL is missing in Vercel. Add it in Project Settings > Environment Variables, then redeploy.";
  }

  let url: URL;
  try {
    url = new URL(normalizeDatabaseUrl(value));
  } catch {
    return "DATABASE_URL is not a valid Postgres URL. Check the value in Vercel and encode special password characters like @ as %40.";
  }

  if (url.protocol !== "postgresql:" && url.protocol !== "postgres:") {
    return "DATABASE_URL must start with postgresql://. Check the database URL in Vercel.";
  }

  if (url.hostname.startsWith("db.") && url.hostname.endsWith(".supabase.co")) {
    return "Vercel is using the Supabase direct database URL. Use Supabase's pooler URL instead, with a host ending in pooler.supabase.com, then redeploy.";
  }

  if (url.hostname.includes("pooler.supabase.com") && !url.username.includes(".")) {
    return "The Supabase pooler username should look like postgres.your-project-ref. Check the DATABASE_URL username in Vercel.";
  }

  return undefined;
}

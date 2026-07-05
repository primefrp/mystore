export function normalizeDatabaseUrl(value: string) {
  try {
    return new URL(value).toString();
  } catch {
    return value;
  }
}

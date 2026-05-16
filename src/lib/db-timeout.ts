const DEFAULT_DB_TIMEOUT_MS = 8_000;

export async function withDbTimeout<T>(promise: Promise<T>, ms = DEFAULT_DB_TIMEOUT_MS): Promise<T> {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;

  const timeout = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(() => reject(new Error("Database query timed out")), ms);
  });

  try {
    return await Promise.race([promise, timeout]);
  } finally {
    if (timeoutId) clearTimeout(timeoutId);
  }
}

export function getApiErrorMessage(
  error: unknown,
  fallback = "Đã có lỗi xảy ra",
): string {
  const err = error as { response?: { data?: { message?: string | string[] } } };
  const msg = err.response?.data?.message;
  if (Array.isArray(msg)) return msg.join(", ");
  if (typeof msg === "string") return msg;
  return fallback;
}

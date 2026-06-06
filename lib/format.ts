export function formatOrderDate(value: string | Date): string {
  const d = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(d.getTime())) return String(value);
  return d.toLocaleDateString("vi-VN", { dateStyle: "medium" });
}

export function orderIdShort(id: string): string {
  return id.length > 6 ? id.slice(-6) : id;
}

export function scheduledDateKey(value: string | Date): string {
  const d = typeof value === "string" ? new Date(value) : value;
  return d.toISOString().split("T")[0];
}

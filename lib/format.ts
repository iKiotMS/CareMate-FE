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

export function formatVND(value: number): string {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(value ?? 0);
}

/** "1 giờ 45 phút" / "45 phút". Used for actual-vs-booked duration. */
export function formatDuration(minutes: number): string {
  const abs = Math.abs(Math.round(minutes));
  const h = Math.floor(abs / 60);
  const m = abs % 60;
  if (h === 0) return `${m} phút`;
  if (m === 0) return `${h} giờ`;
  return `${h} giờ ${m} phút`;
}

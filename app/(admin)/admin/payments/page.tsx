"use client";

import { useState } from "react";
import { useAdminOrders } from "@/hooks/useApi";
import { PageHeader } from "@/components/shared/PageHeader";
import { FilterTabs } from "@/components/shared/EmptyState";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { SkeletonTable } from "@/components/ui/Skeleton";
import { Badge } from "@/components/ui/Badge";
import { PAYMENT_STATUS_VARIANT, PAYMENT_METHOD_LABEL } from "@/lib/constants";
import type { Order } from "@/types";

const STATUS_TABS = [
  { id: "", label: "All" },
  { id: "UNPAID", label: "Unpaid" },
  { id: "PAID", label: "Paid" },
  { id: "REFUNDED", label: "Refunded" },
];

export default function AdminPaymentsPage() {
  const [paymentStatus, setPaymentStatus] = useState("");
  const { data, isLoading, isError, refetch } = useAdminOrders({ limit: 50 });

  const orders: Order[] = (data?.data ?? data ?? []) as Order[];
  const filtered = paymentStatus
    ? orders.filter((o) => o.paymentStatus === paymentStatus)
    : orders;

  if (isLoading) return <SkeletonTable rows={8} />;
  if (isError) return <ErrorState onRetry={refetch} />;

  return (
    <div className="p-6 space-y-4">
      <PageHeader title="Payments" subtitle={`${filtered.length} orders`} />

      <FilterTabs tabs={STATUS_TABS} active={paymentStatus} onChange={setPaymentStatus} />

      {filtered.length === 0 ? (
        <EmptyState title="No payment records found" />
      ) : (
        <div className="rounded-xl border border-[var(--color-border)] overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-[var(--color-bg-muted)] text-[var(--color-text-secondary)]">
              <tr>
                <th className="px-4 py-3 text-left font-medium">Order</th>
                <th className="px-4 py-3 text-left font-medium">Customer</th>
                <th className="px-4 py-3 text-left font-medium">Amount</th>
                <th className="px-4 py-3 text-left font-medium">Method</th>
                <th className="px-4 py-3 text-left font-medium">Status</th>
                <th className="px-4 py-3 text-left font-medium">Paid At</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)]">
              {filtered.map((o) => (
                <tr key={o._id} className="hover:bg-[var(--color-surface-hover)]">
                  <td className="px-4 py-3 font-mono text-xs text-[var(--color-text-muted)]">
                    #{o._id.slice(-6).toUpperCase()}
                  </td>
                  <td className="px-4 py-3 text-[var(--color-text)]">
                    {o.customerName ?? o.customerId.slice(-6)}
                  </td>
                  <td className="px-4 py-3 font-medium text-[var(--color-text)]">
                    {(o.totalAmount ?? 0).toLocaleString("vi-VN")} ₫
                  </td>
                  <td className="px-4 py-3 text-[var(--color-text-secondary)]">
                    {PAYMENT_METHOD_LABEL[o.paymentMethod] ?? o.paymentMethod}
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={PAYMENT_STATUS_VARIANT[o.paymentStatus] as any}>
                      {o.paymentStatus}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-[var(--color-text-muted)]">
                    {o.paidAt ? new Date(o.paidAt).toLocaleDateString("vi-VN") : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

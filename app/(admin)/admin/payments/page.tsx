"use client";

import { useState } from "react";
import { useRevenueDashboard, useAdminPaymentStats, useAdminOrders } from "@/hooks/useApi";
import { PageHeader } from "@/components/shared/PageHeader";
import { FilterTabs } from "@/components/shared/EmptyState";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { SkeletonTable, SkeletonStatCard } from "@/components/ui/Skeleton";
import { SimpleStatCard } from "@/components/shared/StatCard";
import { Badge } from "@/components/ui/Badge";
import { PAYMENT_STATUS_VARIANT, PAYMENT_METHOD_LABEL } from "@/lib/constants";
import type { Order } from "@/types";

const STATUS_TABS = [
  { id: "",         label: "Tất cả" },
  { id: "UNPAID",   label: "Chưa thanh toán" },
  { id: "PAID",     label: "Đã thanh toán" },
  { id: "REFUNDED", label: "Hoàn tiền" },
];

function formatVND(v: number) {
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(v);
}

export default function AdminPaymentsPage() {
  const [paymentStatus, setPaymentStatus] = useState("");

  const { data: revenueData, isLoading: loadingRevenue } = useRevenueDashboard();
  const { data: statsData,   isLoading: loadingStats   } = useAdminPaymentStats();
  const { data: ordersRaw,   isLoading: loadingOrders, isError: errOrders, refetch } = useAdminOrders({ limit: 50 });

  const orders: Order[] = (Array.isArray(ordersRaw) ? ordersRaw : (ordersRaw as any)?.data ?? []) as Order[];
  const filtered = paymentStatus
    ? orders.filter((o) => o.paymentStatus === paymentStatus)
    : orders;

  const stats = statsData as any;
  const revenue = revenueData as any;

  return (
    <div className="p-6 space-y-6">
      <PageHeader title="Thanh toán & Doanh thu" />

      {/* Revenue summary */}
      {loadingRevenue || loadingStats ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => <SkeletonStatCard key={i} />)}
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <SimpleStatCard title="Doanh thu tháng này"    value={formatVND(revenue?.revenueThisMonth  ?? 0)} />
          <SimpleStatCard title="Tăng trưởng"             value={`+${revenue?.growthRate?.toFixed(1) ?? 0}%`} />
          <SimpleStatCard title="Tổng đã thu"             value={formatVND(stats?.totalCollected ?? 0)} />
          <SimpleStatCard title="Đơn chưa thanh toán"     value={stats?.unpaid ?? 0} />
        </div>
      )}

      {/* Payment method breakdown */}
      {!loadingStats && stats && (
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Tiền mặt",        value: stats.cashAmount,    color: "var(--color-success)" },
            { label: "Chuyển khoản",    value: stats.bankAmount,    color: "var(--color-primary)" },
            { label: "Ví điện tử",      value: stats.eWalletAmount, color: "var(--color-warning)" },
          ].map((m) => (
            <div key={m.label} className="rounded-xl border border-[var(--color-border)] p-4 text-center">
              <p className="text-xs text-[var(--color-text-muted)] mb-1">{m.label}</p>
              <p className="text-lg font-bold" style={{ color: m.color }}>{formatVND(m.value)}</p>
            </div>
          ))}
        </div>
      )}

      {/* Order payment table */}
      <div>
        <FilterTabs tabs={STATUS_TABS} active={paymentStatus} onChange={setPaymentStatus} className="mb-4" />

        {loadingOrders ? (
          <SkeletonTable rows={8} />
        ) : errOrders ? (
          <ErrorState onRetry={refetch} />
        ) : filtered.length === 0 ? (
          <EmptyState title="Không có dữ liệu thanh toán" />
        ) : (
          <div className="rounded-xl border border-[var(--color-border)] overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-[var(--color-bg-muted)] text-[var(--color-text-secondary)]">
                <tr>
                  <th className="px-4 py-3 text-left font-medium">Đơn</th>
                  <th className="px-4 py-3 text-left font-medium">Khách hàng</th>
                  <th className="px-4 py-3 text-right font-medium">Tổng tiền</th>
                  <th className="px-4 py-3 text-left font-medium">Phương thức</th>
                  <th className="px-4 py-3 text-left font-medium">Trạng thái</th>
                  <th className="px-4 py-3 text-left font-medium">Thanh toán lúc</th>
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
                    <td className="px-4 py-3 text-right font-medium text-[var(--color-text)]">
                      {formatVND(o.totalAmount ?? 0)}
                    </td>
                    <td className="px-4 py-3 text-[var(--color-text-secondary)]">
                      {PAYMENT_METHOD_LABEL[o.paymentMethod] ?? o.paymentMethod}
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={PAYMENT_STATUS_VARIANT[o.paymentStatus] as any}>
                        {o.paymentStatus === "PAID" ? "Đã thanh toán"
                          : o.paymentStatus === "REFUNDED" ? "Hoàn tiền"
                          : "Chưa thanh toán"}
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
    </div>
  );
}

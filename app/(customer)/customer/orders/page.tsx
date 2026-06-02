"use client";

import { useState } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/shared/PageHeader";
import { FilterTabs } from "@/components/shared/EmptyState";
import { OrderStatusBadge } from "@/components/shared/OrderStatusBadge";
import { DataTable, TableRow, TableCell } from "@/components/ui/DataTable";
import { Button } from "@/components/ui/Button";
import { t } from "@/lib/i18n";
import { useCustomerOrders } from "@/hooks/useApi";
import { formatOrderDate, orderIdShort } from "@/lib/format";
import type { Order, OrderStatus } from "@/types";
import { Loader2 } from "lucide-react";

const FILTERS = [
  { id: "ALL", label: t("common.all") },
  { id: "PENDING", label: t("status.pending") },
  { id: "ASSIGNED", label: t("status.assigned") },
  { id: "ACCEPTED", label: t("status.accepted") },
  { id: "IN_PROGRESS", label: t("status.inProgress") },
  { id: "REVIEW_PENDING", label: t("status.reviewPending") },
  { id: "COMPLETED", label: t("status.completed") },
  { id: "CANCELLED", label: t("status.cancelled") },
];

export default function CustomerOrdersPage() {
  const [filter, setFilter] = useState("ALL");
  const statusParam = filter === "ALL" ? undefined : filter;
  const { data: ordersRaw, isLoading, isError, refetch } = useCustomerOrders(statusParam);
  const list = (Array.isArray(ordersRaw) ? ordersRaw : []) as Order[];

  return (
    <div>
      <PageHeader
        title={t("customer.orders.title")}
        action={
          <Link href="/customer/book">
            <Button size="sm">{t("nav.customer.book")}</Button>
          </Link>
        }
      />

      <FilterTabs tabs={FILTERS} active={filter} onChange={setFilter} className="mb-6" />

      {isLoading ? (
        <p className="flex items-center gap-2 text-[var(--color-text-muted)]">
          <Loader2 className="w-5 h-5 animate-spin" /> {t("common.loading")}
        </p>
      ) : isError ? (
        <p className="text-red-600">
          Không tải được đơn hàng.{" "}
          <button type="button" className="underline" onClick={() => refetch()}>Thử lại</button>
        </p>
      ) : list.length === 0 ? (
        <p className="text-[var(--color-text-muted)]">
          {t("common.noData")}. <Link href="/customer/book" className="text-[var(--color-primary)] underline">Đặt dịch vụ</Link>
        </p>
      ) : (
        <DataTable
          headers={[
            t("customer.orders.orderId"),
            t("customer.orders.date"),
            t("customer.orders.status"),
            t("customer.orders.cleaner"),
            t("common.action"),
          ]}
        >
          {list.map((o) => (
            <TableRow key={o._id}>
              <TableCell>
                <span className="font-mono text-xs">#{orderIdShort(o._id)}</span>
              </TableCell>
              <TableCell>
                {formatOrderDate(o.scheduledDate)}
                <br />
                <span className="text-xs text-[var(--color-text-muted)]">{o.scheduledTime}</span>
              </TableCell>
              <TableCell>
                <OrderStatusBadge status={o.status as OrderStatus} />
              </TableCell>
              <TableCell>
                {o.cleanerId ? "Đã có nhân viên" : t("customer.orders.notAssigned")}
              </TableCell>
              <TableCell>
                <Link href={`/customer/orders/${o._id}`}>
                  <Button variant="ghost" size="sm">{t("common.view")}</Button>
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </DataTable>
      )}
    </div>
  );
}

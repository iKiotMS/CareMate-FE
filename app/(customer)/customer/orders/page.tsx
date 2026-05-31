"use client";

import { useState } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/shared/PageHeader";
import { FilterTabs } from "@/components/shared/EmptyState";
import { OrderStatusBadge } from "@/components/shared/OrderStatusBadge";
import { DataTable, TableRow, TableCell } from "@/components/ui/DataTable";
import { Button } from "@/components/ui/Button";
import { t } from "@/lib/i18n";
import { getCustomerOrders, formatDate } from "@/data/mock";
import type { OrderStatus } from "@/types";

const FILTERS = [
  { id: "ALL", label: t("common.all") },
  { id: "PENDING", label: t("status.pending") },
  { id: "ASSIGNED", label: t("status.assigned") },
  { id: "ACCEPTED", label: t("status.accepted") },
  { id: "IN_PROGRESS", label: t("status.inProgress") },
  { id: "COMPLETED", label: t("status.completed") },
  { id: "CANCELLED", label: t("status.cancelled") },
];

export default function CustomerOrdersPage() {
  const [filter, setFilter] = useState("ALL");
  const orders = getCustomerOrders().filter((o) => filter === "ALL" || o.status === filter);

  return (
    <div>
      <PageHeader title={t("customer.orders.title")} />
      <FilterTabs tabs={FILTERS} active={filter} onChange={setFilter} className="mb-6" />

      <DataTable headers={[t("customer.orders.orderId"), t("customer.orders.date"), t("customer.orders.status"), t("customer.orders.cleaner"), t("common.action")]}>
        {orders.map((o) => (
          <TableRow key={o._id}>
            <TableCell><span className="font-mono text-xs">#{o._id.slice(-6)}</span></TableCell>
            <TableCell>{formatDate(o.scheduledDate)}<br /><span className="text-xs text-[var(--color-text-muted)]">{o.scheduledTime}</span></TableCell>
            <TableCell><OrderStatusBadge status={o.status as OrderStatus} /></TableCell>
            <TableCell>{o.cleanerName ?? t("customer.orders.notAssigned")}</TableCell>
            <TableCell>
              <Link href={`/customer/orders/${o._id}`}>
                <Button variant="ghost" size="sm">{t("common.view")}</Button>
              </Link>
            </TableCell>
          </TableRow>
        ))}
      </DataTable>
    </div>
  );
}

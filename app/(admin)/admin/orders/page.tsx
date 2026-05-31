"use client";

import { useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { OrderStatusBadge } from "@/components/shared/OrderStatusBadge";
import { DataTable, TableRow, TableCell } from "@/components/ui/DataTable";
import { Button } from "@/components/ui/Button";
import { Select, FormField } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { t } from "@/lib/i18n";
import { MOCK_ORDERS, MOCK_CLEANERS, formatDate } from "@/data/mock";
import type { OrderStatus } from "@/types";

export default function AdminOrdersPage() {
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
  const orders = MOCK_ORDERS.filter((o) => !statusFilter || o.status === statusFilter);
  const detail = selectedOrder ? MOCK_ORDERS.find((o) => o._id === selectedOrder) : null;

  return (
    <div>
      <PageHeader title={t("admin.orders.title")} />
      <FormField label={t("common.filter")} className="max-w-xs mb-4">
        <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="">{t("common.all")}</option>
          {["PENDING", "ASSIGNED", "ACCEPTED", "IN_PROGRESS", "COMPLETED", "CANCELLED"].map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </Select>
      </FormField>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <DataTable headers={["Mã", "Khách", "Ngày", "Trạng thái", "Thao tác"]}>
            {orders.map((o) => (
              <TableRow key={o._id}>
                <TableCell>#{o._id.slice(-6)}</TableCell>
                <TableCell>{o.customerName}</TableCell>
                <TableCell>{formatDate(o.scheduledDate)}</TableCell>
                <TableCell><OrderStatusBadge status={o.status as OrderStatus} /></TableCell>
                <TableCell><Button variant="ghost" size="sm" onClick={() => setSelectedOrder(o._id)}>{t("common.view")}</Button></TableCell>
              </TableRow>
            ))}
          </DataTable>
        </div>

        {detail && (
          <Card>
            <h3 className="font-semibold mb-4">Chi tiết #{detail._id.slice(-6)}</h3>
            <div className="text-sm space-y-2 mb-4">
              <p><strong>Địa chỉ:</strong> {detail.address}</p>
              <p><strong>NV:</strong> {detail.cleanerName ?? "—"}</p>
              <p><strong>Tasks:</strong> {detail.tasks.map((t) => t.taskName).join(", ")}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {detail.status === "PENDING" && (
                <Button size="sm" onClick={() => alert("Đã phân công")}>{t("admin.orders.assignCleaner")}</Button>
              )}
              <Button size="sm" variant="outline">{t("admin.orders.reassignCleaner")}</Button>
              <Button size="sm" variant="danger">{t("admin.orders.cancelOrder")}</Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}

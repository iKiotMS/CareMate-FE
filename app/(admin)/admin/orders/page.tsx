"use client";

import { useEffect, useRef, useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { OrderStatusBadge } from "@/components/shared/OrderStatusBadge";
import { DataTable, TableRow, TableCell } from "@/components/ui/DataTable";
import { Button } from "@/components/ui/Button";
import { Select, FormField } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { t } from "@/lib/i18n";
import {
  useAdminOrders,
  useAdminCleaners,
  useAdminAssignCleaner,
  useAdminReassignCleaner,
  useAdminCancelOrder,
  useAdminConfirmDeposit,
  useAdminConfirmFinalPayment,
} from "@/hooks/useApi";
import { formatOrderDate, orderIdShort } from "@/lib/format";
import { getApiErrorMessage } from "@/lib/api-errors";
import type { Order, OrderStatus, User } from "@/types";
import { Loader2 } from "lucide-react";

const STATUS_OPTIONS = [
  "PENDING",
  "ON_HOLD_PAYMENT",
  "CONFIRMED",
  "ACCEPTED",
  "IN_PROGRESS",
  "REVIEW_PENDING",
  "PAYMENT_PENDING",
  "COMPLETED",
  "CANCELLED",
];

export default function AdminOrdersPage() {
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
  const [cleanerIdInput, setCleanerIdInput] = useState("");
  const [error, setError] = useState("");
  const [justSelected, setJustSelected] = useState(false);
  const detailRef = useRef<HTMLDivElement>(null);

  const { data: ordersData, isLoading, refetch } = useAdminOrders({
    status: statusFilter || undefined,
  });
  const { data: cleanersData } = useAdminCleaners();
  const { mutateAsync: assignCleaner, isPending: assigning } = useAdminAssignCleaner();
  const { mutateAsync: reassignCleaner, isPending: reassigning } = useAdminReassignCleaner();
  const { mutateAsync: cancelOrder, isPending: cancelling } = useAdminCancelOrder();
  const { mutateAsync: confirmDeposit, isPending: confirmingDeposit } = useAdminConfirmDeposit();
  const { mutateAsync: confirmFinalPayment, isPending: confirmingFinal } = useAdminConfirmFinalPayment();

  const orders = ((ordersData as { orders?: Order[] })?.orders ?? []) as Order[];
  const cleaners = ((cleanersData as { cleaners?: User[] })?.cleaners ?? []) as User[];
  const detail = selectedOrder ? orders.find((o) => o._id === selectedOrder) : null;

  // Scroll the detail card into view whenever a new order is selected — the
  // card renders below the table, so without this a click on a row near the
  // top of a long list looks like it did nothing.
  useEffect(() => {
    if (!selectedOrder || !detail) return;
    detailRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    setJustSelected(true);
    const timeout = setTimeout(() => setJustSelected(false), 1200);
    return () => clearTimeout(timeout);
  }, [selectedOrder, detail]);

  const runAction = async (fn: () => Promise<unknown>) => {
    setError("");
    try {
      await fn();
      refetch();
    } catch (err) {
      setError(getApiErrorMessage(err));
    }
  };

  return (
    <div>
      <PageHeader title={t("admin.orders.title")} />

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-700 text-sm">{error}</div>
      )}

      <FormField label={t("common.filter")} className="max-w-xs mb-4">
        <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="">{t("common.all")}</option>
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </Select>
      </FormField>

      {isLoading ? (
        <div className="flex items-center gap-2">
          <Loader2 className="w-5 h-5 animate-spin" /> {t("common.loading")}
        </div>
      ) : (
        <div>
          <div className="lg:col-span-2">
            <DataTable headers={["Mã", "Địa chỉ", "Ngày", "Trạng thái", "Thao tác"]}>
              {orders.map((o) => (
                <TableRow key={o._id}>
                  <TableCell>#{orderIdShort(o._id)}</TableCell>
                  <TableCell className="max-w-[200px] truncate">{o.address}</TableCell>
                  <TableCell>{formatOrderDate(o.scheduledDate)}</TableCell>
                  <TableCell>
                    <OrderStatusBadge status={o.status as OrderStatus} />
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" onClick={() => setSelectedOrder(o._id)}>
                      {t("common.view")}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </DataTable>
            {orders.length === 0 && (
              <p className="text-[var(--color-text-muted)] mt-4">{t("common.noData")}</p>
            )}
          </div>

          {detail && (
            <div ref={detailRef} className="scroll-mt-20">
              <Card
                className={`mt-6 transition-shadow duration-500 ${
                  justSelected ? "ring-2 ring-[var(--color-primary)]" : ""
                }`}
              >
                <h3 className="font-semibold mb-4">Chi tiết #{orderIdShort(detail._id)}</h3>
                <div className="text-sm space-y-2 mb-4">
                  <p><strong>Địa chỉ:</strong> {detail.address}</p>
                  <p>
                    <strong>Trạng thái:</strong>{" "}
                    <OrderStatusBadge status={detail.status as OrderStatus} />
                  </p>
                  <p><strong>Tasks:</strong> {detail.tasks?.map((task) => task.taskName).join(", ")}</p>
                </div>

                <FormField label="Chọn nhân viên" className="mb-3">
                  <Select
                    value={cleanerIdInput}
                    onChange={(e) => setCleanerIdInput(e.target.value)}
                  >
                    <option value="">— Chọn —</option>
                    {cleaners
                      .filter((c) => c.isActive)
                      .map((c) => (
                        <option key={c._id} value={c._id}>
                          {c.fullName}
                        </option>
                      ))}
                  </Select>
                </FormField>

                <div className="flex flex-wrap gap-2">
                  {/* Assign cleaner to a PENDING order */}
                  {detail.status === "PENDING" && (
                    <Button
                      size="sm"
                      disabled={!cleanerIdInput || assigning}
                      onClick={() =>
                        runAction(() =>
                          assignCleaner({ orderId: detail._id, cleanerId: cleanerIdInput }),
                        )
                      }
                    >
                      {assigning ? t("common.loading") : t("admin.orders.assignCleaner")}
                    </Button>
                  )}

                  {/* Reassign cleaner when order is CONFIRMED or ACCEPTED */}
                  {["CONFIRMED", "ACCEPTED"].includes(detail.status) && (
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={!cleanerIdInput || reassigning}
                      onClick={() =>
                        runAction(() =>
                          reassignCleaner({ orderId: detail._id, cleanerId: cleanerIdInput }),
                        )
                      }
                    >
                      {reassigning ? t("common.loading") : t("admin.orders.reassignCleaner")}
                    </Button>
                  )}

                  {/* Offline payment: confirm deposit received → CONFIRMED */}
                  {detail.status === "ON_HOLD_PAYMENT" && (
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={confirmingDeposit}
                      onClick={() => {
                        if (!confirm("Xác nhận đã nhận đặt cọc offline cho đơn này?")) return;
                        runAction(() => confirmDeposit(detail._id));
                      }}
                    >
                      {confirmingDeposit ? t("common.loading") : "Xác nhận đặt cọc (offline)"}
                    </Button>
                  )}

                  {/* Offline payment: confirm final payment received → COMPLETED */}
                  {detail.status === "PAYMENT_PENDING" && (
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={confirmingFinal}
                      onClick={() => {
                        if (!confirm("Xác nhận đã nhận thanh toán cuối offline cho đơn này?")) return;
                        runAction(() => confirmFinalPayment(detail._id));
                      }}
                    >
                      {confirmingFinal ? t("common.loading") : "Xác nhận thanh toán cuối (offline)"}
                    </Button>
                  )}

                  {/* Cancel — not allowed once order is COMPLETED or already CANCELLED */}
                  {detail.status !== "COMPLETED" && detail.status !== "CANCELLED" && (
                    <Button
                      size="sm"
                      variant="danger"
                      disabled={cancelling}
                      onClick={() => {
                        if (!confirm("Hủy đơn này?")) return;
                        runAction(() => cancelOrder({ orderId: detail._id, reason: "Admin hủy" }));
                      }}
                    >
                      {cancelling ? t("common.loading") : t("admin.orders.cancelOrder")}
                    </Button>
                  )}
                </div>
              </Card>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

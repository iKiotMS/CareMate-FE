"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/shared/PageHeader";
import { FilterTabs, EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { OrderStatusBadge } from "@/components/shared/OrderStatusBadge";
import { DataTable, TableRow, TableCell } from "@/components/ui/DataTable";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { t } from "@/lib/i18n";
import { useCustomerOrders } from "@/hooks/useApi";
import { formatOrderDate, orderIdShort } from "@/lib/format";
import type { Order, OrderStatus } from "@/types";
import {
  CheckCircle2,
  Clock3,
  CreditCard,
  PackageCheck,
  PauseCircle,
  Timer,
  XCircle,
} from "lucide-react";

const FILTERS = [
  { id: "ALL", label: t("common.all") },
  { id: "PENDING", label: t("status.pending") },
  { id: "ON_HOLD_PAYMENT", label: t("status.onHoldPayment") },
  { id: "CONFIRMED", label: t("status.confirmed") },
  { id: "ACCEPTED", label: t("status.accepted") },
  { id: "IN_PROGRESS", label: t("status.inProgress") },
  { id: "REVIEW_PENDING", label: t("status.reviewPending") },
  { id: "PAYMENT_PENDING", label: t("status.paymentPending") },
  { id: "COMPLETED", label: t("status.completed") },
  { id: "CANCELLED", label: t("status.cancelled") },
];

const PAGE_SIZE = 8;

const STAT_ITEMS: Array<{
  status: OrderStatus;
  label: string;
  icon: typeof Clock3;
}> = [
  { status: "PENDING", label: t("status.pending"), icon: Clock3 },
  { status: "ON_HOLD_PAYMENT", label: t("status.onHoldPayment"), icon: CreditCard },
  { status: "CONFIRMED", label: t("status.confirmed"), icon: PackageCheck },
  { status: "ACCEPTED", label: t("status.accepted"), icon: CheckCircle2 },
  { status: "IN_PROGRESS", label: t("status.inProgress"), icon: Timer },
  { status: "REVIEW_PENDING", label: t("status.reviewPending"), icon: PauseCircle },
  { status: "PAYMENT_PENDING", label: t("status.paymentPending"), icon: CreditCard },
  { status: "COMPLETED", label: t("status.completed"), icon: CheckCircle2 },
  { status: "CANCELLED", label: t("status.cancelled"), icon: XCircle },
];

export default function CustomerOrdersPage() {
  const [filter, setFilter] = useState("ALL");
  const [page, setPage] = useState(1);
  const statusParam = filter === "ALL" ? undefined : filter;
  const allOrdersQuery = useCustomerOrders();
  const filteredOrdersQuery = useCustomerOrders(statusParam);

  const allOrders = (Array.isArray(allOrdersQuery.data) ? allOrdersQuery.data : []) as Order[];
  const list = (
    filter === "ALL"
      ? allOrders
      : Array.isArray(filteredOrdersQuery.data)
        ? filteredOrdersQuery.data
        : []
  ) as Order[];

  const isLoading = filter === "ALL" ? allOrdersQuery.isLoading : filteredOrdersQuery.isLoading;
  const isError = filter === "ALL" ? allOrdersQuery.isError : filteredOrdersQuery.isError;
  const refetch = filter === "ALL" ? allOrdersQuery.refetch : filteredOrdersQuery.refetch;

  const statusCounts = useMemo(() => {
    return allOrders.reduce<Record<string, number>>(
      (acc, order) => {
        acc[order.status] = (acc[order.status] ?? 0) + 1;
        acc.ALL += 1;
        return acc;
      },
      { ALL: 0 },
    );
  }, [allOrders]);

  const totalPages = Math.max(1, Math.ceil(list.length / PAGE_SIZE));
  const pageItems = list.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  useEffect(() => {
    setPage(1);
  }, [filter]);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

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

      {/* Mobile: 4 key stats */}
      <div className="grid grid-cols-2 gap-2 mb-4 sm:hidden">
        <StatusStat label="Tất cả" value={statusCounts.ALL ?? 0} icon={Clock3} active={filter === "ALL"} onClick={() => setFilter("ALL")} />
        <StatusStat label={t("status.pending")} value={statusCounts.PENDING ?? 0} icon={Clock3} active={filter === "PENDING"} onClick={() => setFilter("PENDING")} />
        <StatusStat label={t("status.inProgress")} value={statusCounts.IN_PROGRESS ?? 0} icon={Timer} active={filter === "IN_PROGRESS"} onClick={() => setFilter("IN_PROGRESS")} />
        <StatusStat label={t("status.completed")} value={statusCounts.COMPLETED ?? 0} icon={CheckCircle2} active={filter === "COMPLETED"} onClick={() => setFilter("COMPLETED")} />
      </div>

      {/* Desktop: full stat grid */}
      <div className="hidden sm:grid gap-3 sm:grid-cols-2 xl:grid-cols-4 mb-5">
        <StatusStat
          label="Tất cả"
          value={statusCounts.ALL ?? 0}
          active={filter === "ALL"}
          onClick={() => setFilter("ALL")}
        />
        {STAT_ITEMS.map((item) => (
          <StatusStat
            key={item.status}
            label={item.label}
            value={statusCounts[item.status] ?? 0}
            icon={item.icon}
            active={filter === item.status}
            onClick={() => setFilter(item.status)}
          />
        ))}
      </div>

      <FilterTabs tabs={FILTERS} active={filter} onChange={setFilter} className="mb-5" />

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full rounded-[var(--radius-lg)]" />
          ))}
        </div>
      ) : isError ? (
        <ErrorState message="Không tải được đơn hàng." onRetry={() => refetch()} />
      ) : list.length === 0 ? (
        <div className="rounded-[var(--radius-xl)] border border-dashed border-[var(--color-border)] p-8">
          <EmptyState title={t("common.noData")} description="Đặt dịch vụ dọn dẹp đầu tiên của bạn ngay hôm nay." />
          <div className="flex justify-center">
            <Link href="/customer/book">
              <Button>Đặt dịch vụ</Button>
            </Link>
          </div>
        </div>
      ) : (
        <>
          {/* Mobile: card list */}
          <div className="sm:hidden space-y-3">
            {pageItems.map((o) => (
              <Link key={o._id} href={`/customer/orders/${o._id}`} className="block">
                <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4 shadow-[var(--shadow-xs)] transition-all duration-150 hover:border-[var(--color-primary)]/40 hover:shadow-[var(--shadow-sm)] active:scale-[0.99]">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="font-mono text-xs text-[var(--color-text-muted)]">#{orderIdShort(o._id)}</span>
                    <OrderStatusBadge status={o.status as OrderStatus} />
                  </div>
                  <p className="font-medium text-sm text-[var(--color-text)]">
                    {formatOrderDate(o.scheduledDate)} · {o.scheduledTime}
                  </p>
                  <p className="text-xs text-[var(--color-text-muted)] mt-1 line-clamp-1">
                    {o.tasks?.map((t) => t.taskName).join(", ") || "Chưa có công việc"}
                  </p>
                  <p className="text-xs text-[var(--color-text-secondary)] mt-1">
                    {t("customer.orders.cleaner")}: {o.cleanerName || t("customer.orders.notAssigned")}
                  </p>
                </div>
              </Link>
            ))}
          </div>

          {/* Desktop: data table */}
          <div className="hidden sm:block">
            <DataTable
              headers={[
                t("customer.orders.orderId"),
                t("customer.orders.date"),
                "Công việc",
                t("customer.orders.status"),
                t("customer.orders.cleaner"),
                t("common.action"),
              ]}
            >
              {pageItems.map((o) => (
                <TableRow key={o._id}>
                  <TableCell>
                    <span className="font-mono text-xs">#{orderIdShort(o._id)}</span>
                  </TableCell>
                  <TableCell>
                    <p className="font-medium">{formatOrderDate(o.scheduledDate)}</p>
                    <span className="text-xs text-[var(--color-text-muted)]">{o.scheduledTime}</span>
                  </TableCell>
                  <TableCell>
                    <p className="font-medium">{o.tasks?.length ?? 0} mục</p>
                    <p className="text-xs text-[var(--color-text-muted)] max-w-[200px] line-clamp-1">
                      {o.tasks?.map((task) => task.taskName).join(", ") || "Chưa có"}
                    </p>
                  </TableCell>
                  <TableCell>
                    <OrderStatusBadge status={o.status as OrderStatus} />
                  </TableCell>
                  <TableCell>
                    {o.cleanerNames?.length ? o.cleanerNames.join(", ") : o.cleanerName || t("customer.orders.notAssigned")}
                  </TableCell>
                  <TableCell>
                    <Link href={`/customer/orders/${o._id}`}>
                      <Button variant="ghost" size="sm">{t("common.view")}</Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </DataTable>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mt-4">
            <p className="text-sm text-[var(--color-text-muted)]">
              Hiển thị {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, list.length)} trên {list.length} đơn
            </p>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>
                Trước
              </Button>
              <span className="text-sm font-medium text-[var(--color-text)]">
                {page}/{totalPages}
              </span>
              <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}>
                Sau
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function StatusStat({
  label,
  value,
  icon: Icon = Clock3,
  active,
  onClick,
}: {
  label: string;
  value: number;
  icon?: typeof Clock3;
  active?: boolean;
  onClick?: () => void;
}) {
  const content = (
    <>
      <span className="block">
        <span className="block text-xs text-[var(--color-text-muted)]">{label}</span>
        <span className="block text-xl font-bold text-[var(--color-text)]">{value}</span>
      </span>
      <span
        className={
          "flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-colors " +
          (active
            ? "bg-[var(--color-primary)] text-white"
            : "bg-[var(--color-primary-soft)] text-[var(--color-primary)]")
        }
      >
        <Icon className="w-4 h-4" />
      </span>
    </>
  );

  const className =
    "flex items-center justify-between gap-2 rounded-[var(--radius-xl)] border p-3.5 bg-[var(--color-surface)] transition-all duration-150 " +
    (active
      ? "border-[var(--color-primary)] bg-[var(--color-primary-soft)] shadow-[var(--shadow-sm)]"
      : "border-[var(--color-border)] shadow-[var(--shadow-xs)]");

  if (!onClick) return <div className={className}>{content}</div>;

  return (
    <button type="button" onClick={onClick} className={`${className} text-left active:scale-[0.98] hover:-translate-y-0.5 hover:border-[var(--color-primary)]/60 hover:shadow-[var(--shadow-md)]`}>
      {content}
    </button>
  );
}

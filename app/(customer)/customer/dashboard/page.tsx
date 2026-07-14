"use client";

import Link from "next/link";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatCard } from "@/components/shared/StatCard";
import { usePageView } from "@/hooks/usePageView";
import { OrderStatusBadge } from "@/components/shared/OrderStatusBadge";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { DataTable, TableRow, TableCell } from "@/components/ui/DataTable";
import { SkeletonStatCard, Skeleton } from "@/components/ui/Skeleton";
import { t } from "@/lib/i18n";
import { useCustomerOrders } from "@/hooks/useApi";
import { formatOrderDate, orderIdShort } from "@/lib/format";
import type { Order, OrderStatus } from "@/types";
import {
  ArrowRight,
  Calendar,
  CheckCircle,
  ClipboardList,
  Sparkles,
  Star,
} from "lucide-react";

export default function CustomerDashboardPage() {
  usePageView("home");

  const { data: ordersRaw, isLoading } = useCustomerOrders();
  const list = (Array.isArray(ordersRaw) ? ordersRaw : []) as Order[];

  const active = list.filter(
    (o) => !["COMPLETED", "CANCELLED", "REVIEW_PENDING"].includes(o.status),
  ).length;
  const completed = list.filter((o) => o.status === "COMPLETED").length;
  const pendingReviews = list.filter((o) => o.status === "REVIEW_PENDING").length;
  const upcoming = list
    .filter((o) => ["PENDING", "ASSIGNED", "ACCEPTED", "IN_PROGRESS"].includes(o.status))
    .slice(0, 6);

  return (
    <div>
      <PageHeader
        title={t("customer.dashboard.title")}
        subtitle={t("customer.dashboard.subtitle")}
        action={
          <Link href="/customer/book" className="hidden sm:block">
            <Button size="lg" className="gap-2">
              <Sparkles className="w-4 h-4" />
              {t("customer.dashboard.quickBook")}
            </Button>
          </Link>
        }
      />

      <Link href="/customer/book" className="mb-5 block sm:hidden animate-fade-up">
        <div className="flex items-center justify-between gap-3 rounded-[var(--radius-xl)] bg-gradient-to-br from-[var(--color-gradient-from)] to-[var(--color-gradient-to)] px-5 py-4 text-white shadow-[var(--shadow-md)] active:scale-[0.99] transition-transform">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20">
              <Sparkles className="h-5 w-5" />
            </span>
            <div>
              <p className="font-semibold leading-tight">{t("customer.dashboard.quickBook")}</p>
              <p className="text-xs text-white/80">Chỉ mất 60 giây để hoàn tất</p>
            </div>
          </div>
          <ArrowRight className="h-5 w-5 shrink-0" />
        </div>
      </Link>

      {isLoading ? (
        <div className="space-y-5">
          <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <SkeletonStatCard key={i} />
            ))}
          </div>
          <div className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5 space-y-3">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        </div>
      ) : (
        <>
          <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-3 mb-5 animate-fade-up">
            <StatCard title={t("customer.dashboard.activeOrders")} value={active} icon={ClipboardList} accent="primary" />
            <StatCard title={t("customer.dashboard.completedOrders")} value={completed} icon={CheckCircle} accent="success" />
            <StatCard title={t("customer.dashboard.pendingReviews")} value={pendingReviews} icon={Star} accent="warning" />
            <StatCard title={t("customer.dashboard.upcomingSchedule")} value={upcoming.length} icon={Calendar} accent="info" />
          </div>

          <Card padding="md" className="animate-fade-up">
            <div className="flex items-center justify-between gap-3 mb-4">
              <div>
                <h2 className="font-semibold text-[var(--color-text)]">{t("customer.dashboard.upcomingSchedule")}</h2>
                <p className="text-sm text-[var(--color-text-muted)]">Các đơn đang chờ xử lý hoặc sắp thực hiện</p>
              </div>
              <Link href="/customer/orders">
                <Button variant="ghost" size="sm">Xem tất cả</Button>
              </Link>
            </div>

            {upcoming.length === 0 ? (
              <div className="rounded-[var(--radius-lg)] border border-dashed border-[var(--color-border)] p-8 text-center">
                <p className="text-sm text-[var(--color-text-muted)] mb-3">{t("common.noData")}</p>
                <Link href="/customer/book">
                  <Button size="sm">Đặt dịch vụ ngay</Button>
                </Link>
              </div>
            ) : (
              <>
                {/* Mobile: card list */}
                <div className="sm:hidden space-y-3">
                  {upcoming.map((o) => (
                    <Link key={o._id} href={`/customer/orders/${o._id}`} className="block">
                      <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-bg-muted)] p-3.5 transition-colors hover:border-[var(--color-primary)]/40 active:bg-[var(--color-surface-hover)]">
                        <div className="flex items-start justify-between gap-2 mb-1.5">
                          <p className="font-medium text-sm text-[var(--color-text)]">
                            {formatOrderDate(o.scheduledDate)} · {o.scheduledTime}
                          </p>
                          <OrderStatusBadge status={o.status as OrderStatus} />
                        </div>
                        <p className="text-xs text-[var(--color-text-muted)] line-clamp-1">
                          {o.tasks?.map((task) => task.taskName).join(", ") || "Chưa có"}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>

                {/* Desktop: data table */}
                <div className="hidden sm:block">
                  <DataTable headers={["Mã đơn", "Lịch", "Công việc", "Nhân viên", "Trạng thái", ""]}>
                    {upcoming.map((o) => (
                      <TableRow key={o._id}>
                        <TableCell>
                          <span className="font-mono text-xs">#{orderIdShort(o._id)}</span>
                        </TableCell>
                        <TableCell>
                          <p className="font-medium">{formatOrderDate(o.scheduledDate)}</p>
                          <p className="text-xs text-[var(--color-text-muted)]">{o.scheduledTime}</p>
                        </TableCell>
                        <TableCell>
                          <p className="font-medium">{o.tasks?.length ?? 0} mục</p>
                          <p className="text-xs text-[var(--color-text-muted)] line-clamp-1">
                            {o.tasks?.map((task) => task.taskName).join(", ") || "Chưa có"}
                          </p>
                        </TableCell>
                        <TableCell>{o.cleanerNames?.length ? o.cleanerNames.join(", ") : o.cleanerName || "Chưa phân công"}</TableCell>
                        <TableCell>
                          <OrderStatusBadge status={o.status as OrderStatus} />
                        </TableCell>
                        <TableCell className="text-right">
                          <Link href={`/customer/orders/${o._id}`}>
                            <Button variant="ghost" size="sm">{t("common.view")}</Button>
                          </Link>
                        </TableCell>
                      </TableRow>
                    ))}
                  </DataTable>
                </div>
              </>
            )}
          </Card>
        </>
      )}
    </div>
  );
}

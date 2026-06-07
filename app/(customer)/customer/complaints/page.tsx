"use client";

import { useState } from "react";
import Link from "next/link";
import { useMyComplaints } from "@/hooks/useApi";
import { PageHeader } from "@/components/shared/PageHeader";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { Badge } from "@/components/ui/Badge";
import { SkeletonCard } from "@/components/ui/Skeleton";
import { Button } from "@/components/ui/Button";
import { COMPLAINT_STATUS_VARIANT } from "@/lib/constants";
import { t } from "@/lib/i18n";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";

const COMPLAINT_STATUS_LABEL: Record<string, string> = {
  OPEN: "Mới gửi",
  PROCESSING: "Đang xử lý",
  RESOLVED: "Đã giải quyết",
  REJECTED: "Từ chối",
};

export default function ComplaintsPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading, isError, refetch } = useMyComplaints(page);

  const complaints: any[] = data?.data ?? [];
  const total: number = data?.total ?? 0;

  if (isLoading) {
    return (
      <div className="p-6 space-y-4">
        <PageHeader title={t("customer.complaints.title")} />
        {Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)}
      </div>
    );
  }

  if (isError) return <ErrorState onRetry={refetch} />;

  return (
    <div className="p-6 space-y-4">
      <PageHeader
        title={t("customer.complaints.title")}
        action={
          <Link href="/customer/complaints/new">
            <Button size="sm">{t("customer.complaints.newComplaint")}</Button>
          </Link>
        }
      />

      {complaints.length === 0 ? (
        <EmptyState
          title={t("customer.complaints.noComplaints")}
          description={t("customer.complaints.noComplaintsDesc")}
        />
      ) : (
        <div className="space-y-3">
          {complaints.map((c) => (
            <Link key={c._id} href={`/customer/complaints/${c._id}`}>
              <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 hover:bg-[var(--color-surface-hover)] transition-colors">
                <div className="flex items-start justify-between gap-2">
                  <p className="font-medium text-[var(--color-text)]">{c.subject}</p>
                  <Badge variant={COMPLAINT_STATUS_VARIANT[c.status] as any}>
                    {COMPLAINT_STATUS_LABEL[c.status] ?? c.status}
                  </Badge>
                </div>
                <p className="mt-1 text-sm text-[var(--color-text-secondary)] line-clamp-2">
                  {c.description}
                </p>
                <p className="mt-2 text-xs text-[var(--color-text-muted)]">
                  {formatDistanceToNow(new Date(c.createdAt), { addSuffix: true, locale: vi })}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}

      {total > complaints.length && (
        <div className="flex justify-center pt-2">
          <Button variant="outline" size="sm" onClick={() => setPage((p) => p + 1)}>
            Xem thêm
          </Button>
        </div>
      )}
    </div>
  );
}

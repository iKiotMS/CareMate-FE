"use client";

import { use } from "react";
import Link from "next/link";
import { useMyComplaintById } from "@/hooks/useApi";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { SkeletonCard } from "@/components/ui/Skeleton";
import { ErrorState } from "@/components/shared/ErrorState";
import { Button } from "@/components/ui/Button";
import { COMPLAINT_STATUS_VARIANT } from "@/lib/constants";
import { t } from "@/lib/i18n";
import { formatDistanceToNow, format } from "date-fns";
import { vi } from "date-fns/locale";

const COMPLAINT_STATUS_LABEL: Record<string, string> = {
  OPEN: "Mới gửi",
  PROCESSING: "Đang xử lý",
  RESOLVED: "Đã giải quyết",
  REJECTED: "Từ chối",
};

const COMPLAINT_CATEGORY_LABEL: Record<string, string> = {
  SERVICE_QUALITY: "Chất lượng dịch vụ",
  CLEANER_BEHAVIOR: "Hành vi nhân viên",
  LATE_ARRIVAL: "Đến trễ",
  DAMAGE: "Hư hỏng tài sản",
  OTHER: "Khác",
};

export default function ComplaintDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data: complaint, isLoading, isError, refetch } = useMyComplaintById(id);

  if (isLoading) {
    return (
      <div className="p-6 space-y-4 max-w-2xl">
        <SkeletonCard />
        <SkeletonCard />
      </div>
    );
  }

  if (isError || !complaint) return <ErrorState onRetry={refetch} />;

  const c = complaint as any;
  const replies: any[] = c.replies ?? [];

  return (
    <div className="p-6 space-y-5 max-w-2xl">
      <PageHeader
        title={t("customer.complaints.detailTitle")}
        action={
          <Link href="/customer/complaints">
            <Button variant="outline" size="sm">{t("common.back")}</Button>
          </Link>
        }
      />

      {/* Thông tin khiếu nại */}
      <Card>
        <div className="flex items-start justify-between gap-3 mb-3">
          <h2 className="font-semibold text-[var(--color-text)] text-base">{c.subject}</h2>
          <Badge variant={COMPLAINT_STATUS_VARIANT[c.status] as any}>
            {COMPLAINT_STATUS_LABEL[c.status] ?? c.status}
          </Badge>
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm mb-4">
          <div>
            <p className="text-[var(--color-text-muted)] text-xs mb-0.5">{t("customer.complaints.createdAt")}</p>
            <p className="text-[var(--color-text)]">
              {format(new Date(c.createdAt), "dd/MM/yyyy HH:mm")}
            </p>
          </div>
          {c.category && (
            <div>
              <p className="text-[var(--color-text-muted)] text-xs mb-0.5">{t("customer.complaints.categoryLabel")}</p>
              <p className="text-[var(--color-text)]">
                {COMPLAINT_CATEGORY_LABEL[c.category] ?? c.category}
              </p>
            </div>
          )}
        </div>

        <div className="pt-3 border-t border-[var(--color-border)]">
          <p className="text-[var(--color-text-muted)] text-xs mb-1">{t("customer.complaints.description")}</p>
          <p className="text-sm text-[var(--color-text)] whitespace-pre-wrap">{c.description}</p>
        </div>
      </Card>

      {/* Ảnh minh chứng */}
      {c.evidenceUrls?.length > 0 && (
        <Card>
          <h3 className="font-medium mb-3 text-sm">{t("customer.complaints.evidencePhotos")}</h3>
          <div className="flex flex-wrap gap-2">
            {c.evidenceUrls.map((url: string, i: number) => (
              <a key={i} href={url} target="_blank" rel="noopener noreferrer">
                <img
                  src={url}
                  alt={`evidence-${i + 1}`}
                  className="w-20 h-20 object-cover rounded-lg border border-[var(--color-border)] hover:opacity-80 transition-opacity"
                />
              </a>
            ))}
          </div>
        </Card>
      )}

      {/* Phản hồi từ quản trị */}
      <Card>
        <h3 className="font-medium mb-3 text-sm">{t("customer.complaints.adminReplies")}</h3>
        {replies.length === 0 ? (
          <p className="text-sm text-[var(--color-text-muted)]">{t("customer.complaints.noReplies")}</p>
        ) : (
          <div className="space-y-3">
            {replies.map((reply: any, i: number) => (
              <div
                key={i}
                className="p-3 rounded-lg bg-[var(--color-bg-muted)] border border-[var(--color-border)]"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium text-[var(--color-primary)]">
                    {reply.authorRole === "admin" ? "Quản trị viên" : reply.authorRole}
                  </span>
                  <span className="text-xs text-[var(--color-text-muted)]">
                    {formatDistanceToNow(new Date(reply.createdAt), { addSuffix: true, locale: vi })}
                  </span>
                </div>
                <p className="text-sm text-[var(--color-text)]">{reply.message}</p>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}

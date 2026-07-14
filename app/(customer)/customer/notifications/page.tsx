"use client";

import { useState } from "react";
import { useMyNotifications, useMarkNotificationsRead, useMarkAllRead } from "@/hooks/useApi";
import { Skeleton } from "@/components/ui/Skeleton";
import { ErrorState } from "@/components/shared/ErrorState";
import { EmptyState } from "@/components/shared/EmptyState";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/Button";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import type { Notification } from "@/types";
import { Check } from "lucide-react";
import { cn } from "@/lib/cn";
import { toast } from "sonner";

export default function NotificationsPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading, isError, refetch } = useMyNotifications(page, 20);
  const markRead = useMarkNotificationsRead();
  const markAllRead = useMarkAllRead();

  const notifications = data?.data ?? [];
  const total = data?.total ?? 0;

  function handleMarkRead(id: string) {
    markRead.mutate([id], {
      onError: () => toast.error("Không thể đánh dấu đã đọc"),
    });
  }

  function handleMarkAllRead() {
    markAllRead.mutate(undefined, {
      onSuccess: () => toast.success("Đã đánh dấu tất cả là đã đọc"),
      onError: () => toast.error("Không thể cập nhật thông báo"),
    });
  }

  if (isLoading) {
    return (
      <div>
        <PageHeader title="Thông báo" />
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="rounded-[var(--radius-xl)] border border-[var(--color-border)] p-4 space-y-2">
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-3 w-2/3" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (isError) return <ErrorState onRetry={refetch} />;

  return (
    <div>
      <PageHeader
        title="Thông báo"
        subtitle={`${total} thông báo`}
        action={
          notifications.some((n) => !n.isRead) ? (
            <Button variant="outline" size="sm" onClick={handleMarkAllRead} className="gap-1.5">
              <Check className="h-4 w-4" />
              Đánh dấu tất cả đã đọc
            </Button>
          ) : undefined
        }
      />

      {notifications.length === 0 ? (
        <div className="rounded-[var(--radius-xl)] border border-dashed border-[var(--color-border)]">
          <EmptyState title="Không có thông báo" description="Bạn đã đọc hết thông báo rồi!" />
        </div>
      ) : (
        <div className="space-y-2.5 animate-fade-up">
          {notifications.map((n) => (
            <NotificationRow key={n._id} n={n} onMarkRead={handleMarkRead} />
          ))}
        </div>
      )}
    </div>
  );
}

function NotificationRow({
  n,
  onMarkRead,
}: {
  n: Notification;
  onMarkRead: (id: string) => void;
}) {
  return (
    <div
      className={cn(
        "flex items-start gap-4 rounded-[var(--radius-xl)] border p-4 transition-all duration-150",
        n.isRead
          ? "border-[var(--color-border)] bg-[var(--color-surface)]"
          : "border-[var(--color-primary)]/20 bg-[var(--color-primary-soft)] shadow-[var(--shadow-xs)]",
      )}
    >
      {!n.isRead && (
        <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[var(--color-primary)]" />
      )}
      <div className={cn("flex-1 min-w-0", n.isRead && "pl-4")}>
        <p className="font-medium text-sm text-[var(--color-text)]">{n.title}</p>
        <p className="text-sm text-[var(--color-text-secondary)] mt-0.5">{n.body}</p>
        <p className="mt-1.5 text-xs text-[var(--color-text-muted)]">
          {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true, locale: vi })}
        </p>
      </div>
      {!n.isRead && (
        <button
          onClick={() => onMarkRead(n._id)}
          className="shrink-0 text-xs font-medium text-[var(--color-primary)] hover:underline whitespace-nowrap"
        >
          Đánh dấu đã đọc
        </button>
      )}
    </div>
  );
}

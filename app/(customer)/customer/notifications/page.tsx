"use client";

import { useState } from "react";
import { useMyNotifications, useMarkNotificationsRead, useMarkAllRead } from "@/hooks/useApi";
import { Skeleton } from "@/components/ui/Skeleton";
import { ErrorState } from "@/components/shared/ErrorState";
import { EmptyState } from "@/components/shared/EmptyState";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/Button";
import { formatDistanceToNow } from "date-fns";
import type { Notification } from "@/types";
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
      onError: () => toast.error("Failed to mark as read"),
    });
  }

  function handleMarkAllRead() {
    markAllRead.mutate(undefined, {
      onSuccess: () => toast.success("All notifications marked as read"),
      onError: () => toast.error("Failed to mark all as read"),
    });
  }

  if (isLoading) {
    return (
      <div className="p-6 space-y-4">
        <PageHeader title="Notifications" />
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-[var(--color-border)] p-4 space-y-2">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-3 w-2/3" />
          </div>
        ))}
      </div>
    );
  }

  if (isError) return <ErrorState onRetry={refetch} />;

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <PageHeader title="Notifications" subtitle={`${total} total`} />
        {notifications.some((n) => !n.isRead) && (
          <Button variant="ghost" size="sm" onClick={handleMarkAllRead}>
            Mark all read
          </Button>
        )}
      </div>

      {notifications.length === 0 ? (
        <EmptyState title="No notifications" description="You're all caught up!" />
      ) : (
        <div className="space-y-2">
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
        "flex items-start gap-4 rounded-xl border p-4 transition-colors",
        n.isRead
          ? "border-[var(--color-border)] bg-[var(--color-surface)]"
          : "border-[var(--color-primary)]/30 bg-[var(--color-primary)]/5",
      )}
    >
      {!n.isRead && (
        <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[var(--color-primary)]" />
      )}
      <div className={cn("flex-1", n.isRead && "pl-4")}>
        <p className="font-medium text-sm text-[var(--color-text)]">{n.title}</p>
        <p className="text-sm text-[var(--color-text-secondary)]">{n.body}</p>
        <p className="mt-1 text-xs text-[var(--color-text-muted)]">
          {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
        </p>
      </div>
      {!n.isRead && (
        <button
          onClick={() => onMarkRead(n._id)}
          className="text-xs text-[var(--color-primary)] hover:underline whitespace-nowrap"
        >
          Mark read
        </button>
      )}
    </div>
  );
}

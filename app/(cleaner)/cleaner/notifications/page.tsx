"use client";

import { PageHeader } from "@/components/shared/PageHeader";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { SkeletonCard } from "@/components/ui/Skeleton";
import { ErrorState } from "@/components/shared/ErrorState";
import { EmptyState } from "@/components/shared/EmptyState";
import { t } from "@/lib/i18n";
import { cn } from "@/lib/cn";
import { useMyNotifications, useMarkAllRead, useMarkNotificationsRead } from "@/hooks/useApi";

export default function CleanerNotificationsPage() {
  const { data, isLoading, isError, refetch } = useMyNotifications();
  const markAllRead = useMarkAllRead();
  const markRead = useMarkNotificationsRead();

  const notifications = (data as any)?.data ?? [];
  const unreadIds = notifications.filter((n: any) => !n.isRead).map((n: any) => n._id);

  const handleMarkAllRead = () => markAllRead.mutate();

  const handleMarkRead = (id: string) => {
    markRead.mutate([id]);
  };

  return (
    <div>
      <PageHeader
        title={t("cleaner.notifications.title")}
        action={
          unreadIds.length > 0 ? (
            <Button variant="ghost" size="sm" onClick={handleMarkAllRead} disabled={markAllRead.isPending}>
              Đánh dấu tất cả đã đọc
            </Button>
          ) : undefined
        }
      />
      <div className="space-y-3 max-w-2xl">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)
        ) : isError ? (
          <ErrorState onRetry={refetch} />
        ) : notifications.length === 0 ? (
          <EmptyState message="Không có thông báo nào." />
        ) : (
          notifications.map((n: any) => (
            <Card
              key={n._id}
              className={cn(!n.isRead && "border-l-4 border-l-[var(--color-primary)] cursor-pointer")}
              onClick={() => !n.isRead && handleMarkRead(n._id)}
            >
              <p className="font-medium">{n.title}</p>
              <p className="text-sm text-[var(--color-text-secondary)] mt-1">{n.body}</p>
              {!n.isRead && <Badge variant="info" className="mt-2">Mới</Badge>}
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

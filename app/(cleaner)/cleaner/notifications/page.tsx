"use client";

import { PageHeader } from "@/components/shared/PageHeader";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { t } from "@/lib/i18n";
import { MOCK_NOTIFICATIONS } from "@/data/mock";
import { cn } from "@/lib/cn";

export default function CleanerNotificationsPage() {
  const notifications = MOCK_NOTIFICATIONS.cleaner;

  return (
    <div>
      <PageHeader title={t("cleaner.notifications.title")} />
      <div className="space-y-3 max-w-2xl">
        {notifications.map((n) => (
          <Card key={n._id} className={cn(!n.isRead && "border-l-4 border-l-[var(--color-primary)]")}>
            <p className="font-medium">{n.title}</p>
            <p className="text-sm text-[var(--color-text-secondary)] mt-1">{n.body}</p>
            {!n.isRead && <Badge variant="info" className="mt-2">Mới</Badge>}
          </Card>
        ))}
      </div>
    </div>
  );
}

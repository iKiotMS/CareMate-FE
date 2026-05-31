"use client";

import { PageHeader } from "@/components/shared/PageHeader";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { t } from "@/lib/i18n";
import { MOCK_NOTIFICATIONS } from "@/data/mock";
import { cn } from "@/lib/cn";

export default function CustomerNotificationsPage() {
  const notifications = MOCK_NOTIFICATIONS.customer;

  return (
    <div>
      <PageHeader title={t("customer.notifications.title")} />
      <div className="space-y-3 max-w-2xl">
        {notifications.map((n) => (
          <Card key={n._id} className={cn(!n.read && "border-l-4 border-l-[var(--color-primary)]")}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-medium text-[var(--color-text)]">{n.title}</p>
                <p className="text-sm text-[var(--color-text-secondary)] mt-1">{n.message}</p>
                <p className="text-xs text-[var(--color-text-muted)] mt-2">
                  {new Date(n.createdAt).toLocaleString("vi-VN")}
                </p>
              </div>
              {!n.read && <Badge variant="info">Mới</Badge>}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

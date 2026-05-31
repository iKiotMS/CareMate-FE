"use client";

import { PageHeader } from "@/components/shared/PageHeader";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { t } from "@/lib/i18n";
import { MOCK_COMPLAINTS } from "@/data/mock";
import type { Complaint } from "@/types";

const statusVariant: Record<Complaint["status"], "warning" | "info" | "success"> = {
  open: "warning",
  investigating: "info",
  resolved: "success",
};
const statusLabel: Record<Complaint["status"], string> = {
  open: t("admin.complaints.open"),
  investigating: t("admin.complaints.investigating"),
  resolved: t("admin.complaints.resolved"),
};

export default function AdminComplaintsPage() {
  return (
    <div>
      <PageHeader title={t("admin.complaints.title")} />
      <div className="space-y-3">
        {MOCK_COMPLAINTS.map((c) => (
          <Card key={c._id}>
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
              <Badge variant={c.type === "customer" ? "info" : "purple"}>
                {c.type === "customer" ? t("admin.complaints.customerComplaint") : t("admin.complaints.cleanerComplaint")}
              </Badge>
              <Badge variant={statusVariant[c.status]}>{statusLabel[c.status]}</Badge>
            </div>
            <p className="font-medium">{c.subject}</p>
            <p className="text-sm text-[var(--color-text-secondary)] mt-1">{c.description}</p>
            <p className="text-xs text-[var(--color-text-muted)] mt-2">{new Date(c.createdAt).toLocaleDateString("vi-VN")}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}

"use client";

import { PageHeader } from "@/components/shared/PageHeader";
import { StarDisplay } from "@/components/shared/StarRating";
import { Card } from "@/components/ui/Card";
import { t } from "@/lib/i18n";
import { MOCK_REVIEWS } from "@/data/mock";

export default function CleanerReviewsPage() {
  const reviews = MOCK_REVIEWS.filter((r) => r.cleanerName === "Trần Văn Hùng");

  return (
    <div>
      <PageHeader title={t("cleaner.reviews.title")} />
      <div className="space-y-4 max-w-2xl">
        {reviews.map((r) => (
          <Card key={r._id}>
            <div className="flex justify-between">
              <p className="font-medium">{r.customerName}</p>
              <StarDisplay rating={r.rating} />
            </div>
            {r.comment && <p className="text-sm text-[var(--color-text-secondary)] mt-2">{r.comment}</p>}
            <p className="text-xs text-[var(--color-text-muted)] mt-2">{new Date(r.createdAt).toLocaleDateString("vi-VN")}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}

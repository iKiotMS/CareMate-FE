"use client";

import { useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { FilterTabs } from "@/components/shared/EmptyState";
import { StarDisplay } from "@/components/shared/StarRating";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { t } from "@/lib/i18n";
import { MOCK_REVIEWS } from "@/data/mock";

const FILTERS = [
  { id: "all", label: t("common.all") },
  { id: "low", label: t("admin.reviews.low") },
  { id: "medium", label: t("admin.reviews.medium") },
  { id: "high", label: t("admin.reviews.high") },
];

function filterReviews(id: string) {
  if (id === "low") return MOCK_REVIEWS.filter((r) => r.rating <= 2);
  if (id === "medium") return MOCK_REVIEWS.filter((r) => r.rating === 3);
  if (id === "high") return MOCK_REVIEWS.filter((r) => r.rating >= 4);
  return MOCK_REVIEWS;
}

export default function AdminReviewsPage() {
  const [filter, setFilter] = useState("all");
  const reviews = filterReviews(filter);

  return (
    <div>
      <PageHeader title={t("admin.reviews.title")} />
      <FilterTabs
        tabs={FILTERS}
        active={filter}
        onChange={setFilter}
        className="mb-6"
      />

      <div className="space-y-3">
        {reviews.map((r) => (
          <Card key={r._id}>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="font-medium">
                  {r.customerName} → {r.cleanerName}
                </p>
                <p className="text-sm text-[var(--color-text-muted)]">
                  {new Date(r.createdAt).toLocaleDateString("vi-VN")}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {r.rating <= 2 && <Badge variant="danger">Cần theo dõi</Badge>}
                <StarDisplay rating={r.rating} />
              </div>
            </div>
            {r.comment && (
              <p className="text-sm mt-2 text-[var(--color-text-secondary)]">
                {r.comment}
              </p>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}

"use client";

import { PageHeader } from "@/components/shared/PageHeader";
import { StarDisplay } from "@/components/shared/StarRating";
import { Card } from "@/components/ui/Card";
import { t } from "@/lib/i18n";
import { useCleanerWorkHistory } from "@/hooks/useApi";
import { formatOrderDate } from "@/lib/format";
import type { Order } from "@/types";
import { Loader2 } from "lucide-react";

export default function WorkHistoryPage() {
  const { data: ordersRaw, isLoading, isError, refetch } = useCleanerWorkHistory();
  const orders = (Array.isArray(ordersRaw) ? ordersRaw : []) as Order[];

  return (
    <div>
      <PageHeader title={t("cleaner.workHistory.title")} />

      {isLoading ? (
        <div className="flex items-center gap-2">
          <Loader2 className="w-5 h-5 animate-spin" /> {t("common.loading")}
        </div>
      ) : isError ? (
        <p className="text-red-600">
          Lỗi tải lịch sử.{" "}
          <button type="button" className="underline" onClick={() => refetch()}>
            Thử lại
          </button>
        </p>
      ) : (
        <div className="space-y-3">
          {orders.map((o) => (
            <Card key={o._id}>
              <p className="font-medium">{o.address}</p>
              <p className="text-sm text-[var(--color-text-muted)]">
                {formatOrderDate(o.scheduledDate)}
              </p>
              {o.rating != null && (
                <div className="mt-2">
                  <StarDisplay rating={o.rating} />
                </div>
              )}
            </Card>
          ))}
          {orders.length === 0 && (
            <p className="text-[var(--color-text-muted)]">{t("common.noData")}</p>
          )}
        </div>
      )}
    </div>
  );
}

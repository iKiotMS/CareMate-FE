"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { t } from "@/lib/i18n";
import { formatVND, formatDuration } from "@/lib/format";
import { useResolveAdjustment } from "@/hooks/useApi";
import { Clock, Receipt } from "lucide-react";
import type { OrderAdjustment, AdjustmentStatus } from "@/types";

const STATUS_VARIANT: Record<
  AdjustmentStatus,
  "warning" | "success" | "danger"
> = {
  PENDING: "warning",
  APPROVED: "success",
  REJECTED: "danger",
};

const STATUS_LABEL: Record<AdjustmentStatus, string> = {
  PENDING: t("adjustment.pending"),
  APPROVED: t("adjustment.approved"),
  REJECTED: t("adjustment.rejected"),
};

interface AdjustmentListProps {
  orderId: string;
  adjustments: OrderAdjustment[];
  /** Only the customer who owns the order may approve or reject. */
  canResolve?: boolean;
}

export function AdjustmentList({
  orderId,
  adjustments,
  canResolve = false,
}: AdjustmentListProps) {
  const resolve = useResolveAdjustment(orderId);
  const [rejecting, setRejecting] = useState<string | null>(null);
  const [reason, setReason] = useState("");

  if (adjustments.length === 0) return null;

  const pendingTotal = adjustments
    .filter((a) => a.status === "PENDING")
    .reduce((sum, a) => sum + a.amount, 0);

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold">{t("adjustment.title")}</h2>
        {pendingTotal > 0 && (
          <Badge variant="warning">
            {t("adjustment.pending")}: {formatVND(pendingTotal)}
          </Badge>
        )}
      </div>

      <div className="space-y-3">
        {adjustments.map((a) => (
          <div
            key={a._id}
            className="border border-[var(--color-border)] rounded-[var(--radius-md)] p-3"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-2.5 min-w-0">
                <div className="p-1.5 rounded-[var(--radius-md)] bg-[var(--color-bg-muted)] shrink-0">
                  {a.kind === "OVERTIME" ? (
                    <Clock className="w-4 h-4 text-[var(--color-text-secondary)]" />
                  ) : (
                    <Receipt className="w-4 h-4 text-[var(--color-text-secondary)]" />
                  )}
                </div>
                <div className="min-w-0">
                  <p className="font-medium text-sm">{a.label}</p>
                  <p className="text-lg font-bold tabular-nums">
                    {formatVND(a.amount)}
                  </p>
                  {a.kind === "EXPENSE" && (
                    <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
                      {t("adjustment.reimbursedNote")}
                    </p>
                  )}
                  {a.status === "REJECTED" && a.rejectionReason && (
                    <p className="text-xs text-[var(--color-danger)] mt-1">
                      {a.rejectionReason}
                    </p>
                  )}
                </div>
              </div>
              <Badge variant={STATUS_VARIANT[a.status]}>
                {STATUS_LABEL[a.status]}
              </Badge>
            </div>

            {a.evidencePhoto && (
              <a
                href={a.evidencePhoto}
                target="_blank"
                rel="noopener noreferrer"
                className="block mt-3"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={a.evidencePhoto}
                  alt={t("adjustment.evidence")}
                  className="h-24 w-auto rounded-[var(--radius-md)] border border-[var(--color-border)] object-cover"
                />
              </a>
            )}

            {canResolve && a.status === "PENDING" && (
              <div className="mt-3">
                {rejecting === a._id ? (
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      placeholder={t("adjustment.rejectionReason")}
                      className="w-full px-3 py-2 text-sm rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)]"
                    />
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="danger"
                        disabled={resolve.isPending}
                        onClick={() =>
                          resolve.mutate(
                            {
                              adjustmentId: a._id,
                              approve: false,
                              rejectionReason: reason || undefined,
                            },
                            {
                              onSuccess: () => {
                                setRejecting(null);
                                setReason("");
                              },
                            },
                          )
                        }
                      >
                        {t("adjustment.reject")}
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setRejecting(null);
                          setReason("");
                        }}
                      >
                        {t("common.cancel")}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      disabled={resolve.isPending}
                      onClick={() =>
                        resolve.mutate({ adjustmentId: a._id, approve: true })
                      }
                    >
                      {t("adjustment.approve")}
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setRejecting(a._id)}
                    >
                      {t("adjustment.reject")}
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
}

/** Actual-vs-booked working time. Early finishes are shown, never refunded. */
export function DurationSummary({
  bookedHours,
  actualMinutes,
  varianceMinutes,
}: {
  bookedHours?: number;
  actualMinutes?: number | null;
  varianceMinutes?: number | null;
}) {
  if (actualMinutes == null) return null;

  const early = (varianceMinutes ?? 0) < 0;

  return (
    <div className="flex flex-wrap items-center gap-x-6 gap-y-1 text-sm">
      <span className="text-[var(--color-text-secondary)]">
        {t("adjustment.bookedDuration")}:{" "}
        <span className="font-medium text-[var(--color-text)]">
          {formatDuration((bookedHours ?? 2) * 60)}
        </span>
      </span>
      <span className="text-[var(--color-text-secondary)]">
        {t("adjustment.actualDuration")}:{" "}
        <span className="font-medium text-[var(--color-text)]">
          {formatDuration(actualMinutes)}
        </span>
      </span>
      {varianceMinutes != null && varianceMinutes !== 0 && (
        <Badge variant={early ? "success" : "warning"}>
          {early
            ? t("adjustment.finishedEarly", {
                minutes: formatDuration(varianceMinutes),
              })
            : t("adjustment.overran", {
                minutes: formatDuration(varianceMinutes),
              })}
        </Badge>
      )}
    </div>
  );
}

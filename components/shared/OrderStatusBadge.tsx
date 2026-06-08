"use client";

import { Badge } from "@/components/ui/Badge";
import { ORDER_STATUS_LABEL_KEYS, ORDER_STATUS_VARIANT } from "@/lib/constants";
import { t } from "@/lib/i18n";
import type { OrderStatus } from "@/types";

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  const labelKey = ORDER_STATUS_LABEL_KEYS[status];
  const variant = ORDER_STATUS_VARIANT[status];
  return <Badge variant={variant}>{t(labelKey)}</Badge>;
}

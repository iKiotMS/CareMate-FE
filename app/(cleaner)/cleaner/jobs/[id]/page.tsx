"use client";

import { useState } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/shared/PageHeader";
import { OrderStatusBadge } from "@/components/shared/OrderStatusBadge";
import { PhotoGrid, ProgressBar } from "@/components/shared/Charts";
import { Tabs } from "@/components/ui/Tabs";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { t } from "@/lib/i18n";
import { getOrderById, formatDate } from "@/data/mock";
import type { OrderStatus } from "@/types";
import { cn } from "@/lib/cn";
import { Check, Upload, Brain } from "lucide-react";

export default function CleanerJobDetailPage({ params }: { params: { id: string } }) {
  const order = getOrderById(params.id) ?? getOrderById("ord001")!;
  const [status, setStatus] = useState(order.status);
  const [checkinPhotos, setCheckinPhotos] = useState(0);
  const [taskState, setTaskState] = useState(
    order.tasks.map((t) => ({ ...t, localBefore: !!t.photoBefore, localAfter: !!t.photoAfter, localDone: t.isDone })),
  );

  const allDone = taskState.every((t) => t.localDone && t.localBefore && t.localAfter);
  const doneCount = taskState.filter((t) => t.localDone).length;

  const infoTab = (
    <div className="space-y-4">
      <div><span className="text-sm text-[var(--color-text-muted)]">{t("cleaner.jobDetail.customer")}</span><p className="font-medium">{order.customerName}</p></div>
      <div><span className="text-sm text-[var(--color-text-muted)]">{t("customer.book.address")}</span><p className="font-medium">{order.address}</p></div>
      <div><span className="text-sm text-[var(--color-text-muted)]">{t("customer.book.date")}</span><p className="font-medium">{formatDate(order.scheduledDate)} · {order.scheduledTime}</p></div>
      {order.note && <div><span className="text-sm text-[var(--color-text-muted)]">{t("cleaner.jobDetail.notes")}</span><p>{order.note}</p></div>}
      <div>
        <span className="text-sm text-[var(--color-text-muted)]">{t("customer.orderDetail.tasks")}</span>
        <ul className="mt-2 space-y-1">{order.tasks.map((t, i) => <li key={i} className="text-sm">• {t.taskName}</li>)}</ul>
      </div>
    </div>
  );

  const checkinTab = (
    <div className="space-y-4">
      <p className="text-sm text-[var(--color-text-secondary)]">{t("cleaner.jobDetail.overallPhotos")}</p>
      <div className="border-2 border-dashed border-[var(--color-border)] rounded-[var(--radius-lg)] p-8 text-center cursor-pointer" onClick={() => setCheckinPhotos((n) => n + 1)}>
        <Upload className="w-8 h-8 mx-auto text-[var(--color-text-muted)] mb-2" />
        <p className="text-sm">Upload ảnh check-in (demo)</p>
        {checkinPhotos > 0 && <p className="text-sm text-[var(--color-success)] mt-2">{checkinPhotos} ảnh</p>}
      </div>
      {status === "ASSIGNED" && <Button onClick={() => setStatus("ACCEPTED")}>{t("common.accept")}</Button>}
      {status === "ACCEPTED" && (
        <Button onClick={() => setStatus("IN_PROGRESS")} disabled={checkinPhotos === 0}>{t("cleaner.jobDetail.checkInBtn")}</Button>
      )}
      {status === "IN_PROGRESS" && <Badge variant="success">Đã check-in</Badge>}
    </div>
  );

  const tasksTab = (
    <div className="space-y-4">
      {taskState.map((task, i) => (
        <Card key={i} padding="sm" className="border border-[var(--color-border)]">
          <p className="font-medium mb-3">{task.taskName}</p>
          <div className="grid sm:grid-cols-2 gap-3 mb-3">
            <Button variant="outline" size="sm" onClick={() => { const n = [...taskState]; n[i].localBefore = true; setTaskState(n); }}>
              {t("cleaner.jobDetail.beforePhoto")} {task.localBefore && "✓"}
            </Button>
            <Button variant="outline" size="sm" onClick={() => { const n = [...taskState]; n[i].localAfter = true; setTaskState(n); }}>
              {t("cleaner.jobDetail.afterPhoto")} {task.localAfter && "✓"}
            </Button>
          </div>
          <label className={cn("flex items-center gap-2 text-sm", !task.localBefore || !task.localAfter ? "opacity-50" : "")}>
            <input type="checkbox" checked={task.localDone} disabled={!task.localBefore || !task.localAfter}
              onChange={() => { const n = [...taskState]; n[i].localDone = !n[i].localDone; setTaskState(n); }} />
            {t("cleaner.jobDetail.markDone")}
          </label>
        </Card>
      ))}
      <ProgressBar value={doneCount} max={taskState.length} label={`${doneCount}/${taskState.length} công việc`} />
    </div>
  );

  const completeTab = (
    <div className="space-y-4">
      <Card className="bg-[var(--color-bg-muted)]">
        <div className="flex items-center gap-2 mb-3"><Brain className="w-5 h-5 text-[var(--color-primary)]" /><span className="font-medium">{t("cleaner.jobDetail.aiCheck")}</span></div>
        <div className="space-y-2 text-sm">
          <p className="flex items-center gap-2">{allDone ? <Check className="w-4 h-4 text-[var(--color-success)]" /> : "○"} {t("cleaner.jobDetail.allTasksDone")}</p>
          <p className="flex items-center gap-2">{allDone ? <Check className="w-4 h-4 text-[var(--color-success)]" /> : "○"} {t("cleaner.jobDetail.allPhotosUploaded")}</p>
        </div>
      </Card>
      <Button disabled={!allDone || status !== "IN_PROGRESS"} onClick={() => { setStatus("REVIEW_PENDING"); alert("Hoàn thành công việc!"); }}>
        {t("cleaner.jobDetail.completeJob")}
      </Button>
    </div>
  );

  return (
    <div>
      <Link href="/cleaner/jobs" className="text-sm text-[var(--color-primary)] hover:underline mb-4 inline-block">← {t("common.back")}</Link>
      <PageHeader title={`Công việc #${order._id.slice(-6)}`} action={<OrderStatusBadge status={status as OrderStatus} />} />

      <Tabs tabs={[
        { id: "info", label: t("cleaner.jobDetail.tabInfo"), content: infoTab },
        { id: "checkin", label: t("cleaner.jobDetail.tabCheckin"), content: checkinTab },
        { id: "tasks", label: t("cleaner.jobDetail.tabTasks"), content: tasksTab },
        { id: "complete", label: t("cleaner.jobDetail.tabComplete"), content: completeTab },
      ]} defaultTab="info" />
    </div>
  );
}

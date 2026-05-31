"use client";

import { useState } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Select, FormField } from "@/components/ui/Input";
import { t } from "@/lib/i18n";
import { getPendingOrders, formatDate } from "@/data/mock";

export default function AvailableJobsPage() {
  const [dateFilter, setDateFilter] = useState("");
  const [areaFilter, setAreaFilter] = useState("");
  const jobs = getPendingOrders().filter((j) => {
    if (dateFilter && j.scheduledDate !== dateFilter) return false;
    if (areaFilter && !j.address.includes(areaFilter)) return false;
    return true;
  });

  return (
    <div>
      <PageHeader title={t("cleaner.available.title")} />
      <div className="grid sm:grid-cols-3 gap-4 mb-6">
        <FormField label={t("cleaner.available.filterDate")}>
          <Select value={dateFilter} onChange={(e) => setDateFilter(e.target.value)}>
            <option value="">Tất cả</option>
            {[...new Set(getPendingOrders().map((j) => j.scheduledDate))].map((d) => (
              <option key={d} value={d}>{formatDate(d)}</option>
            ))}
          </Select>
        </FormField>
        <FormField label={t("cleaner.available.filterArea")}>
          <Select value={areaFilter} onChange={(e) => setAreaFilter(e.target.value)}>
            <option value="">Tất cả</option>
            <option value="Quận 1">Quận 1</option>
            <option value="Quận 3">Quận 3</option>
            <option value="Quận 5">Quận 5</option>
          </Select>
        </FormField>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {jobs.map((job) => (
          <Card key={job._id}>
            <p className="font-medium text-[var(--color-text)]">{job.address}</p>
            <p className="text-sm text-[var(--color-text-muted)] mt-1">{formatDate(job.scheduledDate)} · {job.scheduledTime}</p>
            <p className="text-sm text-[var(--color-text-secondary)] mt-2">
              {job.tasks.map((t) => t.taskName).join(", ")}
            </p>
            <Button size="sm" className="mt-4" onClick={() => alert("Đã ứng tuyển thành công!")}>
              {t("common.apply")}
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
}

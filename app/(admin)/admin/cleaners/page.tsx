"use client";

import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable, TableRow, TableCell } from "@/components/ui/DataTable";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { t } from "@/lib/i18n";
import { MOCK_CLEANERS } from "@/data/mock";

export default function AdminCleanersPage() {
  return (
    <div>
      <PageHeader
        title={t("admin.cleaners.title")}
        action={<Button size="sm">{t("admin.cleaners.createCleaner")}</Button>}
      />

      <DataTable headers={["Họ tên", t("admin.cleaners.rating"), t("admin.cleaners.completedJobs"), "Trạng thái", "Thao tác"]}>
        {MOCK_CLEANERS.map((c) => (
          <TableRow key={c._id}>
            <TableCell>{c.fullName}</TableCell>
            <TableCell>{c.rating}★</TableCell>
            <TableCell>{c.completedJobs}</TableCell>
            <TableCell><Badge variant="success">Hoạt động</Badge></TableCell>
            <TableCell className="flex gap-1">
              <Button variant="ghost" size="sm">{t("common.edit")}</Button>
              <Button variant="ghost" size="sm">{t("common.lock")}</Button>
            </TableCell>
          </TableRow>
        ))}
      </DataTable>
    </div>
  );
}

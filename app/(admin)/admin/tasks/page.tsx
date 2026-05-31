"use client";

import { useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable, TableRow, TableCell } from "@/components/ui/DataTable";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Input, FormField } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { t } from "@/lib/i18n";
import { MOCK_TASKS } from "@/data/mock";

export default function AdminTasksPage() {
  const [showAdd, setShowAdd] = useState(false);

  return (
    <div>
      <PageHeader title={t("admin.tasks.title")} action={<Button size="sm" onClick={() => setShowAdd(!showAdd)}>{t("common.add")}</Button>} />

      {showAdd && (
        <Card className="mb-4 max-w-md">
          <FormField label={t("admin.tasks.taskName")}><Input placeholder="Tên công việc mới" /></FormField>
          <FormField label={t("admin.tasks.description")}><Input placeholder="Mô tả" /></FormField>
          <Button size="sm">{t("common.save")}</Button>
        </Card>
      )}

      <DataTable headers={[t("admin.tasks.taskName"), t("admin.tasks.description"), t("admin.tasks.status"), "Thao tác"]}>
        {MOCK_TASKS.map((task) => (
          <TableRow key={task._id}>
            <TableCell>{task.name}</TableCell>
            <TableCell className="text-[var(--color-text-secondary)]">{task.description}</TableCell>
            <TableCell>
              <Badge variant={task.isActive ? "success" : "default"}>
                {task.isActive ? t("admin.tasks.active") : t("admin.tasks.hidden")}
              </Badge>
            </TableCell>
            <TableCell className="flex gap-1">
              <Button variant="ghost" size="sm">{t("common.edit")}</Button>
              <Button variant="ghost" size="sm">{task.isActive ? t("common.hide") : t("common.show")}</Button>
            </TableCell>
          </TableRow>
        ))}
      </DataTable>
    </div>
  );
}

"use client";

import { useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable, TableRow, TableCell } from "@/components/ui/DataTable";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Input, FormField } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { t } from "@/lib/i18n";
import { useAdminTasks, useAdminCreateTask, useAdminToggleTask } from "@/hooks/useApi";
import { getApiErrorMessage } from "@/lib/api-errors";
import type { TaskCatalogItem } from "@/types";
import { Loader2 } from "lucide-react";

function slugify(name: string) {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export default function AdminTasksPage() {
  const [showAdd, setShowAdd] = useState(false);
  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [pricePerM2, setPricePerM2] = useState(10000);
  const [error, setError] = useState("");

  const { data: tasksRaw, isLoading, refetch } = useAdminTasks();
  const { mutateAsync: createTask, isPending: creating } = useAdminCreateTask();
  const { mutateAsync: toggleTask, isPending: toggling } = useAdminToggleTask();

  const tasks = (Array.isArray(tasksRaw) ? tasksRaw : []) as TaskCatalogItem[];

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setError("");
    try {
      await createTask({ name: name.trim(), slug: slugify(name), price, pricePerM2 });
      setName("");
      setPrice(0);
      setPricePerM2(10000);
      setShowAdd(false);
      refetch();
    } catch (err) {
      setError(getApiErrorMessage(err));
    }
  };

  const handleToggle = async (taskId: string) => {
    setError("");
    try {
      await toggleTask(taskId);
      refetch();
    } catch (err) {
      setError(getApiErrorMessage(err));
    }
  };

  return (
    <div>
      <PageHeader
        title={t("admin.tasks.title")}
        action={
          <Button size="sm" onClick={() => setShowAdd(!showAdd)}>
            {t("common.add")}
          </Button>
        }
      />

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-700 text-sm">{error}</div>
      )}

      {showAdd && (
        <Card className="mb-4 max-w-md">
          <form onSubmit={handleCreate}>
            <FormField label={t("admin.tasks.taskName")}>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Tên công việc mới"
                required
              />
            </FormField>
            <FormField label="Giá cố định (VND)">
              <Input
                type="number"
                min={0}
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                placeholder="0"
                required
              />
            </FormField>
            <FormField label="Giá theo diện tích (VND/m²)">
              <Input
                type="number"
                min={0}
                value={pricePerM2}
                onChange={(e) => setPricePerM2(Number(e.target.value))}
                placeholder="10000"
                required
              />
            </FormField>
            <Button type="submit" size="sm" className="mt-2" disabled={creating}>
              {creating ? t("common.loading") : t("common.save")}
            </Button>
          </form>
        </Card>
      )}

      {isLoading ? (
        <div className="flex items-center gap-2">
          <Loader2 className="w-5 h-5 animate-spin" /> {t("common.loading")}
        </div>
      ) : (
        <DataTable
          headers={[t("admin.tasks.taskName"), t("admin.tasks.description"), "Giá cố định", "Giá/m²", t("admin.tasks.status"), "Thao tác"]}
        >
          {tasks.map((task) => (
            <TableRow key={task._id}>
              <TableCell>{task.name}</TableCell>
              <TableCell className="text-[var(--color-text-secondary)]">
                {task.description ?? task.slug}
              </TableCell>
              <TableCell className="text-right tabular-nums">
                {(task.price ?? 0).toLocaleString("vi-VN")} ₫
              </TableCell>
              <TableCell className="text-right tabular-nums">
                {(task.pricePerM2 ?? 10000).toLocaleString("vi-VN")} ₫/m²
              </TableCell>
              <TableCell>
                <Badge variant={task.isActive ? "success" : "default"}>
                  {task.isActive ? t("admin.tasks.active") : t("admin.tasks.hidden")}
                </Badge>
              </TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  size="sm"
                  disabled={toggling}
                  onClick={() => handleToggle(task._id)}
                >
                  {task.isActive ? t("common.hide") : t("common.show")}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </DataTable>
      )}
      {!isLoading && tasks.length === 0 && (
        <p className="text-[var(--color-text-muted)] mt-4">{t("common.noData")}</p>
      )}
    </div>
  );
}

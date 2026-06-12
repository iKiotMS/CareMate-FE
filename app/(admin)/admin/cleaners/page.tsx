"use client";

import { useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable, TableRow, TableCell } from "@/components/ui/DataTable";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Input, FormField } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { t } from "@/lib/i18n";
import { useAdminCleaners, useAdminCreateCleaner, useAdminLockCleaner } from "@/hooks/useApi";
import { getApiErrorMessage } from "@/lib/api-errors";
import type { User } from "@/types";
import { Loader2 } from "lucide-react";

export default function AdminCleanersPage() {
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "password123",
  });
  const [error, setError] = useState("");

  const { data, isLoading, refetch } = useAdminCleaners();
  const { mutateAsync: createCleaner, isPending: creating } = useAdminCreateCleaner();
  const { mutateAsync: lockCleaner, isPending: locking } = useAdminLockCleaner();

  const cleaners = ((data as { cleaners?: User[] })?.cleaners ?? []) as User[];

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      await createCleaner(form);
      setShowCreate(false);
      setForm({ fullName: "", email: "", phone: "", password: "password123" });
      refetch();
    } catch (err) {
      setError(getApiErrorMessage(err));
    }
  };

  const toggleLock = async (c: User) => {
    setError("");
    try {
      await lockCleaner({ id: c._id, lock: c.isActive });
      refetch();
    } catch (err) {
      setError(getApiErrorMessage(err));
    }
  };

  return (
    <div>
      <PageHeader
        title={t("admin.cleaners.title")}
        action={
          <Button size="sm" onClick={() => setShowCreate(!showCreate)}>
            {t("admin.cleaners.createCleaner")}
          </Button>
        }
      />

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-700 text-sm">{error}</div>
      )}

      {showCreate && (
        <Card className="mb-4 max-w-md">
          <form onSubmit={handleCreate} className="space-y-3">
            <FormField label={t("auth.fullName")}>
              <Input
                value={form.fullName}
                onChange={(e) => setForm((f) => ({ ...f, fullName: e.target.value }))}
                required
              />
            </FormField>
            <FormField label={t("auth.email")}>
              <Input
                type="email"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                required
              />
            </FormField>
            <FormField label={t("auth.phone")}>
              <Input
                value={form.phone}
                onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
              />
            </FormField>
            <FormField label="Mật khẩu">
              <Input
                type="password"
                value={form.password}
                onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                required
              />
            </FormField>
            <Button type="submit" size="sm" disabled={creating}>
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
          headers={["Họ tên", "Email", "SĐT", "Trạng thái", "Thao tác"]}
        >
          {cleaners.map((c) => (
            <TableRow key={c._id}>
              <TableCell>{c.fullName}</TableCell>
              <TableCell>{c.email}</TableCell>
              <TableCell>{c.phone ?? "—"}</TableCell>
              <TableCell>
                <Badge variant={c.isActive ? "success" : "danger"}>
                  {c.isActive ? "Hoạt động" : "Đã khóa"}
                </Badge>
              </TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  size="sm"
                  disabled={locking}
                  onClick={() => toggleLock(c)}
                >
                  {c.isActive ? t("common.lock") : t("common.unlock")}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </DataTable>
      )}
      {!isLoading && cleaners.length === 0 && (
        <p className="text-[var(--color-text-muted)] mt-4">{t("common.noData")}</p>
      )}
    </div>
  );
}

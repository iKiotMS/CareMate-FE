"use client";

import { useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable, TableRow, TableCell } from "@/components/ui/DataTable";
import { Button } from "@/components/ui/Button";
import { Input, FormField } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { t } from "@/lib/i18n";
import { useAdminCustomers, useAdminLockCustomer } from "@/hooks/useApi";
import { getApiErrorMessage } from "@/lib/api-errors";
import type { User } from "@/types";
import { Loader2 } from "lucide-react";

export default function AdminCustomersPage() {
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const { data, isLoading, refetch } = useAdminCustomers(search || undefined);
  const { mutateAsync: lockCustomer, isPending } = useAdminLockCustomer();

  const customers = ((data as { customers?: User[] })?.customers ?? []) as User[];

  const toggleLock = async (c: User) => {
    setError("");
    try {
      await lockCustomer({ id: c._id, lock: c.isActive });
      refetch();
    } catch (err) {
      setError(getApiErrorMessage(err));
    }
  };

  return (
    <div>
      <PageHeader title={t("admin.customers.title")} />

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-700 text-sm">{error}</div>
      )}

      <FormField label={t("common.search")} className="max-w-sm mb-4">
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Tên hoặc email..."
        />
      </FormField>

      {isLoading ? (
        <div className="flex items-center gap-2">
          <Loader2 className="w-5 h-5 animate-spin" /> {t("common.loading")}
        </div>
      ) : (
        <DataTable headers={["Họ tên", "Email", "SĐT", "Trạng thái", "Thao tác"]}>
          {customers.map((c) => (
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
                  disabled={isPending}
                  onClick={() => toggleLock(c)}
                >
                  {c.isActive ? t("common.lock") : t("common.unlock")}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </DataTable>
      )}
      {!isLoading && customers.length === 0 && (
        <p className="text-[var(--color-text-muted)] mt-4">{t("common.noData")}</p>
      )}
    </div>
  );
}

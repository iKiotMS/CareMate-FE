"use client";

import { useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable, TableRow, TableCell } from "@/components/ui/DataTable";
import { Button } from "@/components/ui/Button";
import { Input, FormField } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { t } from "@/lib/i18n";
import { MOCK_CUSTOMERS } from "@/data/mock";

export default function AdminCustomersPage() {
  const [search, setSearch] = useState("");
  const customers = MOCK_CUSTOMERS.filter(
    (c) => !search || c.fullName.toLowerCase().includes(search.toLowerCase()) || c.email.includes(search),
  );

  return (
    <div>
      <PageHeader title={t("admin.customers.title")} />
      <FormField label={t("common.search")} className="max-w-sm mb-4">
        <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Tên hoặc email..." />
      </FormField>

      <DataTable headers={["Họ tên", "Email", "SĐT", "Trạng thái", "Thao tác"]}>
        {customers.map((c) => (
          <TableRow key={c._id}>
            <TableCell>{c.fullName}</TableCell>
            <TableCell>{c.email}</TableCell>
            <TableCell>{c.phone}</TableCell>
            <TableCell>
              <Badge variant={c.isActive ? "success" : "danger"}>{c.isActive ? "Hoạt động" : "Đã khóa"}</Badge>
            </TableCell>
            <TableCell>
              <Button variant="ghost" size="sm">{c.isActive ? t("common.lock") : t("common.unlock")}</Button>
            </TableCell>
          </TableRow>
        ))}
      </DataTable>
    </div>
  );
}

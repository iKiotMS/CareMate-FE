"use client";

import { useState } from "react";
import { useAdminComplaints } from "@/hooks/useApi";
import { PageHeader } from "@/components/shared/PageHeader";
import { FilterTabs } from "@/components/shared/EmptyState";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { SkeletonTable } from "@/components/ui/Skeleton";
import { Badge } from "@/components/ui/Badge";
import { COMPLAINT_STATUS_VARIANT } from "@/lib/constants";
import type { Complaint } from "@/types";
import { formatDistanceToNow } from "date-fns";

const STATUS_TABS = [
  { id: "", label: "All" },
  { id: "OPEN", label: "Open" },
  { id: "PROCESSING", label: "Processing" },
  { id: "RESOLVED", label: "Resolved" },
  { id: "REJECTED", label: "Rejected" },
];

export default function AdminComplaintsPage() {
  const [status, setStatus] = useState("");
  const { data, isLoading, isError, refetch } = useAdminComplaints({
    status: status || undefined,
  });

  const complaints: Complaint[] = data?.data ?? [];

  if (isLoading) return <SkeletonTable rows={8} />;
  if (isError) return <ErrorState onRetry={refetch} />;

  return (
    <div className="p-6 space-y-4">
      <PageHeader title="Complaints" subtitle={`${data?.total ?? 0} total`} />

      <FilterTabs tabs={STATUS_TABS} active={status} onChange={setStatus} />

      {complaints.length === 0 ? (
        <EmptyState title="No complaints found" />
      ) : (
        <div className="rounded-xl border border-[var(--color-border)] overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-[var(--color-bg-muted)] text-[var(--color-text-secondary)]">
              <tr>
                <th className="px-4 py-3 text-left font-medium">Customer</th>
                <th className="px-4 py-3 text-left font-medium">Subject</th>
                <th className="px-4 py-3 text-left font-medium">Status</th>
                <th className="px-4 py-3 text-left font-medium">Filed</th>
                <th className="px-4 py-3 text-left font-medium">Replies</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)]">
              {complaints.map((c) => (
                <tr key={c._id} className="hover:bg-[var(--color-surface-hover)]">
                  <td className="px-4 py-3 text-[var(--color-text)]">{c.customerName}</td>
                  <td className="px-4 py-3 text-[var(--color-text)] max-w-xs truncate">{c.subject}</td>
                  <td className="px-4 py-3">
                    <Badge variant={COMPLAINT_STATUS_VARIANT[c.status] as any}>
                      {c.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-[var(--color-text-muted)]">
                    {formatDistanceToNow(new Date(c.createdAt), { addSuffix: true })}
                  </td>
                  <td className="px-4 py-3 text-[var(--color-text-muted)]">
                    {c.replies.length}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

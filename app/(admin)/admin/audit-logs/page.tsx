"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/services/api-client";
import { PageHeader } from "@/components/shared/PageHeader";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { SkeletonTable } from "@/components/ui/Skeleton";
import { Badge } from "@/components/ui/Badge";
import type { AuditLog, PaginatedResponse } from "@/types";
import { formatDistanceToNow } from "date-fns";

function useAdminAuditLogs(page = 1) {
  return useQuery({
    queryKey: ["admin", "audit-logs", page],
    queryFn: () =>
      apiClient
        .get<PaginatedResponse<AuditLog>>(`/admin/audit-logs?page=${page}&limit=20`)
        .then((r) => r.data),
  });
}

export default function AuditLogsPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading, isError, refetch } = useAdminAuditLogs(page);

  const logs: AuditLog[] = data?.data ?? [];
  const total = data?.total ?? 0;

  if (isLoading) return <SkeletonTable rows={10} />;
  if (isError) return <ErrorState onRetry={refetch} />;

  return (
    <div className="p-6 space-y-4">
      <PageHeader title="Audit Logs" subtitle={`${total} total`} />

      {logs.length === 0 ? (
        <EmptyState title="No audit logs found" />
      ) : (
        <div className="rounded-xl border border-[var(--color-border)] overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-[var(--color-bg-muted)] text-[var(--color-text-secondary)]">
              <tr>
                <th className="px-4 py-3 text-left font-medium">Actor</th>
                <th className="px-4 py-3 text-left font-medium">Action</th>
                <th className="px-4 py-3 text-left font-medium">Target</th>
                <th className="px-4 py-3 text-left font-medium">When</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)]">
              {logs.map((log) => (
                <tr key={log._id} className="hover:bg-[var(--color-surface-hover)]">
                  <td className="px-4 py-3 text-[var(--color-text)]">{log.actorName}</td>
                  <td className="px-4 py-3">
                    <Badge variant="info">{log.action}</Badge>
                  </td>
                  <td className="px-4 py-3 text-[var(--color-text-secondary)]">
                    {log.targetType} · {log.targetId.slice(-6)}
                  </td>
                  <td className="px-4 py-3 text-[var(--color-text-muted)]">
                    {formatDistanceToNow(new Date(log.createdAt), { addSuffix: true })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {total > logs.length && (
        <div className="flex justify-center">
          <button
            onClick={() => setPage((p) => p + 1)}
            className="px-4 py-2 text-sm text-[var(--color-primary)] hover:underline"
          >
            Load more
          </button>
        </div>
      )}
    </div>
  );
}

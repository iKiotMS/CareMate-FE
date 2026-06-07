"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCreateComplaint, useCustomerOrders, useUploadPhotos } from "@/hooks/useApi";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/Button";
import { Input, FormField } from "@/components/ui/Input";
import { t } from "@/lib/i18n";
import { toast } from "sonner";
import { getApiErrorMessage } from "@/lib/api-errors";

export default function NewComplaintPage() {
  const router = useRouter();
  const { data: ordersData } = useCustomerOrders();
  const createComplaint = useCreateComplaint();
  const uploadPhotos = useUploadPhotos();

  const [form, setForm] = useState({ orderId: "", subject: "", description: "" });
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);

  // API trả về array hoặc { data: [] }
  const orders: any[] = Array.isArray(ordersData)
    ? ordersData
    : (ordersData as any)?.data ?? [];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.orderId || !form.subject.trim() || !form.description.trim()) {
      toast.error("Vui lòng điền đầy đủ các trường bắt buộc");
      return;
    }

    try {
      let evidenceUrls: string[] = [];
      if (files.length > 0) {
        setUploading(true);
        const res = await uploadPhotos.mutateAsync(files);
        evidenceUrls = res.data?.urls ?? [];
        setUploading(false);
      }

      await createComplaint.mutateAsync({ ...form, evidenceUrls });
      toast.success(t("customer.complaints.submitSuccess"));
      router.push("/customer/complaints");
    } catch (err) {
      setUploading(false);
      toast.error(getApiErrorMessage(err));
    }
  }

  const isPending = createComplaint.isPending || uploading;

  return (
    <div className="p-6 max-w-lg">
      <PageHeader title={t("customer.complaints.newComplaint")} />

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <FormField label={t("customer.complaints.relatedOrder")} required>
          <select
            className="h-10 w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] px-3 text-sm text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            value={form.orderId}
            onChange={(e) => setForm({ ...form, orderId: e.target.value })}
            required
          >
            <option value="">{t("customer.complaints.selectOrder")}</option>
            {orders.map((o) => (
              <option key={o._id} value={o._id}>
                #{o._id.slice(-6).toUpperCase()} — {o.scheduledDate ?? o.createdAt?.slice(0, 10)}
              </option>
            ))}
          </select>
        </FormField>

        <FormField label={t("customer.complaints.subject")} required>
          <Input
            placeholder={t("customer.complaints.subjectPlaceholder")}
            value={form.subject}
            onChange={(e) => setForm({ ...form, subject: e.target.value })}
            maxLength={100}
            required
          />
        </FormField>

        <FormField label={t("customer.complaints.description")} required>
          <textarea
            className="min-h-[120px] w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] resize-none"
            placeholder={t("customer.complaints.descriptionPlaceholder")}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            maxLength={2000}
            required
          />
        </FormField>

        <FormField label={t("customer.complaints.evidence")}>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => setFiles(Array.from(e.target.files ?? []))}
            className="text-sm text-[var(--color-text-secondary)]"
          />
          {files.length > 0 && (
            <p className="text-xs text-[var(--color-text-muted)] mt-1">
              {t("customer.complaints.filesSelected", { count: files.length })}
            </p>
          )}
        </FormField>

        <div className="flex gap-3 pt-2">
          <Button type="button" variant="outline" onClick={() => router.back()} disabled={isPending}>
            {t("common.cancel")}
          </Button>
          <Button type="submit" loading={isPending}>
            {t("customer.complaints.submit")}
          </Button>
        </div>
      </form>
    </div>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCreateComplaint, useCustomerOrders, useUploadPhotos } from "@/hooks/useApi";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/Button";
import { Input, FormField } from "@/components/ui/Input";
import { toast } from "sonner";
import { getApiErrorMessage } from "@/lib/api-errors";

export default function NewComplaintPage() {
  const router = useRouter();
  const { data: ordersData } = useCustomerOrders();
  const createComplaint = useCreateComplaint();
  const uploadPhotos = useUploadPhotos();

  const [form, setForm] = useState({
    orderId: "",
    subject: "",
    description: "",
  });
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);

  const orders: any[] = Array.isArray(ordersData) ? ordersData : [];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.orderId || !form.subject.trim() || !form.description.trim()) {
      toast.error("Please fill in all required fields");
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
      toast.success("Complaint submitted successfully");
      router.push("/customer/complaints");
    } catch (err) {
      setUploading(false);
      toast.error(getApiErrorMessage(err));
    }
  }

  const isPending = createComplaint.isPending || uploading;

  return (
    <div className="p-6 max-w-lg">
      <PageHeader title="File a Complaint" />

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <FormField label="Related Order" required>
          <select
            className="h-10 w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] px-3 text-sm text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            value={form.orderId}
            onChange={(e) => setForm({ ...form, orderId: e.target.value })}
            required
          >
            <option value="">Select an order</option>
            {orders.map((o) => (
              <option key={o._id} value={o._id}>
                #{o._id.slice(-6).toUpperCase()} — {o.scheduledDate}
              </option>
            ))}
          </select>
        </FormField>

        <FormField label="Subject" required>
          <Input
            placeholder="Brief description of the issue"
            value={form.subject}
            onChange={(e) => setForm({ ...form, subject: e.target.value })}
            maxLength={100}
            required
          />
        </FormField>

        <FormField label="Description" required>
          <textarea
            className="min-h-[120px] w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] resize-none"
            placeholder="Describe the issue in detail"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            maxLength={2000}
            required
          />
        </FormField>

        <FormField label="Evidence Photos (optional)">
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => setFiles(Array.from(e.target.files ?? []))}
            className="text-sm text-[var(--color-text-secondary)]"
          />
          {files.length > 0 && (
            <p className="text-xs text-[var(--color-text-muted)]">{files.length} file(s) selected</p>
          )}
        </FormField>

        <div className="flex gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button type="submit" loading={isPending}>
            Submit Complaint
          </Button>
        </div>
      </form>
    </div>
  );
}

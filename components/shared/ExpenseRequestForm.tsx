"use client";

import { useRef, useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { t } from "@/lib/i18n";
import { getApiErrorMessage } from "@/lib/api-errors";
import { useRequestExpense, useUploadPhotos } from "@/hooks/useApi";
import { Receipt, Upload } from "lucide-react";

/**
 * Cleaner claims an out-of-pocket expense (parking, building access fee, …).
 * The receipt photo is mandatory — the backend rejects the request without one,
 * so the submit button stays disabled until an upload succeeds.
 */
export function ExpenseRequestForm({ orderId }: { orderId: string }) {
  const requestExpense = useRequestExpense(orderId);
  const { mutateAsync: uploadPhotos, isPending: uploading } = useUploadPhotos();
  const fileRef = useRef<HTMLInputElement>(null);

  const [open, setOpen] = useState(false);
  const [label, setLabel] = useState("");
  const [amount, setAmount] = useState("");
  const [photo, setPhoto] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const reset = () => {
    setOpen(false);
    setLabel("");
    setAmount("");
    setPhoto(null);
    setError(null);
  };

  const onPickFile = async (files: FileList | null) => {
    if (!files?.length) return;
    setError(null);
    try {
      const res = await uploadPhotos([files[0]]);
      const url = (res.data as { urls: string[] }).urls?.[0];
      if (!url) throw new Error("Upload không trả về URL");
      setPhoto(url);
    } catch (e) {
      setError(getApiErrorMessage(e));
    }
  };

  const submit = async () => {
    setError(null);
    try {
      await requestExpense.mutateAsync({
        label: label.trim(),
        amount: Number(amount),
        evidencePhoto: photo!,
      });
      reset();
    } catch (e) {
      setError(getApiErrorMessage(e));
    }
  };

  const canSubmit =
    label.trim().length > 0 && Number(amount) > 0 && !!photo && !requestExpense.isPending;

  if (!open) {
    return (
      <Button variant="outline" onClick={() => setOpen(true)}>
        <Receipt className="w-4 h-4 mr-1.5" />
        {t("adjustment.requestExpense")}
      </Button>
    );
  }

  return (
    <Card>
      <h2 className="font-semibold mb-1">{t("adjustment.requestExpense")}</h2>
      <p className="text-xs text-[var(--color-text-muted)] mb-4">
        {t("adjustment.reimbursedNote")} {t("adjustment.evidenceRequired")}
      </p>

      <div className="space-y-3">
        <div>
          <label className="block text-sm mb-1">{t("adjustment.label")}</label>
          <input
            type="text"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder={t("adjustment.labelPlaceholder")}
            className="w-full px-3 py-2 text-sm rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)]"
          />
        </div>

        <div>
          <label className="block text-sm mb-1">{t("adjustment.amount")}</label>
          <input
            type="number"
            min={1}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full px-3 py-2 text-sm rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)]"
          />
        </div>

        <div>
          <label className="block text-sm mb-1">
            {t("adjustment.evidence")}
          </label>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            hidden
            onChange={(e) => onPickFile(e.target.files)}
          />
          {photo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={photo}
              alt={t("adjustment.evidence")}
              className="h-24 w-auto rounded-[var(--radius-md)] border border-[var(--color-border)] object-cover"
            />
          ) : (
            <Button
              variant="outline"
              size="sm"
              loading={uploading}
              onClick={() => fileRef.current?.click()}
            >
              <Upload className="w-4 h-4 mr-1.5" />
              {t("adjustment.evidence")}
            </Button>
          )}
        </div>

        {error && <p className="text-sm text-[var(--color-danger)]">{error}</p>}

        <div className="flex gap-2 pt-1">
          <Button
            disabled={!canSubmit}
            loading={requestExpense.isPending}
            onClick={submit}
          >
            {t("common.submit")}
          </Button>
          <Button variant="ghost" onClick={reset}>
            {t("common.cancel")}
          </Button>
        </div>
      </div>
    </Card>
  );
}

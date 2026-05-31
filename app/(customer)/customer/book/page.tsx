"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/shared/PageHeader";
import { Stepper } from "@/components/ui/Stepper";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input, Textarea, Select, FormField } from "@/components/ui/Input";
import { t } from "@/lib/i18n";
import { MOCK_TASKS } from "@/data/mock";
import { TIME_SLOTS, PAYMENT_METHODS } from "@/lib/constants";
import { Check, Upload, CreditCard } from "lucide-react";
import { cn } from "@/lib/cn";

export default function BookCleaningPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    date: "",
    time: "",
    address: "",
    note: "",
    taskIds: [] as string[],
    photos: 0,
    payment: "",
  });

  const steps = [
    { id: 1, label: t("customer.book.step1") },
    { id: 2, label: t("customer.book.step2") },
    { id: 3, label: t("customer.book.step3") },
    { id: 4, label: t("customer.book.step4") },
    { id: 5, label: t("customer.book.step5") },
  ];

  const activeTasks = MOCK_TASKS.filter((t) => t.isActive);
  const selectedTasks = activeTasks.filter((t) => form.taskIds.includes(t._id));

  const toggleTask = (id: string) => {
    setForm((f) => ({
      ...f,
      taskIds: f.taskIds.includes(id) ? f.taskIds.filter((x) => x !== id) : [...f.taskIds, id],
    }));
  };

  const canNext = () => {
    if (step === 1) return form.date && form.time && form.address;
    if (step === 2) return form.taskIds.length > 0;
    if (step === 3) return true;
    if (step === 4) return true;
    return true;
  };

  const handleSubmit = () => {
    alert(t("customer.book.success"));
    router.push("/customer/orders");
  };

  return (
    <div>
      <PageHeader title={t("customer.book.title")} />
      <Stepper steps={steps} currentStep={step} className="mb-8" />

      <Card padding="lg" className="max-w-2xl">
        {step === 1 && (
          <div className="space-y-4">
            <FormField label={t("customer.book.date")}>
              <Input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
            </FormField>
            <FormField label={t("customer.book.timeSlot")}>
              <Select value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })}>
                <option value="">— Chọn khung giờ —</option>
                {TIME_SLOTS.map((s) => <option key={s} value={s}>{s}</option>)}
              </Select>
            </FormField>
            <FormField label={t("customer.book.address")}>
              <Input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} placeholder="Số nhà, đường, quận, thành phố" />
            </FormField>
            <FormField label={t("customer.book.note")}>
              <Textarea value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} />
            </FormField>
          </div>
        )}

        {step === 2 && (
          <div>
            <p className="text-sm text-[var(--color-text-secondary)] mb-4">{t("customer.book.selectTasks")}</p>
            <div className="grid sm:grid-cols-2 gap-3">
              {activeTasks.map((task) => {
                const selected = form.taskIds.includes(task._id);
                return (
                  <button
                    key={task._id}
                    type="button"
                    onClick={() => toggleTask(task._id)}
                    className={cn(
                      "text-left p-4 rounded-[var(--radius-lg)] border-2 transition-all",
                      selected ? "border-[var(--color-primary)] bg-[var(--color-primary-soft)]" : "border-[var(--color-border)] hover:border-[var(--color-primary)]/50",
                    )}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium text-[var(--color-text)]">{task.name}</p>
                        <p className="text-xs text-[var(--color-text-muted)] mt-1">{task.description}</p>
                      </div>
                      {selected && <Check className="w-5 h-5 text-[var(--color-primary)] shrink-0" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <p className="text-sm text-[var(--color-text-secondary)] mb-4">{t("customer.book.uploadPhotos")}</p>
            <div
              className="border-2 border-dashed border-[var(--color-border)] rounded-[var(--radius-xl)] p-12 text-center cursor-pointer hover:border-[var(--color-primary)] transition-colors"
              onClick={() => setForm({ ...form, photos: form.photos + 1 })}
            >
              <Upload className="w-10 h-10 mx-auto text-[var(--color-text-muted)] mb-3" />
              <p className="text-sm text-[var(--color-text-secondary)]">Nhấn để chọn ảnh (demo)</p>
              {form.photos > 0 && <p className="text-sm text-[var(--color-success)] mt-2">Đã chọn {form.photos} ảnh</p>}
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-4">
            <h3 className="font-semibold text-[var(--color-text)]">{t("customer.book.summary")}</h3>
            <div className="rounded-[var(--radius-lg)] bg-[var(--color-bg-muted)] p-4 space-y-2 text-sm">
              <p><strong>{t("customer.book.date")}:</strong> {form.date || "—"}</p>
              <p><strong>{t("customer.book.timeSlot")}:</strong> {form.time || "—"}</p>
              <p><strong>{t("customer.book.address")}:</strong> {form.address || "—"}</p>
              <p><strong>{t("customer.book.totalTasks")}:</strong> {selectedTasks.length}</p>
              <ul className="list-disc list-inside text-[var(--color-text-secondary)]">
                {selectedTasks.map((t) => <li key={t._id}>{t.name}</li>)}
              </ul>
              <p><strong>Ảnh:</strong> {form.photos} ảnh</p>
            </div>
          </div>
        )}

        {step === 5 && (
          <div>
            <p className="text-sm text-[var(--color-text-muted)] mb-4 flex items-center gap-2">
              <CreditCard className="w-4 h-4" />
              {t("customer.book.paymentNote")}
            </p>
            <div className="space-y-3">
              {PAYMENT_METHODS.map((p) => (
                <label key={p.id} className={cn(
                  "flex items-center gap-3 p-4 rounded-[var(--radius-lg)] border-2 cursor-pointer transition-all",
                  form.payment === p.id ? "border-[var(--color-primary)] bg-[var(--color-primary-soft)]" : "border-[var(--color-border)]",
                )}>
                  <input type="radio" name="payment" value={p.id} checked={form.payment === p.id} onChange={() => setForm({ ...form, payment: p.id })} className="sr-only" />
                  <div>
                    <p className="font-medium">{p.name}</p>
                    <p className="text-xs text-[var(--color-text-muted)]">{p.description}</p>
                  </div>
                  <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-[var(--color-warning-soft)] text-[var(--color-warning)]">{t("common.comingSoon")}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-between mt-8 pt-6 border-t border-[var(--color-border)]">
          <Button variant="outline" onClick={() => setStep((s) => Math.max(1, s - 1))} disabled={step === 1}>
            {t("common.previous")}
          </Button>
          {step < 5 ? (
            <Button onClick={() => setStep((s) => s + 1)} disabled={!canNext()}>{t("common.next")}</Button>
          ) : (
            <Button onClick={handleSubmit}>{t("customer.book.placeOrder")}</Button>
          )}
        </div>
      </Card>
    </div>
  );
}

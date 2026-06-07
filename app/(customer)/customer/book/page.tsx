"use client";

import { useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/shared/PageHeader";
import { Stepper } from "@/components/ui/Stepper";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input, Textarea, Select, FormField } from "@/components/ui/Input";
import { t } from "@/lib/i18n";
import { TIME_SLOTS } from "@/lib/constants";
import {
  useCreateOrder,
  useTaskCatalog,
  useUploadPhotos,
} from "@/hooks/useApi";
import { getApiErrorMessage } from "@/lib/api-errors";
import { Check, Upload, Loader2 } from "lucide-react";
import { cn } from "@/lib/cn";

interface TaskItem {
  _id: string;
  name: string;
  description?: string;
  price: number;
  isActive: boolean;
}

export default function BookCleaningPage() {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [photoUrls, setPhotoUrls] = useState<string[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [form, setForm] = useState({
    date: "",
    time: "",
    address: "",
    note: "",
    taskIds: [] as string[],
  });

  const { data: tasksRaw, isLoading: tasksLoading } = useTaskCatalog(true);
  const { mutateAsync: createOrder, isPending: creating } = useCreateOrder();
  const { mutateAsync: uploadPhotos, isPending: uploading } = useUploadPhotos();

  const tasks: TaskItem[] = Array.isArray(tasksRaw) ? tasksRaw : [];
  const activeTasks = tasks.filter((task) => task.isActive);
  const selectedTasks = activeTasks.filter((task) =>
    form.taskIds.includes(task._id),
  );

  const steps = [
    { id: 1, label: t("customer.book.step1") },
    { id: 2, label: t("customer.book.step2") },
    { id: 3, label: t("customer.book.step3") },
    { id: 4, label: t("customer.book.step4") },
  ];

  const toggleTask = (id: string) => {
    setForm((f) => ({
      ...f,
      taskIds: f.taskIds.includes(id)
        ? f.taskIds.filter((x) => x !== id)
        : [...f.taskIds, id],
    }));
  };

  const canNext = () => {
    if (step === 1) return form.date && form.time && form.address.trim();
    if (step === 2) return form.taskIds.length > 0;
    return true;
  };

  const handleFiles = (files: FileList | null) => {
    if (!files?.length) return;
    setSelectedFiles((prev) => [...prev, ...Array.from(files)]);
  };

  const removeSelectedFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  useEffect(() => {
    // create object URLs for local previews
    const urls = selectedFiles.map((f) => URL.createObjectURL(f));
    setPreviews(urls);

    // cleanup when selectedFiles change or component unmounts
    return () => {
      urls.forEach((u) => URL.revokeObjectURL(u));
    };
  }, [selectedFiles]);

  const uploadAllPhotos = async (): Promise<string[]> => {
    if (selectedFiles.length === 0) return photoUrls;
    try {
      const res = await uploadPhotos(selectedFiles);
      const urls: string[] = res.data?.urls ?? [];
      setPhotoUrls((prev) => [...prev, ...urls]);
      setSelectedFiles([]);
      return [...photoUrls, ...urls];
    } catch {
      return photoUrls;
    }
  };

  const submitOrder = async () => {
    setError("");
    try {
      const urls = await uploadAllPhotos();
      await createOrder({
        scheduledDate: form.date,
        scheduledTime: form.time,
        address: form.address.trim(),
        note: form.note.trim() || undefined,
        taskIds: form.taskIds,
        photosBeforeBooking: urls.length > 0 ? urls : undefined,
        paymentMethod: "BANK_TRANSFER",
      });
      router.push("/customer/orders");
    } catch (err) {
      setError(
        getApiErrorMessage(
          err,
          "Không tạo được đơn. Hãy đăng nhập bằng tài khoản khách hàng và đảm bảo BE đang chạy.",
        ),
      );
    }
  };

  const busy = creating || uploading;

  return (
    <div>
      <PageHeader title={t("customer.book.title")} />

      {error && (
        <div className="mb-4 max-w-2xl p-3 rounded-lg bg-red-50 text-red-700 text-sm border border-red-200">
          {error}
        </div>
      )}

      <Stepper steps={steps} currentStep={step} className="mb-8 max-w-4xl" />

      <Card padding="lg" className="max-w-4xl">
        {step === 1 && (
          <div className="space-y-4">
            <FormField label={t("customer.book.date")}>
              <Input
                type="date"
                value={form.date}
                min={new Date().toISOString().split("T")[0]}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
              />
            </FormField>
            <FormField label={t("customer.book.timeSlot")}>
              <Select
                value={form.time}
                onChange={(e) => setForm({ ...form, time: e.target.value })}
              >
                <option value="">— Chọn khung giờ —</option>
                {TIME_SLOTS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </Select>
            </FormField>
            <FormField label={t("customer.book.address")}>
              <Input
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                placeholder="Số nhà, đường, quận, TP.HCM"
              />
            </FormField>
            <FormField label={t("customer.book.note")}>
              <Textarea
                value={form.note}
                onChange={(e) => setForm({ ...form, note: e.target.value })}
              />
            </FormField>
          </div>
        )}

        {step === 2 && (
          <div>
            {tasksLoading ? (
              <p className="flex items-center gap-2 text-sm text-[var(--color-text-muted)]">
                <Loader2 className="w-4 h-4 animate-spin" /> Đang tải danh mục
                công việc...
              </p>
            ) : activeTasks.length === 0 ? (
              <p className="text-sm text-amber-600">
                Chưa có công việc. Khởi động BE để seed TaskCatalog.
              </p>
            ) : (
              <>
                <p className="text-sm text-[var(--color-text-secondary)] mb-4">
                  {t("customer.book.selectTasks")}
                </p>
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
                          selected
                            ? "border-[var(--color-primary)] bg-[var(--color-primary-soft)]"
                            : "border-[var(--color-border)] hover:border-[var(--color-primary)]/50",
                        )}
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-medium text-[var(--color-text)]">
                              {task.name}
                            </p>
                            {task.description && (
                              <p className="text-xs text-[var(--color-text-muted)] mt-1">
                                {task.description}
                              </p>
                            )}
                          </div>
                          <div className="flex flex-col items-end gap-1 shrink-0">
                            {task.price > 0 && (
                              <span className="text-xs font-medium text-[var(--color-text-secondary)]">
                                {task.price} ₫
                              </span>
                            )}
                            {selected && (
                              <Check className="w-5 h-5 text-[var(--color-primary)]" />
                            )}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {selectedTasks.length > 0 && (
                  <div className="mt-4 rounded-lg bg-[var(--color-primary)]/5 px-4 py-3 border border-[var(--color-primary)]/20 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-[var(--color-text)]">
                        Tổng tiền
                      </span>
                      <span className="text-lg font-bold text-[var(--color-primary)]">
                        {selectedTasks.reduce((s, t) => s + t.price, 0).toLocaleString("vi-VN")} ₫
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-[var(--color-text-muted)]">
                      <span>Đặt cọc</span>
                      <span>30.000 ₫</span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-[var(--color-text-muted)]">
                      <span>Còn lại sau dịch vụ</span>
                      <span>{Math.max(0, selectedTasks.reduce((s, t) => s + t.price, 0) - 30000).toLocaleString("vi-VN")} ₫</span>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {step === 3 && (
          <div>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => handleFiles(e.target.files)}
            />
            <p className="text-sm text-[var(--color-text-secondary)] mb-4">
              {t("customer.book.uploadPhotos")}
            </p>
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="w-full border-2 border-dashed border-[var(--color-border)] rounded-[var(--radius-xl)] p-12 text-center hover:border-[var(--color-primary)] transition-colors"
            >
              <Upload className="w-10 h-10 mx-auto text-[var(--color-text-muted)] mb-3" />
              <p className="text-sm text-[var(--color-text-secondary)]">
                Chọn ảnh (tùy chọn)
              </p>
            </button>
            {(selectedFiles.length > 0 || photoUrls.length > 0) && (
              <p className="text-sm text-[var(--color-success)] mt-2">
                {selectedFiles.length} file chờ upload · {photoUrls.length} URL
                đã có
              </p>
            )}
            {previews.length > 0 && (
              <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
                {previews.map((src, i) => (
                  <div
                    key={i}
                    className="relative rounded-[var(--radius-md)] overflow-hidden border"
                  >
                    <img
                      src={src}
                      alt={`preview-${i}`}
                      className="w-full h-24 object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeSelectedFile(i)}
                      className="absolute top-1 right-1 bg-white/80 rounded-full p-1 text-xs"
                      aria-label="Remove photo"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}

            {photoUrls.length > 0 && (
              <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
                {photoUrls.map((src, i) => (
                  <div
                    key={`url-${i}`}
                    className="rounded-[var(--radius-md)] overflow-hidden border"
                  >
                    <img
                      src={src}
                      alt={`uploaded-${i}`}
                      className="w-full h-24 object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {step === 4 && (
          <div className="space-y-4">
            <h3 className="font-semibold text-[var(--color-text)]">
              {t("customer.book.summary")}
            </h3>
            <div className="rounded-[var(--radius-lg)] bg-[var(--color-bg-muted)] p-4 space-y-2 text-sm">
              <p>
                <strong>{t("customer.book.date")}:</strong> {form.date}
              </p>
              <p>
                <strong>{t("customer.book.timeSlot")}:</strong> {form.time}
              </p>
              <p>
                <strong>{t("customer.book.address")}:</strong> {form.address}
              </p>
              <p>
                <strong>{t("customer.book.totalTasks")}:</strong>{" "}
                {selectedTasks.length}
              </p>
              <ul className="list-disc list-inside text-[var(--color-text-secondary)]">
                {selectedTasks.map((task) => (
                  <li key={task._id}>{task.name}</li>
                ))}
              </ul>
            </div>
            <div className="mt-4 p-3 rounded-lg bg-blue-50 dark:bg-blue-950/20 text-sm text-blue-800 dark:text-blue-300">
              Sau khi đặt đơn, bạn sẽ chọn nhân viên và thanh toán đặt cọc{" "}
              <strong>30.000 ₫</strong> qua QR chuyển khoản.
            </div>
            <Button
              onClick={submitOrder}
              disabled={busy}
              className="w-full mt-4"
            >
              {busy ? (
                <Loader2 className="w-4 h-4 animate-spin inline mr-2" />
              ) : null}
              {t("customer.book.placeOrder")}
            </Button>
          </div>
        )}

        <div className="flex justify-between mt-8 pt-6 border-t border-[var(--color-border)]">
          <Button
            variant="outline"
            onClick={() => setStep((s) => Math.max(1, s - 1))}
            disabled={step === 1 || busy}
          >
            {t("common.previous")}
          </Button>
          {step < 4 ? (
            <Button
              onClick={() => setStep((s) => s + 1)}
              disabled={!canNext() || busy}
            >
              {t("common.next")}
            </Button>
          ) : null}
        </div>
      </Card>
    </div>
  );
}

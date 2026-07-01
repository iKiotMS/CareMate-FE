"use client";

import { useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/shared/PageHeader";
import { Stepper } from "@/components/ui/Stepper";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input, Textarea, Select, FormField } from "@/components/ui/Input";
import { t } from "@/lib/i18n";
import {
  START_TIMES,
  HOURLY_RATE,
  AREA_RATE,
  AREA_OPTIONS,
  DURATION_OPTIONS,
  CLEANER_COUNT_OPTIONS,
} from "@/lib/constants";
import {
  useCreateOrder,
  useTaskCatalog,
  useUploadPhotos,
  useUser,
} from "@/hooks/useApi";
import { getApiErrorMessage } from "@/lib/api-errors";
import { Check, Upload, Loader2, MapPin, Plus } from "lucide-react";
import { cn } from "@/lib/cn";
import { toast } from "sonner";
import type { UserAddress } from "@/types";

const MAX_PHOTOS = 5;
const MAX_PHOTO_MB = 5;

interface TaskItem {
  _id: string;
  name: string;
  description?: string;
  isActive: boolean;
}

export default function BookCleaningPage() {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");
  const [today, setToday] = useState("");
  const [maxDate, setMaxDate] = useState("");
  const [step1Errors, setStep1Errors] = useState<{ date?: string; time?: string; address?: string }>({});
  const [step2Errors, setStep2Errors] = useState<{ tasks?: string; area?: string }>({});
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [photoUrls, setPhotoUrls] = useState<string[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [form, setForm] = useState({
    date: "",
    time: "",
    address: "",
    note: "",
    taskIds: [] as string[],
    durationHours: DURATION_OPTIONS[0],
    numCleaners: CLEANER_COUNT_OPTIONS[0],
    areaOptionIdx: -1,
  });

  useEffect(() => {
    const now = new Date();
    setToday(now.toISOString().split("T")[0]);
    const max = new Date(now);
    max.setDate(max.getDate() + 90);
    setMaxDate(max.toISOString().split("T")[0]);
  }, []);

  useEffect(() => {
    if (!form.time || !form.date) return;
    const today = new Date().toISOString().split("T")[0];
    if (form.date !== today) return;
    const [hours, minutes] = form.time.split(":").map(Number);
    const start = new Date();
    start.setHours(hours, minutes, 0, 0);
    if (start.getTime() < Date.now() + 2 * 60 * 60 * 1000) {
      setForm((f) => ({ ...f, time: "" }));
    }
  }, [form.date]);

  const { data: tasksRaw, isLoading: tasksLoading } = useTaskCatalog(true);
  const { mutateAsync: createOrder, isPending: creating } = useCreateOrder();
  const { mutateAsync: uploadPhotos, isPending: uploading } = useUploadPhotos();
  const { data: userData } = useUser();

  const savedAddresses: UserAddress[] = (userData as any)?.addresses ?? [];
  const defaultAddress = savedAddresses.find((a) => a.isDefault) ?? savedAddresses[0] ?? null;

  // pre-fill address from default on first load
  const [addressPrefilled, setAddressPrefilled] = useState(false);
  useEffect(() => {
    if (!addressPrefilled && defaultAddress && !form.address) {
      setForm((f) => ({ ...f, address: defaultAddress.address }));
      setAddressPrefilled(true);
    }
  }, [defaultAddress, addressPrefilled, form.address]);

  // track selected saved address id (null = custom manual input)
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [showManualInput, setShowManualInput] = useState(false);

  // sync selectedAddressId once when user data loads
  useEffect(() => {
    if (defaultAddress) setSelectedAddressId(defaultAddress._id);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultAddress?._id]);

  const handleSelectSavedAddress = (addr: UserAddress) => {
    setSelectedAddressId(addr._id);
    setShowManualInput(false);
    setForm((f) => ({ ...f, address: addr.address }));
  };

  const handleUseManual = () => {
    setSelectedAddressId(null);
    setShowManualInput(true);
    setForm((f) => ({ ...f, address: "" }));
  };

  const tasks: TaskItem[] = Array.isArray(tasksRaw) ? tasksRaw : [];
  const activeTasks = tasks.filter((task) => task.isActive);
  const selectedTasks = activeTasks.filter((task) =>
    form.taskIds.includes(task._id),
  );
  const selectedArea = form.areaOptionIdx >= 0 ? AREA_OPTIONS[form.areaOptionIdx] : null;
  const areaM2Num = selectedArea?.areaM2 ?? 0;
  const DEPOSIT_AMOUNT = 30_000;
  const totalAmount =
    HOURLY_RATE * form.durationHours * form.numCleaners + AREA_RATE * areaM2Num;

  const steps = [
    { id: 1, label: t("customer.book.step1") },
    { id: 2, label: t("customer.book.step2") },
    { id: 3, label: t("customer.book.step3") },
    { id: 4, label: t("customer.book.step4") },
  ];

  const isStartTimeUnavailable = (startTime: string): boolean => {
    if (!form.date || !today) return false;
    if (form.date !== today) return false;
    const [hours, minutes] = startTime.split(":").map(Number);
    const start = new Date();
    start.setHours(hours, minutes, 0, 0);
    return start.getTime() < Date.now() + 2 * 60 * 60 * 1000;
  };

  const toggleTask = (id: string) => {
    setForm((f) => ({
      ...f,
      taskIds: f.taskIds.includes(id)
        ? f.taskIds.filter((x) => x !== id)
        : [...f.taskIds, id],
    }));
  };

  const validateStep1 = (): boolean => {
    const errs: typeof step1Errors = {};
    if (!form.date) errs.date = "Vui lòng chọn ngày dọn";
    if (!form.time) errs.time = "Vui lòng chọn giờ bắt đầu";
    if (!form.address.trim()) errs.address = "Vui lòng nhập địa chỉ";
    setStep1Errors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateStep2 = (): boolean => {
    const errs: typeof step2Errors = {};
    if (form.taskIds.length === 0) errs.tasks = "Vui lòng chọn ít nhất một công việc";
    if (form.areaOptionIdx < 0) errs.area = "Vui lòng chọn khoảng diện tích";
    setStep2Errors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (step === 1 && !validateStep1()) return;
    if (step === 2 && !validateStep2()) return;
    setStep((s) => s + 1);
  };

  const handleFiles = (files: FileList | null) => {
    if (!files?.length) return;
    const existing = selectedFiles.length + photoUrls.length;
    const remaining = MAX_PHOTOS - existing;
    if (remaining <= 0) {
      toast.error(`Tối đa ${MAX_PHOTOS} ảnh`);
      return;
    }
    const toAdd = Array.from(files).slice(0, remaining);
    const oversized = toAdd.filter((f) => f.size > MAX_PHOTO_MB * 1024 * 1024);
    if (oversized.length > 0) {
      toast.error(`Mỗi ảnh tối đa ${MAX_PHOTO_MB}MB`);
      return;
    }
    setSelectedFiles((prev) => [...prev, ...toAdd]);
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
      const result = await createOrder({
        scheduledDate: form.date,
        scheduledTime: form.time,
        address: form.address.trim(),
        note: form.note.trim() || undefined,
        taskIds: form.taskIds,
        durationHours: form.durationHours,
        numCleaners: form.numCleaners,
        areaM2: areaM2Num,
        photosBeforeBooking: urls.length > 0 ? urls : undefined,
        paymentMethod: "BANK_TRANSFER",
      });
      const orderId = (result as any)?.data?._id ?? (result as any)?._id;
      toast.success(orderId ? `Đặt lịch thành công! Mã đơn #${String(orderId).slice(-6).toUpperCase()}` : "Đặt lịch thành công!");
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
            <FormField label={t("customer.book.date")} required>
              <Input
                type="date"
                value={form.date}
                min={today}
                max={maxDate}
                onChange={(e) => {
                  setForm({ ...form, date: e.target.value });
                  setStep1Errors((prev) => ({ ...prev, date: undefined }));
                }}
                className={step1Errors.date ? "border-red-500" : ""}
              />
              {step1Errors.date && <p className="mt-1 text-xs text-red-600">{step1Errors.date}</p>}
            </FormField>
            <FormField label="Giờ bắt đầu" required>
              <Select
                value={form.time}
                onChange={(e) => {
                  setForm({ ...form, time: e.target.value });
                  setStep1Errors((prev) => ({ ...prev, time: undefined }));
                }}
                className={step1Errors.time ? "border-red-500" : ""}
              >
                <option value="">— Chọn giờ bắt đầu —</option>
                {START_TIMES.map((s) => {
                  const unavailable = isStartTimeUnavailable(s);
                  return (
                    <option key={s} value={s} disabled={unavailable}>
                      {s}{unavailable ? " (Không còn khả dụng)" : ""}
                    </option>
                  );
                })}
              </Select>
              <p className="mt-1 text-xs text-[var(--color-text-muted)]">
                Thời lượng dọn được chọn ở bước sau.
              </p>
              {step1Errors.time && <p className="mt-1 text-xs text-red-600">{step1Errors.time}</p>}
            </FormField>
            <div>
              <p className="text-sm font-medium text-[var(--color-text)] mb-2">
                {t("customer.book.address")} <span className="text-red-500">*</span>
              </p>

              {step1Errors.address && (
                <p className="mb-2 text-xs text-red-600">{step1Errors.address}</p>
              )}

              {savedAddresses.length === 0 && !showManualInput && (
                <p className="mb-2 text-sm text-amber-600">
                  Bạn chưa có địa chỉ đã lưu.{" "}
                  <a href="/customer/profile" className="text-[var(--color-primary)] underline">
                    Thêm địa chỉ trong hồ sơ
                  </a>{" "}
                  hoặc nhập địa chỉ mới bên dưới.
                </p>
              )}

              {savedAddresses.length > 0 ? (
                <div className="space-y-2">
                  {savedAddresses.map((addr) => (
                    <button
                      key={addr._id}
                      type="button"
                      onClick={() => handleSelectSavedAddress(addr)}
                      className={cn(
                        "w-full text-left flex items-start gap-3 p-3 rounded-[var(--radius-lg)] border-2 transition-all",
                        selectedAddressId === addr._id
                          ? "border-[var(--color-primary)] bg-[var(--color-primary-soft)]"
                          : "border-[var(--color-border)] hover:border-[var(--color-primary)]/50",
                      )}
                    >
                      <MapPin
                        className={cn(
                          "w-4 h-4 mt-0.5 shrink-0",
                          selectedAddressId === addr._id
                            ? "text-[var(--color-primary)]"
                            : "text-[var(--color-text-muted)]",
                        )}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-[var(--color-text)]">
                            {addr.label || "Địa chỉ"}
                          </span>
                          {addr.isDefault && (
                            <span className="text-xs px-1.5 py-0.5 rounded-full bg-[var(--color-primary)] text-white font-medium">
                              Mặc định
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-[var(--color-text-secondary)] mt-0.5 line-clamp-2">
                          {addr.address}
                        </p>
                      </div>
                      {selectedAddressId === addr._id && (
                        <Check className="w-4 h-4 text-[var(--color-primary)] shrink-0 mt-0.5" />
                      )}
                    </button>
                  ))}

                  {/* Nhập địa chỉ khác */}
                  <button
                    type="button"
                    onClick={handleUseManual}
                    className={cn(
                      "w-full text-left flex items-center gap-3 p-3 rounded-[var(--radius-lg)] border-2 transition-all",
                      showManualInput
                        ? "border-[var(--color-primary)] bg-[var(--color-primary-soft)]"
                        : "border-dashed border-[var(--color-border)] hover:border-[var(--color-primary)]/50",
                    )}
                  >
                    <Plus className="w-4 h-4 text-[var(--color-text-muted)] shrink-0" />
                    <span className="text-sm text-[var(--color-text-secondary)]">
                      Dùng địa chỉ khác
                    </span>
                  </button>

                  {showManualInput && (
                    <Input
                      value={form.address}
                      onChange={(e) => {
                        setForm({ ...form, address: e.target.value });
                        setStep1Errors((prev) => ({ ...prev, address: undefined }));
                      }}
                      placeholder="Số nhà, tên đường, phường/xã, quận/huyện, TP.HCM"
                      autoFocus
                    />
                  )}

                  <p className="text-xs text-[var(--color-text-muted)]">
                    Quản lý địa chỉ trong{" "}
                    <a href="/customer/profile" className="text-[var(--color-primary)] underline">
                      hồ sơ của bạn
                    </a>
                    .
                  </p>
                </div>
              ) : (
                <>
                  <Input
                    value={form.address}
                    onChange={(e) => {
                      setForm({ ...form, address: e.target.value });
                      setStep1Errors((prev) => ({ ...prev, address: undefined }));
                    }}
                    placeholder="Số nhà, tên đường, phường/xã, quận/huyện, TP.HCM"
                  />
                  <p className="text-xs text-[var(--color-text-muted)] mt-1">
                    Lưu địa chỉ trong{" "}
                    <a href="/customer/profile" className="text-[var(--color-primary)] underline">
                      hồ sơ
                    </a>{" "}
                    để đặt đơn nhanh hơn lần sau.
                  </p>
                </>
              )}
            </div>
            <FormField label={t("customer.book.note")}>
              <Textarea
                value={form.note}
                maxLength={500}
                onChange={(e) => setForm({ ...form, note: e.target.value })}
                placeholder="Ghi chú cho nhân viên (tuỳ chọn)..."
              />
              <p className="mt-1 text-xs text-[var(--color-text-muted)] text-right">{form.note.length}/500</p>
            </FormField>
          </div>
        )}

        {step === 2 && (
          <div>
            {tasksLoading ? (
              <div className="flex items-center gap-2 text-sm text-[var(--color-text-muted)]">
                <Loader2 className="w-4 h-4 animate-spin" /> Đang tải danh mục
                công việc...
              </div>
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
                        onClick={() => {
                          toggleTask(task._id);
                          setStep2Errors((prev) => ({ ...prev, tasks: undefined }));
                        }}
                        className={cn(
                          "text-left p-4 rounded-[var(--radius-lg)] border-2 transition-all",
                          selected
                            ? "border-[var(--color-primary)] bg-[var(--color-primary-soft)]"
                            : "border-[var(--color-border)] hover:border-[var(--color-primary)]/50",
                        )}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-[var(--color-text)] truncate">
                              {task.name}
                            </p>
                            {task.description && (
                              <p className="text-xs text-[var(--color-text-muted)] mt-1 line-clamp-2">
                                {task.description}
                              </p>
                            )}
                          </div>
                          {selected && (
                            <Check className="w-5 h-5 text-[var(--color-primary)] shrink-0" />
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {step2Errors.tasks && (
                  <p className="mt-2 text-xs text-red-600">{step2Errors.tasks}</p>
                )}

                {/* Duration (hours) */}
                <div className="mt-6">
                  <p className="text-sm font-medium text-[var(--color-text)] mb-2">
                    Thời lượng làm việc <span className="text-red-500">*</span>
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {DURATION_OPTIONS.map((h) => (
                      <button
                        key={h}
                        type="button"
                        onClick={() => setForm((f) => ({ ...f, durationHours: h }))}
                        className={cn(
                          "px-4 py-2 rounded-[var(--radius-lg)] border-2 text-sm font-medium transition-all",
                          form.durationHours === h
                            ? "border-[var(--color-primary)] bg-[var(--color-primary-soft)] text-[var(--color-primary)]"
                            : "border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-primary)]/50",
                        )}
                      >
                        {h} giờ
                      </button>
                    ))}
                  </div>
                </div>

                {/* Number of cleaners */}
                <div className="mt-5">
                  <p className="text-sm font-medium text-[var(--color-text)] mb-2">
                    Số lượng nhân viên <span className="text-red-500">*</span>
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {CLEANER_COUNT_OPTIONS.map((n) => (
                      <button
                        key={n}
                        type="button"
                        onClick={() => setForm((f) => ({ ...f, numCleaners: n }))}
                        className={cn(
                          "px-4 py-2 rounded-[var(--radius-lg)] border-2 text-sm font-medium transition-all",
                          form.numCleaners === n
                            ? "border-[var(--color-primary)] bg-[var(--color-primary-soft)] text-[var(--color-primary)]"
                            : "border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-primary)]/50",
                        )}
                      >
                        {n} người
                      </button>
                    ))}
                  </div>
                  <p className="mt-1.5 text-xs text-[var(--color-text-muted)]">
                    Giá: {HOURLY_RATE.toLocaleString("vi-VN")} ₫/giờ cho mỗi nhân viên
                  </p>
                </div>

                {/* Area */}
                <div className="mt-5">
                  <p className="text-sm font-medium text-[var(--color-text)] mb-2">
                    Diện tích cần dọn dẹp <span className="text-red-500">*</span>
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {AREA_OPTIONS.map((opt, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setForm((f) => ({ ...f, areaOptionIdx: idx }));
                          setStep2Errors((prev) => ({ ...prev, area: undefined }));
                        }}
                        className={cn(
                          "flex flex-col items-center gap-1 px-3 py-3 rounded-[var(--radius-lg)] border-2 text-sm font-medium transition-all",
                          form.areaOptionIdx === idx
                            ? "border-[var(--color-primary)] bg-[var(--color-primary-soft)] text-[var(--color-primary)]"
                            : "border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-primary)]/50",
                        )}
                      >
                        <span className="font-semibold">{opt.label}</span>
                        <span className="text-xs font-normal opacity-80">
                          {(opt.areaM2 * AREA_RATE).toLocaleString("vi-VN")} ₫
                        </span>
                      </button>
                    ))}
                  </div>
                  {step2Errors.area && <p className="mt-2 text-xs text-red-600">{step2Errors.area}</p>}
                </div>

                {/* Price summary */}
                <div className="mt-5 rounded-lg bg-[var(--color-primary)]/5 px-4 py-3 border border-[var(--color-primary)]/20 space-y-1">
                  <div className="flex items-center justify-between text-xs text-[var(--color-text-secondary)]">
                    <span>Giờ công ({form.durationHours} giờ × {form.numCleaners} người)</span>
                    <span>{(HOURLY_RATE * form.durationHours * form.numCleaners).toLocaleString("vi-VN")} ₫</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-[var(--color-text-secondary)]">
                    <span>Phụ phí diện tích ({selectedArea ? selectedArea.label : "—"})</span>
                    <span>{(AREA_RATE * areaM2Num).toLocaleString("vi-VN")} ₫</span>
                  </div>
                  <div className="flex items-center justify-between border-t border-[var(--color-primary)]/20 pt-2 mt-1">
                    <span className="text-sm font-medium text-[var(--color-text)]">
                      Tổng tiền
                    </span>
                    <span className="text-lg font-bold text-[var(--color-primary)]">
                      {totalAmount.toLocaleString("vi-VN")} ₫
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-[var(--color-text-muted)]">
                    <span>Đặt cọc ngay</span>
                    <span>{DEPOSIT_AMOUNT.toLocaleString("vi-VN")} ₫</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-[var(--color-text-muted)]">
                    <span>Còn lại sau khi hoàn thành dịch vụ</span>
                    <span>{Math.max(0, totalAmount - DEPOSIT_AMOUNT).toLocaleString("vi-VN")} ₫</span>
                  </div>
                </div>
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
            <p className="text-sm text-[var(--color-text-secondary)] mb-1">
              {t("customer.book.uploadPhotos")}
            </p>
            <p className="text-xs text-[var(--color-text-muted)] mb-4">
              Tối đa {MAX_PHOTOS} ảnh, mỗi ảnh ≤ {MAX_PHOTO_MB}MB. Định dạng: JPG, PNG, WEBP.
            </p>
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={selectedFiles.length + photoUrls.length >= MAX_PHOTOS}
              className="w-full border-2 border-dashed border-[var(--color-border)] rounded-[var(--radius-xl)] p-6 sm:p-12 text-center hover:border-[var(--color-primary)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Upload className="w-10 h-10 mx-auto text-[var(--color-text-muted)] mb-3" />
              <p className="text-sm text-[var(--color-text-secondary)]">
                {selectedFiles.length + photoUrls.length >= MAX_PHOTOS
                  ? `Đã đạt giới hạn ${MAX_PHOTOS} ảnh`
                  : `Chọn ảnh (tùy chọn) · Còn ${MAX_PHOTOS - selectedFiles.length - photoUrls.length} ảnh`}
              </p>
            </button>
            {(selectedFiles.length > 0 || photoUrls.length > 0) && (
              <p className="text-sm text-[var(--color-success)] mt-2">
                {selectedFiles.length} file chờ upload · {photoUrls.length} URL đã có
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
                      className="absolute top-1 right-1 bg-white/80 dark:bg-gray-800/80 rounded-full p-2 text-xs leading-none"
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
                <strong>{t("customer.book.date")}:</strong>{" "}
                {form.date ? new Date(form.date + "T00:00:00").toLocaleDateString("vi-VN", { dateStyle: "long" }) : ""}
              </p>
              <p>
                <strong>Giờ bắt đầu:</strong> {form.time}
              </p>
              <p>
                <strong>{t("customer.book.address")}:</strong> {form.address}
              </p>
              <p>
                <strong>Thời lượng:</strong> {form.durationHours} giờ
              </p>
              <p>
                <strong>Số nhân viên:</strong> {form.numCleaners} người
              </p>
              <p>
                <strong>Diện tích:</strong> {selectedArea ? selectedArea.label : "—"}
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
            <div className="rounded-[var(--radius-lg)] bg-[var(--color-primary)]/5 px-4 py-3 border border-[var(--color-primary)]/20 space-y-1">
              <div className="flex items-center justify-between text-sm font-semibold text-[var(--color-text)]">
                <span>Tổng tiền</span>
                <span className="text-[var(--color-primary)]">{totalAmount.toLocaleString("vi-VN")} ₫</span>
              </div>
              <div className="flex items-center justify-between text-xs text-[var(--color-text-muted)]">
                <span>Đặt cọc ngay</span>
                <span>{DEPOSIT_AMOUNT.toLocaleString("vi-VN")} ₫</span>
              </div>
              <div className="flex items-center justify-between text-xs text-[var(--color-text-muted)]">
                <span>Thanh toán sau khi hoàn thành</span>
                <span>{Math.max(0, totalAmount - DEPOSIT_AMOUNT).toLocaleString("vi-VN")} ₫</span>
              </div>
            </div>
            <div className="mt-2 p-3 rounded-lg bg-blue-50 dark:bg-blue-950/20 text-sm text-blue-800 dark:text-blue-300">
              Sau khi đặt đơn, bạn sẽ chọn nhân viên và thanh toán đặt cọc{" "}
              <strong>{DEPOSIT_AMOUNT.toLocaleString("vi-VN")} ₫</strong> qua QR chuyển khoản.
            </div>
            <Button
              onClick={submitOrder}
              disabled={busy}
              className="w-full mt-4"
            >
              {busy ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin inline mr-2" />
                  Đang xử lý...
                </>
              ) : t("customer.book.placeOrder")}
            </Button>
          </div>
        )}

        <div className="flex justify-between mt-8 pt-6 border-t border-[var(--color-border)]">
          {step === 1 ? (
            <Button
              variant="outline"
              onClick={() => router.push("/customer")}
              disabled={busy}
            >
              {t("common.cancel")}
            </Button>
          ) : (
            <Button
              variant="outline"
              onClick={() => setStep((s) => Math.max(1, s - 1))}
              disabled={busy}
            >
              {t("common.previous")}
            </Button>
          )}
          {step < 4 ? (
            <Button onClick={handleNext} disabled={busy}>
              {t("common.next")}
            </Button>
          ) : null}
        </div>
      </Card>
    </div>
  );
}

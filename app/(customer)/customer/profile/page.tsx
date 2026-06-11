"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input, FormField } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { t } from "@/lib/i18n";
import {
  useUser,
  useAddAddress,
  useDeleteAddress,
  useSetDefaultAddress,
} from "@/hooks/useApi";
import { useAuthStore } from "@/hooks/useAuth";
import type { UserAddress } from "@/types";
import { Loader2, MapPin, Plus, Star, Trash2 } from "lucide-react";
import { cn } from "@/lib/cn";

const LABEL_PRESETS = ["Nhà", "Văn phòng", "Khác"];

export default function CustomerProfilePage() {
  const { data: user, isLoading } = useUser();
  const storeUser = useAuthStore((s) => s.user);
  const profile = user ?? storeUser;

  // address form state
  const [showAddForm, setShowAddForm] = useState(false);
  const [newLabel, setNewLabel] = useState("Nhà");
  const [newAddress, setNewAddress] = useState("");
  const [newIsDefault, setNewIsDefault] = useState(false);
  const [addrError, setAddrError] = useState("");

  const { mutateAsync: addAddress, isPending: adding } = useAddAddress();
  const { mutateAsync: deleteAddress, isPending: deleting } = useDeleteAddress();
  const { mutateAsync: setDefault, isPending: settingDefault } = useSetDefaultAddress();

  const addresses: UserAddress[] = (profile as any)?.addresses ?? [];

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddress.trim()) return;
    setAddrError("");
    try {
      await addAddress({
        label: newLabel.trim() || "Khác",
        address: newAddress.trim(),
        setAsDefault: newIsDefault || addresses.length === 0,
      });
      setNewLabel("Nhà");
      setNewAddress("");
      setNewIsDefault(false);
      setShowAddForm(false);
    } catch {
      setAddrError("Không thể thêm địa chỉ. Vui lòng thử lại.");
    }
  };

  const handleDelete = async (id: string) => {
    setAddrError("");
    try {
      await deleteAddress(id);
    } catch {
      setAddrError("Không thể xoá địa chỉ. Vui lòng thử lại.");
    }
  };

  const handleSetDefault = async (id: string) => {
    setAddrError("");
    try {
      await setDefault(id);
    } catch {
      setAddrError("Không thể đặt mặc định. Vui lòng thử lại.");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 py-12">
        <Loader2 className="w-5 h-5 animate-spin" /> {t("common.loading")}
      </div>
    );
  }

  if (!profile) {
    return <p className="text-[var(--color-text-muted)]">{t("common.noData")}</p>;
  }

  return (
    <div>
      <PageHeader title={t("customer.profile.title")} />
      <div className="grid gap-6 max-w-4xl lg:grid-cols-2">
        {/* ── Basic info ── */}
        <Card>
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-[var(--color-primary-soft)] flex items-center justify-center text-2xl">
              👤
            </div>
            <div>
              <p className="font-bold text-lg">{profile.fullName}</p>
              <p className="text-sm text-[var(--color-text-muted)]">{profile.email}</p>
            </div>
          </div>
          <FormField label={t("auth.fullName")}>
            <Input defaultValue={profile.fullName} readOnly />
          </FormField>
          <FormField label={t("auth.phone")}>
            <Input defaultValue={profile.phone ?? ""} readOnly />
          </FormField>
          <FormField label={t("auth.email")}>
            <Input defaultValue={profile.email} disabled />
          </FormField>
          <p className="text-xs text-[var(--color-text-muted)] mt-2">
            Cập nhật hồ sơ sẽ có trong phiên bản sau.
          </p>
        </Card>

        {/* ── Address Book ── */}
        <div className="space-y-4">
          <Card>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-[var(--color-primary)]" />
                <h2 className="font-semibold text-[var(--color-text)]">Địa chỉ của tôi</h2>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setShowAddForm((v) => !v);
                  setAddrError("");
                }}
              >
                <Plus className="w-4 h-4 mr-1" />
                Thêm địa chỉ
              </Button>
            </div>

            {addrError && (
              <p className="text-sm text-red-600 mb-3">{addrError}</p>
            )}

            {/* Add form */}
            {showAddForm && (
              <form
                onSubmit={handleAddAddress}
                className="mb-4 p-4 rounded-[var(--radius-lg)] bg-[var(--color-bg-muted)] border border-[var(--color-border)] space-y-3"
              >
                <div>
                  <p className="text-xs font-medium text-[var(--color-text-secondary)] mb-1.5">
                    Nhãn địa chỉ
                  </p>
                  <div className="flex gap-2 flex-wrap">
                    {LABEL_PRESETS.map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setNewLabel(p)}
                        className={cn(
                          "px-3 py-1 rounded-full text-xs border transition-all",
                          newLabel === p
                            ? "border-[var(--color-primary)] bg-[var(--color-primary-soft)] text-[var(--color-primary)] font-medium"
                            : "border-[var(--color-border)] text-[var(--color-text-secondary)]",
                        )}
                      >
                        {p}
                      </button>
                    ))}
                    <Input
                      className="h-8 text-xs w-24 min-w-0"
                      placeholder="Tuỳ chỉnh..."
                      value={LABEL_PRESETS.includes(newLabel) ? "" : newLabel}
                      onChange={(e) => setNewLabel(e.target.value)}
                    />
                  </div>
                </div>
                <FormField label="Địa chỉ chi tiết">
                  <Input
                    value={newAddress}
                    onChange={(e) => setNewAddress(e.target.value)}
                    placeholder="Số nhà, đường, quận, TP.HCM"
                    required
                  />
                </FormField>
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newIsDefault || addresses.length === 0}
                    disabled={addresses.length === 0}
                    onChange={(e) => setNewIsDefault(e.target.checked)}
                    className="rounded"
                  />
                  <span className="text-[var(--color-text-secondary)]">
                    Đặt làm địa chỉ mặc định
                  </span>
                </label>
                <div className="flex gap-2">
                  <Button type="submit" size="sm" disabled={adding || !newAddress.trim()}>
                    {adding ? <Loader2 className="w-4 h-4 animate-spin" /> : "Lưu"}
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => setShowAddForm(false)}
                  >
                    Huỷ
                  </Button>
                </div>
              </form>
            )}

            {/* Address list */}
            {addresses.length === 0 && !showAddForm ? (
              <div className="text-center py-6 text-[var(--color-text-muted)]">
                <MapPin className="w-8 h-8 mx-auto mb-2 opacity-30" />
                <p className="text-sm">Chưa có địa chỉ nào. Thêm địa chỉ để đặt đơn nhanh hơn.</p>
              </div>
            ) : (
              <ul className="space-y-2">
                {addresses.map((addr) => (
                  <li
                    key={addr._id}
                    className={cn(
                      "flex items-start gap-3 p-3 rounded-[var(--radius-lg)] border transition-all",
                      addr.isDefault
                        ? "border-[var(--color-primary)] bg-[var(--color-primary-soft)]"
                        : "border-[var(--color-border)] bg-[var(--color-bg-muted)]",
                    )}
                  >
                    <MapPin
                      className={cn(
                        "w-4 h-4 mt-0.5 shrink-0",
                        addr.isDefault
                          ? "text-[var(--color-primary)]"
                          : "text-[var(--color-text-muted)]",
                      )}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-medium text-[var(--color-text)]">
                          {addr.label || "Địa chỉ"}
                        </span>
                        {addr.isDefault && (
                          <Badge variant="success" className="text-xs py-0">
                            Mặc định
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-[var(--color-text-secondary)] mt-0.5 break-words">
                        {addr.address}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      {!addr.isDefault && (
                        <button
                          type="button"
                          title="Đặt làm mặc định"
                          disabled={settingDefault}
                          onClick={() => handleSetDefault(addr._id)}
                          className="p-2.5 rounded-lg hover:bg-[var(--color-primary-soft)] text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors"
                        >
                          <Star className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        type="button"
                        title="Xoá địa chỉ"
                        disabled={deleting}
                        onClick={() => handleDelete(addr._id)}
                        className="p-2.5 rounded-lg hover:bg-red-50 text-[var(--color-text-muted)] hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </Card>

          {/* Password card */}
          <Card>
            <h2 className="font-semibold mb-4">{t("customer.profile.changePassword")}</h2>
            <FormField label={t("customer.profile.currentPassword")}>
              <Input type="password" disabled />
            </FormField>
            <FormField label={t("customer.profile.newPassword")}>
              <Input type="password" disabled />
            </FormField>
            <FormField label={t("customer.profile.confirmPassword")}>
              <Input type="password" disabled />
            </FormField>
            <Button variant="outline" disabled>
              {t("customer.profile.changePassword")}
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}

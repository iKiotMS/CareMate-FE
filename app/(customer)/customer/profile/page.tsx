"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input, FormField } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { Skeleton } from "@/components/ui/Skeleton";
import { t } from "@/lib/i18n";
import {
  useUser,
  useUpdateProfile,
  useChangePassword,
  useAddAddress,
  useDeleteAddress,
  useSetDefaultAddress,
} from "@/hooks/useApi";
import { useAuthStore } from "@/hooks/useAuth";
import type { UserAddress } from "@/types";
import { Loader2, MapPin, Plus, Star, Trash2 } from "lucide-react";
import { cn } from "@/lib/cn";
import { toast } from "sonner";

const LABEL_PRESETS = ["Nhà", "Văn phòng", "Khác"];

export default function CustomerProfilePage() {
  const { data: user, isLoading } = useUser();
  const storeUser = useAuthStore((s) => s.user);
  const profile = user ?? storeUser;

  // profile edit state
  const [editFullName, setEditFullName] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const { mutateAsync: updateProfile, isPending: updatingProfile } = useUpdateProfile();

  useEffect(() => {
    if (profile) {
      setEditFullName(profile.fullName ?? "");
      setEditPhone((profile as any).phone ?? "");
    }
  }, [profile]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editFullName.trim()) {
      toast.error("Họ và tên không được để trống");
      return;
    }
    try {
      await updateProfile({ fullName: editFullName.trim(), phone: editPhone.trim() || undefined });
      toast.success("Cập nhật hồ sơ thành công");
      setIsEditing(false);
    } catch {
      toast.error("Không thể cập nhật hồ sơ. Vui lòng thử lại.");
    }
  };

  // password change state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { mutateAsync: changePassword, isPending: changingPassword } = useChangePassword();

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      toast.error("Mật khẩu mới phải ít nhất 6 ký tự");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Xác nhận mật khẩu không khớp");
      return;
    }
    try {
      await changePassword({ currentPassword, newPassword });
      toast.success("Đổi mật khẩu thành công");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      const msg = err?.response?.data?.message ?? "Không thể đổi mật khẩu. Vui lòng thử lại.";
      toast.error(msg);
    }
  };

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
      <div className="grid gap-6 max-w-4xl lg:grid-cols-2">
        <Skeleton className="h-80 w-full rounded-[var(--radius-xl)]" />
        <Skeleton className="h-80 w-full rounded-[var(--radius-xl)]" />
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
        <Card className="animate-fade-up">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[var(--color-gradient-from)] to-[var(--color-gradient-to)] flex items-center justify-center text-2xl shadow-sm">
              👤
            </div>
            <div>
              <p className="font-bold text-lg tracking-tight text-[var(--color-text)]">{profile.fullName}</p>
              <p className="text-sm text-[var(--color-text-muted)]">{profile.email}</p>
            </div>
          </div>

          {isEditing ? (
            <form onSubmit={handleSaveProfile} className="space-y-0">
              <FormField label={t("auth.fullName")} required>
                <Input
                  value={editFullName}
                  onChange={(e) => setEditFullName(e.target.value)}
                  placeholder="Nguyễn Văn A"
                />
              </FormField>
              <FormField label={t("auth.phone")}>
                <Input
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  placeholder="0912345678"
                />
              </FormField>
              <FormField label={t("auth.email")}>
                <Input defaultValue={profile.email} disabled />
              </FormField>
              <div className="flex gap-2 mt-2">
                <Button type="submit" size="sm" disabled={updatingProfile}>
                  {updatingProfile ? <Loader2 className="w-4 h-4 animate-spin" /> : t("common.save")}
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setIsEditing(false);
                    setEditFullName(profile.fullName ?? "");
                    setEditPhone((profile as any).phone ?? "");
                  }}
                >
                  {t("common.cancel")}
                </Button>
              </div>
            </form>
          ) : (
            <>
              <FormField label={t("auth.fullName")}>
                <Input defaultValue={profile.fullName} readOnly />
              </FormField>
              <FormField label={t("auth.phone")}>
                <Input defaultValue={(profile as any).phone ?? ""} readOnly />
              </FormField>
              <FormField label={t("auth.email")}>
                <Input defaultValue={profile.email} disabled />
              </FormField>
              <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                {t("common.edit")} hồ sơ
              </Button>
            </>
          )}
        </Card>

        {/* ── Address Book ── */}
        <div className="space-y-4 animate-fade-up">
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
              <p className="text-sm font-medium text-[var(--color-danger)] mb-3 animate-fade-in">{addrError}</p>
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
                    placeholder="Số nhà, tên đường, phường/xã, quận/huyện, TP.HCM"
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
              <div className="rounded-[var(--radius-lg)] border border-dashed border-[var(--color-border)] py-8 text-center text-[var(--color-text-muted)]">
                <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--color-bg-muted)]">
                  <MapPin className="w-5 h-5" />
                </div>
                <p className="text-sm">Chưa có địa chỉ nào. Thêm địa chỉ để đặt đơn nhanh hơn.</p>
              </div>
            ) : (
              <ul className="space-y-2">
                {addresses.map((addr) => (
                  <li
                    key={addr._id}
                    className={cn(
                      "flex items-start gap-3 p-3.5 rounded-[var(--radius-lg)] border transition-all duration-150",
                      addr.isDefault
                        ? "border-[var(--color-primary)] bg-[var(--color-primary-soft)] shadow-[var(--shadow-xs)]"
                        : "border-[var(--color-border)] bg-[var(--color-bg-muted)] hover:border-[var(--color-border-strong)]",
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
                        className="p-2.5 rounded-lg hover:bg-[var(--color-danger-soft)] text-[var(--color-text-muted)] hover:text-[var(--color-danger)] transition-colors"
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
            <h2 className="font-semibold text-[var(--color-text)] mb-4">{t("customer.profile.changePassword")}</h2>
            <form onSubmit={handleChangePassword} className="space-y-0">
              <FormField label={t("customer.profile.currentPassword")}>
                <Input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Mật khẩu hiện tại"
                />
              </FormField>
              <FormField label={t("customer.profile.newPassword")}>
                <Input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Tối thiểu 6 ký tự"
                />
              </FormField>
              <FormField label={t("customer.profile.confirmPassword")}>
                <Input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Nhập lại mật khẩu mới"
                />
              </FormField>
              <Button
                type="submit"
                variant="outline"
                disabled={changingPassword || !currentPassword || !newPassword || !confirmPassword}
              >
                {changingPassword ? <Loader2 className="w-4 h-4 animate-spin mr-2 inline" /> : null}
                {t("customer.profile.changePassword")}
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}

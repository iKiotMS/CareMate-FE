"use client";

import { useState, useEffect } from "react";
import { useMyAvailability, useUpdateAvailability } from "@/hooks/useApi";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/Button";
import { SkeletonCard } from "@/components/ui/Skeleton";
import { ErrorState } from "@/components/shared/ErrorState";
import { toast } from "sonner";
import { cn } from "@/lib/cn";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const TIME_OPTIONS = [
  "06:00", "07:00", "08:00", "09:00", "10:00",
  "17:00", "18:00", "19:00", "20:00", "21:00",
];

export default function AvailabilityPage() {
  const { data, isLoading, isError, refetch } = useMyAvailability();
  const update = useUpdateAvailability();

  const [workingDays, setWorkingDays] = useState<number[]>([1, 2, 3, 4, 5]);
  const [startTime, setStartTime] = useState("07:00");
  const [endTime, setEndTime] = useState("19:00");
  const [daysOff, setDaysOff] = useState<string[]>([]);
  const [newDayOff, setNewDayOff] = useState("");

  useEffect(() => {
    if (data) {
      setWorkingDays(data.workingDays ?? [1, 2, 3, 4, 5]);
      setStartTime(data.workingHours?.start ?? "07:00");
      setEndTime(data.workingHours?.end ?? "19:00");
      setDaysOff(data.daysOff ?? []);
    }
  }, [data]);

  if (isLoading) {
    return (
      <div className="p-6 space-y-4">
        <PageHeader title="Availability" />
        <SkeletonCard />
        <SkeletonCard />
      </div>
    );
  }

  if (isError) return <ErrorState onRetry={refetch} />;

  function toggleDay(d: number) {
    setWorkingDays((prev) =>
      prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d],
    );
  }

  function addDayOff() {
    if (newDayOff && !daysOff.includes(newDayOff)) {
      setDaysOff((p) => [...p, newDayOff]);
      setNewDayOff("");
    }
  }

  function removeDayOff(date: string) {
    setDaysOff((p) => p.filter((d) => d !== date));
  }

  function handleSave() {
    update.mutate(
      { workingDays, workingHours: { start: startTime, end: endTime }, daysOff },
      {
        onSuccess: () => toast.success("Availability updated"),
        onError: () => toast.error("Failed to save availability"),
      },
    );
  }

  return (
    <div className="p-6 max-w-lg space-y-6">
      <PageHeader title="Availability" subtitle="Configure when you accept jobs" />

      <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 space-y-3">
        <p className="font-medium text-sm text-[var(--color-text)]">Working Days</p>
        <div className="flex gap-2 flex-wrap">
          {DAYS.map((day, i) => (
            <button
              key={i}
              type="button"
              onClick={() => toggleDay(i)}
              className={cn(
                "h-9 w-12 rounded-lg text-sm font-medium transition-colors",
                workingDays.includes(i)
                  ? "bg-[var(--color-primary)] text-white"
                  : "bg-[var(--color-bg-muted)] text-[var(--color-text-secondary)]",
              )}
            >
              {day}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 space-y-3">
        <p className="font-medium text-sm text-[var(--color-text)]">Working Hours</p>
        <div className="flex items-center gap-3">
          <select
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="flex-1 h-10 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] px-3 text-sm"
          >
            {TIME_OPTIONS.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
          <span className="text-[var(--color-text-muted)]">to</span>
          <select
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className="flex-1 h-10 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] px-3 text-sm"
          >
            {TIME_OPTIONS.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 space-y-3">
        <p className="font-medium text-sm text-[var(--color-text)]">Days Off</p>
        <div className="flex gap-2">
          <input
            type="date"
            value={newDayOff}
            onChange={(e) => setNewDayOff(e.target.value)}
            className="flex-1 h-10 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] px-3 text-sm"
          />
          <Button size="sm" type="button" onClick={addDayOff} variant="outline">
            Add
          </Button>
        </div>
        {daysOff.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {daysOff.map((d) => (
              <span
                key={d}
                className="flex items-center gap-1.5 rounded-full bg-[var(--color-bg-muted)] px-3 py-1 text-xs text-[var(--color-text-secondary)]"
              >
                {d}
                <button
                  onClick={() => removeDayOff(d)}
                  className="hover:text-[var(--color-danger)]"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      <Button onClick={handleSave} loading={update.isPending} className="w-full">
        Save Availability
      </Button>
    </div>
  );
}

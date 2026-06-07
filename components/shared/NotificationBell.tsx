"use client";

import { Bell } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useUnreadCount, useMyNotifications, useMarkAllRead } from "@/hooks/useApi";
import type { Notification } from "@/types";
import { cn } from "@/lib/cn";
import { formatDistanceToNow } from "date-fns";

export function NotificationBell() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const { data: countData } = useUnreadCount();
  const { data: notifData } = useMyNotifications(1, 5);
  const markAllRead = useMarkAllRead();

  const unread = countData?.count ?? 0;
  const items = notifData?.data ?? [];

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="relative p-2 rounded-full hover:bg-[var(--color-surface-hover)] transition-colors"
      >
        <Bell className="h-5 w-5 text-[var(--color-text-secondary)]" />
        {unread > 0 && (
          <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[var(--color-danger)] text-[10px] font-bold text-white">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-lg z-50">
          <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--color-border)]">
            <span className="font-semibold text-sm text-[var(--color-text)]">Notifications</span>
            {unread > 0 && (
              <button
                onClick={() => markAllRead.mutate()}
                className="text-xs text-[var(--color-primary)] hover:underline"
              >
                Mark all read
              </button>
            )}
          </div>

          <div className="divide-y divide-[var(--color-border)] max-h-72 overflow-y-auto">
            {items.length === 0 ? (
              <p className="py-8 text-center text-sm text-[var(--color-text-muted)]">
                No notifications
              </p>
            ) : (
              items.map((n) => <NotificationItem key={n._id} notification={n} />)
            )}
          </div>

          <a
            href="/customer/notifications"
            className="block py-2 text-center text-xs text-[var(--color-primary)] hover:underline border-t border-[var(--color-border)]"
          >
            View all
          </a>
        </div>
      )}
    </div>
  );
}

function NotificationItem({ notification: n }: { notification: Notification }) {
  return (
    <div
      className={cn(
        "flex gap-3 px-4 py-3 text-sm",
        !n.isRead && "bg-[var(--color-primary)]/5",
      )}
    >
      {!n.isRead && (
        <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[var(--color-primary)]" />
      )}
      <div className={cn("flex-1", n.isRead && "pl-5")}>
        <p className="font-medium text-[var(--color-text)]">{n.title}</p>
        <p className="text-[var(--color-text-secondary)] line-clamp-2">{n.body}</p>
        <p className="mt-0.5 text-[var(--color-text-muted)] text-xs">
          {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
        </p>
      </div>
    </div>
  );
}

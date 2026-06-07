"use client";

import { useState, useEffect } from "react";
import { Clock } from "lucide-react";

interface Props {
  expiresAt: string | Date;
  label?: string;
}

export function CountdownTimer({ expiresAt, label = "Còn lại" }: Props) {
  const [remaining, setRemaining] = useState(0);

  useEffect(() => {
    const update = () => {
      const diff = new Date(expiresAt).getTime() - Date.now();
      setRemaining(Math.max(0, diff));
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [expiresAt]);

  const minutes = Math.floor(remaining / 60000);
  const seconds = Math.floor((remaining % 60000) / 1000);
  const expired = remaining === 0;

  return (
    <div
      className={`flex items-center gap-2 text-sm font-medium ${
        expired ? "text-red-600" : "text-amber-700 dark:text-amber-400"
      }`}
    >
      <Clock className="w-4 h-4 shrink-0" />
      <span>
        {label}:{" "}
        {expired
          ? "Đã hết hạn"
          : `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`}
      </span>
    </div>
  );
}

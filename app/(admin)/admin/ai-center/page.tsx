"use client";

import { useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { ProgressBar } from "@/components/shared/Charts";
import { Card, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input, FormField } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { t } from "@/lib/i18n";
import { Brain, TrendingUp, UserCheck, Camera, MessageSquare, Bot } from "lucide-react";
import { useAdminRatingAnalytics, useAdminCleanerPerformance } from "@/hooks/useApi";

export default function AdminAICenterPage() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  const { data: analytics } = useAdminRatingAnalytics();
  const { data: cleanerPerf } = useAdminCleanerPerformance("rating");

  const topCleaner = (cleanerPerf as any)?.data?.[0];
  const qualityScore = analytics
    ? Math.round(((analytics as any).overallAverage ?? 0) / 5 * 100)
    : 0;

  const positive = analytics
    ? Math.round(((analytics as any).distribution?.filter((d: any) => d.stars >= 4).reduce((s: number, d: any) => s + d.percentage, 0)) ?? 0)
    : 0;
  const negative = analytics
    ? Math.round(((analytics as any).distribution?.filter((d: any) => d.stars <= 2).reduce((s: number, d: any) => s + d.percentage, 0)) ?? 0)
    : 0;
  const neutral = 100 - positive - negative;

  const askAI = () => {
    const total = (analytics as any)?.totalReviews ?? 0;
    const avg = ((analytics as any)?.overallAverage ?? 0).toFixed(1);
    const name = topCleaner?.cleanerName ?? "—";
    const rating = topCleaner?.averageRating?.toFixed(1) ?? "—";
    setAnswer(
      `Tổng đánh giá: ${total} · Trung bình: ${avg}★. NV xuất sắc: ${name} (${rating}★). Tỷ lệ hài lòng: ${positive}%.`,
    );
  };

  return (
    <div>
      <PageHeader title={t("admin.ai.title")} />

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <div className="flex items-center gap-2 mb-4"><TrendingUp className="w-5 h-5 text-[var(--color-primary)]" /><CardTitle>{t("admin.ai.demandForecast")}</CardTitle></div>
          <div className="space-y-2 text-sm">
            <p><strong>{t("admin.ai.nextWeekOrders")}:</strong> ~{(analytics as any)?.totalReviews ?? "—"} đánh giá</p>
            <p><strong>{t("admin.ai.peakHours")}:</strong> 09:00 - 11:00</p>
            <p><strong>{t("admin.ai.peakAreas")}:</strong> Quận 1, Quận 3</p>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-2 mb-4"><UserCheck className="w-5 h-5 text-[var(--color-success)]" /><CardTitle>{t("admin.ai.cleanerRecommendation")}</CardTitle></div>
          <p className="font-medium">{t("admin.ai.recommended")}: {topCleaner?.cleanerName ?? "—"}</p>
          {topCleaner && (
            <Badge variant="success" className="mt-2">
              {t("admin.ai.confidence")}: {Math.round(topCleaner.completionRate ?? 0)}%
            </Badge>
          )}
          {topCleaner && (
            <ul className="mt-3 text-sm space-y-1">
              <li>• Điểm đánh giá: {topCleaner.averageRating?.toFixed(1)}★</li>
              <li>• Hoàn thành: {topCleaner.completedOrders} đơn</li>
              <li>• Tỷ lệ hoàn thành: {topCleaner.completionRate?.toFixed(1)}%</li>
            </ul>
          )}
        </Card>

        <Card>
          <div className="flex items-center gap-2 mb-4"><Camera className="w-5 h-5 text-[var(--color-info)]" /><CardTitle>{t("admin.ai.qualityCheck")}</CardTitle></div>
          <p className="text-sm mb-2">{t("admin.ai.qualityScore")}</p>
          <ProgressBar value={qualityScore} label={`${qualityScore}/100`} />
        </Card>

        <Card>
          <div className="flex items-center gap-2 mb-4"><MessageSquare className="w-5 h-5 text-[var(--color-warning)]" /><CardTitle>{t("admin.ai.complaintAnalysis")}</CardTitle></div>
          <div className="flex gap-4 text-sm">
            <span className="text-[var(--color-success)]">{t("admin.ai.positive")}: {positive}%</span>
            <span>{t("admin.ai.neutral")}: {neutral}%</span>
            <span className="text-[var(--color-danger)]">{t("admin.ai.negative")}: {negative}%</span>
          </div>
        </Card>

        <Card className="lg:col-span-2">
          <div className="flex items-center gap-2 mb-4"><Bot className="w-5 h-5" /><CardTitle>{t("admin.ai.assistant")}</CardTitle></div>
          <div className="flex gap-2">
            <Input value={question} onChange={(e) => setQuestion(e.target.value)} placeholder={t("admin.ai.askPlaceholder")} className="flex-1" />
            <Button onClick={askAI}>Hỏi</Button>
          </div>
          {answer && (
            <div className="mt-4 p-4 rounded-[var(--radius-lg)] bg-[var(--color-primary-soft)] text-sm">
              <Brain className="w-4 h-4 inline mr-2" />{answer}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

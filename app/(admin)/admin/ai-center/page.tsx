"use client";

import { useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { ProgressBar } from "@/components/shared/Charts";
import { Card, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input, FormField } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { t } from "@/lib/i18n";
import { MOCK_AI } from "@/data/mock";
import { Brain, TrendingUp, UserCheck, Camera, MessageSquare, Bot } from "lucide-react";

export default function AdminAICenterPage() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const ai = MOCK_AI;

  const askAI = () => {
    setAnswer(ai.assistantReply);
  };

  return (
    <div>
      <PageHeader title={t("admin.ai.title")} />

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <div className="flex items-center gap-2 mb-4"><TrendingUp className="w-5 h-5 text-[var(--color-primary)]" /><CardTitle>{t("admin.ai.demandForecast")}</CardTitle></div>
          <div className="space-y-2 text-sm">
            <p><strong>{t("admin.ai.nextWeekOrders")}:</strong> ~{ai.demandForecast.nextWeekOrders} đơn</p>
            <p><strong>{t("admin.ai.peakHours")}:</strong> {ai.demandForecast.peakHours}</p>
            <p><strong>{t("admin.ai.peakAreas")}:</strong> {ai.demandForecast.peakAreas}</p>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-2 mb-4"><UserCheck className="w-5 h-5 text-[var(--color-success)]" /><CardTitle>{t("admin.ai.cleanerRecommendation")}</CardTitle></div>
          <p className="font-medium">{t("admin.ai.recommended")}: {ai.cleanerRecommendation.name}</p>
          <Badge variant="success" className="mt-2">{t("admin.ai.confidence")}: {ai.cleanerRecommendation.confidence}%</Badge>
          <ul className="mt-3 text-sm space-y-1">
            {ai.cleanerRecommendation.reasons.map((r) => <li key={r}>• {r}</li>)}
          </ul>
        </Card>

        <Card>
          <div className="flex items-center gap-2 mb-4"><Camera className="w-5 h-5 text-[var(--color-info)]" /><CardTitle>{t("admin.ai.qualityCheck")}</CardTitle></div>
          <p className="text-sm mb-2">{t("admin.ai.qualityScore")}</p>
          <ProgressBar value={ai.qualityScore} label={`${ai.qualityScore}/100`} />
        </Card>

        <Card>
          <div className="flex items-center gap-2 mb-4"><MessageSquare className="w-5 h-5 text-[var(--color-warning)]" /><CardTitle>{t("admin.ai.complaintAnalysis")}</CardTitle></div>
          <div className="flex gap-4 text-sm">
            <span className="text-[var(--color-success)]">{t("admin.ai.positive")}: {ai.sentiment.positive}%</span>
            <span>{t("admin.ai.neutral")}: {ai.sentiment.neutral}%</span>
            <span className="text-[var(--color-danger)]">{t("admin.ai.negative")}: {ai.sentiment.negative}%</span>
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

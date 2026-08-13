import {
  AlarmClock,
  CheckCircle2,
  Clock3,
  XCircle,
} from "lucide-react";

import type { ReportSummary } from "../types/report";

type ReportSummaryCardsProps = {
  summary: ReportSummary;
};

function SummaryCard({
  title,
  value,
  icon: Icon,
  color,
}: {
  title: string;
  value: string | number;
  icon: React.ElementType;
  color: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500">{title}</p>

          <h3 className="mt-2 text-3xl font-bold text-slate-900">
            {value}
          </h3>
        </div>

        <div className={`rounded-xl p-3 ${color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
    </div>
  );
}

export function ReportSummaryCards({
  summary,
}: ReportSummaryCardsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <SummaryCard
        title="Total de Chamados"
        value={summary.total}
        icon={AlarmClock}
        color="btn-primary"
      />

      <SummaryCard
        title="Dentro do SLA"
        value={`${summary.withinSla} (${summary.slaCompliancePercentage}%)`}
        icon={CheckCircle2}
        color="bg-emerald-600"
      />

      <SummaryCard
        title="SLA Violado"
        value={summary.slaBreached}
        icon={XCircle}
        color="bg-red-600"
      />

      <SummaryCard
        title="Tempo Médio"
        value={`${summary.averageResolutionHours} h`}
        icon={Clock3}
        color="bg-amber-500"
      />
    </div>
  );
}
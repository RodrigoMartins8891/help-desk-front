import { useState } from "react";
import { RefreshCw } from "lucide-react";

import { ReportFilters } from "../components/ReportFilters";
import { ReportSummaryCards } from "../components/ReportSummaryCards";
import { ReportCharts } from "../components/ReportCharts";
import { TechnicianRanking } from "../components/TechnicianRanking";

import { useReports } from "../hooks/useReports";

import type { ReportFilters as ReportFiltersType } from "../types/report";

import { ExportButtons } from "../components/ExportButtons";

import {
  exportReportCsv,
  exportReportExcel,
  exportReportPdf,
} from "../utils/report-export";

export function ReportsPage() {
  const [filters, setFilters] =
    useState<ReportFiltersType>({});

  const reportsQuery = useReports(filters);

  if (reportsQuery.isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-slate-500">
          Carregando relatórios...
        </p>
      </div>
    );
  }

  if (reportsQuery.isError || !reportsQuery.data) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
        <h2 className="font-bold text-red-700">
          Não foi possível carregar os relatórios.
        </h2>

        <button
          onClick={() => reportsQuery.refetch()}
          className="mt-4 flex items-center gap-2 rounded-xl border border-red-300 px-4 py-2 text-red-700 hover:bg-red-100"
        >
          <RefreshCw size={16} />
          Tentar novamente
        </button>
      </div>
    );
  }

  const report = reportsQuery.data;

  const tickets = report.tickets;
  
  return (
    <div className="space-y-6">

      <div>
        <h1 className="text-3xl font-bold text-slate-900">
          Relatórios
        </h1>

        <p className="mt-2 text-slate-500">
          Indicadores, SLA, produtividade e desempenho da equipe.
        </p>
      </div>

      <ReportFilters
        filters={filters}
        onChange={setFilters}
      />

      <ReportSummaryCards
        summary={report.summary}
      />

      <ReportCharts
        charts={report.charts}
      />

      <TechnicianRanking
        technicians={report.technicians}
      />

      <ExportButtons
        onExportPdf={() =>
          exportReportPdf(tickets)
        }
        onExportExcel={() =>
          exportReportExcel(tickets)
        }
        onExportCsv={() =>
          exportReportCsv(tickets)
        }
      />

    </div>
  );
}
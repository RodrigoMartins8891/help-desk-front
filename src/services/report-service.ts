import { api } from "./api";

import type {
  ReportFilters,
  ReportsResponse,
} from "../types/report";

export async function getReports(
  filters: ReportFilters,
) {
  const response = await api.get<ReportsResponse>(
    "/reports",
    {
      params: {
        startDate: filters.startDate || undefined,
        endDate: filters.endDate || undefined,
        status: filters.status || undefined,
        priority: filters.priority || undefined,
        category:
          filters.category?.trim() || undefined,
        technicianId:
          filters.technicianId || undefined,
      },
    },
  );

  return response.data.report;
}
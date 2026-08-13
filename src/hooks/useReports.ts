import {
  keepPreviousData,
  useQuery,
} from "@tanstack/react-query";

import { getReports } from "../services/report-service";
import type { ReportFilters } from "../types/report";

export function useReports(
  filters: ReportFilters,
) {
  return useQuery({
    queryKey: ["reports", filters],
    queryFn: () => getReports(filters),
    placeholderData: keepPreviousData,
  });
}
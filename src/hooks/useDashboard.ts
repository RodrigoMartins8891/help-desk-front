import { useQuery } from "@tanstack/react-query";

import {
  getDashboardCards,
  getDashboardCharts,
  getRecentTickets,
} from "../services/dashboard-service";

export function useDashboard() {
  const cards = useQuery({
    queryKey: ["dashboard", "cards"],
    queryFn: getDashboardCards,
  });

  const charts = useQuery({
    queryKey: ["dashboard", "charts"],
    queryFn: getDashboardCharts,
  });

  const recentTickets = useQuery({
    queryKey: ["dashboard", "recent"],
    queryFn: getRecentTickets,
  });

  return {
    cards,
    charts,
    recentTickets,
  };
}
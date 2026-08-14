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

  // Helpers consolidados para a página
  const isLoading = cards.isLoading || charts.isLoading || recentTickets.isLoading;
  const isError = cards.isError || charts.isError || recentTickets.isError;

  return {
    // Dados diretos
    data: {
      cards: cards.data,
      charts: charts.data,
      recentTickets: recentTickets.data,
    },
    // Estados consolidados
    isLoading,
    isError,
    // Queries individuais para quando quiser carregar/recarregar seções independentes
    queries: {
      cards,
      charts,
      recentTickets,
    },
  };
}
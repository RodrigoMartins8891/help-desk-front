import { api } from "./api";

import type {
  DashboardCardsResponse,
  DashboardChartsResponse,
  RecentTicketsResponse,
} from "../types/dashboard";

export async function getDashboardCards() {
  const response =
    await api.get<DashboardCardsResponse>("/dashboard/cards");

  return response.data.cards;
}

export async function getDashboardCharts() {
  const response =
    await api.get<DashboardChartsResponse>("/dashboard/charts");

  return response.data.charts;
}

export async function getRecentTickets() {
  const response =
    await api.get<RecentTicketsResponse>("/dashboard/recent");

  return response.data.tickets;
}
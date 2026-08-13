import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { getTickets } from "../services/ticket-service";
import type { TicketFilters } from "../types/ticket";

export function useTickets(filters: TicketFilters) {
  return useQuery({
    queryKey: ["tickets", filters],
    queryFn: () => getTickets(filters),
    placeholderData: keepPreviousData,
  });
}
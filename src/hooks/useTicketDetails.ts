import { useQuery } from "@tanstack/react-query";

import { getTicketById } from "../services/ticket-service";

export function useTicketDetails(ticketId: number) {
  return useQuery({
    queryKey: ["tickets", "details", ticketId],
    queryFn: () => getTicketById(ticketId),
    enabled: Number.isInteger(ticketId) && ticketId > 0,
  });
}
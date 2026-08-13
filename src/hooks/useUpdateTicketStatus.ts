import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { api } from "../services/api";

export type TicketStatus =
  | "EM_ANALISE"
  | "EM_ATENDIMENTO"
  | "AGUARDANDO_CLIENTE"
  | "RESOLVIDO"
  | "FECHADO"
  | "CANCELADO";

type UpdateTicketStatusInput = {
  ticketId: number;
  status: TicketStatus;
};

async function updateTicketStatus({
  ticketId,
  status,
}: UpdateTicketStatusInput) {
  const response = await api.patch(
    `/tickets/${ticketId}/status`,
    {
      status,
    },
  );

  return response.data;
}

export function useUpdateTicketStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateTicketStatus,

    onSuccess: async (_data, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["tickets"],
        }),

        queryClient.invalidateQueries({
          queryKey: [
            "tickets",
            "details",
            variables.ticketId,
          ],
        }),

        queryClient.invalidateQueries({
          queryKey: ["dashboard"],
        }),

        queryClient.invalidateQueries({
          queryKey: ["reports"],
        }),
      ]);
    },
  });
}
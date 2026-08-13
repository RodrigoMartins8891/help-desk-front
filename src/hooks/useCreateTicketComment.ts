import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { createTicketComment } from "../services/ticket-service";
import type { CreateCommentInput } from "../types/ticket";

type CreateTicketCommentVariables = {
  ticketId: number;
  data: CreateCommentInput;
};

export function useCreateTicketComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      ticketId,
      data,
    }: CreateTicketCommentVariables) =>
      createTicketComment(ticketId, data),

    onSuccess: async (_response, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: [
            "tickets",
            "details",
            variables.ticketId,
          ],
        }),

        queryClient.invalidateQueries({
          queryKey: ["tickets"],
        }),

        queryClient.invalidateQueries({
          queryKey: ["dashboard"],
        }),
      ]);
    },
  });
}
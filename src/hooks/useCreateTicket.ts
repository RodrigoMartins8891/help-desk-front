import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { createTicket } from "../services/ticket-service";

export function useCreateTicket() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTicket,

    onSuccess: async () => {
      await Promise.all([
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
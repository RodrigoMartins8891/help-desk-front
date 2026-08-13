import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { api } from "../services/api";

type AssignTechnicianInput = {
  ticketId: number;
  technicianId: number;
};

async function assignTechnician({
  ticketId,
  technicianId,
}: AssignTechnicianInput) {
  const response = await api.patch(
    `/tickets/${ticketId}/assign`,
    {
      technicianId,
    },
  );

  return response.data;
}

export function useAssignTechnician() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: assignTechnician,

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
      ]);
    },
  });
}
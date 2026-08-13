import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { createUser } from "../services/user-service";

export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createUser,

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["users"],
      });
    },
  });
}
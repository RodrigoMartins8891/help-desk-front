import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { updateUserStatus } from "../services/user-service";

export function useUpdateUserStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateUserStatus,

    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["users"],
        }),

        queryClient.invalidateQueries({
          queryKey: ["tickets"],
        }),
      ]);
    },
  });
}
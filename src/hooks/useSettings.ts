import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  getSettings,
  sendTestEmail,
  testSmtpConnection,
  updateSettings,
} from "../services/settings-service";

export function useSettings() {
  return useQuery({
    queryKey: ["settings"],
    queryFn: getSettings,
    staleTime: 1000 * 60 * 5,
  });
}

export function useUpdateSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateSettings,

    onSuccess: async (response) => {
      queryClient.setQueryData(
        ["settings"],
        response.settings,
      );

      await queryClient.invalidateQueries({
        queryKey: ["settings"],
      });
    },
  });
}

export function useTestSmtpConnection() {
  return useMutation({
    mutationFn: testSmtpConnection,
  });
}

export function useSendTestEmail() {
  return useMutation({
    mutationFn: sendTestEmail,
  });
}
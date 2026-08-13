import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useEffect } from "react";

import {
  getNotifications,
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from "../services/notification-service";

import { socket } from "../services/socket";

export function useNotifications() {
  const queryClient = useQueryClient();

  const notificationsQuery = useQuery({
    queryKey: ["notifications"],
    queryFn: getNotifications,
  });

  useEffect(() => {
    function handleNotificationCreated() {
      queryClient.invalidateQueries({
        queryKey: ["notifications"],
      });
    }

    socket.on(
      "notification-created",
      handleNotificationCreated,
    );

    return () => {
      socket.off(
        "notification-created",
        handleNotificationCreated,
      );
    };
  }, [queryClient]);

  return notificationsQuery;
}

export function useMarkNotificationAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markNotificationAsRead,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["notifications"],
      });
    },
  });
}

export function useMarkAllNotificationsAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markAllNotificationsAsRead,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["notifications"],
      });
    },
  });
}
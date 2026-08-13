import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { socket } from "../services/socket";

export function useSocketEvents() {
  const queryClient = useQueryClient();

  useEffect(() => {
    socket.on("ticket:created", () => {
      queryClient.invalidateQueries({
        queryKey: ["tickets"],
      });

      queryClient.invalidateQueries({
        queryKey: ["dashboard"],
      });
    });

    socket.on("ticket:updated", () => {
      queryClient.invalidateQueries({
        queryKey: ["tickets"],
      });

      queryClient.invalidateQueries({
        queryKey: ["dashboard"],
      });
    });

    socket.on("ticket:comment-created", () => {
      queryClient.invalidateQueries({
        queryKey: ["tickets"],
      });

      queryClient.invalidateQueries({
        queryKey: ["dashboard"],
      });
    });

    socket.on("ticket:details-updated", () => {
      queryClient.invalidateQueries({
        queryKey: ["tickets"],
      });
    });

    return () => {
      socket.removeAllListeners();
    };
  }, [queryClient]);
}
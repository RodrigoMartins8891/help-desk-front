import { useMutation } from "@tanstack/react-query";
import { classifyTicket } from "../services/ticket-service";
import type { ClassifyTicketInput, ClassifyTicketResponse } from "../types/ticket";

export function useClassifyTicket() {
  return useMutation<ClassifyTicketResponse, Error, ClassifyTicketInput>({
    mutationFn: (data) => classifyTicket(data),
  });
}
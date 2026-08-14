import { api } from "./api";

import type {
  ClassifyTicketInput,
  ClassifyTicketResponse,
  CreateCommentInput,
  CreateCommentResponse,
  CreateTicketInput,
  CreateTicketResponse,
  TicketDetailsResponse,
  TicketFilters,
  TicketsResponse,
} from "../types/ticket";

export async function getTickets(filters: TicketFilters) {
  const response = await api.get<TicketsResponse>("/tickets", {
    params: {
      page: filters.page,
      limit: filters.limit,
      status: filters.status || undefined,
      priority: filters.priority || undefined,
      category: filters.category?.trim() || undefined,
    },
  });

  return response.data;
}

export async function getTicketById(ticketId: number) {
  const response = await api.get<TicketDetailsResponse>(
    `/tickets/${ticketId}`,
  );

  return response.data.ticket;
}

export async function createTicket(data: CreateTicketInput) {
  const response = await api.post<CreateTicketResponse>(
    "/tickets",
    data,
  );

  return response.data;
}

export async function classifyTicket(data: ClassifyTicketInput) {
  const response = await api.post<ClassifyTicketResponse>(
    "/tickets/classify",
    data,
  );

  return response.data;
}

export async function createTicketComment(
  ticketId: number,
  data: CreateCommentInput,
) {
  const response = await api.post<CreateCommentResponse>(
    `/tickets/${ticketId}/comments`,
    data,
  );

  return response.data;
}

export type UpdateTicketStatusInput = {
  ticketId: number;
  status:
    | "EM_ANALISE"
    | "EM_ATENDIMENTO"
    | "AGUARDANDO_CLIENTE"
    | "RESOLVIDO"
    | "FECHADO"
    | "CANCELADO";
};

export async function updateTicketStatus({
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
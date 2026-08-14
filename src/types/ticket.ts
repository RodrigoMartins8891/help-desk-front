export type TicketStatus =
  | "ABERTO"
  | "EM_ANALISE"
  | "EM_ATENDIMENTO"
  | "AGUARDANDO_CLIENTE"
  | "RESOLVIDO"
  | "FECHADO"
  | "CANCELADO";

export type TicketPriority =
  | "BAIXA"
  | "MEDIA"
  | "ALTA"
  | "CRITICA";

export type TicketUser = {
  id: number;
  name: string;
  email: string;
};

export type Ticket = {
  id: number;
  protocol: string;
  title: string;
  description: string;
  category: string;
  priority: TicketPriority;
  status: TicketStatus;

  requesterId: number;
  technicianId: number | null;

  requester: TicketUser;
  technician: TicketUser | null;

  firstResponseAt: string | null;
  firstResponseDeadline: string | null;
  resolutionDeadline: string | null;
  slaBreached: boolean;

  resolvedAt: string | null;
  closedAt: string | null;

  createdAt: string;
  updatedAt: string;
};

export type TicketFilters = {
  page: number;
  limit: number;
  status?: TicketStatus | "";
  priority?: TicketPriority | "";
  category?: string;
};

export type TicketsResponse = {
  success: boolean;
  total: number;
  page: number;
  limit: number;
  tickets: Ticket[];
};

export type CreateTicketInput = {
  title: string;
  description: string;
  category: string;
  priority: TicketPriority;
};

export type CreateTicketResponse = {
  success: boolean;
  message: string;
  ticket: Ticket;
};

export type TicketComment = {
  id: number;
  message: string;
  isInternal: boolean;
  ticketId: number;
  authorId: number;
  createdAt: string;
  updatedAt: string;

  author?: {
    id: number;
    name: string;
    email?: string;
    role: string;
  };

  user?: {
    id: number;
    name: string;
    role: string;
  };
};

export type TicketHistory = {
  id: number;
  action: string;
  oldValue: string | null;
  newValue: string | null;
  ticketId: number;
  userId: number | null;
  createdAt: string;

  user: {
    id: number;
    name: string;
    role: string;
  } | null;
};

export type TicketDetails = Ticket & {
  comments: TicketComment[];
  history: TicketHistory[];
};

export type TicketDetailsResponse = {
  success: boolean;
  ticket: TicketDetails;
};

export type CreateCommentInput = {
  message: string;
  isInternal: boolean;
};

export type CreateCommentResponse = {
  success: boolean;
  message: string;
  comment: TicketComment;
};

export type ClassifyTicketInput = {
  title: string;
  description: string;
};

export type ClassifyTicketResponse = {
  success: boolean;
  suggestion: {
    category: "HARDWARE" | "SOFTWARE" | "REDE" | "ACESSO" | "OUTROS";
    priority: "BAIXA" | "MEDIA" | "ALTA" | "CRITICA";
    reason: string;
  };
};
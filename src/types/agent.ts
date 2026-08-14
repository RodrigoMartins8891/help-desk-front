import type { Ticket } from "./ticket";

export type AgentQueryInput = {
  query: string;
};

export type AgentQueryResponse = {
  success: boolean;
  answer: string;
  total: number;
  tickets: Ticket[];
};
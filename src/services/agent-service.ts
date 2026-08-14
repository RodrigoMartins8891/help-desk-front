import { api } from "./api";

import type { AgentQueryInput, AgentQueryResponse } from "../types/agent";

export async function askAgent(data: AgentQueryInput) {
  const response = await api.post<AgentQueryResponse>(
    "/agent/ask",
    data,
  );

  return response.data;
}
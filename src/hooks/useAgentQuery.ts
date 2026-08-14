import { useMutation } from "@tanstack/react-query";

import { askAgent } from "../services/agent-service";
import type { AgentQueryInput, AgentQueryResponse } from "../types/agent";

export function useAgentQuery() {
  return useMutation<AgentQueryResponse, Error, AgentQueryInput>({
    mutationFn: (data) => askAgent(data),
  });
}
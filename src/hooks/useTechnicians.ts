import { useQuery } from "@tanstack/react-query";

import { api } from "../services/api";
import type { SystemUser } from "../types/user";

type TechniciansResponse = {
  success: boolean;
  total: number;
  users: SystemUser[];
};

async function getTechnicians() {
  const response =
    await api.get<TechniciansResponse>("/users", {
      params: {
        role: "TECNICO",
      },
    });

  return response.data.users;
}

export function useTechnicians() {
  return useQuery({
    queryKey: ["users", "technicians"],
    queryFn: getTechnicians,
    staleTime: 1000 * 60 * 10,
  });
}
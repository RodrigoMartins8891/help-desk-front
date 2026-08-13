export type DashboardCards = {
  total: number;
  abertos: number;
  emAnalise: number;
  emAtendimento: number;
  aguardandoCliente: number;
  resolvidos: number;
  fechados: number;
  slaViolado: number;
};

export type DashboardChartItem = {
  name: string;
  total: number;
};

export type DashboardCharts = {
  status: DashboardChartItem[];
  priorities: DashboardChartItem[];
  categories: DashboardChartItem[];
};

export type RecentTicket = {
  id: number;
  protocol: string;
  title: string;
  category: string;
  priority: "BAIXA" | "MEDIA" | "ALTA" | "CRITICA";
  status:
    | "ABERTO"
    | "EM_ANALISE"
    | "EM_ATENDIMENTO"
    | "AGUARDANDO_CLIENTE"
    | "RESOLVIDO"
    | "FECHADO"
    | "CANCELADO";
  slaBreached: boolean;
  createdAt: string;
  requester: {
    id: number;
    name: string;
  };
  technician: {
    id: number;
    name: string;
  } | null;
};

export type DashboardCardsResponse = {
  success: boolean;
  cards: DashboardCards;
};

export type DashboardChartsResponse = {
  success: boolean;
  charts: DashboardCharts;
};

export type RecentTicketsResponse = {
  success: boolean;
  total: number;
  tickets: RecentTicket[];
};
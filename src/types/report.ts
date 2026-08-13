import type {
  TicketPriority,
  TicketStatus,
} from "./ticket";

export type ReportFilters = {
  startDate?: string;
  endDate?: string;
  status?: TicketStatus | "";
  priority?: TicketPriority | "";
  category?: string;
  technicianId?: number | "";
};

export type ReportSummary = {
  total: number;
  withinSla: number;
  slaBreached: number;
  slaCompliancePercentage: number;
  averageFirstResponseHours: number;
  averageResolutionHours: number;
};

export type ReportChartItem = {
  name: string;
  total: number;
};

export type ReportCharts = {
  status: ReportChartItem[];
  priorities: ReportChartItem[];
  categories: ReportChartItem[];
};

export type TechnicianPerformance = {
  id: number;
  name: string;
  total: number;
  resolved: number;
  pending: number;
  slaPercentage: number;
};

export type ReportTicket = {
  id: number;
  protocol: string;
  title: string;
  category: string;
  priority: TicketPriority;
  status: TicketStatus;
  slaBreached: boolean;
  createdAt: string;
  firstResponseAt: string | null;
  resolvedAt: string | null;
  closedAt: string | null;

  requester: {
    id: number;
    name: string;
  };

  technician: {
    id: number;
    name: string;
  } | null;
};

export type ReportData = {
  summary: ReportSummary;
  charts: ReportCharts;
  technicians: TechnicianPerformance[];
  tickets: ReportTicket[];
};

export type ReportsResponse = {
  success: boolean;
  report: ReportData;
};
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

import type { ReportTicket } from "../types/report";

function formatDate(date: string | null) {
  if (!date) return "-";

  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(date));
}

function ticketToObject(ticket: ReportTicket) {
  return {
    Protocolo: ticket.protocol,
    Título: ticket.title,
    Categoria: ticket.category,
    Prioridade: ticket.priority,
    Status: ticket.status,
    Solicitante: ticket.requester.name,
    Técnico: ticket.technician?.name ?? "-",
    SLA: ticket.slaBreached
      ? "Violado"
      : "Dentro",
    Abertura: formatDate(ticket.createdAt),
    Resolução: formatDate(ticket.resolvedAt),
  };
}

export function exportReportCsv(
  tickets: ReportTicket[],
) {
  const rows = tickets.map(ticketToObject);

  const headers = Object.keys(rows[0] ?? {});

  const csv = [
    headers.join(";"),

    ...rows.map((row) =>
      headers
        .map((header) => `"${row[header as keyof typeof row]}"`)
        .join(";"),
    ),
  ].join("\n");

  const blob = new Blob([csv], {
    type: "text/csv;charset=utf-8;",
  });

  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");

  link.href = url;

  link.download = "relatorio-helpdesk.csv";

  link.click();

  URL.revokeObjectURL(url);
}

export function exportReportExcel(
  tickets: ReportTicket[],
) {
  const workbook = XLSX.utils.book_new();

  const worksheet = XLSX.utils.json_to_sheet(
    tickets.map(ticketToObject),
  );

  XLSX.utils.book_append_sheet(
    workbook,
    worksheet,
    "Relatório",
  );

  XLSX.writeFile(
    workbook,
    "relatorio-helpdesk.xlsx",
  );
}

export function exportReportPdf(
  tickets: ReportTicket[],
) {
  const pdf = new jsPDF();

  pdf.setFontSize(18);

  pdf.text(
    "Relatório Help Desk",
    14,
    20,
  );

  autoTable(pdf, {
    startY: 30,

    head: [[
      "Protocolo",
      "Título",
      "Prioridade",
      "Status",
      "Técnico",
    ]],

    body: tickets.map((ticket) => [
      ticket.protocol,
      ticket.title,
      ticket.priority,
      ticket.status,
      ticket.technician?.name ?? "-",
    ]),
  });

  pdf.save("relatorio-helpdesk.pdf");
}
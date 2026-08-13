import {
  Eye,
  ShieldCheck,
  ShieldX,
} from "lucide-react";
import { Link } from "react-router-dom";

import type { Ticket } from "../types/ticket";
import { TicketBadge } from "./TicketBadge";

type TicketTableProps = {
  tickets: Ticket[];
  isFetching?: boolean;
};

function formatDate(date: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(date));
}

export function TicketTable({
  tickets,
  isFetching = false,
}: TicketTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full">
        <thead className="bg-slate-50">
          <tr className="text-left text-xs uppercase tracking-wide text-slate-500">
            <th className="px-5 py-4">Protocolo</th>
            <th className="px-5 py-4">Chamado</th>
            <th className="px-5 py-4">Status</th>
            <th className="px-5 py-4">Prioridade</th>
            <th className="px-5 py-4">Solicitante</th>
            <th className="px-5 py-4">Técnico</th>
            <th className="px-5 py-4">SLA</th>
            <th className="px-5 py-4">Data</th>
            <th className="px-5 py-4 text-right">
              Ações
            </th>
          </tr>
        </thead>

        <tbody
          className={[
            "divide-y divide-slate-100 transition",
            isFetching ? "opacity-60" : "",
          ].join(" ")}
        >
          {tickets.map((ticket) => (
            <tr
              key={ticket.id}
              className="text-sm text-slate-700 transition hover:bg-slate-50"
            >
              <td className="whitespace-nowrap px-5 py-4">
                <Link
                  to={`/tickets/${ticket.id}`}
                  className="font-semibold text-blue-600 hover:text-blue-800"
                >
                  {ticket.protocol}
                </Link>
              </td>

              <td className="min-w-64 px-5 py-4">
                <p className="font-medium text-slate-900">
                  {ticket.title}
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  {ticket.category}
                </p>
              </td>

              <td className="whitespace-nowrap px-5 py-4">
                <TicketBadge
                  value={ticket.status}
                  type="status"
                />
              </td>

              <td className="whitespace-nowrap px-5 py-4">
                <TicketBadge
                  value={ticket.priority}
                  type="priority"
                />
              </td>

              <td className="whitespace-nowrap px-5 py-4">
                {ticket.requester.name}
              </td>

              <td className="whitespace-nowrap px-5 py-4">
                {ticket.technician?.name ?? (
                  <span className="text-slate-400">
                    Não atribuído
                  </span>
                )}
              </td>

              <td className="whitespace-nowrap px-5 py-4">
                {ticket.slaBreached ? (
                  <span className="inline-flex items-center gap-1.5 font-semibold text-red-600">
                    <ShieldX size={17} />
                    Violado
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 font-semibold text-emerald-600">
                    <ShieldCheck size={17} />
                    No prazo
                  </span>
                )}
              </td>

              <td className="whitespace-nowrap px-5 py-4 text-slate-500">
                {formatDate(ticket.createdAt)}
              </td>

              <td className="whitespace-nowrap px-5 py-4 text-right">
                <Link
                  to={`/tickets/${ticket.id}`}
                  title="Visualizar chamado"
                  className="inline-flex rounded-lg p-2 text-slate-500 transition hover:bg-blue-50 hover:text-blue-600"
                >
                  <Eye size={18} />
                </Link>
              </td>
            </tr>
          ))}

          {tickets.length === 0 && (
            <tr>
              <td
                colSpan={9}
                className="px-5 py-14 text-center"
              >
                <p className="font-medium text-slate-700">
                  Nenhum chamado encontrado
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  Altere os filtros ou abra um novo chamado.
                </p>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
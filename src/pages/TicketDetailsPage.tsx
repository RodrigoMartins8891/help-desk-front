import {
  AlertTriangle,
  ArrowLeft,
  CalendarClock,
  Folder,
  Mail,
  RefreshCw,
  ShieldCheck,
  User,
  UserCog,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { useEffect } from "react";
import { TicketBadge } from "../components/TicketBadge";
import { TicketComments } from "../components/TicketComments";
import { TicketInfoItem } from "../components/TicketInfoItem";
import { TicketTimeline } from "../components/TicketTimeline";
import { CreateCommentForm } from "../components/CreateCommentForm";
import { TicketActions } from "../components/TicketActions";
import { SlaCard } from "../components/SlaCard";
import { useTicketDetails } from "../hooks/useTicketDetails";

import { socket } from "../services/socket";




function formatDate(date: string | null) {
  if (!date) {
    return "Não registrado";
  }

  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(date));
}

export function TicketDetailsPage() {
  const params = useParams();
  const ticketId = Number(params.id);

  const ticketQuery = useTicketDetails(ticketId);

  useEffect(() => {
    if (!Number.isInteger(ticketId) || ticketId <= 0) {
      return;
    }

    function joinTicketRoom() {
      socket.emit("join-ticket", ticketId);
    }

    if (socket.connected) {
      joinTicketRoom();
    } else {
      socket.on("connect", joinTicketRoom);
    }

    return () => {
      socket.emit("leave-ticket", ticketId);
      socket.off("connect", joinTicketRoom);
    };
  }, [ticketId]);
  


  if (!Number.isInteger(ticketId) || ticketId <= 0) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">
        ID do chamado inválido.
      </div>
    );
  }

  if (ticketQuery.isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-slate-500">
          Carregando chamado...
        </p>
      </div>
    );
  }

  if (ticketQuery.isError || !ticketQuery.data) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">
        <p className="font-semibold">
          Não foi possível carregar o chamado.
        </p>

        <button
          type="button"
          onClick={() => ticketQuery.refetch()}
          className="mt-4 inline-flex items-center gap-2 rounded-xl border border-red-300 px-4 py-2 text-sm font-semibold transition hover:bg-red-100"
        >
          <RefreshCw size={16} />
          Tentar novamente
        </button>
      </div>
    );
  }

  const ticket = ticketQuery.data;

  return (
    <div className="space-y-6">
      <section>
        <Link
          to="/tickets"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-blue-600"
        >
          <ArrowLeft size={18} />
          Voltar para chamados
        </Link>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-semibold text-blue-600">
                {ticket.protocol}
              </span>

              <TicketBadge
                value={ticket.status}
                type="status"
              />

              <TicketBadge
                value={ticket.priority}
                type="priority"
              />
            </div>

            <h2 className="mt-4 text-2xl font-bold text-slate-900">
              {ticket.title}
            </h2>

            <p className="mt-4 whitespace-pre-wrap leading-7 text-slate-600">
              {ticket.description}
            </p>
          </div>

          <div
            className={[
              "flex shrink-0 items-center gap-3 rounded-2xl border px-4 py-3",
              ticket.slaBreached
                ? "border-red-200 bg-red-50 text-red-700"
                : "border-emerald-200 bg-emerald-50 text-emerald-700",
            ].join(" ")}
          >
            {ticket.slaBreached ? (
              <AlertTriangle size={22} />
            ) : (
              <ShieldCheck size={22} />
            )}

            <div>
              <p className="text-xs font-medium uppercase">
                Situação do SLA
              </p>

              <p className="font-bold">
                {ticket.slaBreached
                  ? "Prazo violado"
                  : "Dentro do prazo"}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <TicketInfoItem
          label="Categoria"
          value={ticket.category}
          icon={Folder}
        />

        <TicketInfoItem
          label="Solicitante"
          value={ticket.requester.name}
          icon={User}
        />

        <TicketInfoItem
          label="Técnico"
          value={
            ticket.technician?.name ?? "Não atribuído"
          }
          icon={UserCog}
        />

        <TicketInfoItem
          label="Data de abertura"
          value={formatDate(ticket.createdAt)}
          icon={CalendarClock}
        />
      </section>

      <div className="grid gap-4 md:grid-cols-2">
        <SlaCard
          title="SLA - Primeira Resposta"
          startDate={ticket.createdAt}
          deadline={ticket.firstResponseDeadline}
          completedAt={ticket.firstResponseAt}
        />

        <SlaCard
          title="SLA - Resolução"
          startDate={ticket.createdAt}
          deadline={ticket.resolutionDeadline}
          completedAt={ticket.resolvedAt}
        />
      </div>
      <section className="grid gap-6 xl:grid-cols-[1.3fr_1fr]">
        <div className="space-y-6">
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="font-bold text-slate-900">
              Informações do atendimento
            </h3>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <TicketInfoItem
                label="E-mail do solicitante"
                value={ticket.requester.email}
                icon={Mail}
              />

              <TicketInfoItem
                label="Primeira resposta"
                value={formatDate(ticket.firstResponseAt)}
                icon={CalendarClock}
              />

              <TicketInfoItem
                label="Prazo da primeira resposta"
                value={formatDate(
                  ticket.firstResponseDeadline,
                )}
                icon={CalendarClock}
              />

              <TicketInfoItem
                label="Prazo de resolução"
                value={formatDate(
                  ticket.resolutionDeadline,
                )}
                icon={CalendarClock}
              />
            </div>
          </section>

          <TicketActions
            ticketId={ticket.id}
            currentTechnicianId={ticket.technicianId}
            currentStatus={ticket.status}
          />

          <TicketComments comments={ticket.comments ?? []} />

          <CreateCommentForm ticketId={ticket.id} />
        </div>

        <TicketTimeline history={ticket.history ?? []} />
      </section>
    </div>
  );
}
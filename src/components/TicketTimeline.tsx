import {
  CircleCheck,
  Clock3,
  MessageSquare,
  RefreshCw,
  UserRoundCheck,
} from "lucide-react";

import type { TicketHistory } from "../types/ticket";

type TicketTimelineProps = {
  history: TicketHistory[];
};

function formatDate(date: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(date));
}

function getEventData(action: string) {
  switch (action) {
    case "CHAMADO_CRIADO":
      return {
        title: "Chamado criado",
        icon: CircleCheck,
      };

    case "TECNICO_ATRIBUIDO":
      return {
        title: "Técnico atribuído",
        icon: UserRoundCheck,
      };

    case "STATUS_ALTERADO":
      return {
        title: "Status alterado",
        icon: RefreshCw,
      };

    case "COMENTARIO_ADICIONADO":
      return {
        title: "Comentário adicionado",
        icon: MessageSquare,
      };

    case "COMENTARIO_INTERNO_ADICIONADO":
      return {
        title: "Comentário interno adicionado",
        icon: MessageSquare,
      };

    case "PRIMEIRA_RESPOSTA_REGISTRADA":
      return {
        title: "Primeira resposta registrada",
        icon: Clock3,
      };

    default:
      return {
        title: action.replaceAll("_", " "),
        icon: Clock3,
      };
  }
}

export function TicketTimeline({
  history,
}: TicketTimelineProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <header className="border-b border-slate-200 p-5">
        <div className="flex items-center gap-2">
          <Clock3
            size={20}
            className="text-blue-600"
          />

          <h3 className="font-bold text-slate-900">
            Histórico
          </h3>
        </div>

        <p className="mt-1 text-sm text-slate-500">
          Linha do tempo das alterações do chamado.
        </p>
      </header>

      <div className="p-5">
        <div className="space-y-0">
          {history.map((event, index) => {
            const eventData = getEventData(event.action);
            const Icon = eventData.icon;
            const isLast = index === history.length - 1;

            return (
              <article
                key={event.id}
                className="relative flex gap-4 pb-7"
              >
                {!isLast && (
                  <div className="absolute left-5 top-10 h-[calc(100%-20px)] w-px bg-slate-200" />
                )}

                <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                  <Icon size={18} />
                </div>

                <div className="min-w-0 pt-1">
                  <p className="font-semibold text-slate-800">
                    {eventData.title}
                  </p>

                  {(event.oldValue || event.newValue) && (
                    <p className="mt-1 text-sm text-slate-500">
                      {event.oldValue && event.newValue
                        ? `${event.oldValue} → ${event.newValue}`
                        : event.newValue ?? event.oldValue}
                    </p>
                  )}

                  <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-slate-400">
                    <span>
                      {event.user?.name ?? "Sistema"}
                    </span>

                    <span>•</span>

                    <time>{formatDate(event.createdAt)}</time>
                  </div>
                </div>
              </article>
            );
          })}

          {history.length === 0 && (
            <div className="py-10 text-center">
              <Clock3
                size={34}
                className="mx-auto text-slate-300"
              />

              <p className="mt-3 font-medium text-slate-600">
                Histórico vazio
              </p>

              <p className="mt-1 text-sm text-slate-400">
                Nenhuma alteração foi registrada.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
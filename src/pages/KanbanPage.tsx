import {
  DndContext,
  type DragEndEvent,
  DragOverlay,
  PointerSensor,
  useDroppable,
  useSensor,
  useSensors,
} from "@dnd-kit/core";

import { toast } from "sonner";

import {
  useSortable,
} from "@dnd-kit/sortable";

import {
  CSS,
} from "@dnd-kit/utilities";

import {
  Columns3,
  GripVertical,
  RefreshCw,
} from "lucide-react";

import {
  useState,
} from "react";

import { useNavigate } from "react-router-dom";

import { useTickets } from "../hooks/useTickets";

import {
  type TicketStatus,
  useUpdateTicketStatus,
} from "../hooks/useUpdateTicketStatus";

import type {
  Ticket,
} from "../types/ticket";

type KanbanColumn = {
  status: TicketStatus;
  title: string;
};

const columns: KanbanColumn[] = [
  {
    status: "EM_ANALISE",
    title: "Em análise",
  },
  {
    status: "EM_ATENDIMENTO",
    title: "Em atendimento",
  },
  {
    status: "AGUARDANDO_CLIENTE",
    title: "Aguardando cliente",
  },
  {
    status: "RESOLVIDO",
    title: "Resolvido",
  },
];

const allowedTransitions: Record<
  TicketStatus,
  TicketStatus[]
> = {
  EM_ANALISE: [
    "EM_ATENDIMENTO",
    "CANCELADO",
  ],

  EM_ATENDIMENTO: [
    "EM_ANALISE",
    "AGUARDANDO_CLIENTE",
    "RESOLVIDO",
  ],

  AGUARDANDO_CLIENTE: [
    "EM_ATENDIMENTO",
    "RESOLVIDO",
  ],

  RESOLVIDO: [
    "EM_ATENDIMENTO",
    "FECHADO",
  ],

  FECHADO: [],

  CANCELADO: [],
};

function priorityClasses(priority: string) {
  switch (priority) {
    case "CRITICA":
      return "bg-red-100 text-red-700";

    case "ALTA":
      return "bg-orange-100 text-orange-700";

    case "MEDIA":
      return "bg-amber-100 text-amber-700";

    case "BAIXA":
      return "bg-emerald-100 text-emerald-700";

    default:
      return "bg-slate-100 text-slate-700";
  }
}

function formatPriority(priority: string) {
  const labels: Record<string, string> = {
    BAIXA: "Baixa",
    MEDIA: "Média",
    ALTA: "Alta",
    CRITICA: "Crítica",
  };

  return labels[priority] ?? priority;
}

function TicketCardContent({
  ticket,
  dragging = false,
}: {
  ticket: Ticket;
  dragging?: boolean;
}) {
  return (
    <article
      className={[
        "rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition",
        dragging
          ? "rotate-2 shadow-xl"
          : "hover:shadow-md",
      ].join(" ")}
    >
      <div className="flex items-start justify-between gap-3">
        <span className="text-primary text-xs font-bold">
          {ticket.protocol}
        </span>

        <div className="flex items-center gap-2">
          <span
            className={[
              "rounded-full px-2.5 py-1 text-[11px] font-bold",
              priorityClasses(ticket.priority),
            ].join(" ")}
          >
            {formatPriority(ticket.priority)}
          </span>

          <GripVertical
            size={16}
            className="text-slate-300"
          />
        </div>
      </div>

      <h3 className="mt-3 font-semibold leading-5 text-slate-900">
        {ticket.title}
      </h3>

      <p className="mt-2 text-sm text-slate-500">
        {ticket.category}
      </p>

      <div className="mt-4 border-t border-slate-100 pt-3">
        <p className="text-xs text-slate-400">
          Técnico
        </p>

        <p className="mt-1 text-sm font-medium text-slate-700">
          {ticket.technician?.name ??
            "Não atribuído"}
        </p>
      </div>
    </article>
  );
}

function DraggableTicket({
  ticket,
}: {
  ticket: Ticket;
}) {
  const navigate = useNavigate();

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: `ticket-${ticket.id}`,

    data: {
      type: "ticket",
      ticket,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={() => {
        if (!isDragging) {
          navigate(`/tickets/${ticket.id}`);
        }
      }}
      className={[
        "cursor-grab touch-none",
        isDragging
          ? "opacity-30"
          : "",
      ].join(" ")}
    >
      <TicketCardContent
        ticket={ticket}
      />
    </div>
  );
}

function KanbanColumn({
  column,
  tickets,
}: {
  column: KanbanColumn;
  tickets: Ticket[];
}) {
  const {
    setNodeRef,
    isOver,
  } = useDroppable({
    id: column.status,

    data: {
      type: "column",
      status: column.status,
    },
  });

  return (
    <section
      ref={setNodeRef}
      className={[
        "min-h-[500px] rounded-2xl p-4 transition",
        isOver
          ? "bg-blue-100 ring-2 ring-primary/30"
          : "bg-slate-100",
      ].join(" ")}
    >
      <header className="mb-4 flex items-center justify-between">
        <h2 className="font-bold text-slate-800">
          {column.title}
        </h2>

        <span className="rounded-full bg-white px-2.5 py-1 text-xs font-bold text-slate-600 shadow-sm">
          {tickets.length}
        </span>
      </header>

      <div className="space-y-3">
        {tickets.map((ticket) => (
          <DraggableTicket
            key={ticket.id}
            ticket={ticket}
          />
        ))}

        {tickets.length === 0 && (
          <div className="rounded-xl border border-dashed border-slate-300 p-6 text-center text-sm text-slate-400">
            Solte um chamado aqui
          </div>
        )}
      </div>
    </section>
  );
}

export function KanbanPage() {
  const ticketsQuery = useTickets({
    page: 1,
    limit: 100,
  });

  const updateStatus =
    useUpdateTicketStatus();

  const [activeTicket, setActiveTicket] =
    useState<Ticket | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
  );

  if (ticketsQuery.isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-slate-500">
        Carregando Kanban...
      </div>
    );
  }

  if (
    ticketsQuery.isError ||
    !ticketsQuery.data
  ) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">
        <p className="font-semibold">
          Não foi possível carregar o Kanban.
        </p>

        <button
          type="button"
          onClick={() =>
            ticketsQuery.refetch()
          }
          className="mt-4 inline-flex items-center gap-2 rounded-xl border border-red-300 px-4 py-2 text-sm font-semibold hover:bg-red-100"
        >
          <RefreshCw size={16} />
          Tentar novamente
        </button>
      </div>
    );
  }

  const tickets =
    ticketsQuery.data.tickets ?? [];

  function handleDragEnd(
    event: DragEndEvent,
  ) {
    const { active, over } = event;

    setActiveTicket(null);

    if (!over) {
      return;
    }

    const ticket =
      active.data.current?.ticket as
      | Ticket
      | undefined;

    if (!ticket) {
      return;
    }

    let newStatus:
      | TicketStatus
      | undefined;

    if (
      over.data.current?.type ===
      "column"
    ) {
      newStatus =
        over.data.current
          .status as TicketStatus;
    } else if (
      over.data.current?.type ===
      "ticket"
    ) {
      const targetTicket =
        over.data.current.ticket as Ticket;

      newStatus =
        targetTicket.status as TicketStatus;
    }

    if (
      !newStatus ||
      ticket.status === newStatus
    ) {
      return;
    }

    const currentStatus =
      ticket.status as TicketStatus;

    const canMove =
      allowedTransitions[currentStatus]?.includes(
        newStatus,
      );

    if (!canMove) {
      toast.error("Movimentação não permitida", {
        description:
          "Esse chamado não pode ser movido diretamente para essa etapa.",
      });

      return;
    }

    updateStatus.mutate(
      {
        ticketId: ticket.id,
        status: newStatus,
      },
      {
        onSuccess: () => {
          toast.success("Chamado atualizado", {
            description: `${ticket.protocol} foi movido com sucesso.`,
          });
        },

        onError: () => {
          toast.error("Erro ao mover chamado", {
            description:
              "Não foi possível atualizar o status. Tente novamente.",
          });
        },
      },
    );
  }

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-primary rounded-xl p-2 text-white">
            <Columns3 size={22} />
          </div>

          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              Kanban
            </h1>

            <p className="mt-1 text-slate-500">
              Arraste os chamados entre as etapas.
            </p>
          </div>
        </div>

        {updateStatus.isPending && (
          <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
            <RefreshCw
              size={16}
              className="animate-spin"
            />

            Atualizando...
          </div>
        )}
      </header>

      <DndContext
        sensors={sensors}
        onDragStart={(event) => {
          const ticket =
            event.active.data.current
              ?.ticket as Ticket | undefined;

          setActiveTicket(
            ticket ?? null,
          );
        }}
        onDragCancel={() =>
          setActiveTicket(null)
        }
        onDragEnd={handleDragEnd}
      >
        <div className="overflow-x-auto pb-4">
          <div className="grid min-w-[1100px] grid-cols-4 gap-5">
            {columns.map((column) => {
              const columnTickets =
                tickets.filter(
                  (ticket) =>
                    ticket.status ===
                    column.status,
                );

              return (
                <KanbanColumn
                  key={column.status}
                  column={column}
                  tickets={
                    columnTickets
                  }
                />
              );
            })}
          </div>
        </div>

        <DragOverlay>
          {activeTicket ? (
            <div className="w-[260px]">
              <TicketCardContent
                ticket={activeTicket}
                dragging
              />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
import {
  RotateCcw,
  Search,
} from "lucide-react";

import type {
  TicketPriority,
  TicketStatus,
} from "../types/ticket";

type TicketFiltersProps = {
  search: string;
  status: TicketStatus | "";
  priority: TicketPriority | "";
  category: string;

  onSearchChange: (value: string) => void;
  onStatusChange: (value: TicketStatus | "") => void;
  onPriorityChange: (value: TicketPriority | "") => void;
  onCategoryChange: (value: string) => void;
  onClear: () => void;
};

export function TicketFilters({
  search,
  status,
  priority,
  category,
  onSearchChange,
  onStatusChange,
  onPriorityChange,
  onCategoryChange,
  onClear,
}: TicketFiltersProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-[2fr_1fr_1fr_1fr_auto]">
        <div>
          <label
            htmlFor="ticket-search"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Pesquisar
          </label>

          <div className="relative">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              id="ticket-search"
              type="search"
              value={search}
              onChange={(event) =>
                onSearchChange(event.target.value)
              }
              placeholder="Protocolo ou título"
              className="h-11 w-full rounded-xl border border-slate-300 pl-10 pr-3 outline-none transition focus-primary focus:ring-4 focus:ring-blue-100"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="ticket-status"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Status
          </label>

          <select
            id="ticket-status"
            value={status}
            onChange={(event) =>
              onStatusChange(
                event.target.value as TicketStatus | "",
              )
            }
            className="h-11 w-full rounded-xl border border-slate-300 bg-white px-3 outline-none transition focus-primary focus:ring-4 focus:ring-blue-100"
          >
            <option value="">Todos</option>
            <option value="ABERTO">Aberto</option>
            <option value="EM_ANALISE">Em análise</option>
            <option value="EM_ATENDIMENTO">
              Em atendimento
            </option>
            <option value="AGUARDANDO_CLIENTE">
              Aguardando cliente
            </option>
            <option value="RESOLVIDO">Resolvido</option>
            <option value="FECHADO">Fechado</option>
            <option value="CANCELADO">Cancelado</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="ticket-priority"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Prioridade
          </label>

          <select
            id="ticket-priority"
            value={priority}
            onChange={(event) =>
              onPriorityChange(
                event.target.value as TicketPriority | "",
              )
            }
            className="h-11 w-full rounded-xl border border-slate-300 bg-white px-3 outline-none transition focus-primary focus:ring-4 focus:ring-blue-100"
          >
            <option value="">Todas</option>
            <option value="BAIXA">Baixa</option>
            <option value="MEDIA">Média</option>
            <option value="ALTA">Alta</option>
            <option value="CRITICA">Crítica</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="ticket-category"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Categoria
          </label>

          <input
            id="ticket-category"
            type="text"
            value={category}
            onChange={(event) =>
              onCategoryChange(event.target.value)
            }
            placeholder="Ex.: Hardware"
            className="h-11 w-full rounded-xl border border-slate-300 px-3 outline-none transition focus-primary focus:ring-4 focus:ring-blue-100"
          />
        </div>

        <div className="flex items-end">
          <button
            type="button"
            onClick={onClear}
            className="flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-slate-300 px-4 font-medium text-slate-600 transition hover:bg-slate-50 xl:w-auto"
          >
            <RotateCcw size={17} />
            Limpar
          </button>
        </div>
      </div>
    </section>
  );
}
import { Search } from "lucide-react";

import type {
  ReportFilters as ReportFiltersType,
} from "../types/report";

import type {
  TicketPriority,
  TicketStatus,
} from "../types/ticket";

type ReportFiltersProps = {
  filters: ReportFiltersType;
  onChange: (
    filters: ReportFiltersType,
  ) => void;
};

export function ReportFilters({
  filters,
  onChange,
}: ReportFiltersProps) {
  function updateField<
    K extends keyof ReportFiltersType,
  >(field: K, value: ReportFiltersType[K]) {
    onChange({
      ...filters,
      [field]: value,
    });
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Data inicial
          </label>

          <input
            type="date"
            value={filters.startDate ?? ""}
            onChange={(event) =>
              updateField(
                "startDate",
                event.target.value,
              )
            }
            className="h-11 w-full rounded-xl border border-slate-300 px-3 outline-none focus-primary focus:ring-4 focus:ring-blue-100"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Data final
          </label>

          <input
            type="date"
            value={filters.endDate ?? ""}
            onChange={(event) =>
              updateField(
                "endDate",
                event.target.value,
              )
            }
            className="h-11 w-full rounded-xl border border-slate-300 px-3 outline-none focus-primary focus:ring-4 focus:ring-blue-100"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Status
          </label>

          <select
            value={filters.status ?? ""}
            onChange={(event) =>
              updateField(
                "status",
                event.target
                  .value as TicketStatus,
              )
            }
            className="h-11 w-full rounded-xl border border-slate-300 px-3 outline-none focus-primary focus:ring-4 focus:ring-blue-100"
          >
            <option value="">Todos</option>
            <option value="EM_ANALISE">
              Em análise
            </option>
            <option value="EM_ATENDIMENTO">
              Em atendimento
            </option>
            <option value="AGUARDANDO_CLIENTE">
              Aguardando cliente
            </option>
            <option value="RESOLVIDO">
              Resolvido
            </option>
            <option value="FECHADO">
              Fechado
            </option>
            <option value="CANCELADO">
              Cancelado
            </option>
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Prioridade
          </label>

          <select
            value={filters.priority ?? ""}
            onChange={(event) =>
              updateField(
                "priority",
                event.target
                  .value as TicketPriority,
              )
            }
            className="h-11 w-full rounded-xl border border-slate-300 px-3 outline-none focus-primary focus:ring-4 focus:ring-blue-100"
          >
            <option value="">Todas</option>
            <option value="BAIXA">
              Baixa
            </option>
            <option value="MEDIA">
              Média
            </option>
            <option value="ALTA">
              Alta
            </option>
            <option value="CRITICA">
              Crítica
            </option>
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Categoria
          </label>

          <input
            type="text"
            placeholder="Categoria"
            value={filters.category ?? ""}
            onChange={(event) =>
              updateField(
                "category",
                event.target.value,
              )
            }
            className="h-11 w-full rounded-xl border border-slate-300 px-3 outline-none focus-primary focus:ring-4 focus:ring-blue-100"
          />
        </div>

        <div className="flex items-end">
          <button
            className="flex h-11 w-full items-center justify-center gap-2 rounded-xl btn-primary px-4 font-semibold text-white transition hover:bg-blue-700"
          >
            <Search size={18} />
            Filtrar
          </button>
        </div>

      </div>
    </section>
  );
}
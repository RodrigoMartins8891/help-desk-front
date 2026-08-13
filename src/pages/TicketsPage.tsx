import {
  CirclePlus,
  RefreshCw,
} from "lucide-react";
import {
  useMemo,
  useState,
} from "react";

import { CreateTicketModal } from "../components/CreateTicketModal";
import { Pagination } from "../components/Pagination";
import { TicketFilters } from "../components/TicketFilters";
import { TicketTable } from "../components/TicketTable";
import { useTickets } from "../hooks/useTickets";
import type {
  TicketPriority,
  TicketStatus,
} from "../types/ticket";

const ITEMS_PER_PAGE = 10;

export function TicketsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const [status, setStatus] =
    useState<TicketStatus | "">("");

  const [priority, setPriority] =
    useState<TicketPriority | "">("");

  const [category, setCategory] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] =
    useState(false);

  const ticketsQuery = useTickets({
    page,
    limit: ITEMS_PER_PAGE,
    status,
    priority,
    category,
  });

  const tickets = ticketsQuery.data?.tickets ?? [];
  const total = ticketsQuery.data?.total ?? 0;

  const filteredTickets = useMemo(() => {
    const normalizedSearch = search
      .trim()
      .toLowerCase();

    if (!normalizedSearch) {
      return tickets;
    }

    return tickets.filter((ticket) => {
      return (
        ticket.protocol
          .toLowerCase()
          .includes(normalizedSearch) ||
        ticket.title
          .toLowerCase()
          .includes(normalizedSearch)
      );
    });
  }, [search, tickets]);

  const totalPages = Math.ceil(
    total / ITEMS_PER_PAGE,
  );

  function resetPage() {
    setPage(1);
  }

  function handleClearFilters() {
    setSearch("");
    setStatus("");
    setPriority("");
    setCategory("");
    setPage(1);
  }

  return (
    <>
      <div className="space-y-6">
        <section className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              Chamados
            </h2>

            <p className="mt-1 text-slate-500">
              Consulte, acompanhe e gerencie os atendimentos.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsCreateModalOpen(true)}
            className="flex h-11 items-center justify-center gap-2 rounded-xl btn-primary px-5 font-semibold text-white transition hover:bg-blue-700"
          >
            <CirclePlus size={19} />
            Novo chamado
          </button>
        </section>

        <TicketFilters
          search={search}
          status={status}
          priority={priority}
          category={category}
          onSearchChange={setSearch}
          onStatusChange={(value) => {
            setStatus(value);
            resetPage();
          }}
          onPriorityChange={(value) => {
            setPriority(value);
            resetPage();
          }}
          onCategoryChange={(value) => {
            setCategory(value);
            resetPage();
          }}
          onClear={handleClearFilters}
        />

        {ticketsQuery.isError && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-red-700">
            <p className="font-medium">
              Não foi possível carregar os chamados.
            </p>

            <button
              type="button"
              onClick={() => ticketsQuery.refetch()}
              className="mt-3 inline-flex items-center gap-2 rounded-xl border border-red-300 px-4 py-2 text-sm font-semibold transition hover:bg-red-100"
            >
              <RefreshCw size={16} />
              Tentar novamente
            </button>
          </div>
        )}

        {!ticketsQuery.isError && (
          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
              <div>
                <h3 className="font-bold text-slate-900">
                  Lista de chamados
                </h3>

                <p className="text-sm text-slate-500">
                  {ticketsQuery.isLoading
                    ? "Carregando registros..."
                    : `${total} chamado${
                        total === 1 ? "" : "s"
                      } no total`}
                </p>
              </div>

              {ticketsQuery.isFetching &&
                !ticketsQuery.isLoading && (
                  <RefreshCw
                    size={18}
                    className="animate-spin text-blue-600"
                  />
                )}
            </div>

            {ticketsQuery.isLoading ? (
              <div className="flex min-h-80 items-center justify-center">
                <p className="text-slate-500">
                  Carregando chamados...
                </p>
              </div>
            ) : (
              <>
                <TicketTable
                  tickets={filteredTickets}
                  isFetching={
                    ticketsQuery.isFetching
                  }
                />

                <Pagination
                  page={page}
                  totalPages={totalPages}
                  totalItems={total}
                  isLoading={
                    ticketsQuery.isFetching
                  }
                  onPageChange={setPage}
                />
              </>
            )}
          </section>
        )}
      </div>

      <CreateTicketModal
        isOpen={isCreateModalOpen}
        onClose={() =>
          setIsCreateModalOpen(false)
        }
      />
    </>
  );
}
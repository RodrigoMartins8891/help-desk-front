import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

type PaginationProps = {
  page: number;
  totalPages: number;
  totalItems: number;
  isLoading?: boolean;
  onPageChange: (page: number) => void;
};

export function Pagination({
  page,
  totalPages,
  totalItems,
  isLoading = false,
  onPageChange,
}: PaginationProps) {
  return (
    <div className="flex flex-col gap-3 border-t border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-slate-500">
        {totalItems} chamado
        {totalItems === 1 ? "" : "s"} encontrado
        {totalItems === 1 ? "" : "s"}
      </p>

      <div className="flex items-center gap-3">
        <button
          type="button"
          disabled={page <= 1 || isLoading}
          onClick={() => onPageChange(page - 1)}
          className="flex h-10 items-center gap-1 rounded-xl border border-slate-300 px-3 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronLeft size={17} />
          Anterior
        </button>

        <span className="text-sm font-medium text-slate-600">
          Página {page} de {Math.max(totalPages, 1)}
        </span>

        <button
          type="button"
          disabled={page >= totalPages || isLoading}
          onClick={() => onPageChange(page + 1)}
          className="flex h-10 items-center gap-1 rounded-xl border border-slate-300 px-3 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Próxima
          <ChevronRight size={17} />
        </button>
      </div>
    </div>
  );
}
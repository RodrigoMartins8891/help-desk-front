import { AxiosError } from "axios";
import {
  LoaderCircle,
  X,
} from "lucide-react";
import {
  type FormEvent,
  useEffect,
  useState,
} from "react";

import { useCreateTicket } from "../hooks/useCreateTicket";
import type { TicketPriority } from "../types/ticket";

type CreateTicketModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

type ApiErrorResponse = {
  message?: string;
  errors?: Record<string, string[]>;
};

export function CreateTicketModal({
  isOpen,
  onClose,
}: CreateTicketModalProps) {
  const createTicketMutation = useCreateTicket();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [priority, setPriority] =
    useState<TicketPriority>("MEDIA");

  const [error, setError] = useState("");

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  function resetForm() {
    setTitle("");
    setDescription("");
    setCategory("");
    setPriority("MEDIA");
    setError("");
  }

  function handleClose() {
    if (createTicketMutation.isPending) {
      return;
    }

    resetForm();
    onClose();
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setError("");

    try {
      await createTicketMutation.mutateAsync({
        title: title.trim(),
        description: description.trim(),
        category: category.trim(),
        priority,
      });

      resetForm();
      onClose();
    } catch (requestError) {
      const axiosError =
        requestError as AxiosError<ApiErrorResponse>;

      const apiMessage =
        axiosError.response?.data?.message;

      const fieldErrors =
        axiosError.response?.data?.errors;

      const firstFieldError = fieldErrors
        ? Object.values(fieldErrors)
            .flat()
            .find(Boolean)
        : undefined;

      setError(
        firstFieldError ??
          apiMessage ??
          "Não foi possível abrir o chamado.",
      );
    }
  }

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          handleClose();
        }
      }}
    >
      <section className="max-h-[95vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white shadow-2xl">
        <header className="flex items-start justify-between border-b border-slate-200 p-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              Novo chamado
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Informe os detalhes do problema ou solicitação.
            </p>
          </div>

          <button
            type="button"
            onClick={handleClose}
            disabled={createTicketMutation.isPending}
            title="Fechar"
            className="rounded-xl p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50"
          >
            <X size={22} />
          </button>
        </header>

        <form
          onSubmit={handleSubmit}
          className="space-y-5 p-6"
        >
          <div>
            <label
              htmlFor="new-ticket-title"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Título
            </label>

            <input
              id="new-ticket-title"
              type="text"
              value={title}
              onChange={(event) =>
                setTitle(event.target.value)
              }
              minLength={5}
              maxLength={150}
              required
              autoFocus
              placeholder="Ex.: Computador não está ligando"
              className="h-12 w-full rounded-xl border border-slate-300 px-4 outline-none transition focus-primary focus:ring-4 focus:ring-blue-100"
            />

            <p className="mt-1 text-right text-xs text-slate-400">
              {title.length}/150
            </p>
          </div>

          <div>
            <label
              htmlFor="new-ticket-description"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Descrição
            </label>

            <textarea
              id="new-ticket-description"
              value={description}
              onChange={(event) =>
                setDescription(event.target.value)
              }
              minLength={10}
              required
              rows={6}
              placeholder="Descreva o problema com o máximo de detalhes possível."
              className="w-full resize-y rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus-primary focus:ring-4 focus:ring-blue-100"
            />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label
                htmlFor="new-ticket-category"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Categoria
              </label>

              <input
                id="new-ticket-category"
                type="text"
                value={category}
                onChange={(event) =>
                  setCategory(event.target.value)
                }
                minLength={3}
                required
                placeholder="Ex.: Hardware"
                className="h-12 w-full rounded-xl border border-slate-300 px-4 outline-none transition focus-primary focus:ring-4 focus:ring-blue-100"
              />
            </div>

            <div>
              <label
                htmlFor="new-ticket-priority"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Prioridade
              </label>

              <select
                id="new-ticket-priority"
                value={priority}
                onChange={(event) =>
                  setPriority(
                    event.target.value as TicketPriority,
                  )
                }
                className="h-12 w-full rounded-xl border border-slate-300 bg-white px-4 outline-none transition focus-primary focus:ring-4 focus:ring-blue-100"
              >
                <option value="BAIXA">Baixa</option>
                <option value="MEDIA">Média</option>
                <option value="ALTA">Alta</option>
                <option value="CRITICA">Crítica</option>
              </select>
            </div>
          </div>

          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <footer className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={handleClose}
              disabled={createTicketMutation.isPending}
              className="h-11 rounded-xl border border-slate-300 px-5 font-semibold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={createTicketMutation.isPending}
              className="flex h-11 items-center justify-center gap-2 rounded-xl btn-primary px-5 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {createTicketMutation.isPending && (
                <LoaderCircle
                  size={18}
                  className="animate-spin"
                />
              )}

              {createTicketMutation.isPending
                ? "Abrindo chamado..."
                : "Abrir chamado"}
            </button>
          </footer>
        </form>
      </section>
    </div>
  );
}
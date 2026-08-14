import { Bot, Loader2, Search, Sparkles, X } from "lucide-react";
import { FormEvent, useEffect, useRef, useState } from "react";

import { useAgentQuery } from "../hooks/useAgentQuery";
import { TicketBadge } from "./TicketBadge";

export function AIAgentAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const { mutate: search, data, isPending, error, reset } =
    useAgentQuery();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  useEffect(() => {
    function handleEsc(event: KeyboardEvent) {
      if (event.key === "Escape") handleClose();
    }
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  function handleClose() {
    setIsOpen(false);
    setQuery("");
    reset();
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();

    if (!query.trim() || query.trim().length < 3) return;

    search({ query: query.trim() });
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg shadow-blue-600/30 transition hover:bg-blue-700 hover:scale-105 active:scale-95"
        aria-label="Abrir assistente de IA"
      >
        <Bot className="h-6 w-6" />
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/40 backdrop-blur-sm sm:items-center"
          onClick={handleClose}
        >
          <div
            className="w-full max-w-lg rounded-t-2xl bg-white p-6 shadow-2xl sm:rounded-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-4 flex items-start justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">
                    Assistente do Help Desk
                  </h3>
                  <p className="text-xs text-slate-500">
                    Pesquise chamados usando linguagem natural
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleClose}
                className="rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                aria-label="Fechar"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Ex: chamados críticos de rede em aberto"
                className="flex-1 rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                disabled={isPending}
              />

              <button
                type="submit"
                disabled={isPending || query.trim().length < 3}
                className="flex items-center justify-center rounded-xl bg-blue-600 px-4 text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Search className="h-4 w-4" />
                )}
              </button>
            </form>

            {(data || error || isPending) && (
              <div className="mt-4 max-h-80 space-y-3 overflow-y-auto">
                {isPending && (
                  <p className="text-sm text-slate-500">
                    Consultando o assistente...
                  </p>
                )}

                {error && (
                  <p className="text-sm text-red-600">
                    Não foi possível consultar o assistente agora.
                  </p>
                )}

                {data && (
                  <>
                    <div className="rounded-xl bg-slate-50 p-4 text-sm text-slate-700">
                      {data.answer}
                    </div>

                    {data.tickets.length > 0 ? (
                      <ul className="divide-y divide-slate-100 rounded-xl border border-slate-200">
                        {data.tickets.map((ticket) => (
                          <li
                            key={ticket.id}
                            className="flex items-center justify-between gap-3 p-3"
                          >
                            <div>
                              <p className="text-sm font-medium text-slate-900">
                                {ticket.title}
                              </p>
                              <p className="text-xs text-blue-600">
                                {ticket.protocol}
                              </p>
                            </div>

                            <div className="flex gap-1.5">
                              <TicketBadge
                                value={ticket.status}
                                type="status"
                              />
                              <TicketBadge
                                value={ticket.priority}
                                type="priority"
                              />
                            </div>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-center text-xs text-slate-400">
                        Nenhum chamado encontrado para essa busca.
                      </p>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
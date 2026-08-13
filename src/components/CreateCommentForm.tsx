import { AxiosError } from "axios";
import {
  LoaderCircle,
  LockKeyhole,
  Send,
} from "lucide-react";
import {
  type FormEvent,
  useState,
} from "react";

import { useAuth } from "../contexts/AuthContext";
import { useCreateTicketComment } from "../hooks/useCreateTicketComment";

type CreateCommentFormProps = {
  ticketId: number;
};

type ApiErrorResponse = {
  message?: string;
  errors?: Record<string, string[]>;
};

export function CreateCommentForm({
  ticketId,
}: CreateCommentFormProps) {
  const { user } = useAuth();

  const createCommentMutation =
    useCreateTicketComment();

  const [message, setMessage] = useState("");
  const [isInternal, setIsInternal] =
    useState(false);
  const [error, setError] = useState("");

  const canCreateInternalComment =
    user?.role === "ADMIN" ||
    user?.role === "TECNICO";

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setError("");

    try {
      await createCommentMutation.mutateAsync({
        ticketId,
        data: {
          message: message.trim(),
          isInternal:
            canCreateInternalComment && isInternal,
        },
      });

      setMessage("");
      setIsInternal(false);
    } catch (requestError) {
      const axiosError =
        requestError as AxiosError<ApiErrorResponse>;

      const fieldErrors =
        axiosError.response?.data?.errors;

      const firstFieldError = fieldErrors
        ? Object.values(fieldErrors)
            .flat()
            .find(Boolean)
        : undefined;

      setError(
        firstFieldError ??
          axiosError.response?.data?.message ??
          "Não foi possível adicionar o comentário.",
      );
    }
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <header className="border-b border-slate-200 p-5">
        <h3 className="font-bold text-slate-900">
          Adicionar comentário
        </h3>

        <p className="mt-1 text-sm text-slate-500">
          Registre uma resposta ou atualização do atendimento.
        </p>
      </header>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 p-5"
      >
        <div>
          <label
            htmlFor="ticket-comment"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Mensagem
          </label>

          <textarea
            id="ticket-comment"
            value={message}
            onChange={(event) =>
              setMessage(event.target.value)
            }
            minLength={2}
            maxLength={2000}
            rows={5}
            required
            placeholder="Digite uma atualização sobre este chamado..."
            className="w-full resize-y rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus-primary focus:ring-4 focus:ring-blue-100"
          />

          <p className="mt-1 text-right text-xs text-slate-400">
            {message.length}/2000
          </p>
        </div>

        {canCreateInternalComment && (
          <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
            <input
              type="checkbox"
              checked={isInternal}
              onChange={(event) =>
                setIsInternal(event.target.checked)
              }
              className="mt-1 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
            />

            <div>
              <span className="flex items-center gap-2 font-semibold text-amber-800">
                <LockKeyhole size={17} />
                Comentário interno
              </span>

              <p className="mt-1 text-sm text-amber-700">
                Visível apenas para administradores e técnicos.
              </p>
            </div>
          </label>
        )}

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={
              createCommentMutation.isPending ||
              message.trim().length < 2
            }
            className="flex h-11 items-center justify-center gap-2 rounded-xl btn-primary px-5 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {createCommentMutation.isPending ? (
              <LoaderCircle
                size={18}
                className="animate-spin"
              />
            ) : (
              <Send size={18} />
            )}

            {createCommentMutation.isPending
              ? "Enviando..."
              : "Enviar comentário"}
          </button>
        </div>
      </form>
    </section>
  );
}
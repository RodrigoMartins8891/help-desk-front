import {
  LockKeyhole,
  MessageSquare,
  UserCircle,
} from "lucide-react";

import type { TicketComment } from "../types/ticket";

type TicketCommentsProps = {
  comments: TicketComment[];
};

function formatDate(date: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(date));
}

export function TicketComments({
  comments,
}: TicketCommentsProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <header className="border-b border-slate-200 p-5">
        <div className="flex items-center gap-2">
          <MessageSquare
            size={20}
            className="text-blue-600"
          />

          <h3 className="font-bold text-slate-900">
            Comentários
          </h3>
        </div>

        <p className="mt-1 text-sm text-slate-500">
          Conversa e registros do atendimento.
        </p>
      </header>

      <div className="space-y-4 p-5">
        {comments.map((comment) => {
          const author = comment.author ?? comment.user;

          return (
            <article
              key={comment.id}
              className={[
                "rounded-2xl border p-4",
                comment.isInternal
                  ? "border-amber-200 bg-amber-50"
                  : "border-slate-200 bg-slate-50",
              ].join(" ")}
            >
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-2">
                  <UserCircle
                    size={22}
                    className="text-blue-600"
                  />

                  <div>
                    <p className="font-semibold text-slate-800">
                      {author?.name ?? "Usuário"}
                    </p>

                    <p className="text-xs text-slate-500">
                      {author?.role ?? "Perfil não informado"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {comment.isInternal && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-700">
                      <LockKeyhole size={13} />
                      Interno
                    </span>
                  )}

                  <time className="text-xs text-slate-400">
                    {formatDate(comment.createdAt)}
                  </time>
                </div>
              </div>

              <p className="mt-4 whitespace-pre-wrap text-sm leading-6 text-slate-700">
                {comment.message}
              </p>
            </article>
          );
        })}

        {comments.length === 0 && (
          <div className="py-10 text-center">
            <MessageSquare
              size={34}
              className="mx-auto text-slate-300"
            />

            <p className="mt-3 font-medium text-slate-600">
              Nenhum comentário
            </p>

            <p className="mt-1 text-sm text-slate-400">
              Ainda não existem respostas neste chamado.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
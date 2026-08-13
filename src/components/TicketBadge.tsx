type TicketBadgeProps = {
  value: string;
  type: "status" | "priority";
};

const statusStyles: Record<string, string> = {
  ABERTO: "bg-sky-100 text-sky-700",
  EM_ANALISE: "bg-amber-100 text-amber-700",
  EM_ATENDIMENTO: "bg-blue-100 text-blue-700",
  AGUARDANDO_CLIENTE: "bg-purple-100 text-purple-700",
  RESOLVIDO: "bg-emerald-100 text-emerald-700",
  FECHADO: "bg-slate-200 text-slate-700",
  CANCELADO: "bg-red-100 text-red-700",
};

const priorityStyles: Record<string, string> = {
  BAIXA: "bg-slate-100 text-slate-600",
  MEDIA: "bg-yellow-100 text-yellow-700",
  ALTA: "bg-orange-100 text-orange-700",
  CRITICA: "bg-red-100 text-red-700",
};

function formatLabel(value: string) {
  return value.replaceAll("_", " ");
}

export function TicketBadge({
  value,
  type,
}: TicketBadgeProps) {
  const styles =
    type === "status"
      ? statusStyles[value]
      : priorityStyles[value];

  return (
    <span
      className={[
        "inline-flex rounded-full px-2.5 py-1 text-xs font-semibold",
        styles ?? "bg-slate-100 text-slate-700",
      ].join(" ")}
    >
      {formatLabel(value)}
    </span>
  );
}
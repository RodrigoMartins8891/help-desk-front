import {
  AlertTriangle,
  CheckCircle2,
  Clock3,
} from "lucide-react";
import {
  useEffect,
  useMemo,
  useState,
} from "react";

import { calculateSla } from "../utils/sla";

type SlaCardProps = {
  title: string;
  startDate: string;
  deadline: string | null;
  completedAt?: string | null;
};

function formatDuration(milliseconds: number) {
  const totalSeconds = Math.max(
    0,
    Math.floor(Math.abs(milliseconds) / 1000),
  );

  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor(
    (totalSeconds % 86400) / 3600,
  );
  const minutes = Math.floor(
    (totalSeconds % 3600) / 60,
  );
  const seconds = totalSeconds % 60;

  if (days > 0) {
    return `${days}d ${hours}h ${minutes}min`;
  }

  if (hours > 0) {
    return `${hours}h ${minutes}min ${seconds}s`;
  }

  if (minutes > 0) {
    return `${minutes}min ${seconds}s`;
  }

  return `${seconds}s`;
}

export function SlaCard({
  title,
  startDate,
  deadline,
  completedAt,
}: SlaCardProps) {
  const [currentTime, setCurrentTime] = useState(
    Date.now(),
  );

  useEffect(() => {
    if (completedAt) {
      return;
    }

    const intervalId = window.setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [completedAt]);

  const sla = useMemo(() => {
    if (!deadline) {
      return null;
    }

    const referenceDate = completedAt
      ? new Date(completedAt).toISOString()
      : new Date(currentTime).toISOString();

    return calculateSla(
      startDate,
      deadline,
      referenceDate,
    );
  }, [
    completedAt,
    currentTime,
    deadline,
    startDate,
  ]);

  if (!deadline || !sla) {
    return (
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="font-bold text-slate-900">
          {title}
        </h3>

        <p className="mt-4 text-sm text-slate-500">
          SLA não configurado.
        </p>
      </section>
    );
  }

  const isWarning =
    !sla.expired && sla.percentage >= 85;

  const progressColor = sla.expired
    ? "bg-red-500"
    : isWarning
      ? "bg-amber-500"
      : "bg-emerald-500";

  const borderColor = sla.expired
    ? "border-red-200"
    : isWarning
      ? "border-amber-200"
      : "border-emerald-200";

  const statusText = completedAt
    ? sla.expired
      ? "Concluído fora do prazo"
      : "Concluído dentro do prazo"
    : sla.label;

  return (
    <section
      className={[
        "rounded-2xl border bg-white p-5 shadow-sm",
        borderColor,
      ].join(" ")}
    >
      <div className="flex items-center justify-between gap-4">
        <div>
          <h3 className="font-bold text-slate-900">
            {title}
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            {completedAt
              ? "Prazo concluído"
              : "Acompanhamento em tempo real"}
          </p>
        </div>

        {sla.expired ? (
          <AlertTriangle
            size={24}
            className="shrink-0 text-red-600"
          />
        ) : (
          <CheckCircle2
            size={24}
            className="shrink-0 text-emerald-600"
          />
        )}
      </div>

      <div className="mt-6">
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="font-medium text-slate-600">
            Consumo do prazo
          </span>

          <strong className="text-slate-900">
            {sla.percentage.toFixed(0)}%
          </strong>
        </div>

        <div className="h-3 overflow-hidden rounded-full bg-slate-200">
          <div
            className={[
              "h-full rounded-full transition-all duration-500",
              progressColor,
            ].join(" ")}
            style={{
              width: `${sla.percentage}%`,
            }}
          />
        </div>
      </div>

      <div className="mt-5 flex items-start gap-3 rounded-xl bg-slate-50 p-4">
        <Clock3
          size={19}
          className="mt-0.5 shrink-0 text-slate-500"
        />

        <div>
          <p
            className={[
              "font-semibold",
              sla.expired
                ? "text-red-600"
                : isWarning
                  ? "text-amber-600"
                  : "text-emerald-600",
            ].join(" ")}
          >
            {statusText}
          </p>

          <p className="mt-1 text-sm text-slate-600">
            {completedAt
              ? sla.expired
                ? `Concluído com ${formatDuration(
                    sla.remainingMs,
                  )} de atraso`
                : `Concluído com ${formatDuration(
                    sla.remainingMs,
                  )} de antecedência`
              : sla.expired
                ? `Violado há ${formatDuration(
                    sla.remainingMs,
                  )}`
                : `Restam ${formatDuration(
                    sla.remainingMs,
                  )}`}
          </p>
        </div>
      </div>
    </section>
  );
}
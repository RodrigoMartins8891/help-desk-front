import { Award } from "lucide-react";

import type { TechnicianPerformance } from "../types/report";

type TechnicianRankingProps = {
  technicians: TechnicianPerformance[];
};

export function TechnicianRanking({
  technicians,
}: TechnicianRankingProps) {
  const maxTickets = Math.max(
    ...technicians.map((t) => t.total),
    1,
  );

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-6 flex items-center gap-2">
        <Award className="text-amber-500" />

        <h3 className="text-lg font-bold text-slate-900">
          Ranking dos Técnicos
        </h3>
      </div>

      <div className="space-y-5">
        {technicians.map((technician) => {
          const width =
            (technician.total / maxTickets) * 100;

          return (
            <div key={technician.id}>
              <div className="mb-2 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-slate-800">
                    {technician.name}
                  </p>

                  <p className="text-sm text-slate-500">
                    Resolvidos: {technician.resolved} •
                    Pendentes: {technician.pending}
                  </p>
                </div>

                <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700">
                  SLA {technician.slaPercentage}%
                </span>
              </div>

              <div className="h-3 overflow-hidden rounded-full bg-slate-200">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-blue-500 to-emerald-500 transition-all duration-500"
                  style={{
                    width: `${width}%`,
                  }}
                />
              </div>

              <div className="mt-1 text-right text-xs text-slate-500">
                {technician.total} chamados
              </div>
            </div>
          );
        })}

        {technicians.length === 0 && (
          <div className="py-10 text-center text-slate-500">
            Nenhum técnico encontrado.
          </div>
        )}
      </div>
    </section>
  );
}
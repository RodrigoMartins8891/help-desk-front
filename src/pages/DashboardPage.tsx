import {
  AlertTriangle,
  CheckCircle2,
  Clock3,
  Ticket,
} from "lucide-react";
import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { AIAgentAssistant } from "../components/AIAgentAssistant";
import { MetricCard } from "../components/MetricCard";
import { TicketBadge } from "../components/TicketBadge";
import {
  getDashboardCards,
  getDashboardCharts,
  getRecentTickets,
} from "../services/dashboard-service";
import type {
  DashboardCards,
  DashboardCharts,
  RecentTicket,
} from "../types/dashboard";

export function DashboardPage() {
  const [cards, setCards] =
    useState<DashboardCards | null>(null);

  const [charts, setCharts] =
    useState<DashboardCharts | null>(null);

  const [recentTickets, setRecentTickets] =
    useState<RecentTicket[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadDashboard() {
      try {
        setIsLoading(true);
        setError("");

        const [
          cardsResponse,
          chartsResponse,
          ticketsResponse,
        ] = await Promise.all([
          getDashboardCards(),
          getDashboardCharts(),
          getRecentTickets(),
        ]);

        setCards(cardsResponse);
        setCharts(chartsResponse);
        setRecentTickets(ticketsResponse);
      } catch (requestError) {
        console.error(requestError);

        setError(
          "Não foi possível carregar os dados do dashboard.",
        );
      } finally {
        setIsLoading(false);
      }
    }

    loadDashboard();
  }, []);

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-slate-500">
          Carregando dashboard...
        </p>
      </div>
    );
  }

  if (error || !cards || !charts) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-red-700">
        {error || "Dados indisponíveis."}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-2xl font-bold text-slate-900">
          Visão geral
        </h2>

        <p className="mt-1 text-slate-500">
          Acompanhe os principais indicadores do atendimento.
        </p>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          title="Total de chamados"
          value={cards.total}
          description="Todos os chamados registrados"
          icon={Ticket}
        />

        <MetricCard
          title="Em atendimento"
          value={cards.emAtendimento}
          description="Chamados sendo tratados"
          icon={Clock3}
        />

        <MetricCard
          title="Resolvidos"
          value={cards.resolvidos}
          description="Chamados com solução registrada"
          icon={CheckCircle2}
        />

        <MetricCard
          title="SLA violado"
          value={cards.slaViolado}
          description="Chamados fora do prazo"
          icon={AlertTriangle}
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-5">
            <h3 className="font-bold text-slate-900">
              Chamados por status
            </h3>

            <p className="text-sm text-slate-500">
              Distribuição atual dos atendimentos
            </p>
          </div>

          <div className="h-72">
            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <PieChart>
                <Pie
                  data={charts.status}
                  dataKey="total"
                  nameKey="name"
                  outerRadius={95}
                  label
                />

                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </article>

        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-5">
            <h3 className="font-bold text-slate-900">
              Chamados por categoria
            </h3>

            <p className="text-sm text-slate-500">
              Categorias mais recorrentes
            </p>
          </div>

          <div className="h-72">
            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <BarChart data={charts.categories}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                />

                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />

                <Bar
                  dataKey="total"
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </article>
      </section>

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 p-5">
          <h3 className="font-bold text-slate-900">
            Chamados recentes
          </h3>

          <p className="text-sm text-slate-500">
            Últimos chamados registrados no sistema
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-slate-50">
              <tr className="text-left text-xs uppercase tracking-wide text-slate-500">
                <th className="px-5 py-4">Protocolo</th>
                <th className="px-5 py-4">Chamado</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4">Prioridade</th>
                <th className="px-5 py-4">Técnico</th>
                <th className="px-5 py-4">SLA</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {recentTickets.map((ticketItem) => (
                <tr
                  key={ticketItem.id}
                  className="text-sm text-slate-700 hover:bg-slate-50"
                >
                  <td className="whitespace-nowrap px-5 py-4 font-semibold text-blue-600">
                    {ticketItem.protocol}
                  </td>

                  <td className="px-5 py-4">
                    <p className="font-medium text-slate-900">
                      {ticketItem.title}
                    </p>

                    <p className="text-xs text-slate-500">
                      {ticketItem.category}
                    </p>
                  </td>

                  <td className="px-5 py-4">
                    <TicketBadge
                      value={ticketItem.status}
                      type="status"
                    />
                  </td>

                  <td className="px-5 py-4">
                    <TicketBadge
                      value={ticketItem.priority}
                      type="priority"
                    />
                  </td>

                  <td className="px-5 py-4">
                    {ticketItem.technician?.name ??
                      "Não atribuído"}
                  </td>

                  <td className="px-5 py-4">
                    {ticketItem.slaBreached ? (
                      <span className="font-semibold text-red-600">
                        Violado
                      </span>
                    ) : (
                      <span className="font-semibold text-emerald-600">
                        Dentro do prazo
                      </span>
                    )}
                  </td>
                </tr>
              ))}

              {recentTickets.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-5 py-10 text-center text-slate-500"
                  >
                    Nenhum chamado encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <AIAgentAssistant />
    </div>
  );
}
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { ReportCharts as ReportChartsType } from "../types/report";

type Props = {
  charts: ReportChartsType;
};

const COLORS = [
  "#2563eb",
  "#22c55e",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#06b6d4",
];

export function ReportCharts({ charts }: Props) {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="mb-5 text-lg font-bold">
          Chamados por Status
        </h3>

        <ResponsiveContainer
          width="100%"
          height={320}
        >
          <BarChart data={charts.status}>
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="name" />

            <YAxis />

            <Tooltip />

            <Legend />

            <Bar
              dataKey="total"
              fill="#2563eb"
              radius={[8, 8, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="mb-5 text-lg font-bold">
          Chamados por Prioridade
        </h3>

        <ResponsiveContainer
          width="100%"
          height={320}
        >
          <PieChart>
            <Pie
              data={charts.priorities}
              dataKey="total"
              nameKey="name"
              outerRadius={110}
              label
            >
              {charts.priorities.map(
                (_, index) => (
                  <Cell
                    key={index}
                    fill={
                      COLORS[
                        index % COLORS.length
                      ]
                    }
                  />
                ),
              )}
            </Pie>

            <Tooltip />

            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:col-span-2">
        <h3 className="mb-5 text-lg font-bold">
          Chamados por Categoria
        </h3>

        <ResponsiveContainer
          width="100%"
          height={350}
        >
          <BarChart
            data={charts.categories}
            layout="vertical"
          >
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis type="number" />

            <YAxis
              dataKey="name"
              type="category"
              width={120}
            />

            <Tooltip />

            <Bar
              dataKey="total"
              fill="#22c55e"
              radius={[0, 8, 8, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </section>
    </div>
  );
}
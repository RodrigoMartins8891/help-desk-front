import type { LucideIcon } from "lucide-react";

type MetricCardProps = {
  title: string;
  value: number;
  description: string;
  icon: LucideIcon;
};

export function MetricCard({
  title,
  value,
  description,
  icon: Icon,
}: MetricCardProps) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">
            {title}
          </p>

          <strong className="mt-2 block text-3xl font-bold text-slate-900">
            {value}
          </strong>
        </div>

        <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
          <Icon size={22} />
        </div>
      </div>

      <p className="mt-4 text-xs text-slate-400">
        {description}
      </p>
    </article>
  );
}
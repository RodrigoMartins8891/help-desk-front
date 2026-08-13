import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

type TicketInfoItemProps = {
  label: string;
  value: ReactNode;
  icon: LucideIcon;
};

export function TicketInfoItem({
  label,
  value,
  icon: Icon,
}: TicketInfoItemProps) {
  return (
    <div className="flex gap-3 rounded-xl border border-slate-200 p-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
        <Icon size={19} />
      </div>

      <div className="min-w-0">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
          {label}
        </p>

        <div className="mt-1 font-medium text-slate-800">
          {value}
        </div>
      </div>
    </div>
  );
}
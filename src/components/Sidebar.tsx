import {
  BarChart3,
  Headphones,
  LayoutDashboard,
  Settings,
  Ticket,
  Users,
} from "lucide-react";
import { NavLink } from "react-router-dom";

const menuItems = [
  {
    label: "Dashboard",
    path: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Chamados",
    path: "/tickets",
    icon: Ticket,
  },
  {
    label: "Usuários",
    path: "/users",
    icon: Users,
  },
  {
    label: "Relatórios",
    path: "/reports",
    icon: BarChart3,
  },
  {
    label: "Configurações",
    path: "/settings",
    icon: Settings,
  },
];

export function Sidebar() {
  return (
    <aside className="hidden min-h-screen w-64 flex-col bg-slate-950 text-white lg:flex">
      <div className="flex h-20 items-center gap-3 border-b border-slate-800 px-6">
        <div className="rounded-xl btn-primary p-2.5">
          <Headphones size={23} />
        </div>

        <div>
          <strong className="block text-lg">Help Desk</strong>

          <span className="text-xs text-slate-400">
            Chamados e SLA
          </span>
        </div>
      </div>

      <nav className="flex-1 space-y-2 p-4">
        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                [
                  "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition",
                  isActive
                    ? "bg-primary text-white"
                    : "text-slate-400 hover:bg-slate-900 hover:text-white",
                ].join(" ")
              }
            >
              <Icon size={19} />
              {item.label}
            </NavLink>
          );
        })}
      </nav>

      <div className="border-t border-slate-800 p-4">
        <p className="text-xs text-slate-500">
          Desenvolvido por
        </p>

        <p className="mt-1 text-sm font-medium text-slate-300">
          Rodrigo Martins
        </p>
      </div>
    </aside>
  );
}
import {
  RefreshCw,
  Search,
  UserPlus,
} from "lucide-react";
import {
  useMemo,
  useState,
} from "react";

import { CreateUserModal } from "../components/CreateUserModal";
import { UsersTable } from "../components/UsersTable";
import { useAuth } from "../contexts/AuthContext";
import { useUsers } from "../hooks/useUsers";
import type { UserRole } from "../types/user";

export function UsersPage() {
  const { user } = useAuth();
  const usersQuery = useUsers();

  const [search, setSearch] = useState("");
  const [role, setRole] =
    useState<UserRole | "">("");
  const [status, setStatus] =
    useState<"ATIVO" | "INATIVO" | "">("");
  const [isModalOpen, setIsModalOpen] =
    useState(false);

  const users = usersQuery.data?.users ?? [];

  const filteredUsers = useMemo(() => {
    const normalizedSearch =
      search.trim().toLowerCase();

    return users.filter((listedUser) => {
      const matchesSearch =
        !normalizedSearch ||
        listedUser.name
          .toLowerCase()
          .includes(normalizedSearch) ||
        listedUser.email
          .toLowerCase()
          .includes(normalizedSearch);

      const matchesRole =
        !role || listedUser.role === role;

      const matchesStatus =
        !status ||
        (status === "ATIVO"
          ? listedUser.active
          : !listedUser.active);

      return (
        matchesSearch &&
        matchesRole &&
        matchesStatus
      );
    });
  }, [role, search, status, users]);

  if (user?.role !== "ADMIN") {
    return (
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-amber-800">
        <h2 className="font-bold">
          Acesso restrito
        </h2>

        <p className="mt-2 text-sm">
          Somente administradores podem acessar a
          gestão de usuários.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        <section className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              Usuários
            </h2>

            <p className="mt-1 text-slate-500">
              Gerencie acessos, perfis e status dos
              usuários.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="flex h-11 items-center justify-center gap-2 rounded-xl btn-primary px-5 font-semibold text-white transition hover:bg-blue-700"
          >
            <UserPlus size={19} />
            Novo usuário
          </button>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <label
                htmlFor="users-search"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Pesquisar
              </label>

              <div className="relative">
                <Search
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  id="users-search"
                  value={search}
                  onChange={(event) =>
                    setSearch(event.target.value)
                  }
                  placeholder="Nome ou e-mail"
                  className="h-11 w-full rounded-xl border border-slate-300 pl-10 pr-3 outline-none transition focus-primary focus:ring-4 focus:ring-blue-100"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="users-role"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Perfil
              </label>

              <select
                id="users-role"
                value={role}
                onChange={(event) =>
                  setRole(
                    event.target.value as
                      | UserRole
                      | "",
                  )
                }
                className="h-11 w-full rounded-xl border border-slate-300 bg-white px-3 outline-none focus-primary focus:ring-4 focus:ring-blue-100"
              >
                <option value="">Todos</option>
                <option value="ADMIN">
                  Administradores
                </option>
                <option value="TECNICO">
                  Técnicos
                </option>
                <option value="SOLICITANTE">
                  Solicitantes
                </option>
              </select>
            </div>

            <div>
              <label
                htmlFor="users-status"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Status
              </label>

              <select
                id="users-status"
                value={status}
                onChange={(event) =>
                  setStatus(
                    event.target.value as
                      | "ATIVO"
                      | "INATIVO"
                      | "",
                  )
                }
                className="h-11 w-full rounded-xl border border-slate-300 bg-white px-3 outline-none focus-primary focus:ring-4 focus:ring-blue-100"
              >
                <option value="">Todos</option>
                <option value="ATIVO">Ativos</option>
                <option value="INATIVO">
                  Inativos
                </option>
              </select>
            </div>
          </div>
        </section>

        {usersQuery.isError ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-red-700">
            <p className="font-medium">
              Não foi possível carregar os usuários.
            </p>

            <button
              type="button"
              onClick={() => usersQuery.refetch()}
              className="mt-3 inline-flex items-center gap-2 rounded-xl border border-red-300 px-4 py-2 text-sm font-semibold hover:bg-red-100"
            >
              <RefreshCw size={16} />
              Tentar novamente
            </button>
          </div>
        ) : (
          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <header className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
              <div>
                <h3 className="font-bold text-slate-900">
                  Lista de usuários
                </h3>

                <p className="text-sm text-slate-500">
                  {usersQuery.isLoading
                    ? "Carregando..."
                    : `${filteredUsers.length} usuário${
                        filteredUsers.length === 1
                          ? ""
                          : "s"
                      } encontrado${
                        filteredUsers.length === 1
                          ? ""
                          : "s"
                      }`}
                </p>
              </div>

              {usersQuery.isFetching &&
                !usersQuery.isLoading && (
                  <RefreshCw
                    size={18}
                    className="animate-spin text-blue-600"
                  />
                )}
            </header>

            {usersQuery.isLoading ? (
              <div className="flex min-h-72 items-center justify-center text-slate-500">
                Carregando usuários...
              </div>
            ) : (
              <UsersTable users={filteredUsers} />
            )}
          </section>
        )}
      </div>

      <CreateUserModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
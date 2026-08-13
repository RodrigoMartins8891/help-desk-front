import { AxiosError } from "axios";
import {
  Power,
  PowerOff,
  Shield,
  UserCog,
  UserRound,
} from "lucide-react";
import { useState } from "react";

import { useAuth } from "../contexts/AuthContext";
import { useUpdateUserStatus } from "../hooks/useUpdateUserStatus";
import type {
  SystemUser,
  UserRole,
} from "../types/user";

type UsersTableProps = {
  users: SystemUser[];
};

type ApiErrorResponse = {
  message?: string;
};

const roleStyles: Record<UserRole, string> = {
  ADMIN:
    "bg-purple-100 text-purple-700",
  TECNICO:
    "bg-blue-100 text-blue-700",
  SOLICITANTE:
    "bg-slate-100 text-slate-700",
};

function formatRole(role: UserRole) {
  const labels: Record<UserRole, string> = {
    ADMIN: "Administrador",
    TECNICO: "Técnico",
    SOLICITANTE: "Solicitante",
  };

  return labels[role];
}

function RoleIcon({
  role,
}: {
  role: UserRole;
}) {
  if (role === "ADMIN") {
    return <Shield size={15} />;
  }

  if (role === "TECNICO") {
    return <UserCog size={15} />;
  }

  return <UserRound size={15} />;
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
  }).format(new Date(date));
}

export function UsersTable({
  users,
}: UsersTableProps) {
  const { user: authenticatedUser } = useAuth();
  const mutation = useUpdateUserStatus();

  const [updatingUserId, setUpdatingUserId] =
    useState<number | null>(null);
  const [error, setError] = useState("");

  async function handleToggleStatus(
    selectedUser: SystemUser,
  ) {
    setError("");
    setUpdatingUserId(selectedUser.id);

    try {
      await mutation.mutateAsync({
        userId: selectedUser.id,
        active: !selectedUser.active,
      });
    } catch (requestError) {
      const axiosError =
        requestError as AxiosError<ApiErrorResponse>;

      setError(
        axiosError.response?.data?.message ??
          "Não foi possível alterar o usuário.",
      );
    } finally {
      setUpdatingUserId(null);
    }
  }

  return (
    <>
      {error && (
        <div className="border-b border-red-200 bg-red-50 px-5 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-slate-50">
            <tr className="text-left text-xs uppercase tracking-wide text-slate-500">
              <th className="px-5 py-4">Usuário</th>
              <th className="px-5 py-4">Perfil</th>
              <th className="px-5 py-4">Status</th>
              <th className="px-5 py-4">Cadastro</th>
              <th className="px-5 py-4 text-right">
                Ações
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {users.map((listedUser) => {
              const isOwnUser =
                listedUser.id ===
                authenticatedUser?.id;

              const isUpdating =
                updatingUserId === listedUser.id;

              return (
                <tr
                  key={listedUser.id}
                  className="text-sm text-slate-700 transition hover:bg-slate-50"
                >
                  <td className="px-5 py-4">
                    <p className="font-semibold text-slate-900">
                      {listedUser.name}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      {listedUser.email}
                    </p>
                  </td>

                  <td className="whitespace-nowrap px-5 py-4">
                    <span
                      className={[
                        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold",
                        roleStyles[listedUser.role],
                      ].join(" ")}
                    >
                      <RoleIcon
                        role={listedUser.role}
                      />

                      {formatRole(listedUser.role)}
                    </span>
                  </td>

                  <td className="whitespace-nowrap px-5 py-4">
                    <span
                      className={[
                        "inline-flex rounded-full px-2.5 py-1 text-xs font-semibold",
                        listedUser.active
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-red-100 text-red-700",
                      ].join(" ")}
                    >
                      {listedUser.active
                        ? "Ativo"
                        : "Inativo"}
                    </span>
                  </td>

                  <td className="whitespace-nowrap px-5 py-4 text-slate-500">
                    {formatDate(
                      listedUser.createdAt,
                    )}
                  </td>

                  <td className="whitespace-nowrap px-5 py-4 text-right">
                    <button
                      type="button"
                      onClick={() =>
                        handleToggleStatus(listedUser)
                      }
                      disabled={
                        isOwnUser ||
                        isUpdating ||
                        authenticatedUser?.role !==
                          "ADMIN"
                      }
                      title={
                        isOwnUser
                          ? "Você não pode alterar seu próprio status"
                          : listedUser.active
                            ? "Inativar usuário"
                            : "Ativar usuário"
                      }
                      className={[
                        "inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-semibold transition disabled:cursor-not-allowed disabled:opacity-40",
                        listedUser.active
                          ? "border-red-200 text-red-600 hover:bg-red-50"
                          : "border-emerald-200 text-emerald-600 hover:bg-emerald-50",
                      ].join(" ")}
                    >
                      {listedUser.active ? (
                        <PowerOff size={16} />
                      ) : (
                        <Power size={16} />
                      )}

                      {isUpdating
                        ? "Salvando..."
                        : listedUser.active
                          ? "Inativar"
                          : "Ativar"}
                    </button>
                  </td>
                </tr>
              );
            })}

            {users.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="px-5 py-14 text-center text-slate-500"
                >
                  Nenhum usuário encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
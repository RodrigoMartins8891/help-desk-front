import { AxiosError } from "axios";
import {
  LoaderCircle,
  UserPlus,
  X,
} from "lucide-react";
import {
  type FormEvent,
  useEffect,
  useState,
} from "react";

import { useCreateUser } from "../hooks/useCreateUser";
import type { UserRole } from "../types/user";

type CreateUserModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

type ApiErrorResponse = {
  message?: string;
  errors?: Record<string, string[]>;
};

export function CreateUserModal({
  isOpen,
  onClose,
}: CreateUserModalProps) {
  const mutation = useCreateUser();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] =
    useState("");
  const [role, setRole] =
    useState<UserRole>("SOLICITANTE");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function handleEscape(event: KeyboardEvent) {
      if (
        event.key === "Escape" &&
        !mutation.isPending
      ) {
        handleClose();
      }
    }

    document.addEventListener(
      "keydown",
      handleEscape,
    );

    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener(
        "keydown",
        handleEscape,
      );

      document.body.style.overflow = "";
    };
  }, [isOpen, mutation.isPending]);

  function resetForm() {
    setName("");
    setEmail("");
    setPassword("");
    setRole("SOLICITANTE");
    setError("");
  }

  function handleClose() {
    if (mutation.isPending) {
      return;
    }

    resetForm();
    onClose();
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();
    setError("");

    try {
      await mutation.mutateAsync({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
        role,
      });

      resetForm();
      onClose();
    } catch (requestError) {
      const axiosError =
        requestError as AxiosError<ApiErrorResponse>;

      const fieldErrors =
        axiosError.response?.data?.errors;

      const firstFieldError = fieldErrors
        ? Object.values(fieldErrors)
            .flat()
            .find(Boolean)
        : undefined;

      setError(
        firstFieldError ??
          axiosError.response?.data?.message ??
          "Não foi possível cadastrar o usuário.",
      );
    }
  }

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          handleClose();
        }
      }}
    >
      <section className="w-full max-w-xl rounded-3xl bg-white shadow-2xl">
        <header className="flex items-start justify-between border-b border-slate-200 p-6">
          <div>
            <div className="flex items-center gap-2">
              <UserPlus className="text-blue-600" />

              <h2 className="text-2xl font-bold text-slate-900">
                Novo usuário
              </h2>
            </div>

            <p className="mt-2 text-sm text-slate-500">
              Cadastre um novo acesso ao Help Desk.
            </p>
          </div>

          <button
            type="button"
            onClick={handleClose}
            disabled={mutation.isPending}
            className="rounded-xl p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
          >
            <X size={22} />
          </button>
        </header>

        <form
          onSubmit={handleSubmit}
          className="space-y-5 p-6"
        >
          <div>
            <label
              htmlFor="user-name"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Nome
            </label>

            <input
              id="user-name"
              value={name}
              onChange={(event) =>
                setName(event.target.value)
              }
              minLength={3}
              required
              autoFocus
              placeholder="Nome completo"
              className="h-12 w-full rounded-xl border border-slate-300 px-4 outline-none transition focus-primary focus:ring-4 focus:ring-blue-100"
            />
          </div>

          <div>
            <label
              htmlFor="user-email"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              E-mail
            </label>

            <input
              id="user-email"
              type="email"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
              required
              placeholder="usuario@empresa.com"
              className="h-12 w-full rounded-xl border border-slate-300 px-4 outline-none transition focus-primary focus:ring-4 focus:ring-blue-100"
            />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label
                htmlFor="user-password"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Senha
              </label>

              <input
                id="user-password"
                type="password"
                value={password}
                onChange={(event) =>
                  setPassword(event.target.value)
                }
                minLength={6}
                required
                placeholder="Mínimo 6 caracteres"
                className="h-12 w-full rounded-xl border border-slate-300 px-4 outline-none transition focus-primary focus:ring-4 focus:ring-blue-100"
              />
            </div>

            <div>
              <label
                htmlFor="user-role"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Perfil
              </label>

              <select
                id="user-role"
                value={role}
                onChange={(event) =>
                  setRole(
                    event.target.value as UserRole,
                  )
                }
                className="h-12 w-full rounded-xl border border-slate-300 bg-white px-4 outline-none transition focus-primary focus:ring-4 focus:ring-blue-100"
              >
                <option value="SOLICITANTE">
                  Solicitante
                </option>

                <option value="TECNICO">
                  Técnico
                </option>

                <option value="ADMIN">
                  Administrador
                </option>
              </select>
            </div>
          </div>

          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <footer className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={handleClose}
              disabled={mutation.isPending}
              className="h-11 rounded-xl border border-slate-300 px-5 font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={mutation.isPending}
              className="flex h-11 items-center justify-center gap-2 rounded-xl btn-primary px-5 font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60"
            >
              {mutation.isPending && (
                <LoaderCircle
                  size={18}
                  className="animate-spin"
                />
              )}

              {mutation.isPending
                ? "Cadastrando..."
                : "Cadastrar usuário"}
            </button>
          </footer>
        </form>
      </section>
    </div>
  );
}
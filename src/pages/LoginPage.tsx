import { AxiosError } from "axios";
import {
  Headphones,
  LoaderCircle,
  LockKeyhole,
  Mail,
} from "lucide-react";
import {
  type FormEvent,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../contexts/AuthContext";

type ApiErrorResponse = {
  message?: string;
};

export function LoginPage() {
  const navigate = useNavigate();
  const { signIn } = useAuth();

  const [email, setEmail] = useState("rodrigo@email.com");
  const [password, setPassword] = useState("123456");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setIsSubmitting(true);

    try {
      await signIn({
        email,
        password,
      });

      navigate("/dashboard");
    } catch (requestError) {
      const axiosError =
        requestError as AxiosError<ApiErrorResponse>;

      setError(
        axiosError.response?.data?.message ??
          "Não foi possível realizar o login.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="flex min-h-screen bg-slate-100">
      <section className="hidden w-1/2 flex-col justify-between bg-slate-950 p-12 text-white lg:flex">
        <div className="flex items-center gap-3">
          <div className="rounded-xl btn-primary p-3">
            <Headphones size={26} />
          </div>

          <div>
            <strong className="text-xl">Help Desk</strong>
            <p className="text-sm text-slate-400">
              Gestão de chamados e SLA
            </p>
          </div>
        </div>

        <div className="max-w-lg">
          <span className="mb-5 inline-flex rounded-full bg-blue-500/10 px-4 py-2 text-sm text-blue-300">
            Suporte organizado e eficiente
          </span>

          <h1 className="text-5xl font-bold leading-tight">
            Controle todo o atendimento em um único lugar.
          </h1>

          <p className="mt-6 text-lg leading-8 text-slate-400">
            Gerencie chamados, acompanhe SLAs, registre históricos
            e melhore a produtividade da equipe técnica.
          </p>
        </div>

        <p className="text-sm text-slate-500">
          Sistema desenvolvido por Rodrigo Martins
        </p>
      </section>

      <section className="flex w-full items-center justify-center p-6 lg:w-1/2">
        <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/70">
          <div className="mb-8">
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl btn-primary text-white lg:hidden">
              <Headphones size={28} />
            </div>

            <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
              Bem-vindo
            </p>

            <h2 className="mt-2 text-3xl font-bold text-slate-900">
              Entre na sua conta
            </h2>

            <p className="mt-2 text-slate-500">
              Informe suas credenciais para acessar o sistema.
            </p>
          </div>

          <form
            className="space-y-5"
            onSubmit={handleSubmit}
          >
            <div>
              <label
                className="mb-2 block text-sm font-medium text-slate-700"
                htmlFor="email"
              >
                E-mail
              </label>

              <div className="relative">
                <Mail
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  size={19}
                />

                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(event) =>
                    setEmail(event.target.value)
                  }
                  className="h-12 w-full rounded-xl border border-slate-300 bg-white pl-12 pr-4 outline-none transition focus-primary focus:ring-4 focus:ring-blue-100"
                  placeholder="seu@email.com"
                  required
                />
              </div>
            </div>

            <div>
              <label
                className="mb-2 block text-sm font-medium text-slate-700"
                htmlFor="password"
              >
                Senha
              </label>

              <div className="relative">
                <LockKeyhole
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  size={19}
                />

                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(event) =>
                    setPassword(event.target.value)
                  }
                  className="h-12 w-full rounded-xl border border-slate-300 bg-white pl-12 pr-4 outline-none transition focus-primary focus:ring-4 focus:ring-blue-100"
                  placeholder="Digite sua senha"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-xl btn-primary font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting && (
                <LoaderCircle
                  className="animate-spin"
                  size={19}
                />
              )}

              {isSubmitting ? "Entrando..." : "Entrar"}
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
import { AxiosError } from "axios";
import {
  Building2,
  LoaderCircle,
  Palette,
  Save,
  Settings,
  Clock3,
  Mail,
} from "lucide-react";

import {
  type FormEvent,
  useEffect,
  useState,
} from "react";

import {
  useSendTestEmail,
  useSettings,
  useTestSmtpConnection,
  useUpdateSettings,
} from "../hooks/useSettings";

import type {
  ThemeMode,
  UpdateSettingsInput,
} from "../types/settings";

type ApiError = {
  message?: string;
};

function darkenHexColor(
  hex: string,
  amount = 25,
) {
  const normalized = hex.replace("#", "");

  const number = Number.parseInt(
    normalized,
    16,
  );

  const red = Math.max(
    0,
    (number >> 16) - amount,
  );

  const green = Math.max(
    0,
    ((number >> 8) & 0x00ff) - amount,
  );

  const blue = Math.max(
    0,
    (number & 0x0000ff) - amount,
  );

  return `#${[red, green, blue]
    .map((value) =>
      value.toString(16).padStart(2, "0"),
    )
    .join("")}`;
}

type SlaPriorityCardProps = {
  title: string;
  color: string;
  firstResponse: number;
  resolution: number;
  onFirstResponseChange: (value: number) => void;
  onResolutionChange: (value: number) => void;
};

function SlaPriorityCard({
  title,
  color,
  firstResponse,
  resolution,
  onFirstResponseChange,
  onResolutionChange,
}: SlaPriorityCardProps) {
  return (
    <div
      className={`rounded-2xl border-t-4 bg-slate-50 p-5 ${color}`}
    >
      <h3 className="mb-4 font-bold text-slate-900">
        {title}
      </h3>

      <div className="space-y-4">
        <div>
          <label className="mb-2 block text-sm text-slate-600">
            Primeira resposta
          </label>

          <div className="flex items-center gap-2">
            <input
              type="number"
              min={1}
              value={firstResponse}
              onChange={(event) =>
                onFirstResponseChange(
                  Number(event.target.value),
                )
              }
              className="focus-primary h-11 min-w-0 flex-1 rounded-xl border border-slate-300 bg-white px-3 outline-none"
            />

            <span className="text-sm text-slate-500">
              min
            </span>
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm text-slate-600">
            Resolução
          </label>

          <div className="flex items-center gap-2">
            <input
              type="number"
              min={1}
              value={resolution}
              onChange={(event) =>
                onResolutionChange(
                  Number(event.target.value),
                )
              }
              className="focus-primary h-11 min-w-0 flex-1 rounded-xl border border-slate-300 bg-white px-3 outline-none"
            />

            <span className="text-sm text-slate-500">
              min
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function SettingsPage() {
  const settingsQuery = useSettings();
  const updateMutation = useUpdateSettings();
  const testSmtpMutation = useTestSmtpConnection();
  const sendTestEmailMutation = useSendTestEmail();

  const [form, setForm] =
    useState<UpdateSettingsInput>({});

  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [testEmail, setTestEmail] = useState("");

  useEffect(() => {
    if (!settingsQuery.data) {
      return;
    }

    const settings = settingsQuery.data;

    setForm({
      companyName: settings.companyName,
      systemName: settings.systemName,
      logoUrl: settings.logoUrl,

      theme: settings.theme,
      primaryColor: settings.primaryColor,
      language: settings.language,
      timezone: settings.timezone,

      lowFirstResponseMinutes:
        settings.lowFirstResponseMinutes,
      lowResolutionMinutes:
        settings.lowResolutionMinutes,

      mediumFirstResponseMinutes:
        settings.mediumFirstResponseMinutes,
      mediumResolutionMinutes:
        settings.mediumResolutionMinutes,

      highFirstResponseMinutes:
        settings.highFirstResponseMinutes,
      highResolutionMinutes:
        settings.highResolutionMinutes,

      criticalFirstResponseMinutes:
        settings.criticalFirstResponseMinutes,
      criticalResolutionMinutes:
        settings.criticalResolutionMinutes,

      smtpHost: settings.smtpHost,
      smtpPort: settings.smtpPort,
      smtpUser: settings.smtpUser,
      smtpFrom: settings.smtpFrom,
    });

    const root = document.documentElement;

    root.style.setProperty(
      "--primary-color",
      settings.primaryColor,
    );

    root.style.setProperty(
      "--primary-color-hover",
      darkenHexColor(settings.primaryColor),
    );

    const selectedTheme =
      settings.theme === "system"
        ? window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light"
        : settings.theme;

    root.classList.toggle(
      "dark",
      selectedTheme === "dark",
    );
  }, [settingsQuery.data]);



  function updateField<
    K extends keyof UpdateSettingsInput,
  >(
    field: K,
    value: UpdateSettingsInput[K],
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setSuccess("");
    setError("");

    try {
      const response =
        await updateMutation.mutateAsync(form);

      const updatedSettings = response.settings;

      document.documentElement.style.setProperty(
        "--primary-color",
        updatedSettings.primaryColor,
      );

      const selectedTheme =
        updatedSettings.theme === "system"
          ? window.matchMedia("(prefers-color-scheme: dark)").matches
            ? "dark"
            : "light"
          : updatedSettings.theme;

      document.documentElement.classList.toggle(
        "dark",
        selectedTheme === "dark",
      );



      setSuccess(response.message);
    } catch (requestError) {
      const axiosError =
        requestError as AxiosError<ApiError>;

      setError(
        axiosError.response?.data?.message ??
        "Não foi possível salvar as configurações.",
      );
    }
  }

  if (settingsQuery.isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <LoaderCircle className="animate-spin text-blue-600" />
        <span className="ml-3 text-slate-500">
          Carregando configurações...
        </span>
      </div>
    );
  }

  if (settingsQuery.isError) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">
        Não foi possível carregar as configurações.
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      <header>
        <div className="flex items-center gap-3">
          <Settings className="text-primary" />

          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              Configurações
            </h1>

            <p className="mt-1 text-slate-500">
              Personalize o Help Desk e suas regras.
            </p>
          </div>
        </div>
      </header>

      {/* EMPRESA */}

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center gap-3">
          <div className="rounded-xl bg-blue-100 p-2 text-blue-600">
            <Building2 size={21} />
          </div>

          <div>
            <h2 className="font-bold text-slate-900">
              Geral
            </h2>

            <p className="text-sm text-slate-500">
              Identificação da empresa e do sistema.
            </p>
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Nome da empresa
            </label>

            <input
              value={form.companyName ?? ""}
              onChange={(event) =>
                updateField(
                  "companyName",
                  event.target.value,
                )
              }
              required
              className="h-11 w-full rounded-xl border border-slate-300 px-4 outline-none transition focus-primary focus:ring-4 focus:ring-blue-100"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Nome do sistema
            </label>

            <input
              value={form.systemName ?? ""}
              onChange={(event) =>
                updateField(
                  "systemName",
                  event.target.value,
                )
              }
              required
              className="h-11 w-full rounded-xl border border-slate-300 px-4 outline-none transition focus-primary focus:ring-4 focus:ring-blue-100"
            />
          </div>

          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-medium text-slate-700">
              URL do logo
            </label>

            <input
              type="url"
              value={form.logoUrl ?? ""}
              onChange={(event) =>
                updateField(
                  "logoUrl",
                  event.target.value || null,
                )
              }
              placeholder="https://..."
              className="h-11 w-full rounded-xl border border-slate-300 px-4 outline-none transition focus-primary focus:ring-4 focus:ring-blue-100"
            />
          </div>
        </div>
      </section>

      {/* APARÊNCIA */}

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center gap-3">
          <div className="rounded-xl bg-purple-100 p-2 text-purple-600">
            <Palette size={21} />
          </div>

          <div>
            <h2 className="font-bold text-slate-900">
              Aparência e localização
            </h2>

            <p className="text-sm text-slate-500">
              Tema, cor e preferências regionais.
            </p>
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Tema
            </label>

            <select
              value={form.theme ?? "light"}
              onChange={(event) =>
                updateField(
                  "theme",
                  event.target.value as ThemeMode,
                )
              }
              className="h-11 w-full rounded-xl border border-slate-300 bg-white px-4 outline-none focus-primary focus:ring-4 focus:ring-blue-100"
            >
              <option value="light">Claro</option>
              <option value="dark">Escuro</option>
              <option value="system">
                Sistema
              </option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Cor principal
            </label>

            <div className="flex gap-2">
              <input
                type="color"
                value={
                  form.primaryColor ?? "#2563eb"
                }
                onChange={(event) =>
                  updateField(
                    "primaryColor",
                    event.target.value,
                  )
                }
                className="h-11 w-14 cursor-pointer rounded-xl border border-slate-300 bg-white p-1"
              />

              <input
                value={
                  form.primaryColor ?? "#2563eb"
                }
                onChange={(event) =>
                  updateField(
                    "primaryColor",
                    event.target.value,
                  )
                }
                className="h-11 min-w-0 flex-1 rounded-xl border border-slate-300 px-3 outline-none focus-primary"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Idioma
            </label>

            <select
              value={form.language ?? "pt-BR"}
              onChange={(event) =>
                updateField(
                  "language",
                  event.target.value,
                )
              }
              className="h-11 w-full rounded-xl border border-slate-300 bg-white px-4"
            >
              <option value="pt-BR">
                Português (Brasil)
              </option>

              <option value="en-US">
                English
              </option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Fuso horário
            </label>

            <select
              value={
                form.timezone ??
                "America/Sao_Paulo"
              }
              onChange={(event) =>
                updateField(
                  "timezone",
                  event.target.value,
                )
              }
              className="h-11 w-full rounded-xl border border-slate-300 bg-white px-4"
            >
              <option value="America/Sao_Paulo">
                Brasília
              </option>

              <option value="America/Manaus">
                Manaus
              </option>

              <option value="America/Rio_Branco">
                Rio Branco
              </option>

              <option value="UTC">
                UTC
              </option>
            </select>
          </div>
        </div>
      </section>
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center gap-3">
          <div className="rounded-xl bg-amber-100 p-2 text-amber-600">
            <Clock3 size={21} />
          </div>

          <div>
            <h2 className="font-bold text-slate-900">
              SLA
            </h2>

            <p className="text-sm text-slate-500">
              Defina os prazos de atendimento por prioridade.
            </p>
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          <SlaPriorityCard
            title="Baixa"
            color="border-slate-300"
            firstResponse={form.lowFirstResponseMinutes ?? 480}
            resolution={form.lowResolutionMinutes ?? 4320}
            onFirstResponseChange={(value) =>
              updateField("lowFirstResponseMinutes", value)
            }
            onResolutionChange={(value) =>
              updateField("lowResolutionMinutes", value)
            }
          />

          <SlaPriorityCard
            title="Média"
            color="border-blue-300"
            firstResponse={form.mediumFirstResponseMinutes ?? 240}
            resolution={form.mediumResolutionMinutes ?? 2880}
            onFirstResponseChange={(value) =>
              updateField("mediumFirstResponseMinutes", value)
            }
            onResolutionChange={(value) =>
              updateField("mediumResolutionMinutes", value)
            }
          />

          <SlaPriorityCard
            title="Alta"
            color="border-orange-300"
            firstResponse={form.highFirstResponseMinutes ?? 60}
            resolution={form.highResolutionMinutes ?? 720}
            onFirstResponseChange={(value) =>
              updateField("highFirstResponseMinutes", value)
            }
            onResolutionChange={(value) =>
              updateField("highResolutionMinutes", value)
            }
          />

          <SlaPriorityCard
            title="Crítica"
            color="border-red-300"
            firstResponse={form.criticalFirstResponseMinutes ?? 15}
            resolution={form.criticalResolutionMinutes ?? 240}
            onFirstResponseChange={(value) =>
              updateField("criticalFirstResponseMinutes", value)
            }
            onResolutionChange={(value) =>
              updateField("criticalResolutionMinutes", value)
            }
          />
        </div>
      </section>

      {/* E-MAIL / SMTP */}

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center gap-3">
          <div className="rounded-xl bg-emerald-100 p-2 text-emerald-600">
            <Mail size={21} />
          </div>

          <div>
            <h2 className="font-bold text-slate-900">
              E-mail / SMTP
            </h2>

            <p className="text-sm text-slate-500">
              Configure o servidor utilizado para envio de e-mails.
            </p>
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Servidor SMTP
            </label>

            <input
              value={form.smtpHost ?? ""}
              onChange={(event) =>
                updateField(
                  "smtpHost",
                  event.target.value || null,
                )
              }
              placeholder="smtp.gmail.com"
              className="focus-primary h-11 w-full rounded-xl border border-slate-300 bg-white px-4 outline-none transition"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Porta
            </label>

            <input
              type="number"
              min={1}
              max={65535}
              value={form.smtpPort ?? ""}
              onChange={(event) =>
                updateField(
                  "smtpPort",
                  event.target.value
                    ? Number(event.target.value)
                    : null,
                )
              }
              placeholder="587"
              className="focus-primary h-11 w-full rounded-xl border border-slate-300 bg-white px-4 outline-none transition"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Usuário SMTP
            </label>

            <input
              value={form.smtpUser ?? ""}
              onChange={(event) =>
                updateField(
                  "smtpUser",
                  event.target.value || null,
                )
              }
              placeholder="suporte@empresa.com"
              className="focus-primary h-11 w-full rounded-xl border border-slate-300 bg-white px-4 outline-none transition"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              E-mail remetente
            </label>

            <input
              type="email"
              value={form.smtpFrom ?? ""}
              onChange={(event) =>
                updateField(
                  "smtpFrom",
                  event.target.value || null,
                )
              }
              placeholder="suporte@empresa.com"
              className="focus-primary h-11 w-full rounded-xl border border-slate-300 bg-white px-4 outline-none transition"
            />
          </div>

          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Senha SMTP
            </label>

            <input
              type="password"
              value={form.smtpPassword ?? ""}
              onChange={(event) =>
                updateField(
                  "smtpPassword",
                  event.target.value || null,
                )
              }
              placeholder={
                settingsQuery.data?.smtpPasswordConfigured
                  ? "Senha já configurada — digite somente para alterar"
                  : "Digite a senha SMTP"
              }
              className="focus-primary h-11 w-full rounded-xl border border-slate-300 bg-white px-4 outline-none transition"
            />

            {settingsQuery.data?.smtpPasswordConfigured && (
              <p className="mt-2 text-sm text-emerald-600">
                ✓ Senha SMTP já configurada.
              </p>
            )}
          </div>

          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
            <button
              type="button"
              onClick={async () => {
                setSuccess("");
                setError("");

                try {
                  const response =
                    await testSmtpMutation.mutateAsync();

                  setSuccess(response.message);
                } catch (requestError) {
                  const axiosError =
                    requestError as AxiosError<ApiError>;

                  setError(
                    axiosError.response?.data?.message ??
                    "Não foi possível testar a conexão SMTP.",
                  );
                }
              }}
              disabled={testSmtpMutation.isPending}
              className="btn-primary inline-flex h-11 items-center justify-center gap-2 rounded-xl px-5 font-semibold transition disabled:opacity-60"
            >
              {testSmtpMutation.isPending ? (
                <LoaderCircle
                  size={18}
                  className="animate-spin"
                />
              ) : (
                <Mail size={18} />
              )}

              {testSmtpMutation.isPending
                ? "Testando..."
                : "Testar conexão SMTP"}
            </button>

            {settingsQuery.data?.smtpPasswordConfigured && (
              <span className="text-sm text-slate-500">
                A conexão será testada com as credenciais já salvas.
              </span>
            )}
          </div>

        </div>

        <div className="mt-6 border-t border-slate-200 pt-6">
          <label className="mb-2 block text-sm font-medium text-slate-700">
            E-mail para teste
          </label>

          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              type="email"
              value={testEmail}
              onChange={(event) =>
                setTestEmail(event.target.value)
              }
              placeholder="email@exemplo.com"
              className="focus-primary h-11 min-w-0 flex-1 rounded-xl border border-slate-300 bg-white px-4 outline-none transition"
            />

            <button
              type="button"
              disabled={
                sendTestEmailMutation.isPending ||
                !testEmail.trim()
              }
              onClick={async () => {
                setSuccess("");
                setError("");

                try {
                  const response =
                    await sendTestEmailMutation.mutateAsync(
                      testEmail.trim(),
                    );

                  setSuccess(response.message);
                } catch (requestError) {
                  const axiosError =
                    requestError as AxiosError<ApiError>;

                  setError(
                    axiosError.response?.data?.message ??
                    "Não foi possível enviar o e-mail de teste.",
                  );
                }
              }}
              className="btn-primary inline-flex h-11 items-center justify-center gap-2 rounded-xl px-5 font-semibold transition disabled:cursor-not-allowed disabled:opacity-60"
            >
              {sendTestEmailMutation.isPending ? (
                <LoaderCircle
                  size={18}
                  className="animate-spin"
                />
              ) : (
                <Mail size={18} />
              )}

              {sendTestEmailMutation.isPending
                ? "Enviando..."
                : "Enviar e-mail de teste"}
            </button>
          </div>

          <p className="mt-2 text-sm text-slate-500">
            Envia uma mensagem para confirmar que o SMTP está funcionando.
          </p>
        </div>
      </section>
      {success && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-emerald-700">
          {success}
        </div>
      )}

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-700">
          {error}
        </div>
      )}

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={updateMutation.isPending}
          className="btn-primary inline-flex h-12 items-center gap-2 rounded-xl px-6 font-semibold transition disabled:opacity-60"
        >
          {updateMutation.isPending ? (
            <LoaderCircle
              size={18}
              className="animate-spin"
            />
          ) : (
            <Save size={18} />
          )}

          {updateMutation.isPending
            ? "Salvando..."
            : "Salvar alterações"}
        </button>
      </div>
    </form>
  );
}



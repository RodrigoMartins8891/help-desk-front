import { AxiosError } from "axios";
import {
  LoaderCircle,
  Save,
  UserCog,
  Workflow,
} from "lucide-react";
import {
  useEffect,
  useState,
} from "react";

import { useAssignTechnician } from "../hooks/useAssignTechnician";
import { useTechnicians } from "../hooks/useTechnicians";
import {
  type TicketStatus,
  useUpdateTicketStatus,
} from "../hooks/useUpdateTicketStatus";

type TicketActionsProps = {
  ticketId: number;
  currentTechnicianId: number | null;
  currentStatus:
    | "ABERTO"
    | "EM_ANALISE"
    | "EM_ATENDIMENTO"
    | "AGUARDANDO_CLIENTE"
    | "RESOLVIDO"
    | "FECHADO"
    | "CANCELADO";
};

type ApiErrorResponse = {
  message?: string;
};

const allowedStatuses: TicketStatus[] = [
  "EM_ANALISE",
  "EM_ATENDIMENTO",
  "AGUARDANDO_CLIENTE",
  "RESOLVIDO",
  "FECHADO",
  "CANCELADO",
];

function formatStatus(status: string) {
  return status.replaceAll("_", " ");
}

export function TicketActions({
  ticketId,
  currentTechnicianId,
  currentStatus,
}: TicketActionsProps) {
  const techniciansQuery = useTechnicians();
  const assignTechnicianMutation =
    useAssignTechnician();
  const updateStatusMutation =
    useUpdateTicketStatus();

  const [technicianId, setTechnicianId] =
    useState<string>(
      currentTechnicianId
        ? String(currentTechnicianId)
        : "",
    );

  const [status, setStatus] =
    useState<string>(currentStatus);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    setTechnicianId(
      currentTechnicianId
        ? String(currentTechnicianId)
        : "",
    );
  }, [currentTechnicianId]);

  useEffect(() => {
    setStatus(currentStatus);
  }, [currentStatus]);

  const technicianChanged =
    technicianId !== "" &&
    Number(technicianId) !== currentTechnicianId;

  const statusChanged =
    status !== currentStatus;

  const hasChanges =
    technicianChanged || statusChanged;

  const isSaving =
    assignTechnicianMutation.isPending ||
    updateStatusMutation.isPending;

  async function handleSave() {
    setMessage("");
    setError("");

    try {
      if (technicianChanged) {
        await assignTechnicianMutation.mutateAsync({
          ticketId,
          technicianId: Number(technicianId),
        });
      }

      if (statusChanged) {
        await updateStatusMutation.mutateAsync({
          ticketId,
          status: status as TicketStatus,
        });
      }

      setMessage("Alterações salvas com sucesso.");
    } catch (requestError) {
      const axiosError =
        requestError as AxiosError<ApiErrorResponse>;

      setError(
        axiosError.response?.data?.message ??
          "Não foi possível salvar as alterações.",
      );
    }
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <header className="border-b border-slate-200 p-5">
        <h3 className="font-bold text-slate-900">
          Painel de atendimento
        </h3>

        <p className="mt-1 text-sm text-slate-500">
          Atualize o técnico responsável e o status do chamado.
        </p>
      </header>

      <div className="space-y-5 p-5">
        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label
              htmlFor="ticket-technician"
              className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700"
            >
              <UserCog size={17} />
              Técnico responsável
            </label>

            <select
              id="ticket-technician"
              value={technicianId}
              onChange={(event) =>
                setTechnicianId(event.target.value)
              }
              disabled={
                techniciansQuery.isLoading ||
                isSaving
              }
              className="h-12 w-full rounded-xl border border-slate-300 bg-white px-4 outline-none transition focus-primary focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-100"
            >
              <option value="">
                Selecione um técnico
              </option>

              {techniciansQuery.data?.map(
                (technician) => (
                  <option
                    key={technician.id}
                    value={technician.id}
                  >
                    {technician.name}
                  </option>
                ),
              )}
            </select>

            {techniciansQuery.isError && (
              <p className="mt-2 text-sm text-red-600">
                Não foi possível carregar os técnicos.
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="ticket-status"
              className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700"
            >
              <Workflow size={17} />
              Status
            </label>

            <select
              id="ticket-status"
              value={status}
              onChange={(event) =>
                setStatus(event.target.value)
              }
              disabled={isSaving}
              className="h-12 w-full rounded-xl border border-slate-300 bg-white px-4 outline-none transition focus-primary focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-100"
            >
              {currentStatus === "ABERTO" && (
                <option value="ABERTO">
                  ABERTO
                </option>
              )}

              {allowedStatuses.map(
                (statusOption) => (
                  <option
                    key={statusOption}
                    value={statusOption}
                  >
                    {formatStatus(statusOption)}
                  </option>
                ),
              )}
            </select>
          </div>
        </div>

        {message && (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            {message}
          </div>
        )}

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleSave}
            disabled={
              !hasChanges ||
              isSaving ||
              techniciansQuery.isLoading
            }
            className="flex h-11 items-center justify-center gap-2 rounded-xl btn-primary px-5 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSaving ? (
              <LoaderCircle
                size={18}
                className="animate-spin"
              />
            ) : (
              <Save size={18} />
            )}

            {isSaving
              ? "Salvando..."
              : "Salvar alterações"}
          </button>
        </div>
      </div>
    </section>
  );
}
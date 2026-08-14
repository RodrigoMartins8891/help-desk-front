import { useState } from "react";
import { useForm } from "react-hook-form";
import { Sparkles, Loader2 } from "lucide-react";
import { useClassifyTicket } from "../hooks/useClassifyTicket"; 
import type { CreateTicketInput } from "../types/ticket";

interface CreateTicketFormProps {
  onSubmitTicket: (data: CreateTicketInput) => void;
  isSubmitting?: boolean;
}

export function CreateTicketForm({
  onSubmitTicket,
  isSubmitting = false,
}: CreateTicketFormProps) {
  const { register, handleSubmit, watch, setValue } = useForm<CreateTicketInput>();
  const [aiReason, setAiReason] = useState<string | null>(null);

  // Hook da IA com TanStack Query
  const { mutate: classify, isPending: isClassifying } = useClassifyTicket();

  const title = watch("title");
  const description = watch("description");

  function handleAutoClassify() {
    if (!title || title.trim().length < 5) {
      alert("Escreva um título de pelo menos 5 caracteres para a IA analisar.");
      return;
    }

    if (!description || description.trim().length < 10) {
      alert("Escreva uma descrição de pelo menos 10 caracteres para a IA analisar.");
      return;
    }

    classify(
      { title, description },
      {
        onSuccess: (data) => {
          if (data.success && data.suggestion) {
            setValue("category", data.suggestion.category);
            setValue("priority", data.suggestion.priority);
            setAiReason(data.suggestion.reason);
          }
        },
        onError: (error) => {
          console.error("Erro ao classificar chamado com IA:", error);
          alert("Não foi possível obter a sugestão da IA no momento.");
        },
      }
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmitTicket)} className="space-y-4">
      {/* Campo Título */}
      <div>
        <label className="block text-sm font-medium mb-1">Título</label>
        <input
          {...register("title", { required: true })}
          placeholder="Ex: Não consigo acessar o e-mail corporativo"
          className="w-full p-2 border rounded-md"
        />
      </div>

      {/* Campo Descrição */}
      <div>
        <label className="block text-sm font-medium mb-1">Descrição</label>
        <textarea
          {...register("description", { required: true })}
          rows={4}
          placeholder="Descreva detalhadamente o problema..."
          className="w-full p-2 border rounded-md"
        />
      </div>

      {/* Ação da IA */}
      <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg border border-purple-100">
        <span className="text-xs text-purple-900">
          Preencha título e descrição para a IA sugerir Categoria e Prioridade.
        </span>
        <button
          type="button"
          onClick={handleAutoClassify}
          disabled={isClassifying}
          className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-white bg-purple-600 rounded-md hover:bg-purple-700 disabled:opacity-50 transition-colors shrink-0"
        >
          {isClassifying ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Sparkles className="w-3.5 h-3.5" />
          )}
          {isClassifying ? "Analisando..." : "Sugerir com IA"}
        </button>
      </div>

      {/* Exibição do Motivo da IA */}
      {aiReason && (
        <div className="p-3 text-xs text-purple-900 bg-purple-100/60 border border-purple-200 rounded-md">
          <strong>Por que essa sugestão?</strong> {aiReason}
        </div>
      )}

      {/* Categoria e Prioridade */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Categoria</label>
          <select
            {...register("category", { required: true })}
            className="w-full p-2 border rounded-md"
          >
            <option value="">Selecione...</option>
            <option value="HARDWARE">Hardware</option>
            <option value="SOFTWARE">Software</option>
            <option value="REDE">Rede</option>
            <option value="ACESSO">Acesso / Permissões</option>
            <option value="OUTROS">Outros</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Prioridade</label>
          <select
            {...register("priority", { required: true })}
            className="w-full p-2 border rounded-md"
          >
            <option value="">Selecione...</option>
            <option value="BAIXA">Baixa</option>
            <option value="MEDIA">Média</option>
            <option value="ALTA">Alta</option>
            <option value="CRITICA">Crítica</option>
          </select>
        </div>
      </div>

      {/* Botão de Submissão */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md disabled:opacity-50 transition-colors"
      >
        {isSubmitting ? "Criando Chamado..." : "Abrir Chamado"}
      </button>
    </form>
  );
}
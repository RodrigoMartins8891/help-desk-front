export type SlaResult = {
  percentage: number;
  remainingMs: number;
  expired: boolean;
  label: string;
};

export function calculateSla(
  startDate: string,
  deadline: string,
  referenceDate = new Date().toISOString(),
): SlaResult {
  const start = new Date(startDate).getTime();
  const end = new Date(deadline).getTime();
  const reference = new Date(referenceDate).getTime();

  const total = end - start;
  const elapsed = reference - start;

  if (
    Number.isNaN(start) ||
    Number.isNaN(end) ||
    Number.isNaN(reference) ||
    total <= 0
  ) {
    return {
      percentage: 0,
      remainingMs: 0,
      expired: false,
      label: "Prazo inválido",
    };
  }

  const percentage = Math.min(
    Math.max((elapsed / total) * 100, 0),
    100,
  );

  const remainingMs = end - reference;
  const expired = remainingMs < 0;

  if (expired) {
    return {
      percentage: 100,
      remainingMs,
      expired: true,
      label: "SLA violado",
    };
  }

  if (percentage >= 85) {
    return {
      percentage,
      remainingMs,
      expired: false,
      label: "Vence em breve",
    };
  }

  return {
    percentage,
    remainingMs,
    expired: false,
    label: "Dentro do SLA",
  };
}
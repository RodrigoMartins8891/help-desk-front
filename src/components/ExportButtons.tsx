import { FileSpreadsheet, FileText, Table } from "lucide-react";

type ExportButtonsProps = {
  onExportPdf: () => void;
  onExportExcel: () => void;
  onExportCsv: () => void;
};

export function ExportButtons({
  onExportPdf,
  onExportExcel,
  onExportCsv,
}: ExportButtonsProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="mb-5 text-lg font-bold text-slate-900">
        Exportações
      </h3>

      <div className="flex flex-wrap gap-4">
        <button
          onClick={onExportPdf}
          className="flex items-center gap-2 rounded-xl bg-red-600 px-5 py-3 font-semibold text-white transition hover:bg-red-700"
        >
          <FileText size={18} />
          Exportar PDF
        </button>

        <button
          onClick={onExportExcel}
          className="flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 font-semibold text-white transition hover:bg-emerald-700"
        >
          <FileSpreadsheet size={18} />
          Exportar Excel
        </button>

        <button
          onClick={onExportCsv}
          className="flex items-center gap-2 rounded-xl btn-primary px-5 py-3 font-semibold text-white transition hover:bg-blue-700"
        >
          <Table size={18} />
          Exportar CSV
        </button>
      </div>
    </section>
  );
}
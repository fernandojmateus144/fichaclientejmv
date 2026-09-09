import type { ReactNode } from "react";

const inputCls =
  "w-full rounded-md border border-line bg-paper px-3 py-3 text-base outline-none focus:border-primary focus:ring-2 focus:ring-primary/20";

export function Seccao({
  numero,
  titulo,
  total,
  extra,
  children,
}: {
  numero: number;
  titulo: string;
  total: number;
  extra?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="border-b border-line">
      <div className="flex flex-wrap items-center gap-3 bg-panel px-5 py-3">
        <span className="grid size-8 shrink-0 place-items-center rounded-sm bg-ink font-mono text-sm font-semibold text-paper">
          {numero}
        </span>
        <h2 className="text-base font-semibold tracking-tight">{titulo}</h2>
        {extra ?? (
          <span className="ml-auto font-mono text-[11px] text-inksoft">
            Secção {numero}/{total}
          </span>
        )}
      </div>
      {children}
    </div>
  );
}

export function Campo({
  label,
  value,
  onChange,
  mono,
  type = "text",
  className,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  mono?: boolean;
  type?: string;
  className?: string;
}) {
  return (
    <label className={`block ${className ?? ""}`}>
      <span className="mb-1.5 block text-xs font-medium text-inksoft">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`${inputCls} ${mono ? "font-mono" : ""}`}
      />
    </label>
  );
}

export function AreaTexto({
  label,
  value,
  onChange,
  rows = 4,
}: {
  label?: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
}) {
  return (
    <label className="block">
      {label && <span className="mb-1.5 block text-xs font-medium text-inksoft">{label}</span>}
      <textarea
        rows={rows}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={inputCls}
      />
    </label>
  );
}

export function Opcoes({
  label,
  opcoes,
  value,
  onChange,
  className,
}: {
  label: string;
  opcoes: string[];
  value: string;
  onChange: (v: string) => void;
  className?: string;
}) {
  return (
    <label className={`block ${className ?? ""}`}>
      <span className="mb-1.5 block text-xs font-medium text-inksoft">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`${inputCls} appearance-none bg-[length:12px] bg-[right_0.9rem_center] bg-no-repeat pr-9`}
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 8'><path fill='%23555' d='M1 1.5 6 6.5l5-5'/></svg>\")",
        }}
      >
        <option value="">— Seleccionar —</option>
        {opcoes.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </label>
  );
}

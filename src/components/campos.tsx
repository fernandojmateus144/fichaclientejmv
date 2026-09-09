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
}: {
  label: string;
  opcoes: string[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <span className="mb-2 block text-xs font-medium text-inksoft">{label}</span>
      <div className="flex flex-col gap-2">
        {opcoes.map((o) => (
          <label
            key={o}
            className={`flex cursor-pointer items-center gap-2.5 rounded-md border px-3 py-2.5 text-sm ${
              value === o ? "border-primary bg-primary/5 font-medium" : "border-line bg-paper"
            }`}
          >
            <input
              type="radio"
              checked={value === o}
              onChange={() => onChange(o)}
              className="size-4 accent-[var(--primary)]"
            />
            {o}
          </label>
        ))}
      </div>
    </div>
  );
}

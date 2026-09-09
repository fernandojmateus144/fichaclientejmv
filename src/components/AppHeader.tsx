import { Link } from "@tanstack/react-router";

export function AppHeader() {
  return (
    <header className="no-print border-b-2 border-ink bg-paper">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <Link to="/" className="flex items-center gap-3">
          <div className="grid size-9 place-items-center bg-primary font-mono text-sm font-semibold text-primary-foreground">
            JMV
          </div>
          <div className="leading-tight">
            <p className="text-sm font-semibold tracking-tight">JMV · Fichas de Cliente</p>
            <p className="font-mono text-[11px] text-inksoft">Mercado Interno</p>
          </div>
        </Link>
        <div className="flex items-center gap-2 font-mono text-[11px] text-inksoft">
          <Link to="/" className="hidden rounded-md px-3 py-2 text-ink hover:bg-panel sm:block">
            Fichas
          </Link>
          <Link
            to="/ficha/$id"
            params={{ id: "nova" }}
            className="rounded-md bg-ink px-3 py-2 font-medium text-paper"
          >
            Nova ficha
          </Link>
        </div>
      </div>
    </header>
  );
}

import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { AppHeader } from "@/components/AppHeader";
import { apagarFicha, lerFichas, type Ficha } from "@/lib/ficha";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Fichas de Cliente JMV" },
      {
        name: "description",
        content:
          "Lista das fichas de cliente JMV guardadas neste aparelho, com pesquisa e criação de novas fichas.",
      },
      { property: "og:title", content: "Fichas de Cliente JMV" },
      {
        property: "og:description",
        content: "Lista das fichas de cliente JMV guardadas neste aparelho.",
      },
    ],
  }),
  component: Lista,
});

function Lista() {
  const [fichas, setFichas] = useState<Ficha[]>([]);
  const [pesquisa, setPesquisa] = useState("");

  useEffect(() => {
    setFichas(lerFichas());
  }, []);

  const filtradas = useMemo(() => {
    const t = pesquisa.trim().toLowerCase();
    if (!t) return fichas;
    return fichas.filter((f) =>
      [f.firma, f.nomeEstabelecimento, f.contribuinte, f.numeroCliente, f.localidade]
        .join(" ")
        .toLowerCase()
        .includes(t),
    );
  }, [fichas, pesquisa]);

  function remover(id: string) {
    if (!window.confirm("Apagar esta ficha?")) return;
    apagarFicha(id);
    setFichas(lerFichas());
  }

  return (
    <div className="min-h-screen bg-rail text-ink antialiased">
      <AppHeader />
      <main className="mx-auto max-w-6xl px-4 py-5 sm:px-6 sm:py-7">
        <section className="rounded-xl border border-line bg-panel">
          <div className="flex flex-col gap-3 border-b border-line p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <span className="grid size-7 place-items-center rounded-sm bg-ink/5 font-mono text-[11px] font-semibold text-inksoft">
                01
              </span>
              <h1 className="text-base font-semibold tracking-tight">Fichas guardadas</h1>
              <span className="font-mono text-[11px] text-inksoft">
                {fichas.length} {fichas.length === 1 ? "registo" : "registos"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex flex-1 items-center gap-2 rounded-md border border-line bg-paper px-3 py-2.5 sm:flex-none">
                <span className="font-mono text-xs text-inksoft">⌕</span>
                <input
                  type="text"
                  value={pesquisa}
                  onChange={(e) => setPesquisa(e.target.value)}
                  placeholder="Pesquisar por NIF, nome ou código…"
                  className="w-full bg-transparent text-sm outline-none placeholder:text-inksoft/60 sm:w-64"
                />
              </div>
              <Link
                to="/ficha/$id"
                params={{ id: "nova" }}
                className="flex shrink-0 items-center gap-1.5 rounded-md bg-primary px-3 py-2.5 text-sm font-medium text-primary-foreground ring-1 ring-primary"
              >
                <span className="font-mono text-base leading-none">+</span> Nova ficha
              </Link>
            </div>
          </div>

          <div className="divide-y divide-line">
            {filtradas.length === 0 && (
              <p className="p-6 text-center font-mono text-[11px] text-inksoft">
                Ainda não há fichas guardadas neste aparelho.
              </p>
            )}
            {filtradas.map((f) => (
              <div key={f.id} className="flex items-center gap-3 p-3 pl-4 sm:px-4">
                <Link
                  to="/ficha/$id"
                  params={{ id: f.id }}
                  className="min-w-0 flex-1"
                >
                  <p className="truncate text-sm font-medium">
                    {f.firma || f.nomeEstabelecimento || "Ficha sem nome"}
                    {f.contribuinte ? ` — ${f.contribuinte}` : ""}
                  </p>
                  <p className="font-mono text-[11px] text-inksoft">
                    {[f.canal || "Canal por definir", f.sector || "Sector por definir", f.localidade]
                      .filter(Boolean)
                      .join(" · ")}
                  </p>
                </Link>
                <span className="hidden font-mono text-xs text-inksoft sm:block">
                  {new Date(f.actualizadoEm).toLocaleDateString("pt-PT")}
                </span>
                <button
                  onClick={() => remover(f.id)}
                  className="rounded-sm bg-paper px-2 py-1 font-mono text-[11px] text-warn ring-1 ring-line"
                >
                  Apagar
                </button>
              </div>
            ))}
          </div>
        </section>

        <p className="mt-4 text-center font-mono text-[11px] text-inksoft">
          As fichas ficam guardadas neste aparelho · funciona sem internet
        </p>
      </main>
    </div>
  );
}

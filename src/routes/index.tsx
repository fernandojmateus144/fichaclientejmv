import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import * as XLSX from "xlsx";
import { AppHeader } from "@/components/AppHeader";
import { apagarFicha, lerFichas, telefoneCompleto, type Ficha } from "@/lib/ficha";

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

type Vista = "lista" | "tabela";

function Lista() {
  const [fichas, setFichas] = useState<Ficha[]>([]);
  const [pesquisa, setPesquisa] = useState("");
  const [vista, setVista] = useState<Vista>("lista");

  useEffect(() => {
    setFichas(lerFichas());
    const guardada = typeof window !== "undefined" ? window.localStorage.getItem("jmv-vista") : null;
    if (guardada === "tabela" || guardada === "lista") setVista(guardada);
  }, []);

  const mudarVista = (v: Vista) => {
    setVista(v);
    if (typeof window !== "undefined") window.localStorage.setItem("jmv-vista", v);
  };

  const filtradas = useMemo(() => {
    const t = pesquisa.trim().toLowerCase();
    if (!t) return fichas;
    return fichas.filter((f) =>
      [
        f.firma,
        f.nomeEstabelecimento,
        f.contribuinte,
        f.numeroCliente,
        f.localidade,
        f.regiao,
        f.canal,
        f.sector,
        f.pessoaContactar,
      ]
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
            <div className="flex flex-col items-stretch gap-2 sm:flex-row sm:items-center">
              <div className="flex items-center gap-1 rounded-md border border-line bg-paper p-1">
                <button
                  type="button"
                  onClick={() => mudarVista("lista")}
                  className={`rounded px-2.5 py-1.5 text-xs font-medium ${
                    vista === "lista"
                      ? "bg-ink text-paper"
                      : "text-inksoft hover:bg-ink/5"
                  }`}
                >
                  Lista
                </button>
                <button
                  type="button"
                  onClick={() => mudarVista("tabela")}
                  className={`rounded px-2.5 py-1.5 text-xs font-medium ${
                    vista === "tabela"
                      ? "bg-ink text-paper"
                      : "text-inksoft hover:bg-ink/5"
                  }`}
                >
                  Tabela
                </button>
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
          </div>

          {vista === "lista" ? (
            <div className="divide-y divide-line">
              {filtradas.length === 0 && (
                <p className="p-6 text-center font-mono text-[11px] text-inksoft">
                  Ainda não há fichas guardadas neste aparelho.
                </p>
              )}
              {filtradas.map((f) => (
                <div key={f.id} className="flex items-center gap-3 p-3 pl-4 sm:px-4">
                  <Link to="/ficha/$id" params={{ id: f.id }} className="min-w-0 flex-1">
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
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] text-left text-sm">
                <thead className="bg-ink/5 font-mono text-[11px] font-semibold uppercase tracking-wide text-inksoft">
                  <tr>
                    <th className="sticky left-0 z-10 w-40 bg-ink/5 px-3 py-2.5">N.º Cliente / Firma</th>
                    <th className="px-3 py-2.5">Estabelecimento</th>
                    <th className="px-3 py-2.5">Contribuinte</th>
                    <th className="px-3 py-2.5">Localidade</th>
                    <th className="px-3 py-2.5">Região</th>
                    <th className="px-3 py-2.5">Canal</th>
                    <th className="px-3 py-2.5">Sector</th>
                    <th className="px-3 py-2.5">Telefone</th>
                    <th className="px-3 py-2.5">Email</th>
                    <th className="px-3 py-2.5">Actualizado</th>
                    <th className="px-3 py-2.5 text-right">Acções</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {filtradas.length === 0 && (
                    <tr>
                      <td colSpan={11} className="px-3 py-6 text-center font-mono text-[11px] text-inksoft">
                        Ainda não há fichas guardadas neste aparelho.
                      </td>
                    </tr>
                  )}
                  {filtradas.map((f) => (
                    <tr key={f.id} className="hover:bg-ink/[0.02]">
                      <td className="sticky left-0 z-10 w-40 bg-panel px-3 py-2.5">
                        <Link
                          to="/ficha/$id"
                          params={{ id: f.id }}
                          className="block truncate font-medium hover:underline"
                        >
                          {f.numeroCliente || "—"}
                        </Link>
                        <p className="truncate font-mono text-[11px] text-inksoft">{f.firma || "—"}</p>
                      </td>
                      <td className="px-3 py-2.5">{f.nomeEstabelecimento || "—"}</td>
                      <td className="px-3 py-2.5 font-mono text-[11px]">{f.contribuinte || "—"}</td>
                      <td className="px-3 py-2.5">{f.localidade || "—"}</td>
                      <td className="px-3 py-2.5">{f.regiao || "—"}</td>
                      <td className="px-3 py-2.5">{f.canal || "—"}</td>
                      <td className="px-3 py-2.5">{f.sector || "—"}</td>
                      <td className="px-3 py-2.5 font-mono text-[11px] whitespace-nowrap">
                        {telefoneCompleto(f.telefone) || "—"}
                      </td>
                      <td className="max-w-[200px] truncate px-3 py-2.5 font-mono text-[11px]">
                        {f.email || "—"}
                      </td>
                      <td className="px-3 py-2.5 font-mono text-[11px] whitespace-nowrap">
                        {new Date(f.actualizadoEm).toLocaleDateString("pt-PT")}
                      </td>
                      <td className="px-3 py-2.5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            to="/ficha/$id"
                            params={{ id: f.id }}
                            className="rounded-sm bg-paper px-2 py-1 font-mono text-[11px] ring-1 ring-line hover:bg-ink/5"
                          >
                            Ver
                          </Link>
                          <button
                            onClick={() => remover(f.id)}
                            className="rounded-sm bg-paper px-2 py-1 font-mono text-[11px] text-warn ring-1 ring-line"
                          >
                            Apagar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <p className="mt-4 text-center font-mono text-[11px] text-inksoft">
          As fichas ficam guardadas neste aparelho · funciona sem internet
        </p>
      </main>
    </div>
  );
}


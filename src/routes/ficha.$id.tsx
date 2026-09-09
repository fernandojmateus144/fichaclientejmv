import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppHeader } from "@/components/AppHeader";
import { AreaTexto, Campo, CampoEmail, CampoTelefone, Opcoes, Seccao } from "@/components/campos";
import {
  CANAIS,
  GRUPOS,
  GRUPOS_CLIENTES,
  REGIOES,
  SECTORES,
  SISTEMAS_DEBITO,
  euros,
  formatarCodigoPostal,
  guardarFicha,
  lerFicha,
  novaFicha,
  novaLinha,
  totalFicha,
  totalLinha,
  type Ficha,
  type Linha,
} from "@/lib/ficha";

export const Route = createFileRoute("/ficha/$id")({
  head: () => ({
    meta: [
      { title: "Preencher ficha de cliente — JMV" },
      {
        name: "description",
        content:
          "Formulário completo da ficha de cliente JMV: dados do cliente, canal, dados financeiros, equipamento e condições de fornecimento.",
      },
      { property: "og:title", content: "Preencher ficha de cliente — JMV" },
      {
        property: "og:description",
        content: "Formulário completo da ficha de cliente JMV, pronto a preencher em qualquer aparelho.",
      },
    ],
  }),
  component: Formulario,
});

const TOTAL_SECCOES = 7;
const celaCls =
  "w-full rounded border border-line bg-paper px-2 py-2.5 text-sm outline-none focus:border-primary";

function Formulario() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const [ficha, setFicha] = useState<Ficha | null>(null);
  const [guardado, setGuardado] = useState(false);

  useEffect(() => {
    if (id === "nova") setFicha(novaFicha());
    else setFicha(lerFicha(id) ?? novaFicha());
  }, [id]);

  if (!ficha) return null;

  const set = <K extends keyof Ficha>(k: K, v: Ficha[K]) => {
    setFicha({ ...ficha, [k]: v });
    setGuardado(false);
  };

  const setLinha = (linhaId: string, k: keyof Linha, v: string) => {
    set(
      "linhas",
      ficha.linhas.map((l) => (l.id === linhaId ? { ...l, [k]: v } : l)),
    );
  };

  function guardar() {
    if (!ficha) return;
    const gravada = guardarFicha(ficha);
    setFicha(gravada);
    setGuardado(true);
    if (id === "nova") navigate({ to: "/ficha/$id", params: { id: gravada.id }, replace: true });
  }

  return (
    <div className="min-h-screen bg-rail text-ink antialiased">
      <AppHeader />
      <main className="mx-auto max-w-6xl px-4 py-5 sm:px-6 sm:py-7">
        <section className="print-block rounded-xl border border-line bg-paper">
          <div className="flex flex-col gap-1 border-b-2 border-ink px-5 py-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-primary">
                Ficha de Cliente · Mercado Interno
              </p>
              <h1 className="text-2xl font-semibold tracking-tight text-balance">
                {ficha.firma || "Nova ficha de cliente"}
              </h1>
            </div>
            <p className="font-mono text-[11px] text-inksoft">
              {ficha.numeroCliente ? `N.º Cliente ${ficha.numeroCliente} · ` : ""}
              {TOTAL_SECCOES} secções
            </p>
          </div>

          <div className="grid grid-cols-1 gap-x-6 gap-y-5 border-b border-line p-5 sm:grid-cols-2 lg:grid-cols-5">
            <Campo label="N.º Cliente" mono value={ficha.numeroCliente} onChange={(v) => set("numeroCliente", v)} />
            <Campo label="Ex Cliente N.º" mono value={ficha.exClienteNumero} onChange={(v) => set("exClienteNumero", v)} />
            <Campo
              label="Área"
              mono
              value={ficha.area}
              onChange={(v) => set("area", v.replace(/\D/g, "").slice(0, 3))}
            />
            <Campo label="Vendedor" value={ficha.vendedor} onChange={(v) => set("vendedor", v)} />
            <Campo label="Inspector" value={ficha.inspector} onChange={(v) => set("inspector", v)} />
          </div>

          <Seccao numero={1} titulo="Dados do Cliente" total={TOTAL_SECCOES}>
            <div className="grid grid-cols-1 gap-x-6 gap-y-5 p-5 sm:grid-cols-2 lg:grid-cols-3">
              <Campo label="Firma do Cliente" value={ficha.firma} onChange={(v) => set("firma", v)} />
              <Campo label="Nome do Estabelecimento" value={ficha.nomeEstabelecimento} onChange={(v) => set("nomeEstabelecimento", v)} />
              <Campo label="N.º de Contribuinte" mono value={ficha.contribuinte} onChange={(v) => set("contribuinte", v)} />
              <Campo label="Morada" className="lg:col-span-2" value={ficha.morada} onChange={(v) => set("morada", v)} />
              <Campo
                label="Código Postal"
                mono
                value={ficha.codigoPostal}
                onChange={(v) => set("codigoPostal", formatarCodigoPostal(v))}
              />
              <Campo label="Localidade" value={ficha.localidade} onChange={(v) => set("localidade", v)} />
              <Opcoes label="Região" opcoes={REGIOES} value={ficha.regiao} onChange={(v) => set("regiao", v)} />
              <Campo label="País" value={ficha.pais} onChange={(v) => set("pais", v)} />
              <Campo label="Pessoa a Contactar" value={ficha.pessoaContactar} onChange={(v) => set("pessoaContactar", v)} />
              <Campo label="Dia de Descanso" value={ficha.diaDescanso} onChange={(v) => set("diaDescanso", v)} />
              <CampoTelefone label="Telefone" value={ficha.telefone} onChange={(v) => set("telefone", v)} />
              <CampoEmail label="E-mail" value={ficha.email} onChange={(v) => set("email", v)} />
            </div>
          </Seccao>

          <Seccao numero={2} titulo="Canal / Sector de Actividade / Grupo de Clientes" total={TOTAL_SECCOES}>
            <div className="grid grid-cols-1 gap-x-6 gap-y-5 p-5 sm:grid-cols-3">
              <Opcoes label="Canal de Distribuição" opcoes={CANAIS} value={ficha.canal} onChange={(v) => set("canal", v)} />
              <div className="space-y-4">
                <Opcoes label="Sector de Actividade" opcoes={SECTORES} value={ficha.sector} onChange={(v) => set("sector", v)} />
                {ficha.sector === "Outro" && (
                  <Campo label="Qual?" value={ficha.sectorOutro} onChange={(v) => set("sectorOutro", v)} />
                )}
              </div>
              <div className="space-y-4">
                <Opcoes label="Grupo de Clientes" opcoes={GRUPOS} value={ficha.grupo} onChange={(v) => set("grupo", v)} />
                {ficha.grupo === "Outro" && (
                  <>
                    <Opcoes
                      label="Qual grupo?"
                      opcoes={GRUPOS_CLIENTES}
                      value={ficha.grupoLista}
                      onChange={(v) => set("grupoLista", v)}
                    />
                    {ficha.grupoLista === "Outros" && (
                      <Campo label="Indique o grupo" value={ficha.grupoQual} onChange={(v) => set("grupoQual", v)} />
                    )}
                  </>
                )}
              </div>
            </div>
          </Seccao>

          <Seccao numero={3} titulo="Dados Financeiros" total={TOTAL_SECCOES}>
            <div className="grid grid-cols-1 gap-x-6 gap-y-5 p-5 sm:grid-cols-2">
              <Campo label="Condições de Pagamento" value={ficha.condicoesPagamento} onChange={(v) => set("condicoesPagamento", v)} />
              <Campo label="Bancos" value={ficha.bancos} onChange={(v) => set("bancos", v)} />
            </div>
          </Seccao>

          <Seccao numero={4} titulo="Dados Normanvi (só clientes de Café HORECA)" total={TOTAL_SECCOES}>
            <div className="space-y-5 p-5">
              <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-3">
                <Campo label="Máquina de Café — Marca - Modelo" value={ficha.maquinaCafe} onChange={(v) => set("maquinaCafe", v)} />
                <Campo label="Moinho — Marca - Modelo" value={ficha.moinho} onChange={(v) => set("moinho", v)} />
                <Campo label="Máquina de Lavar — Marca - Modelo" value={ficha.maquinaLavar} onChange={(v) => set("maquinaLavar", v)} />
              </div>
              <p className="font-mono text-[11px] text-inksoft">
                Preencher apenas se o equipamento a prestar assistência não for propriedade da JMV.
              </p>
              <Opcoes
                label="Sistema de Débito"
                opcoes={SISTEMAS_DEBITO}
                value={ficha.sistemaDebito}
                onChange={(v) => set("sistemaDebito", v)}
              />
            </div>
          </Seccao>

          <Seccao numero={5} titulo="Local de Entrega da Mercadoria" total={TOTAL_SECCOES}>
            <div className="grid grid-cols-1 gap-x-6 gap-y-5 p-5 sm:grid-cols-2 lg:grid-cols-3">
              <Campo label="Morada" className="lg:col-span-2" value={ficha.entregaMorada} onChange={(v) => set("entregaMorada", v)} />
              <div className="grid grid-cols-2 gap-3">
                <Campo label="Código Postal" mono value={ficha.entregaCodigoPostal1} onChange={(v) => set("entregaCodigoPostal1", v)} />
                <Campo label="&nbsp;" mono value={ficha.entregaCodigoPostal2} onChange={(v) => set("entregaCodigoPostal2", v)} />
              </div>
              <Campo label="Localidade" value={ficha.entregaLocalidade} onChange={(v) => set("entregaLocalidade", v)} />
              <Campo label="Pessoa a Contactar" value={ficha.entregaPessoaContactar} onChange={(v) => set("entregaPessoaContactar", v)} />
              <Campo label="Telefone" mono value={ficha.entregaTelefone} onChange={(v) => set("entregaTelefone", v)} />
            </div>
          </Seccao>

          <Seccao numero={6} titulo="Observações" total={TOTAL_SECCOES}>
            <div className="space-y-4 p-5">
              <AreaTexto value={ficha.observacoes} onChange={(v) => set("observacoes", v)} rows={5} />
              <label className="flex items-start gap-3 rounded-md border border-line bg-panel px-3 py-3 text-sm">
                <input
                  type="checkbox"
                  checked={ficha.declaracao}
                  onChange={(e) => set("declaracao", e.target.checked)}
                  className="mt-0.5 size-4 accent-[var(--primary)]"
                />
                Declaro que me foi exibida a declaração de início de actividade fiscal / cartão de
                contribuinte do cliente, que verifiquei estar em conformidade.
              </label>
            </div>
          </Seccao>

          <Seccao
            numero={7}
            titulo="Condições de Fornecimento"
            total={TOTAL_SECCOES}
            extra={
              <button
                onClick={() => set("linhas", [...ficha.linhas, novaLinha()])}
                className="no-print ml-auto flex items-center gap-1.5 rounded-md border border-line bg-paper px-3 py-2 text-sm font-medium text-ink hover:bg-rail"
              >
                <span className="font-mono leading-none">+</span> Adicionar linha
              </button>
            }
          >
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] border-collapse text-sm">
                <thead>
                  <tr className="border-b border-line text-left font-mono text-[11px] uppercase tracking-wide text-inksoft">
                    <th className="px-5 py-2.5 font-medium">Cód.</th>
                    <th className="px-3 py-2.5 font-medium">Designação</th>
                    <th className="px-3 py-2.5 text-right font-medium">Qt. Venda</th>
                    <th className="px-3 py-2.5 text-right font-medium">Preço</th>
                    <th className="px-3 py-2.5 text-right font-medium">Desc. Com.</th>
                    <th className="px-3 py-2.5 font-medium">Bónus Cód.</th>
                    <th className="px-3 py-2.5 font-medium">Bónus Designação</th>
                    <th className="px-3 py-2.5 text-right font-medium">Qt. Bónus</th>
                    <th className="px-5 py-2.5 text-right font-medium">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {ficha.linhas.map((l) => (
                    <tr key={l.id} className="align-middle">
                      <td className="px-5 py-1">
                        <input value={l.cod} onChange={(e) => setLinha(l.id, "cod", e.target.value)} className={`${celaCls} w-24 font-mono`} />
                      </td>
                      <td className="px-3 py-1">
                        <input value={l.designacao} onChange={(e) => setLinha(l.id, "designacao", e.target.value)} className={celaCls} />
                      </td>
                      <td className="px-3 py-1">
                        <input value={l.qtVenda} onChange={(e) => setLinha(l.id, "qtVenda", e.target.value)} className={`${celaCls} w-16 text-right font-mono`} />
                      </td>
                      <td className="px-3 py-1">
                        <input value={l.preco} onChange={(e) => setLinha(l.id, "preco", e.target.value)} className={`${celaCls} w-20 text-right font-mono`} />
                      </td>
                      <td className="px-3 py-1">
                        <input value={l.desconto} onChange={(e) => setLinha(l.id, "desconto", e.target.value)} className={`${celaCls} w-16 text-right font-mono`} />
                      </td>
                      <td className="px-3 py-1">
                        <input value={l.bonusCod} onChange={(e) => setLinha(l.id, "bonusCod", e.target.value)} className={`${celaCls} w-24 font-mono`} />
                      </td>
                      <td className="px-3 py-1">
                        <input value={l.bonusDesignacao} onChange={(e) => setLinha(l.id, "bonusDesignacao", e.target.value)} className={celaCls} />
                      </td>
                      <td className="px-3 py-1">
                        <input value={l.qtBonus} onChange={(e) => setLinha(l.id, "qtBonus", e.target.value)} className={`${celaCls} w-16 text-right font-mono`} />
                      </td>
                      <td className="px-5 py-2.5 text-right font-mono text-sm font-medium text-ink">
                        {euros(totalLinha(l))}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t-2 border-ink bg-panel">
                    <td className="px-5 py-3 font-mono text-[11px] uppercase tracking-wide text-inksoft" colSpan={8}>
                      Total fornecimento
                    </td>
                    <td className="px-5 py-3 text-right font-mono text-base font-semibold text-primary">
                      {euros(totalFicha(ficha))} €
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
            <p className="px-5 pb-4 font-mono text-[11px] text-inksoft">
              Preencher o preço apenas caso seja diferente do preço de tabela geral.
            </p>
          </Seccao>

          <div className="no-print flex flex-col-reverse gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="font-mono text-[11px] text-inksoft">
              {guardado ? "Ficha guardada neste aparelho." : "Alterações por guardar."}
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={() => window.print()}
                className="flex items-center gap-2 rounded-md border border-line bg-paper px-4 py-3 text-sm font-medium text-ink hover:bg-rail"
              >
                <span className="font-mono leading-none">⤓</span> Imprimir / PDF
              </button>
              <button
                onClick={guardar}
                className="flex items-center gap-2 rounded-md bg-primary px-5 py-3 text-sm font-medium text-primary-foreground ring-1 ring-primary"
              >
                <span className="font-mono leading-none">✓</span> Guardar ficha
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

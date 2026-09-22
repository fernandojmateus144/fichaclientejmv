import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppHeader } from "@/components/AppHeader";
import {
  AreaTexto,
  Bloqueado,
  Campo,
  CampoEmail,
  CampoTelefone,
  Opcoes,
  Seccao,
  SimNao,
  TextoExpansivel,
} from "@/components/campos";
import { Assinatura } from "@/components/assinatura";
import {
  CANAIS,
  ESTADOS_CIVIS,
  GRUPOS,
  GRUPOS_CLIENTES,
  MODOS_INVESTIMENTO,
  PROPRIEDADES,
  REGIOES,
  SECTORES,
  SISTEMAS_DEBITO,
  TIPOS_CLIENTE,
  TIPOS_ESTAB,
  VINCULOS,
  formatarCodigoPostal,
  guardarFicha,
  lerFicha,
  novaFicha,
  novaLinha,
  novoItem,
  novoSocio,
  proximoNumeroPI,
  telefoneCompleto,
  type Ficha,
  type Item,
  type Linha,
  type Socio,
} from "@/lib/ficha";

export const Route = createFileRoute("/ficha/$id")({
  head: () => ({
    meta: [
      { title: "Preencher ficha de cliente — JMV" },
      {
        name: "description",
        content:
          "Ficha de cliente JMV em quatro separadores: prospecção, abertura em SAP, ficha para contrato e pedido de investimento.",
      },
      { property: "og:title", content: "Preencher ficha de cliente — JMV" },
      {
        property: "og:description",
        content: "Ficha de cliente JMV em quatro separadores, pronta a preencher em qualquer aparelho.",
      },
    ],
  }),
  component: Formulario,
});

const celaCls =
  "w-full rounded border border-line bg-paper px-2 py-2.5 text-sm outline-none focus:border-primary";

const SEPARADORES = [
  "1 · Ficha de Prospecção",
  "2 · Abertura de Cliente em SAP",
  "3 · Ficha de Cliente para Contrato",
  "4 · Pedido de Investimento",
];

// Per-tab required fields — validation only checks the current tab and prior tabs
const OBRIGATORIOS_ABA1: (keyof Ficha)[] = [
  "area", "inspector", "firma", "nomeEstabelecimento", "contribuinte",
  "morada", "codigoPostal", "localidade", "regiao", "pais",
  "pessoaContactar", "diaDescanso", "telefone", "email",
];

const OBRIGATORIOS_ABA2: (keyof Ficha)[] = [
  "numeroCliente", "canal", "sector", "grupo", "condicoesPagamento",
];

function Formulario() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const [ficha, setFicha] = useState<Ficha | null>(null);
  const [guardado, setGuardado] = useState(false);
  const [erro, setErro] = useState(false);
  const [aba, setAba] = useState(0);

  useEffect(() => {
    if (id === "nova") setFicha(novaFicha());
    else setFicha(lerFicha(id) ?? novaFicha());
  }, [id]);

  if (!ficha) return null;
  const f = ficha;

  const set = <K extends keyof Ficha>(k: K, v: Ficha[K]) => {
    setFicha({ ...f, [k]: v });
    setGuardado(false);
    setErro(false);
  };

  const setLinha = (linhaId: string, k: keyof Linha, v: string) => {
    set("linhas", f.linhas.map((l) => (l.id === linhaId ? { ...l, [k]: v } : l)));
  };

  const setSocio = (socioId: string, k: keyof Socio, v: string) => {
    set("socios", f.socios.map((s) => (s.id === socioId ? { ...s, [k]: v } : s)));
  };

  const eCafes = f.sector === "Cafés";
  const bloqueadoSe = (valor: string) => valor.trim().length > 0;

  // Per-tab validation: check required fields for tabs 0..aba
  function emFaltaAte(x: Ficha, ateAba: number): (keyof Ficha)[] {
    const campos: (keyof Ficha)[] = [];
    for (let i = 0; i <= ateAba; i++) {
      if (i === 0) campos.push(...OBRIGATORIOS_ABA1);
      if (i === 1) campos.push(...OBRIGATORIOS_ABA2);
    }
    const faltam = campos.filter((k) => !String(x[k] ?? "").trim());
    if (ateAba >= 1) {
      if (x.sector === "Outro" && !x.sectorOutro.trim()) faltam.push("sectorOutro");
      if (x.grupo === "Outro" && !x.grupoLista.trim()) faltam.push("grupoLista");
      if (x.grupo === "Outro" && x.grupoLista === "Outros" && !x.grupoQual.trim()) faltam.push("grupoQual");
    }
    return [...new Set(faltam)];
  }

  const faltam = emFaltaAte(f, aba);

  function guardar() {
    if (!ficha) return;
    const faltamTotal = emFaltaAte(ficha, aba);
    if (faltamTotal.length > 0) {
      setErro(true);
      return;
    }
    setErro(false);
    const gravada = guardarFicha(ficha);
    setFicha(gravada);
    setGuardado(true);
    if (id === "nova") navigate({ to: "/ficha/$id", params: { id: gravada.id }, replace: true });
  }

  function imprimirAba(abaNum: number) {
    setAba(abaNum);
    setTimeout(() => window.print(), 100);
  }

  /* ---------- helpers: campo bloqueia se já tiver valor ---------- */
  function CampoOuBloqueado(props: {
    label: string; valor: string; onChange: (v: string) => void;
    mono?: boolean; type?: string; className?: string; obrigatorio?: boolean; erro?: boolean;
  }) {
    if (bloqueadoSe(props.valor))
      return <Bloqueado label={props.label} value={props.valor} className={props.className} mono={props.mono} />;
    return <Campo {...props} value={props.valor} />;
  }

  function CampoTelefoneOuBloqueado(props: {
    label: string; valor: string; onChange: (v: string) => void;
    className?: string; obrigatorio?: boolean; erro?: boolean;
  }) {
    if (bloqueadoSe(props.valor))
      return <Bloqueado label={props.label} value={telefoneCompleto(props.valor)} className={props.className} mono />;
    return <CampoTelefone {...props} value={props.valor} />;
  }

  function CampoEmailOuBloqueado(props: {
    label: string; valor: string; onChange: (v: string) => void;
    className?: string; obrigatorio?: boolean; erro?: boolean;
  }) {
    if (bloqueadoSe(props.valor))
      return <Bloqueado label={props.label} value={props.valor} className={props.className} />;
    return <CampoEmail {...props} value={props.valor} />;
  }

  function OpcoesOuBloqueado(props: {
    label: string; opcoes: string[]; valor: string; onChange: (v: string) => void;
    className?: string; obrigatorio?: boolean; erro?: boolean;
  }) {
    if (bloqueadoSe(props.valor))
      return <Bloqueado label={props.label} value={props.valor} className={props.className} />;
    return <Opcoes {...props} value={props.valor} />;
  }

  /* ---------- separador 1 — prospecção ---------- */
  const aba1 = (
    <>
      <div className="grid grid-cols-1 gap-x-6 gap-y-5 border-b border-line p-5 sm:grid-cols-2 lg:grid-cols-4">
        <Campo label="Área de Vendas" mono obrigatorio erro={erro} value={f.area} onChange={(v) => set("area", v.replace(/\D/g, "").slice(0, 3))} />
        <Campo label="Inspector" obrigatorio erro={erro} value={f.inspector} onChange={(v) => set("inspector", v)} />
      </div>

      <Seccao numero={1} titulo="Dados do Cliente" total={4}>
        <div className="grid grid-cols-1 gap-x-6 gap-y-5 p-5 sm:grid-cols-2 lg:grid-cols-3">
          <Campo label="Firma do Cliente" obrigatorio erro={erro} value={f.firma} onChange={(v) => set("firma", v)} />
          <Campo label="Nome do Estabelecimento" obrigatorio erro={erro} value={f.nomeEstabelecimento} onChange={(v) => set("nomeEstabelecimento", v)} />
          <Campo label="N.º de Contribuinte" mono obrigatorio erro={erro} value={f.contribuinte} onChange={(v) => set("contribuinte", v)} />
          <Campo label="Morada" className="lg:col-span-2" obrigatorio erro={erro} value={f.morada} onChange={(v) => set("morada", v)} />
          <Campo label="Código Postal" mono obrigatorio erro={erro} value={f.codigoPostal} onChange={(v) => set("codigoPostal", formatarCodigoPostal(v))} />
          <Campo label="Localidade" obrigatorio erro={erro} value={f.localidade} onChange={(v) => set("localidade", v)} />
          <Opcoes label="Região" opcoes={REGIOES} obrigatorio erro={erro} value={f.regiao} onChange={(v) => set("regiao", v)} />
          <Campo label="País" obrigatorio erro={erro} value={f.pais} onChange={(v) => set("pais", v)} />
          <Campo label="Pessoa a Contactar" obrigatorio erro={erro} value={f.pessoaContactar} onChange={(v) => set("pessoaContactar", v)} />
          <Campo label="Dia de Descanso" obrigatorio erro={erro} value={f.diaDescanso} onChange={(v) => set("diaDescanso", v)} />
          <CampoTelefone label="Telefone" obrigatorio erro={erro} value={f.telefone} onChange={(v) => set("telefone", v)} />
          <CampoEmail label="E-mail" obrigatorio erro={erro} value={f.email} onChange={(v) => set("email", v)} />
        </div>
      </Seccao>

      <Seccao numero={2} titulo="Contacto de Prospecção" total={4}>
        <div className="grid grid-cols-1 gap-x-6 gap-y-5 p-5 sm:grid-cols-2 lg:grid-cols-3">
          <Campo label="Data" type="date" value={f.prospData} onChange={(v) => set("prospData", v)} />
          <Campo label="Responsável pela Negociação" value={f.prospRespNegociacao} onChange={(v) => set("prospRespNegociacao", v)} />
          <Campo label="Anos de Actividade" mono value={f.prospAnosActividade} onChange={(v) => set("prospAnosActividade", v)} />
          <SimNao label="Já foi nosso cliente?" value={f.prospJaFoiCliente} onChange={(v) => set("prospJaFoiCliente", v)} />
          {f.prospJaFoiCliente === "Sim" && (<Campo label="Em que estabelecimento?" value={f.prospJaFoiClienteOnde} onChange={(v) => set("prospJaFoiClienteOnde", v)} />)}
          <SimNao label="Conhece a nossa empresa?" value={f.prospConheceEmpresa} onChange={(v) => set("prospConheceEmpresa", v)} />
          {f.prospConheceEmpresa === "Sim" && (<Campo label="Como?" value={f.prospConheceComo} onChange={(v) => set("prospConheceComo", v)} />)}
          <Campo label="Conhece alguém na empresa?" value={f.prospConheceAlguem} onChange={(v) => set("prospConheceAlguem", v)} />
          <SimNao label="Tem outros estabelecimentos?" value={f.prospOutrosEstab} onChange={(v) => set("prospOutrosEstab", v)} />
          {f.prospOutrosEstab === "Sim" && (<Campo label="Quais?" value={f.prospOutrosEstabQuais} onChange={(v) => set("prospOutrosEstabQuais", v)} />)}
          <SimNao label="Fez degustação?" value={f.prospDegustacao} onChange={(v) => set("prospDegustacao", v)} />
          {f.prospDegustacao === "Sim" && (<Campo label="Opinião da degustação" value={f.prospDegustacaoOpiniao} onChange={(v) => set("prospDegustacaoOpiniao", v)} />)}
        </div>
      </Seccao>

      <Seccao numero={3} titulo="Estabelecimento e Vínculo" total={4}>
        <div className="grid grid-cols-1 gap-x-6 gap-y-5 p-5 sm:grid-cols-2 lg:grid-cols-3">
          <SimNao label="Estabelecimento novo?" value={f.prospEstabNovo} onChange={(v) => set("prospEstabNovo", v)} />
          {f.prospEstabNovo === "Não" && (<Campo label="Aberto há quanto tempo?" value={f.prospAbertoHa} onChange={(v) => set("prospAbertoHa", v)} />)}
          <SimNao label="Houve trespasse?" value={f.prospTrespasse} onChange={(v) => set("prospTrespasse", v)} />
          <Opcoes label="Vínculo ao estabelecimento" opcoes={VINCULOS} value={f.prospVinculo} onChange={(v) => set("prospVinculo", v)} />
          <SimNao label="Tem contrato de arrendamento?" value={f.prospArrendamento} onChange={(v) => set("prospArrendamento", v)} />
          {f.prospArrendamento === "Sim" && (<>
            <Campo label="Arrendamento até" type="date" value={f.prospArrendamentoAte} onChange={(v) => set("prospArrendamentoAte", v)} />
            <Campo label="Renda mensal (€)" mono value={f.prospRenda} onChange={(v) => set("prospRenda", v)} />
          </>)}
          <Campo label="Horário — das" type="time" value={f.prospHorarioDas} onChange={(v) => set("prospHorarioDas", v)} />
          <Campo label="Horário — às" type="time" value={f.prospHorarioAs} onChange={(v) => set("prospHorarioAs", v)} />
          <Campo label="N.º de estabelecimentos na área" mono value={f.prospNumEstabArea} onChange={(v) => set("prospNumEstabArea", v)} />
          <Opcoes label="Tipo de estabelecimento" opcoes={TIPOS_ESTAB} value={f.prospTipoEstab} onChange={(v) => set("prospTipoEstab", v)} />
          {f.prospTipoEstab === "Outro" && (<Campo label="Qual?" value={f.prospTipoEstabOutro} onChange={(v) => set("prospTipoEstabOutro", v)} />)}
        </div>
      </Seccao>

      <Seccao numero={4} titulo="Consumo, Concorrência e Investimento Pedido" total={4}>
        <div className="grid grid-cols-1 gap-x-6 gap-y-5 p-5 sm:grid-cols-2 lg:grid-cols-3">
          <Campo label="Marca de café actual" value={f.prospMarcaCafe} onChange={(v) => set("prospMarcaCafe", v)} />
          <Campo label="Consumo mensal (kg)" mono value={f.prospConsumoMensal} onChange={(v) => set("prospConsumoMensal", v)} />
          <Campo label="Lote" value={f.prospLote} onChange={(v) => set("prospLote", v)} />
          <Campo label="Preço (€/kg)" mono value={f.prospPreco} onChange={(v) => set("prospPreco", v)} />
          <Campo label="Desconto (%)" mono value={f.prospDesconto} onChange={(v) => set("prospDesconto", v)} />
          <Campo label="Bónus" value={f.prospBonus} onChange={(v) => set("prospBonus", v)} />
          <SimNao label="Tem contrato com o fornecedor actual?" value={f.prospTemContrato} onChange={(v) => set("prospTemContrato", v)} />
          {f.prospTemContrato === "Sim" && (<>
            <Campo label="Tipo de contrato" value={f.prospContratoTipo} onChange={(v) => set("prospContratoTipo", v)} />
            <Campo label="Fim do contrato" type="date" value={f.prospFimContrato} onChange={(v) => set("prospFimContrato", v)} />
          </>)}
          <Campo label="Máquinas pedidas" value={f.prospMaquinas} onChange={(v) => set("prospMaquinas", v)} />
          <Campo label="Mobiliário pedido" value={f.prospMobiliario} onChange={(v) => set("prospMobiliario", v)} />
          <Campo label="Verba (€)" mono value={f.prospVerba} onChange={(v) => set("prospVerba", v)} />
          <Campo label="Louça" value={f.prospLouca} onChange={(v) => set("prospLouca", v)} />
          <Campo label="Assistência" value={f.prospAssistencia} onChange={(v) => set("prospAssistencia", v)} />
          <Campo label="Toldos" value={f.prospToldos} onChange={(v) => set("prospToldos", v)} />
          <Campo label="Reclames" value={f.prospReclames} onChange={(v) => set("prospReclames", v)} />
          <Campo label="Outros" value={f.prospOutros} onChange={(v) => set("prospOutros", v)} />
          <Campo label="Lote a propor" value={f.prospLoteInvestimento} onChange={(v) => set("prospLoteInvestimento", v)} />
        </div>
        <div className="grid grid-cols-1 gap-x-6 gap-y-5 px-5 pb-5 sm:grid-cols-2">
          <AreaTexto label="Pontos fracos do estabelecimento" value={f.prospPontosFracos} onChange={(v) => set("prospPontosFracos", v)} rows={3} />
          <AreaTexto label="Condições propostas" value={f.prospCondicoes} onChange={(v) => set("prospCondicoes", v)} rows={3} />
          <AreaTexto label="O que é necessário para captar o cliente" value={f.prospCaptar} onChange={(v) => set("prospCaptar", v)} rows={3} />
          <AreaTexto label="Observações" value={f.prospObservacoes} onChange={(v) => set("prospObservacoes", v)} rows={3} />
        </div>
      </Seccao>

      <div className="border-b border-line p-5">
        <div className="mb-3 flex flex-wrap items-center gap-3">
          <h3 className="text-sm font-semibold">Datas de Visitas Posteriores</h3>
          <button type="button" onClick={() => set("prospVisitasDatas", [...f.prospVisitasDatas, ""])} className="no-print ml-auto flex items-center gap-1.5 rounded-md border border-line bg-paper px-3 py-2 text-sm font-medium text-ink hover:bg-rail">
            <span className="font-mono leading-none">+</span> Adicionar data de visita
          </button>
        </div>
        {f.prospVisitasDatas.length === 0 && (<p className="font-mono text-[11px] text-inksoft">Nenhuma data de visita posterior registada.</p>)}
        <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2 lg:grid-cols-3">
          {f.prospVisitasDatas.map((d, i) => (
            <div key={i} className="flex items-end gap-2">
              <div className="flex-1">
                <Campo label={`Visita ${i + 1}`} type="date" value={d} onChange={(v) => set("prospVisitasDatas", f.prospVisitasDatas.map((x, j) => (j === i ? v : x)))} />
              </div>
              <button type="button" onClick={() => set("prospVisitasDatas", f.prospVisitasDatas.filter((_, j) => j !== i))} className="no-print mb-1 rounded-md border border-line px-2.5 py-2 font-mono text-[11px] text-warn hover:bg-rail">✕</button>
            </div>
          ))}
        </div>
      </div>
    </>
  );

  /* ---------- separador 2 — abertura SAP ---------- */
  const aba2 = (
    <>
      <div className="grid grid-cols-1 gap-x-6 gap-y-5 border-b border-line p-5 sm:grid-cols-2 lg:grid-cols-4">
        <Campo label="N.º Cliente" mono obrigatorio erro={erro} value={f.numeroCliente} onChange={(v) => set("numeroCliente", v)} />
        <Campo label="Ex Cliente N.º" mono value={f.exClienteNumero} onChange={(v) => set("exClienteNumero", v)} />
        <CampoOuBloqueado label="Área de Vendas" valor={f.area} onChange={(v) => set("area", v.replace(/\D/g, "").slice(0, 3))} mono obrigatorio erro={erro} />
        <CampoOuBloqueado label="Inspector" valor={f.inspector} onChange={(v) => set("inspector", v)} obrigatorio erro={erro} />
      </div>

      <Seccao numero={1} titulo="Dados do Cliente" total={7}>
        <div className="grid grid-cols-1 gap-x-6 gap-y-5 p-5 sm:grid-cols-2 lg:grid-cols-3">
          <CampoOuBloqueado label="Firma do Cliente" valor={f.firma} onChange={(v) => set("firma", v)} obrigatorio erro={erro} />
          <CampoOuBloqueado label="Nome do Estabelecimento" valor={f.nomeEstabelecimento} onChange={(v) => set("nomeEstabelecimento", v)} obrigatorio erro={erro} />
          <CampoOuBloqueado label="N.º de Contribuinte" valor={f.contribuinte} onChange={(v) => set("contribuinte", v)} mono obrigatorio erro={erro} />
          <CampoOuBloqueado label="Morada" valor={f.morada} onChange={(v) => set("morada", v)} className="lg:col-span-2" obrigatorio erro={erro} />
          <CampoOuBloqueado label="Código Postal" valor={f.codigoPostal} onChange={(v) => set("codigoPostal", formatarCodigoPostal(v))} mono obrigatorio erro={erro} />
          <CampoOuBloqueado label="Localidade" valor={f.localidade} onChange={(v) => set("localidade", v)} obrigatorio erro={erro} />
          <OpcoesOuBloqueado label="Região" opcoes={REGIOES} valor={f.regiao} onChange={(v) => set("regiao", v)} obrigatorio erro={erro} />
          <CampoOuBloqueado label="País" valor={f.pais} onChange={(v) => set("pais", v)} obrigatorio erro={erro} />
          <CampoOuBloqueado label="Pessoa a Contactar" valor={f.pessoaContactar} onChange={(v) => set("pessoaContactar", v)} obrigatorio erro={erro} />
          <CampoOuBloqueado label="Dia de Descanso" valor={f.diaDescanso} onChange={(v) => set("diaDescanso", v)} obrigatorio erro={erro} />
          <CampoTelefoneOuBloqueado label="Telefone" valor={f.telefone} onChange={(v) => set("telefone", v)} obrigatorio erro={erro} />
          <CampoEmailOuBloqueado label="E-mail" valor={f.email} onChange={(v) => set("email", v)} obrigatorio erro={erro} />
        </div>
      </Seccao>

      <Seccao numero={2} titulo="Canal / Sector de Actividade / Grupo de Clientes" total={7}>
        <div className="grid grid-cols-1 gap-x-6 gap-y-5 p-5 sm:grid-cols-3">
          <Opcoes label="Canal de Distribuição" opcoes={CANAIS} obrigatorio erro={erro} value={f.canal} onChange={(v) => set("canal", v)} />
          <div className="space-y-4">
            <Opcoes label="Sector de Actividade" opcoes={SECTORES} obrigatorio erro={erro} value={f.sector} onChange={(v) => set("sector", v)} />
            {f.sector === "Outro" && (<Campo label="Qual?" obrigatorio erro={erro} value={f.sectorOutro} onChange={(v) => set("sectorOutro", v)} />)}
          </div>
          <div className="space-y-4">
            <Opcoes label="Grupo de Clientes" opcoes={GRUPOS} obrigatorio erro={erro} value={f.grupo} onChange={(v) => set("grupo", v)} />
            {f.grupo === "Outro" && (<>
              <Opcoes label="Qual grupo?" opcoes={GRUPOS_CLIENTES} obrigatorio erro={erro} value={f.grupoLista} onChange={(v) => set("grupoLista", v)} />
              {f.grupoLista === "Outros" && (<Campo label="Indique o grupo" obrigatorio erro={erro} value={f.grupoQual} onChange={(v) => set("grupoQual", v)} />)}
            </>)}
          </div>
        </div>
      </Seccao>

      <Seccao numero={3} titulo="Dados Financeiros" total={7}>
        <div className="grid grid-cols-1 gap-x-6 gap-y-5 p-5 sm:grid-cols-2">
          <Campo label="Condições de Pagamento" obrigatorio erro={erro} value={f.condicoesPagamento} onChange={(v) => set("condicoesPagamento", v)} />
          <Campo label="Bancos" value={f.bancos} onChange={(v) => set("bancos", v)} />
        </div>
      </Seccao>

      {eCafes && (
        <Seccao numero={4} titulo="Dados Normanvi (só clientes de Café HORECA)" total={7}>
          <div className="space-y-5 p-5">
            <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-3">
              <Campo label="Máquina de Café — Marca - Modelo" value={f.maquinaCafe} onChange={(v) => set("maquinaCafe", v)} />
              <Campo label="Moinho — Marca - Modelo" value={f.moinho} onChange={(v) => set("moinho", v)} />
              <Campo label="Máquina de Lavar — Marca - Modelo" value={f.maquinaLavar} onChange={(v) => set("maquinaLavar", v)} />
            </div>
            <p className="font-mono text-[11px] text-inksoft">Preencher apenas se o equipamento a prestar assistência não for propriedade da JMV.</p>
            <Opcoes label="Sistema de Débito" opcoes={SISTEMAS_DEBITO} value={f.sistemaDebito} onChange={(v) => set("sistemaDebito", v)} />
          </div>
        </Seccao>
      )}

      <Seccao numero={5} titulo="Local de Entrega da Mercadoria" total={7}>
        <div className="grid grid-cols-1 gap-x-6 gap-y-5 p-5 sm:grid-cols-2 lg:grid-cols-3">
          <Campo label="Morada" className="lg:col-span-2" value={f.entregaMorada} onChange={(v) => set("entregaMorada", v)} />
          <Campo label="Código Postal" mono value={f.entregaCodigoPostal} onChange={(v) => set("entregaCodigoPostal", formatarCodigoPostal(v))} />
          <Campo label="Localidade" value={f.entregaLocalidade} onChange={(v) => set("entregaLocalidade", v)} />
          <Campo label="Pessoa a Contactar" value={f.entregaPessoaContactar} onChange={(v) => set("entregaPessoaContactar", v)} />
          <CampoTelefone label="Telefone" value={f.entregaTelefone} onChange={(v) => set("entregaTelefone", v)} />
        </div>
      </Seccao>

      <Seccao numero={6} titulo="Observações" total={7}>
        <div className="space-y-4 p-5">
          <AreaTexto value={f.observacoes} onChange={(v) => set("observacoes", v)} rows={5} />
          <label className="flex items-start gap-3 rounded-md border border-line bg-panel px-3 py-3 text-sm">
            <input type="checkbox" checked={f.declaracao} onChange={(e) => set("declaracao", e.target.checked)} className="mt-0.5 size-4 accent-[var(--primary)]" />
            Declaro que me foi exibida a declaração de início de actividade fiscal / cartão de contribuinte do cliente, que verifiquei estar em conformidade.
          </label>
        </div>
      </Seccao>

      <Seccao numero={7} titulo="Condições de Fornecimento" total={7} extra={
        <button onClick={() => set("linhas", [...f.linhas, novaLinha()])} className="no-print ml-auto flex items-center gap-1.5 rounded-md border border-line bg-paper px-3 py-2 text-sm font-medium text-ink hover:bg-rail">
          <span className="font-mono leading-none">+</span> Adicionar linha
        </button>
      }>
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
                <th className="px-5 py-2.5 text-right font-medium">Qt. Bónus</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {f.linhas.map((l) => (
                <tr key={l.id} className="align-middle">
                  <td className="px-5 py-1"><input value={l.cod} onChange={(e) => setLinha(l.id, "cod", e.target.value)} className={`${celaCls} w-24 font-mono`} /></td>
                  <td className="px-3 py-1"><input value={l.designacao} onChange={(e) => setLinha(l.id, "designacao", e.target.value)} className={celaCls} /></td>
                  <td className="px-3 py-1"><input value={l.qtVenda} onChange={(e) => setLinha(l.id, "qtVenda", e.target.value)} className={`${celaCls} w-16 text-right font-mono`} /></td>
                  <td className="px-3 py-1"><input value={l.preco} onChange={(e) => setLinha(l.id, "preco", e.target.value)} className={`${celaCls} w-20 text-right font-mono`} /></td>
                  <td className="px-3 py-1"><input value={l.desconto} onChange={(e) => setLinha(l.id, "desconto", e.target.value)} className={`${celaCls} w-16 text-right font-mono`} /></td>
                  <td className="px-3 py-1"><input value={l.bonusCod} onChange={(e) => setLinha(l.id, "bonusCod", e.target.value)} className={`${celaCls} w-24 font-mono`} /></td>
                  <td className="px-3 py-1"><input value={l.bonusDesignacao} onChange={(e) => setLinha(l.id, "bonusDesignacao", e.target.value)} className={celaCls} /></td>
                  <td className="px-5 py-1"><input value={l.qtBonus} onChange={(e) => setLinha(l.id, "qtBonus", e.target.value)} className={`${celaCls} w-16 text-right font-mono`} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="px-5 pb-4 font-mono text-[11px] text-inksoft">Preencher o preço apenas caso seja diferente do preço de tabela geral.</p>
      </Seccao>
    </>
  );

  /* ---------- separador 3 — ficha para contrato ---------- */
  const aba3 = (
    <>
      <div className="grid grid-cols-1 gap-x-6 gap-y-5 border-b border-line p-5 sm:grid-cols-2 lg:grid-cols-4">
        <CampoOuBloqueado label="Área de Vendas" valor={f.area} onChange={(v) => set("area", v.replace(/\D/g, "").slice(0, 3))} mono obrigatorio erro={erro} />
        <CampoOuBloqueado label="Inspector" valor={f.inspector} onChange={(v) => set("inspector", v)} obrigatorio erro={erro} />
      </div>

      <Seccao numero={1} titulo="Identificação do Cliente" total={4}>
        <div className="grid grid-cols-1 gap-x-6 gap-y-5 p-5 sm:grid-cols-2 lg:grid-cols-3">
          <CampoOuBloqueado label="Firma do Cliente" valor={f.firma} onChange={(v) => set("firma", v)} />
          <CampoOuBloqueado label="Nome do Estabelecimento" valor={f.nomeEstabelecimento} onChange={(v) => set("nomeEstabelecimento", v)} />
          <CampoOuBloqueado label="N.º de Contribuinte" valor={f.contribuinte} onChange={(v) => set("contribuinte", v)} mono />
          <CampoOuBloqueado label="Morada" valor={f.morada} onChange={(v) => set("morada", v)} className="lg:col-span-2" />
          <CampoOuBloqueado label="Código Postal" valor={f.codigoPostal} onChange={(v) => set("codigoPostal", formatarCodigoPostal(v))} mono />
          <CampoOuBloqueado label="Localidade" valor={f.localidade} onChange={(v) => set("localidade", v)} />
          <OpcoesOuBloqueado label="Região" opcoes={REGIOES} valor={f.regiao} onChange={(v) => set("regiao", v)} />
          <CampoOuBloqueado label="País" valor={f.pais} onChange={(v) => set("pais", v)} />
          <CampoOuBloqueado label="Pessoa a Contactar" valor={f.pessoaContactar} onChange={(v) => set("pessoaContactar", v)} />
          <CampoOuBloqueado label="Dia de Descanso" valor={f.diaDescanso} onChange={(v) => set("diaDescanso", v)} />
          <CampoTelefoneOuBloqueado label="Telefone" valor={f.telefone} onChange={(v) => set("telefone", v)} />
          <CampoEmailOuBloqueado label="E-mail" valor={f.email} onChange={(v) => set("email", v)} />
          <Campo label="N.º do Cartão de Cidadão" mono value={f.contratoNumeroCC} onChange={(v) => set("contratoNumeroCC", v)} />
          <Campo label="Concelho" value={f.contratoConcelho} onChange={(v) => set("contratoConcelho", v)} />
        </div>
        <div className="border-t border-line p-5">
          <Opcoes label="Tipo de Cliente" opcoes={TIPOS_CLIENTE} value={f.contratoTipoCliente} onChange={(v) => set("contratoTipoCliente", v)} />
        </div>
      </Seccao>

      {f.contratoTipoCliente === "Cliente em Nome Individual" && (
        <Seccao numero={2} titulo="Cliente em Nome Individual" total={4}>
          <div className="grid grid-cols-1 gap-x-6 gap-y-5 p-5 sm:grid-cols-2 lg:grid-cols-3">
            <SimNao label="Natural de Portugal?" value={f.indNaturalidadePt} onChange={(v) => set("indNaturalidadePt", v)} />
            {f.indNaturalidadePt === "Não" && (<Campo label="Naturalidade" value={f.indNaturalidadeQual} onChange={(v) => set("indNaturalidadeQual", v)} />)}
            <Opcoes label="Estado civil" opcoes={ESTADOS_CIVIS} value={f.indEstadoCivil} onChange={(v) => set("indEstadoCivil", v)} />
            {(f.indEstadoCivil === "Casado(a)" || f.indEstadoCivil === "União de facto") && (<Campo label="Nome do cônjuge" value={f.indNomeConjuge} onChange={(v) => set("indNomeConjuge", v)} />)}
            <Campo label="Morada particular" className="lg:col-span-2" value={f.indMoradaParticular} onChange={(v) => set("indMoradaParticular", v)} />
            <Campo label="Localidade" value={f.indLocalidade} onChange={(v) => set("indLocalidade", v)} />
            <Campo label="Concelho" value={f.indConcelho} onChange={(v) => set("indConcelho", v)} />
            <CampoTelefone label="Telefone" value={f.indTelefone} onChange={(v) => set("indTelefone", v)} />
            <Campo label="N.º do Cartão de Cidadão" mono value={f.indNumeroCC} onChange={(v) => set("indNumeroCC", v)} />
          </div>
        </Seccao>
      )}

      {f.contratoTipoCliente === "Cliente Sociedade / Colectividade" && (
        <Seccao numero={2} titulo="Cliente Sociedade / Colectividade" total={4} extra={
          <button onClick={() => set("socios", [...f.socios, novoSocio()])} className="no-print ml-auto flex items-center gap-1.5 rounded-md border border-line bg-paper px-3 py-2 text-sm font-medium text-ink hover:bg-rail">
            <span className="font-mono leading-none">+</span> Adicionar signatário
          </button>
        }>
          <div className="space-y-5 p-5">
            <Campo label="Certidão permanente (código)" mono value={f.certidaoPermanente} onChange={(v) => set("certidaoPermanente", v)} />
            {f.socios.map((s, i) => (
              <div key={s.id} className="rounded-lg border border-line p-4">
                <p className="mb-3 font-mono text-[11px] uppercase tracking-wide text-inksoft">Signatário {i + 1}</p>
                <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2 lg:grid-cols-3">
                  <Campo label="Nome" value={s.nome} onChange={(v) => setSocio(s.id, "nome", v)} />
                  <Campo label="Cargo" value={s.cargo} onChange={(v) => setSocio(s.id, "cargo", v)} />
                  <Opcoes label="Estado civil" opcoes={ESTADOS_CIVIS} value={s.estadoCivil} onChange={(v) => setSocio(s.id, "estadoCivil", v)} />
                  <Campo label="Morada particular" className="lg:col-span-2" value={s.moradaParticular} onChange={(v) => setSocio(s.id, "moradaParticular", v)} />
                  <Campo label="Localidade" value={s.localidade} onChange={(v) => setSocio(s.id, "localidade", v)} />
                  <Campo label="N.º de contribuinte" mono value={s.contribuinte} onChange={(v) => setSocio(s.id, "contribuinte", v)} />
                </div>
                {f.socios.length > 1 && (<button onClick={() => set("socios", f.socios.filter((x) => x.id !== s.id))} className="no-print mt-3 rounded-md border border-line px-3 py-1.5 font-mono text-[11px] text-inksoft hover:bg-rail">Remover signatário</button>)}
              </div>
            ))}
          </div>
        </Seccao>
      )}

      <Seccao numero={3} titulo="Informações sobre o Cliente e o Estabelecimento" total={4}>
        <div className="grid grid-cols-1 gap-x-6 gap-y-5 p-5 sm:grid-cols-2 lg:grid-cols-3">
          <SimNao label="Cliente novo?" value={f.cliNovo} onChange={(v) => set("cliNovo", v)} />
          <Campo label="É nosso cliente em que estabelecimento?" value={f.cliNossoClienteEstab} onChange={(v) => set("cliNossoClienteEstab", v)} />
          <Campo label="Foi nosso cliente em que estabelecimento?" value={f.cliFoiNossoClienteEstab} onChange={(v) => set("cliFoiNossoClienteEstab", v)} />
          <Campo label="Anos de actividade" mono value={f.cliAnosActividade || f.prospAnosActividade} onChange={(v) => set("cliAnosActividade", v)} />
          <SimNao label="Tem outros estabelecimentos?" value={f.cliOutrosEstab || f.prospOutrosEstab} onChange={(v) => set("cliOutrosEstab", v)} />
          {(f.cliOutrosEstab || f.prospOutrosEstab) === "Sim" && (<Campo label="Quais?" value={f.cliOutrosEstabQuais || f.prospOutrosEstabQuais} onChange={(v) => set("cliOutrosEstabQuais", v)} />)}
          <Campo label="Marca de café que consome" value={f.cliMarcaConsome || f.prospMarcaCafe} onChange={(v) => set("cliMarcaConsome", v)} />
          <Opcoes label="Propriedade" opcoes={PROPRIEDADES} value={f.cliPropriedade} onChange={(v) => set("cliPropriedade", v)} />
          <Campo label="Informações comerciais" value={f.cliInformacoesComerciais} onChange={(v) => set("cliInformacoesComerciais", v)} />
          <SimNao label="Estabelecimento novo?" value={f.estabNovo || f.prospEstabNovo} onChange={(v) => set("estabNovo", v)} />
          {(f.estabNovo || f.prospEstabNovo) === "Não" && (<Campo label="Aberto há quanto tempo?" value={f.estabAbertoHa || f.prospAbertoHa} onChange={(v) => set("estabAbertoHa", v)} />)}
          <Campo label="Marca de café que consumia" value={f.estabMarcaCafeConsumia} onChange={(v) => set("estabMarcaCafeConsumia", v)} />
          <Campo label="Horário — das" type="time" value={f.estabHorarioDas || f.prospHorarioDas} onChange={(v) => set("estabHorarioDas", v)} />
          <Campo label="Horário — às" type="time" value={f.estabHorarioAs || f.prospHorarioAs} onChange={(v) => set("estabHorarioAs", v)} />
        </div>
        <div className="grid grid-cols-1 gap-x-6 gap-y-5 px-5 pb-5 sm:grid-cols-2">
          <AreaTexto label="Parecer sobre o estabelecimento" value={f.parecerEstabelecimento} onChange={(v) => set("parecerEstabelecimento", v)} rows={3} />
          <AreaTexto label="Parecer sobre o cliente" value={f.parecerCliente} onChange={(v) => set("parecerCliente", v)} rows={3} />
        </div>
      </Seccao>
    </>
  );

  /* ---------- separador 4 — pedido de investimento ---------- */
  function setItens(campo: keyof Ficha, itens: Item[]) {
    set(campo, itens as Ficha[typeof campo]);
  }

  type ColunaDef = { chave: keyof Item; label: string; largura: string; mono?: boolean; maxLen?: number };

  function TabelaItens({
    titulo, campoModo, campoItens, colunas,
  }: {
    titulo: string; campoModo: keyof Ficha; campoItens: keyof Ficha; colunas: ColunaDef[];
  }) {
    const itens = f[campoItens] as Item[];
    const actualizar = (itemId: string, k: keyof Item, v: string) =>
      setItens(campoItens, itens.map((it) => (it.id === itemId ? { ...it, [k]: v } : it)));
    return (
      <div className="border-b border-line p-5 last:border-b-0">
        <div className="mb-3 flex flex-wrap items-center gap-3">
          <h3 className="text-sm font-semibold">{titulo}</h3>
          <button onClick={() => setItens(campoItens, [...itens, novoItem()])} className="no-print ml-auto rounded-md border border-line bg-paper px-3 py-1.5 text-sm font-medium hover:bg-rail">+ Adicionar</button>
        </div>
        <Opcoes label="Modo de cedência" opcoes={MODOS_INVESTIMENTO} value={String(f[campoModo] ?? "")} onChange={(v) => set(campoModo, v as Ficha[typeof campoModo])} />
        <div className="mt-4 overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-line text-left font-mono text-[11px] uppercase tracking-wide text-inksoft">
                {colunas.map((c) => (
                  <th key={c.chave as string} className={`py-2 pr-3 font-medium ${c.largura.includes("min-w") ? "" : ""}`}>{c.label}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {itens.map((it) => (
                <tr key={it.id}>
                  {colunas.map((c, ci) => (
                    <td key={c.chave as string} className={`py-1 ${ci < colunas.length - 1 ? "pr-3" : ""} ${c.chave === "descricao" ? "min-w-[250px]" : ""}`}>
                      {c.chave === "descricao" ? (
                        <TextoExpansivel value={it.descricao} onChange={(v) => actualizar(it.id, "descricao", v)} placeholder="Descrição do material" />
                      ) : (
                        <input
                          value={it[c.chave] as string}
                          onChange={(e) => actualizar(it.id, c.chave, c.maxLen ? e.target.value.slice(0, c.maxLen) : e.target.value)}
                          className={`${celaCls} ${c.largura} ${c.mono ? "font-mono" : ""} ${c.chave === "qtd" ? "text-right" : ""}`}
                        />
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  const colMaquinas: ColunaDef[] = [
    { chave: "qtd", label: "Qt.", largura: "w-14", mono: true, maxLen: 2 },
    { chave: "cod", label: "Cód.", largura: "w-20", mono: true, maxLen: 6 },
    { chave: "descricao", label: "Descrição", largura: "" },
    { chave: "ref", label: "Referência", largura: "w-28", mono: true },
  ];
  const colMobiliario: ColunaDef[] = [
    { chave: "qtd", label: "Qt.", largura: "w-14", mono: true, maxLen: 2 },
    { chave: "cod", label: "Cód.", largura: "w-20", mono: true, maxLen: 6 },
    { chave: "descricao", label: "Descrição", largura: "" },
    { chave: "cor", label: "Cores e Pintura", largura: "w-32" },
  ];
  const colToldos: ColunaDef[] = [
    { chave: "qtd", label: "Qt.", largura: "w-14", mono: true, maxLen: 2 },
    { chave: "cod", label: "Cód.", largura: "w-20", mono: true, maxLen: 6 },
    { chave: "descricao", label: "Descrição", largura: "" },
    { chave: "cor", label: "Cor", largura: "w-24" },
    { chave: "largura", label: "Largura", largura: "w-20", mono: true },
    { chave: "avanco", label: "Avanço", largura: "w-20", mono: true },
    { chave: "altura", label: "Altura", largura: "w-20", mono: true },
  ];
  const colReclames = colToldos;
  const colOutros: ColunaDef[] = [
    { chave: "qtd", label: "Qt.", largura: "w-14", mono: true, maxLen: 2 },
    { chave: "cod", label: "Cód.", largura: "w-20", mono: true, maxLen: 6 },
    { chave: "descricao", label: "Descrição", largura: "" },
  ];

  const aba4 = (
    <>
      <div className="grid grid-cols-1 gap-x-6 gap-y-5 border-b border-line p-5 sm:grid-cols-2 lg:grid-cols-4">
        <Campo label="N.º do Pedido de Investimento" mono value={f.piNumero || proximoNumeroPI(f.area, f.id)} onChange={(v) => set("piNumero", v)} />
        <CampoOuBloqueado label="Área de Vendas" valor={f.area} onChange={(v) => set("area", v.replace(/\D/g, "").slice(0, 3))} mono obrigatorio erro={erro} />
        <CampoOuBloqueado label="Inspector" valor={f.inspector} onChange={(v) => set("inspector", v)} obrigatorio erro={erro} />
      </div>

      <Seccao numero={1} titulo="Identificação" total={4}>
        <div className="grid grid-cols-1 gap-x-6 gap-y-5 p-5 sm:grid-cols-2 lg:grid-cols-3">
          <CampoOuBloqueado label="Firma do Cliente" valor={f.firma} onChange={(v) => set("firma", v)} />
          <CampoOuBloqueado label="Nome do Estabelecimento" valor={f.nomeEstabelecimento} onChange={(v) => set("nomeEstabelecimento", v)} />
          <CampoOuBloqueado label="N.º de Contribuinte" valor={f.contribuinte} onChange={(v) => set("contribuinte", v)} mono />
          <CampoOuBloqueado label="Morada" valor={f.morada} onChange={(v) => set("morada", v)} className="lg:col-span-2" />
          <CampoOuBloqueado label="Código Postal" valor={f.codigoPostal} onChange={(v) => set("codigoPostal", formatarCodigoPostal(v))} mono />
          <CampoOuBloqueado label="Localidade" valor={f.localidade} onChange={(v) => set("localidade", v)} />
          <SimNao label="Já consumia café Torrié?" value={f.piJaConsumiaTorrie} onChange={(v) => set("piJaConsumiaTorrie", v)} />
        </div>
      </Seccao>

      <Seccao numero={2} titulo="Material a Colocar no Cliente" total={4}>
        <TabelaItens titulo="Máquinas" campoModo="piMaquinasModo" campoItens="piMaquinas" colunas={colMaquinas} />
        <TabelaItens titulo="Mobiliário" campoModo="piMobiliarioModo" campoItens="piMobiliario" colunas={colMobiliario} />
        <TabelaItens titulo="Toldos / Estores e Outros em Tela" campoModo="piToldosModo" campoItens="piToldos" colunas={colToldos} />
        <TabelaItens titulo="Reclames e Outros em Acrílico" campoModo="piReclamesModo" campoItens="piReclames" colunas={colReclames} />
        <TabelaItens titulo="Outros" campoModo="piOutrosModo" campoItens="piOutros" colunas={colOutros} />
      </Seccao>

      <Seccao numero={3} titulo="Condições Acordadas" total={4}>
        <div className="grid grid-cols-1 gap-x-6 gap-y-5 p-5 sm:grid-cols-2 lg:grid-cols-3">
          <SimNao label="Contrato?" value={f.piContratoSim} onChange={(v) => set("piContratoSim", v)} />
          {f.piContratoSim === "Sim" && (<>
            <Campo label="Contrato (anos)" mono value={f.piContrato} onChange={(v) => set("piContrato", v)} />
            <Campo label="Total de quilos para contrato" mono value={f.piTotalQuilos} onChange={(v) => set("piTotalQuilos", v)} />
          </>)}
          <Campo label="Média mensal (kg)" mono value={f.piMediaMensal} onChange={(v) => set("piMediaMensal", v)} />
          <Campo label="Lote" value={f.piLote} onChange={(v) => set("piLote", v)} />
          <Campo label="Bónus" value={f.piBonus} onChange={(v) => set("piBonus", v)} />
          <Campo label="Dizeres a aplicar na publicidade" className="lg:col-span-2" value={f.piDizeres} onChange={(v) => set("piDizeres", v)} />
        </div>
        <div className="px-5 pb-5">
          <AreaTexto label="Observações" value={f.piObservacoes} onChange={(v) => set("piObservacoes", v)} rows={3} />
        </div>
      </Seccao>

      <Seccao numero={4} titulo="Assinaturas e Controlo Interno" total={4}>
        <div className="space-y-5 p-5">
          <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2 lg:grid-cols-3">
            <Campo label="Data" type="date" value={f.piData} onChange={(v) => set("piData", v)} />
          </div>
          <p className="text-sm leading-relaxed">
            Aceito as condições acordadas em 3 e o pedido dos bens referidos em 2 de acordo com o(s) modo(s) de cedência aí referido(s).
          </p>
          <Assinatura label="Assinatura do Cliente" value={f.piAssinaturaClienteImg} onChange={(v) => set("piAssinaturaClienteImg", v)} />
          <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2 lg:grid-cols-3">
            <Campo label="Assinatura do vendedor" value={f.piAssinaturaVendedor} onChange={(v) => set("piAssinaturaVendedor", v)} />
            <Campo label="Assinatura do inspector" value={f.piAssinaturaInspector} onChange={(v) => set("piAssinaturaInspector", v)} />
          </div>
          <div className="border-t border-line pt-5">
            <p className="mb-4 font-mono text-[11px] uppercase tracking-wide text-inksoft">Controlo Interno — preencher / assinar à mão no documento impresso</p>
            <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2 lg:grid-cols-3">
              <Campo label="Data de recepção" type="date" value={f.piDataRecepcao} onChange={(v) => set("piDataRecepcao", v)} />
              <Campo label="Aprovação JMV" value={f.piAprovacaoJMV} onChange={(v) => set("piAprovacaoJMV", v)} />
              <Campo label="Data de aprovação" type="date" value={f.piDataAprovacao} onChange={(v) => set("piDataAprovacao", v)} />
              <Campo label="N.º de requisição" mono value={f.piNumRequisicao} onChange={(v) => set("piNumRequisicao", v)} />
              <Campo label="Data de entrega ao SAC" type="date" value={f.piDataEntregaSAC} onChange={(v) => set("piDataEntregaSAC", v)} />
              <Campo label="N.º do pedido de compra" mono value={f.piNumPedidoCompra} onChange={(v) => set("piNumPedidoCompra", v)} />
              <Campo label="Custo (€)" mono value={f.piCusto} onChange={(v) => set("piCusto", v)} />
            </div>
          </div>
        </div>
      </Seccao>
    </>
  );

  const abas = [aba1, aba2, aba3, aba4];

  return (
    <div className="min-h-screen bg-rail text-ink antialiased">
      <AppHeader />
      <main className="mx-auto max-w-6xl px-4 py-5 sm:px-6 sm:py-7">
        <section className="print-block rounded-xl border border-line bg-paper">
          <div className="print-header flex flex-col gap-1 border-b-2 border-ink px-5 py-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-primary">Ficha de Cliente · Mercado Interno</p>
              <h1 className="text-2xl font-semibold tracking-tight text-balance">{f.firma || "Nova ficha de cliente"}</h1>
            </div>
            <p className="font-mono text-[11px] text-inksoft">{f.numeroCliente ? `N.º Cliente ${f.numeroCliente} · ` : ""}{SEPARADORES[aba]}</p>
          </div>

          <div className="no-print flex flex-wrap gap-1 border-b border-line bg-panel px-3 py-3">
            {SEPARADORES.map((t, i) => (
              <button key={t} onClick={() => { setAba(i); setErro(false); }} className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${aba === i ? "bg-ink text-paper" : "border border-line bg-paper text-inksoft hover:bg-rail"}`}>{t}</button>
            ))}
          </div>

          {abas[aba]}

          <div className="no-print flex flex-col-reverse gap-3 border-t border-line p-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="font-mono text-[11px] text-inksoft">
              {erro && faltam.length > 0 ? `Faltam ${faltam.length} campos obrigatórios.` : guardado ? "Ficha guardada neste aparelho." : "Alterações por guardar."}
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <button onClick={() => navigate({ to: "/" })} className="flex items-center gap-2 rounded-md border border-line bg-paper px-4 py-3 text-sm font-medium text-inksoft hover:bg-rail">
                <span className="font-mono leading-none">✕</span> Cancelar
              </button>
              <button onClick={() => imprimirAba(aba)} className="flex items-center gap-2 rounded-md border border-line bg-paper px-4 py-3 text-sm font-medium text-ink hover:bg-rail">
                <span className="font-mono leading-none">⤓</span> Imprimir separador / PDF
              </button>
              <button onClick={guardar} className="flex items-center gap-2 rounded-md bg-primary px-5 py-3 text-sm font-medium text-primary-foreground ring-1 ring-primary">
                <span className="font-mono leading-none">✓</span> Guardar ficha
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

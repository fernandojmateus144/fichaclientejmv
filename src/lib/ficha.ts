export type Linha = {
  id: string;
  cod: string;
  designacao: string;
  qtVenda: string;
  preco: string;
  desconto: string;
  bonusCod: string;
  bonusDesignacao: string;
  qtBonus: string;
};

export type Item = {
  id: string;
  qtd: string;
  cod: string;
  descricao: string;
  ref: string;
  cor: string;
  largura: string;
  avanco: string;
  altura: string;
};

export type Socio = {
  id: string;
  nome: string;
  cargo: string;
  estadoCivil: string;
  moradaParticular: string;
  localidade: string;
  contribuinte: string;
};

export type Ficha = {
  id: string;
  criadoEm: string;
  actualizadoEm: string;
  numeroCliente: string;
  exClienteNumero: string;
  area: string;

  inspector: string;
  firma: string;
  nomeEstabelecimento: string;
  contribuinte: string;
  morada: string;
  codigoPostal: string;
  localidade: string;
  regiao: string;
  pais: string;
  pessoaContactar: string;
  diaDescanso: string;
  telefone: string;
  email: string;
  canal: string;
  sector: string;
  sectorOutro: string;
  grupo: string;
  grupoLista: string;
  grupoQual: string;
  condicoesPagamento: string;
  bancos: string;
  maquinaCafe: string;
  moinho: string;
  maquinaLavar: string;
  sistemaDebito: string;
  entregaMorada: string;
  entregaCodigoPostal: string;
  entregaLocalidade: string;
  entregaPessoaContactar: string;
  entregaTelefone: string;
  observacoes: string;
  declaracao: boolean;
  linhas: Linha[];

  // 1 — Ficha de Prospecção
  prospData: string;
  prospRespNegociacao: string;
  prospAnosActividade: string;
  prospJaFoiCliente: string;
  prospJaFoiClienteOnde: string;
  prospConheceEmpresa: string;
  prospConheceComo: string;
  prospConheceAlguem: string;
  prospOutrosEstab: string;
  prospOutrosEstabQuais: string;
  prospDegustacao: string;
  prospDegustacaoOpiniao: string;
  prospEstabNovo: string;
  prospAbertoHa: string;
  prospTrespasse: string;
  prospVinculo: string;
  prospArrendamento: string;
  prospArrendamentoAte: string;
  prospRenda: string;
  prospMarcaCafe: string;
  prospConsumoMensal: string;
  prospLote: string;
  prospPreco: string;
  prospDesconto: string;
  prospBonus: string;
  prospTemContrato: string;
  prospContratoTipo: string;
  prospFimContrato: string;
  prospHorarioDas: string;
  prospHorarioAs: string;
  prospNumEstabArea: string;
  prospTipoEstab: string;
  prospTipoEstabOutro: string;
  prospPontosFracos: string;
  prospMaquinas: string;
  prospMobiliario: string;
  prospVerba: string;
  prospLouca: string;
  prospAssistencia: string;
  prospToldos: string;
  prospReclames: string;
  prospOutros: string;
  prospLoteInvestimento: string;
  prospCondicoes: string;
  prospCaptar: string;
  prospObservacoes: string;
  prospVisitasDatas: string[];

  // 3 — Ficha de Cliente para Contrato
  contratoTipoCliente: string;
  contratoNumeroCC: string;
  contratoConcelho: string;
  indNaturalidadePt: string;
  indNaturalidadeQual: string;
  indEstadoCivil: string;
  indNomeConjuge: string;
  indMoradaParticular: string;
  indLocalidade: string;
  indConcelho: string;
  indTelefone: string;
  indNumeroCC: string;
  socios: Socio[];
  certidaoPermanente: string;
  cliNovo: string;
  cliNossoClienteEstab: string;
  cliFoiNossoClienteEstab: string;
  cliAnosActividade: string;
  cliOutrosEstab: string;
  cliOutrosEstabQuais: string;
  cliMarcaConsome: string;
  cliPropriedade: string;
  cliInformacoesComerciais: string;
  estabNovo: string;
  estabAbertoHa: string;
  estabMarcaCafeConsumia: string;
  estabHorarioDas: string;
  estabHorarioAs: string;
  parecerEstabelecimento: string;
  parecerCliente: string;

  // 4 — Pedido de Investimento
  piNumero: string;
  piJaConsumiaTorrie: string;
  piMaquinasModo: string;
  piMaquinas: Item[];
  piMobiliarioModo: string;
  piMobiliario: Item[];
  piToldosModo: string;
  piToldos: Item[];
  piReclamesModo: string;
  piReclames: Item[];
  piOutrosModo: string;
  piOutros: Item[];
  piContratoSim: string;
  piTotalQuilos: string;
  piContrato: string;
  piMediaMensal: string;
  piLote: string;
  piBonus: string;
  piDizeres: string;
  piData: string;
  piAssinaturaCliente: string;
  piAssinaturaClienteImg: string;
  piAprovacaoJMV: string;
  piDataAprovacao: string;
  piObservacoes: string;
  piAssinaturaVendedor: string;
  piAssinaturaInspector: string;
  piDataRecepcao: string;
  piNumRequisicao: string;
  piDataEntregaSAC: string;
  piNumPedidoCompra: string;
  piCusto: string;
};

export const SIM_NAO = ["Sim", "Não"];
export const VINCULOS = ["Dono do imóvel", "Dono do negócio", "Explorador", "Subexplorador"];
export const TIPOS_ESTAB = ["Café", "Restaurante", "Snack-Bar", "Bar", "Empresa", "Hotel", "Outro"];
export const ESTADOS_CIVIS = ["Solteiro(a)", "Casado(a)", "União de facto", "Divorciado(a)", "Viúvo(a)"];
export const TIPOS_CLIENTE = ["Cliente em Nome Individual", "Cliente Sociedade / Colectividade"];
export const PROPRIEDADES = ["Proprietário do imóvel", "Dono do trespasse", "Explorador"];
export const MODOS_INVESTIMENTO = [
  "Empréstimo gratuito pelo tempo de consumo de cafés Torrié",
  "Venda nas condições do contrato a celebrar",
];


export const CANAIS = [
  "Moderna Distribuição Retalhista",
  "Moderna Distribuição Grossista",
  "Retalhista (em contrato)",
  "HORECA",
  "Grossista Tradicional",
  "Clientes Ocasionais / Natal",
];

export const SECTORES = ["Cafés", "Bebidas", "Outro"];
export const GRUPOS = ["Nenhum", "Outro"];

export const GRUPOS_CLIENTES = [
  "01 — Auchan",
  "02 — GCT",
  "03 — Sonae",
  "04 — Makro",
  "05 — Carrefour",
  "06 — Regional Mercadorias",
  "07 — Cooplecnorte",
  "08 — Unapor",
  "09 — CNR",
  "10 — ACCOR AMORIM",
  "11 — Unica",
  "12 — Grossão",
  "13 — GSI",
  "14 — Euromadi/Unimark",
  "15 — Recheio",
  "16 — Feira Nova",
  "17 — Pingo Doce",
  "18 — Uniarme",
  "19 — M24",
  "20 — Mercado Externo",
  "21 — Jorge Sá-Pofuturo",
  "22 — Jumbo (Net)",
  "23 — Feira Nova LD",
  "24 — ITMP (MP)",
  "25 — Makro (Net)",
  "26 — Hotusa",
  "27 — PLUS",
  "28 — EL CORTE INGLÉS",
  "29 — DIA/MINIPRECO",
  "30 — INTERMARCHE/LOJAS",
  "31 — BRASA RIO",
  "32 — Madureiras",
  "33 — La Movida",
  "34 — Pedra Alta",
  "35 — MCH Sonae Grossista",
  "36 — GC Hoteis Sede",
  "37 — GC Hoteis Lisboa",
  "38 — GC Of/Vending Sede",
  "39 — GC Of/Vending Lisboa",
  "40 — Hoteis Resto Pais",
  "41 — Of/Vending Resto Pai",
  "42 — Prom Vnd CH-Algarve",
  "43 — Concursos Publicos",
  "44 — REPSOL",
  "45 — Clientes BPI",
  "46 — Lidl & Cia",
  "47 — CNR",
  "48 — REPSOL/lojas N/cent.",
  "49 — ALDI",
  "50 — Grupo Nata-Lisboa",
  "51 — GC Hoteis Algarve",
  "52 — AC Group",
  "53 — LOJAS DIR. ELECLERC",
  "A2 — (E-C)GCT",
  "A3 — (E-C)GROSSÃO",
  "A4 — (E-C)Unimark",
  "A9 — (E-C)CNR",
  "B3 — (E-C)GSI",
  "B4 — (E-C)UNICA",
  "B8 — (E-C)Uniarme",
  "Outros",
];

export const REGIOES = [
  "Minho",
  "Trás-os-Montes e Alto Douro",
  "Douro Litoral",
  "Beira Litoral",
  "Beira Alta",
  "Beira Baixa",
  "Beira Interior",
  "Estremadura",
  "Ribatejo",
  "Alto Alentejo",
  "Alentejo Central",
  "Baixo Alentejo",
  "Algarve",
  "Açores",
  "Madeira",
];

export function formatarCodigoPostal(v: string) {
  const d = v.replace(/\D/g, "").slice(0, 7);
  return d.length > 4 ? `${d.slice(0, 4)}-${d.slice(4)}` : d;
}

export function formatarTelefone(v: string) {
  return v.replace(/\D/g, "").replace(/^351/, "").slice(0, 9);
}

export function telefoneCompleto(v: string) {
  return v ? `+351 ${v}` : "";
}

export function emailValido(v: string) {
  return /^[^\s@]+@[^\s@]+\.[A-Za-z]{2,}$/.test(v);
}
export const SISTEMAS_DEBITO = [
  "A - Cliente Paga Tudo",
  "B - Cliente Paga Peças",
  "C - JMV Paga Tudo",
];

const KEY = "jmv-fichas";

export function novaLinha(): Linha {
  return {
    id: crypto.randomUUID(),
    cod: "",
    designacao: "",
    qtVenda: "",
    preco: "",
    desconto: "",
    bonusCod: "",
    bonusDesignacao: "",
    qtBonus: "",
  };
}

export function novaFicha(): Ficha {
  const agora = new Date().toISOString();
  return {
    id: crypto.randomUUID(),
    criadoEm: agora,
    actualizadoEm: agora,
    numeroCliente: "",
    exClienteNumero: "",
    area: "",
    
    inspector: "",
    firma: "",
    nomeEstabelecimento: "",
    contribuinte: "",
    morada: "",
    codigoPostal: "",
    localidade: "",
    regiao: "",
    pais: "Portugal",
    pessoaContactar: "",
    diaDescanso: "",
    telefone: "",
    email: "",
    canal: "",
    sector: "",
    sectorOutro: "",
    grupo: "Nenhum",
    grupoLista: "",
    grupoQual: "",
    condicoesPagamento: "",
    bancos: "",
    maquinaCafe: "",
    moinho: "",
    maquinaLavar: "",
    sistemaDebito: "",
    entregaMorada: "",
    entregaCodigoPostal: "",
    entregaLocalidade: "",
    entregaPessoaContactar: "",
    entregaTelefone: "",
    observacoes: "",
    declaracao: false,
    linhas: [novaLinha()],

    prospData: "",
    prospRespNegociacao: "",
    prospAnosActividade: "",
    prospJaFoiCliente: "",
    prospJaFoiClienteOnde: "",
    prospConheceEmpresa: "",
    prospConheceComo: "",
    prospConheceAlguem: "",
    prospOutrosEstab: "",
    prospOutrosEstabQuais: "",
    prospDegustacao: "",
    prospDegustacaoOpiniao: "",
    prospEstabNovo: "",
    prospAbertoHa: "",
    prospTrespasse: "",
    prospVinculo: "",
    prospArrendamento: "",
    prospArrendamentoAte: "",
    prospRenda: "",
    prospMarcaCafe: "",
    prospConsumoMensal: "",
    prospLote: "",
    prospPreco: "",
    prospDesconto: "",
    prospBonus: "",
    prospTemContrato: "",
    prospContratoTipo: "",
    prospFimContrato: "",
    prospHorarioDas: "",
    prospHorarioAs: "",
    prospNumEstabArea: "",
    prospTipoEstab: "",
    prospTipoEstabOutro: "",
    prospPontosFracos: "",
    prospMaquinas: "",
    prospMobiliario: "",
    prospVerba: "",
    prospLouca: "",
    prospAssistencia: "",
    prospToldos: "",
    prospReclames: "",
    prospOutros: "",
    prospLoteInvestimento: "",
    prospCondicoes: "",
    prospCaptar: "",
    prospObservacoes: "",
    prospVisitasDatas: [],

    contratoTipoCliente: "",
    contratoNumeroCC: "",
    contratoConcelho: "",
    indNaturalidadePt: "",
    indNaturalidadeQual: "",
    indEstadoCivil: "",
    indNomeConjuge: "",
    indMoradaParticular: "",
    indLocalidade: "",
    indConcelho: "",
    indTelefone: "",
    indNumeroCC: "",
    socios: [novoSocio()],
    certidaoPermanente: "",
    cliNovo: "",
    cliNossoClienteEstab: "",
    cliFoiNossoClienteEstab: "",
    cliAnosActividade: "",
    cliOutrosEstab: "",
    cliOutrosEstabQuais: "",
    cliMarcaConsome: "",
    cliPropriedade: "",
    cliInformacoesComerciais: "",
    estabNovo: "",
    estabAbertoHa: "",
    estabMarcaCafeConsumia: "",
    estabHorarioDas: "",
    estabHorarioAs: "",
    parecerEstabelecimento: "",
    parecerCliente: "",

    piNumero: "",
    piJaConsumiaTorrie: "",
    piMaquinasModo: "",
    piMaquinas: [novoItem()],
    piMobiliarioModo: "",
    piMobiliario: [novoItem()],
    piToldosModo: "",
    piToldos: [novoItem()],
    piReclamesModo: "",
    piReclames: [novoItem()],
    piOutrosModo: "",
    piOutros: [novoItem()],
    piContratoSim: "",
    piTotalQuilos: "",
    piContrato: "",
    piMediaMensal: "",
    piLote: "",
    piBonus: "",
    piDizeres: "",
    piData: "",
    piAssinaturaCliente: "",
    piAssinaturaClienteImg: "",
    piAprovacaoJMV: "",
    piDataAprovacao: "",
    piObservacoes: "",
    piAssinaturaVendedor: "",
    piAssinaturaInspector: "",
    piDataRecepcao: "",
    piNumRequisicao: "",
    piDataEntregaSAC: "",
    piNumPedidoCompra: "",
    piCusto: "",
  };
}

export function novoItem(): Item {
  return {
    id: crypto.randomUUID(),
    qtd: "",
    cod: "",
    descricao: "",
    ref: "",
    cor: "",
    largura: "",
    avanco: "",
    altura: "",
  };
}

export function novoSocio(): Socio {
  return {
    id: crypto.randomUUID(),
    nome: "",
    cargo: "",
    estadoCivil: "",
    moradaParticular: "",
    localidade: "",
    contribuinte: "",
  };
}

function normalizar(f: Partial<Ficha>): Ficha {
  const base = novaFicha();
  return { ...base, ...f, id: f.id ?? base.id };
}

export function lerFichas(): Ficha[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    const dados = JSON.parse(raw) as Partial<Ficha>[];
    return Array.isArray(dados) ? dados.map(normalizar) : [];
  } catch {
    return [];
  }
}

export function lerFicha(id: string): Ficha | undefined {
  return lerFichas().find((f) => f.id === id);
}


export function guardarFicha(ficha: Ficha) {
  const fichas = lerFichas();
  const idx = fichas.findIndex((f) => f.id === ficha.id);
  const actualizada = { ...ficha, actualizadoEm: new Date().toISOString() };
  if (idx >= 0) fichas[idx] = actualizada;
  else fichas.unshift(actualizada);
  window.localStorage.setItem(KEY, JSON.stringify(fichas));
  return actualizada;
}

export function apagarFicha(id: string) {
  const fichas = lerFichas().filter((f) => f.id !== id);
  window.localStorage.setItem(KEY, JSON.stringify(fichas));
}

export function totalLinha(l: Linha) {
  const q = parseFloat(l.qtVenda.replace(",", ".")) || 0;
  const p = parseFloat(l.preco.replace(",", ".")) || 0;
  const d = parseFloat(l.desconto.replace(",", ".")) || 0;
  return q * p * (1 - d / 100);
}

export function totalFicha(ficha: Ficha) {
  return ficha.linhas.reduce((s, l) => s + totalLinha(l), 0);
}

export function euros(v: number) {
  return v.toLocaleString("pt-PT", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function proximoNumeroPI(area: string, idActual?: string) {
  const usados = lerFichas()
    .filter((f) => f.id !== idActual)
    .map((f) => parseInt((f.piNumero || "").split("/")[0] ?? "", 10))
    .filter((n) => Number.isFinite(n));
  const seguinte = (usados.length ? Math.max(...usados) : 0) + 1;
  return `${String(seguinte).padStart(4, "0")}/${area || "—"}`;
}

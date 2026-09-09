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

export type Ficha = {
  id: string;
  criadoEm: string;
  actualizadoEm: string;
  numeroCliente: string;
  exClienteNumero: string;
  area: string;
  vendedor: string;
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
};

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
    vendedor: "",
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
    linhas: [novaLinha(), novaLinha(), novaLinha()],
  };
}

export function lerFichas(): Ficha[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    const dados = JSON.parse(raw) as Ficha[];
    return Array.isArray(dados) ? dados : [];
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

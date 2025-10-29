export interface EstoqueItem {
  id: string;
  codigo: string;
  nome: string;
  categoria: string;
  marca: string;
  modelo: string;
  quantidade: number;
  quantidadeMinima: number;
  unidade: string;
  valorUnitario: number;
  valorTotal: number;
  local: string;
  dataValidade: string;
  status: "disponivel" | "baixo" | "vencendo" | "vencido";
  observacoes: string;
}

export interface Categoria {
  id: string;
  nome: string;
  descricao: string;
  cor: string;
}
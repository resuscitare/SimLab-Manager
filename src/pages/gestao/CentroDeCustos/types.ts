export interface InventoryItem {
  id: string;
  lote: string;
  numeroItem: string;
  descricao: string;
  marcaModelo: string;
  quantidadeRecebida: number;
  unidade: string;
  valorUnitario: number;
  quantidadeSaida: number;
  estoqueAtual: number;
  dataEntrada: string;
  ultimaSaida?: string;
  fornecedor?: string;
  categoria?: string;
  localizacao?: string;
  status: "ativo" | "baixo" | "centro-custos" | "inativo";
}

export interface InventoryAlert {
  id: string;
  type: "critico" | "baixo";
  message: string;
  count: number;
}
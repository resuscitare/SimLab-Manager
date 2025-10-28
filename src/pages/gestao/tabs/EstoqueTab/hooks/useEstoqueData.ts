import { useState, useEffect } from "react";
import { EstoqueItem, Categoria } from "../types";
import { showSuccess, showError } from "@/utils/toast";

export const useEstoqueData = () => {
  const [itens, setItens] = useState<EstoqueItem[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [locais, setLocais] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const categoriasPredefinidas: Categoria[] = [
    { id: "medicamentos", nome: "Medicamentos", descricao: "Fármacos e medicamentos", cor: "bg-red-100 text-red-800" },
    { id: "equipamentos", nome: "Equipamentos", descricao: "Equipamentos médicos e de simulação", cor: "bg-blue-100 text-blue-800" },
    { id: "materiais", nome: "Materiais", descricao: "Materiais de consumo e descartáveis", cor: "bg-green-100 text-green-800" },
    { id: "insumos", nome: "Insumos", descricao: "Insumos de escritório e limpeza", cor: "bg-yellow-100 text-yellow-800" },
    { id: "uniformes", nome: "Uniformes", descricao: "Uniformes e EPIs", cor: "bg-purple-100 text-purple-800" },
  ];

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = () => {
    try {
      // Carregar itens do estoque
      const itensSalvos = localStorage.getItem('estoque_centro_custos');
      if (itensSalvos) {
        const itensParseados = JSON.parse(itensSalvos);
        setItens(itensParseados.map(item => ({
          ...item,
          status: calcularStatus(item),
          valorTotal: item.quantidade * item.valorUnitario
        })));
      } else {
        // Dados mock para demonstração
        const itensMock: EstoqueItem[] = [
          {
            id: "1",
            codigo: "MED001",
            nome: "Adrenalina 1mg/1mL",
            categoria: "medicamentos",
            marca: "Hypofarma",
            modelo: "Ampola 1mL",
            quantidade: 50,
            quantidadeMinima: 10,
            unidade: "ampolas",
            valorUnitario: 15.50,
            valorTotal: 775,
            local: "Laboratório Térreo > Armário de Medicamentos > Gaveta A",
            dataValidade: "2025-12-31",
            status: "disponivel",
            observacoes: "Armazenar em temperatura ambiente"
          },
          {
            id: "2",
            codigo: "EQP001",
            nome: "Simulador Adulto Laerdal",
            categoria: "equipamentos",
            marca: "Laerdal",
            modelo: "SimMan 3G",
            quantidade: 2,
            quantidadeMinima: 1,
            unidade: "unidades",
            valorUnitario: 45000,
            valorTotal: 90000,
            local: "Laboratório Térreo > Sala de Simulação A",
            dataValidade: "",
            status: "disponivel",
            observacoes: "Equipamento de alta fidelidade"
          }
        ];
        setItens(itensMock);
      }

      // Carregar locais
      const locaisSalvos = localStorage.getItem('simlab_locais');
      if (locaisSalvos) {
        setLocais(JSON.parse(locaisSalvos));
      }

      setCategorias(categoriasPredefinidas);
      setLoading(false);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
      showError("Erro ao carregar dados do estoque");
      setLoading(false);
    }
  };

  const calcularStatus = (item: EstoqueItem): EstoqueItem["status"] => {
    if (item.dataValidade) {
      const dataValidade = new Date(item.dataValidade);
      const hoje = new Date();
      const diasParaVencer = Math.ceil((dataValidade.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24));
      
      if (diasParaVencer < 0) return "vencido";
      if (diasParaVencer <= 30) return "vencendo";
    }
    
    if (item.quantidade <= item.quantidadeMinima) return "baixo";
    return "disponivel";
  };

  const salvarItem = (item: EstoqueItem) => {
    try {
      const itensAtualizados = itens.map(i => i.id === item.id ? item : i);
      if (!item.id) {
        itensAtualizados.push({ ...item, id: Date.now().toString() });
      }
      setItens(itensAtualizados);
      localStorage.setItem('estoque_centro_custos', JSON.stringify(itensAtualizados));
      showSuccess("Item salvo com sucesso!");
    } catch (error) {
      showError("Erro ao salvar item");
    }
  };

  const excluirItem = (id: string) => {
    try {
      const itensAtualizados = itens.filter(item => item.id !== id);
      setItens(itensAtualizados);
      localStorage.setItem('estoque_centro_custos', JSON.stringify(itensAtualizados));
      showSuccess("Item excluído com sucesso!");
    } catch (error) {
      showError("Erro ao excluir item");
    }
  };

  return {
    itens,
    categorias,
    locais,
    loading,
    salvarItem,
    excluirItem,
    calcularStatus
  };
};
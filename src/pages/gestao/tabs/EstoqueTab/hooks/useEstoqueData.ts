import { useState, useEffect } from "react";
import { EstoqueItem, Categoria } from "../types";
import { Local } from "@/types";
import { showSuccess, showError } from "@/utils/toast";

const CATEGORIAS_PREDEFINIDAS: Categoria[] = [
  { id: "medicamentos", nome: "Medicamentos", descricao: "Fármacos e medicamentos", cor: "bg-red-100 text-red-800" },
  { id: "equipamentos", nome: "Equipamentos", descricao: "Equipamentos médicos e de simulação", cor: "bg-blue-100 text-blue-800" },
  { id: "materiais", nome: "Materiais", descricao: "Materiais de consumo e descartáveis", cor: "bg-green-100 text-green-800" },
  { id: "insumos", nome: "Insumos", descricao: "Insumos de escritório e limpeza", cor: "bg-yellow-100 text-yellow-800" },
  { id: "uniformes", nome: "Uniformes", descricao: "Uniformes e EPIs", cor: "bg-purple-100 text-purple-800" },
];

export const useEstoqueData = () => {
  const [itens, setItens] = useState<EstoqueItem[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [locais, setLocais] = useState<Local[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const savedItens = localStorage.getItem('simlab_estoque_itens');
      if (savedItens) {
        setItens(JSON.parse(savedItens));
      }

      const savedLocais = localStorage.getItem('simlab_locais');
      if (savedLocais) {
        setLocais(JSON.parse(savedLocais));
      }

      setCategorias(CATEGORIAS_PREDEFINIDAS);
    } catch (e) {
      showError("Erro ao carregar dados do estoque.");
    } finally {
      setLoading(false);
    }
  }, []);

  const saveData = (newItens: EstoqueItem[]) => {
    try {
      localStorage.setItem('simlab_estoque_itens', JSON.stringify(newItens));
      setItens(newItens);
    } catch (e) {
      showError("Erro ao salvar dados no armazenamento local.");
    }
  };

  const salvarItem = (item: EstoqueItem) => {
    const index = itens.findIndex(i => i.id === item.id);
    let newItens;
    if (index > -1) {
      newItens = [...itens];
      newItens[index] = item;
    } else {
      newItens = [...itens, { ...item, id: Date.now().toString() }];
    }
    saveData(newItens);
    showSuccess("Item salvo com sucesso!");
  };

  const excluirItem = (id: string) => {
    if (window.confirm("Tem certeza que deseja excluir este item?")) {
      const newItens = itens.filter(i => i.id !== id);
      saveData(newItens);
      showSuccess("Item excluído com sucesso!");
    }
  };

  const importarItens = (novosItens: EstoqueItem[]) => {
    const updatedItens = [...itens];
    novosItens.forEach(newItem => {
      const existingIndex = updatedItens.findIndex(i => i.codigo === newItem.codigo);
      if (existingIndex > -1) {
        updatedItens[existingIndex] = { ...updatedItens[existingIndex], ...newItem, id: updatedItens[existingIndex].id };
      } else {
        updatedItens.push({ ...newItem, id: Date.now().toString() + Math.random() });
      }
    });
    saveData(updatedItens);
    showSuccess(`${novosItens.length} itens importados/atualizados.`);
  };

  return {
    itens,
    categorias,
    locais,
    loading,
    salvarItem,
    excluirItem,
    importarItens,
    setItens: saveData
  };
};
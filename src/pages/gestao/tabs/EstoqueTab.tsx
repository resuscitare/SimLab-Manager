"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { showSuccess, showError } from "@/utils/toast";
import { EstoqueStats } from "./EstoqueTab/components/EstoqueStats";
import { EstoqueFilters } from "./EstoqueTab/components/EstoqueFilters";
import { EstoqueTable } from "./EstoqueTab/components/EstoqueTable";
import { ItemDialog } from "./EstoqueTab/components/ItemDialog";
import { ImportDialog } from "./EstoqueTab/components/ImportDialog";
import { useEstoqueData } from "./EstoqueTab/hooks/useEstoqueData";
import { useEstoqueUtils } from "./EstoqueTab/hooks/useEstoqueUtils";
import { EstoqueItem } from "./EstoqueTab/types";
import * as XLSX from 'xlsx';

const EstoqueTab = () => {
  const {
    itens,
    categorias,
    locais,
    loading,
    salvarItem,
    excluirItem,
    importarItens,
  } = useEstoqueData();

  const { calcularStatus } = useEstoqueUtils();

  const [searchTerm, setSearchTerm] = useState("");
  const [categoriaFiltro, setCategoriaFiltro] = useState("todas");
  const [statusFiltro, setStatusFiltro] = useState("todos");
  const [ordenacao, setOrdenacao] = useState("nome");
  const [isItemDialogOpen, setIsItemDialogOpen] = useState(false);
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [itemEditando, setItemEditando] = useState<EstoqueItem | null>(null);

  const itensComStatus = useMemo(() => itens.map(item => ({ ...item, status: calcularStatus(item) })), [itens, calcularStatus]);

  const itensFiltrados = useMemo(() => {
    return itensComStatus.filter(item => {
      const matchSearch = item.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.marca.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchCategoria = categoriaFiltro === "todas" || item.categoria === categoriaFiltro;
      const matchStatus = statusFiltro === "todos" || item.status === statusFiltro;
      
      return matchSearch && matchCategoria && matchStatus;
    });
  }, [itensComStatus, searchTerm, categoriaFiltro, statusFiltro]);

  const itensOrdenados = useMemo(() => {
    return [...itensFiltrados].sort((a, b) => {
      switch (ordenacao) {
        case "nome": return a.nome.localeCompare(b.nome);
        case "codigo": return a.codigo.localeCompare(b.codigo);
        case "quantidade": return b.quantidade - a.quantidade;
        case "valor": return b.valorTotal - a.valorTotal;
        case "status": return a.status.localeCompare(b.status);
        default: return 0;
      }
    });
  }, [itensFiltrados, ordenacao]);

  const estatisticas = useMemo(() => {
    return {
      total: itens.length,
      disponivel: itensComStatus.filter(item => item.status === "disponivel").length,
      baixo: itensComStatus.filter(item => item.status === "baixo").length,
      vencendo: itensComStatus.filter(item => item.status === "vencendo").length,
      vencido: itensComStatus.filter(item => item.status === "vencido").length,
      valorTotal: itens.reduce((acc, item) => acc + item.valorTotal, 0)
    };
  }, [itens, itensComStatus]);

  const handleExportar = () => {
    try {
      const worksheet = XLSX.utils.json_to_sheet(itensOrdenados);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Estoque");
      XLSX.writeFile(workbook, "estoque.xlsx");
      showSuccess("Estoque exportado com sucesso!");
    } catch (error) {
      showError("Erro ao exportar estoque.");
    }
  };

  const handleAbrirDialog = (item?: EstoqueItem) => {
    setItemEditando(item || null);
    setIsItemDialogOpen(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <p className="ml-2 text-muted-foreground">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <EstoqueStats {...estatisticas} />

      <Card>
        <CardHeader>
          <CardTitle>Filtros e Ações</CardTitle>
          <CardDescription>Filtre e gerencie os itens do estoque</CardDescription>
        </CardHeader>
        <CardContent>
          <EstoqueFilters
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            categoriaFiltro={categoriaFiltro}
            onCategoriaChange={setCategoriaFiltro}
            statusFiltro={statusFiltro}
            onStatusChange={setStatusFiltro}
            ordenacao={ordenacao}
            onOrdenacaoChange={setOrdenacao}
            categorias={categorias}
            onImportClick={() => setIsImportDialogOpen(true)}
            onExportClick={handleExportar}
            onNovoItemClick={() => handleAbrirDialog()}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Itens em Estoque</CardTitle>
          <CardDescription>Lista de todos os itens cadastrados no inventário.</CardDescription>
        </CardHeader>
        <CardContent>
          <EstoqueTable
            itens={itensOrdenados}
            categorias={categorias}
            onEditItem={handleAbrirDialog}
            onDeleteItem={excluirItem}
            onViewItem={handleAbrirDialog}
          />
        </CardContent>
      </Card>

      <ItemDialog
        isOpen={isItemDialogOpen}
        onClose={() => setIsItemDialogOpen(false)}
        onSave={salvarItem}
        item={itemEditando}
        categorias={categorias}
        locais={locais}
      />

      <ImportDialog
        isOpen={isImportDialogOpen}
        onClose={() => setIsImportDialogOpen(false)}
        onImport={importarItens}
      />
    </div>
  );
};

export default EstoqueTab;
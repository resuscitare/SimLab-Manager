"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { showSuccess, showError } from "@/utils/toast";
import { EstoqueStats } from "./components/EstoqueStats";
import { EstoqueFilters } from "./components/EstoqueFilters";
import { EstoqueTable } from "./components/EstoqueTable";
import { ItemDialog } from "./components/ItemDialog";
import { ImportDialog } from "./components/ImportDialog";
import { useEstoqueData } from "./hooks/useEstoqueData";
import { useEstoqueUtils } from "./hooks/useEstoqueUtils";
import { EstoqueItem } from "./types";

const EstoqueTab = () => {
  const {
    itens,
    categorias,
    locais,
    loading,
    salvarItem,
    excluirItem
  } = useEstoqueData();

  const { calcularStatus } = useEstoqueUtils();

  const [searchTerm, setSearchTerm] = useState("");
  const [categoriaFiltro, setCategoriaFiltro] = useState("todas");
  const [statusFiltro, setStatusFiltro] = useState("todos");
  const [ordenacao, setOrdenacao] = useState("nome");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [itemEditando, setItemEditando] = useState<EstoqueItem | null>(null);

  // Filter and sort items
  const itensFiltrados = useMemo(() => {
    return itens.filter(item => {
      const matchSearch = item.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.marca.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchCategoria = categoriaFiltro === "todas" || item.categoria === categoriaFiltro;
      const matchStatus = statusFiltro === "todos" || item.status === statusFiltro;
      
      return matchSearch && matchCategoria && matchStatus;
    });
  }, [itens, searchTerm, categoriaFiltro, statusFiltro]);

  const itensOrdenados = useMemo(() => {
    return [...itensFiltrados].sort((a, b) => {
      switch (ordenacao) {
        case "nome":
          return a.nome.localeCompare(b.nome);
        case "codigo":
          return a.codigo.localeCompare(b.codigo);
        case "quantidade":
          return b.quantidade - a.quantidade;
        case "valor":
          return b.valorTotal - a.valorTotal;
        case "status":
          return a.status.localeCompare(b.status);
        default:
          return 0;
      }
    });
  }, [itensFiltrados, ordenacao]);

  // Calculate statistics
  const estatisticas = useMemo(() => {
    return {
      total: itens.length,
      disponivel: itens.filter(item => item.status === "disponivel").length,
      baixo: itens.filter(item => item.status === "baixo").length,
      vencendo: itens.filter(item => item.status === "vencendo").length,
      vencido: itens.filter(item => item.status === "vencido").length,
      valorTotal: itens.reduce((acc, item) => acc + item.valorTotal, 0)
    };
  }, [itens]);

  const handleExportarCSV = () => {
    try {
      const headers = [
        'Código',
        'Nome',
        'Categoria',
        'Marca',
        'Modelo',
        'Quantidade',
        'Quantidade Mínima',
        'Unidade',
        'Valor Unitário',
        'Valor Total',
        'Local',
        'Data de Validade',
        'Status',
        'Observações'
      ];

      const csvContent = [
        headers.join(','),
        ...itensOrdenados.map(item => [
          item.codigo,
          item.nome,
          item.categoria,
          item.marca,
          item.modelo,
          item.quantidade,
          item.quantidadeMinima,
          item.unidade,
          item.valorUnitario.toFixed(2),
          item.valorTotal.toFixed(2),
          item.local,
          item.dataValidade,
          item.status,
          item.observacoes
        ].join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `estoque_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      showSuccess("Arquivo CSV exportado com sucesso!");
    } catch (error) {
      showError("Erro ao exportar arquivo CSV");
    }
  };

  const handleAbrirDialog = (item?: EstoqueItem) => {
    setItemEditando(item || null);
    setIsDialogOpen(true);
  };

  const handleFecharDialog = () => {
    setIsDialogOpen(false);
    setItemEditando(null);
  };

  const handleSalvarItem = (item: EstoqueItem) => {
    salvarItem(item);
    handleFecharDialog();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p className="ml-2 text-gray-600">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <EstoqueStats {...estatisticas} />

      {/* Filters and Actions */}
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
            onExportClick={handleExportarCSV}
            onNovoItemClick={() => handleAbrirDialog()}
          />
        </CardContent>
      </Card>

      {/* Items Table */}
      <Card>
        <CardHeader>
          <CardTitle>Itens em Estoque</CardTitle>
          <CardDescription>Gerencie todos os itens do centro de custos</CardDescription>
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

      {/* Add/Edit Item Dialog */}
      <ItemDialog
        isOpen={isDialogOpen}
        onClose={handleFecharDialog}
        onSave={handleSalvarItem}
        item={itemEditando}
        categorias={categorias}
        locais={locais}
      />

      {/* Import Dialog */}
      <ImportDialog
        isOpen={isImportDialogOpen}
        onClose={() => setIsImportDialogOpen(false)}
        onImport={(novosItens) => {
          novosItens.forEach(item => salvarItem(item));
          setIsImportDialogOpen(false);
        }}
      />
    </div>
  );
};

export default EstoqueTab;
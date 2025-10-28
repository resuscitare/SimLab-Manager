"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Upload, Download, Plus } from "lucide-react";

interface EstoqueFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  categoriaFiltro: string;
  onCategoriaChange: (value: string) => void;
  statusFiltro: string;
  onStatusChange: (value: string) => void;
  ordenacao: string;
  onOrdenacaoChange: (value: string) => void;
  categorias: Array<{ id: string; nome: string }>;
  onImportClick: () => void;
  onExportClick: () => void;
  onNovoItemClick: () => void;
}

export const EstoqueFilters = ({
  searchTerm,
  onSearchChange,
  categoriaFiltro,
  onCategoriaChange,
  statusFiltro,
  onStatusChange,
  ordenacao,
  onOrdenacaoChange,
  categorias,
  onImportClick,
  onExportClick,
  onNovoItemClick
}: EstoqueFiltersProps) => {
  return (
    <div className="flex flex-col lg:flex-row gap-4">
      <div className="flex-1 relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
        <Input
          placeholder="Buscar por nome, código ou marca..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>
      
      <Select value={categoriaFiltro} onValueChange={onCategoriaChange}>
        <SelectTrigger className="w-48">
          <SelectValue placeholder="Categoria" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="todas">Todas as categorias</SelectItem>
          {categorias.map(cat => (
            <SelectItem key={cat.id} value={cat.id}>
              {cat.nome}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={statusFiltro} onValueChange={onStatusChange}>
        <SelectTrigger className="w-40">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="todos">Todos os status</SelectItem>
          <SelectItem value="disponivel">Disponível</SelectItem>
          <SelectItem value="baixo">Estoque Baixo</SelectItem>
          <SelectItem value="vencendo">Vencendo</SelectItem>
          <SelectItem value="vencido">Vencido</SelectItem>
        </SelectContent>
      </Select>

      <Select value={ordenacao} onValueChange={onOrdenacaoChange}>
        <SelectTrigger className="w-40">
          <SelectValue placeholder="Ordenar por" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="nome">Nome</SelectItem>
          <SelectItem value="codigo">Código</SelectItem>
          <SelectItem value="quantidade">Quantidade</SelectItem>
          <SelectItem value="valor">Valor</SelectItem>
          <SelectItem value="status">Status</SelectItem>
        </SelectContent>
      </Select>

      <div className="flex gap-2">
        <Button variant="outline" onClick={onImportClick}>
          <Upload className="h-4 w-4 mr-2" />
          Importar CSV
        </Button>
        <Button variant="outline" onClick={onExportClick}>
          <Download className="h-4 w-4 mr-2" />
          Exportar CSV
        </Button>
        <Button onClick={onNovoItemClick}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Item
        </Button>
      </div>
    </div>
  );
};
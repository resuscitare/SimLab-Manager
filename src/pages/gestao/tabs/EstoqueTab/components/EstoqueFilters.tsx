"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Download, Upload, Plus } from "lucide-react";
import { Categoria } from "../types";

interface EstoqueFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  categoriaFiltro: string;
  onCategoriaChange: (value: string) => void;
  statusFiltro: string;
  onStatusChange: (value: string) => void;
  ordenacao: string;
  onOrdenacaoChange: (value: string) => void;
  categorias: Categoria[];
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
          placeholder="Buscar por código, nome ou marca..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>
      
      <Select value={categoriaFiltro} onValueChange={onCategoriaChange}>
        <SelectTrigger className="w-full lg:w-48">
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
        <SelectTrigger className="w-full lg:w-40">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="todos">Todos</SelectItem>
          <SelectItem value="disponivel">Disponível</SelectItem>
          <SelectItem value="baixo">Estoque Baixo</SelectItem>
          <SelectItem value="vencendo">Vencendo</SelectItem>
          <SelectItem value="vencido">Vencido</SelectItem>
        </SelectContent>
      </Select>

      <Select value={ordenacao} onValueChange={onOrdenacaoChange}>
        <SelectTrigger className="w-full lg:w-40">
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
        <Button variant="outline" onClick={onImportClick} className="flex-1">
          <Upload className="h-4 w-4 mr-2" />
          Importar
        </Button>

        <Button variant="outline" onClick={onExportClick} className="flex-1">
          <Download className="h-4 w-4 mr-2" />
          Exportar
        </Button>

        <Button onClick={onNovoItemClick} className="flex-1">
          <Plus className="h-4 w-4 mr-2" />
          Novo Item
        </Button>
      </div>
    </div>
  );
};
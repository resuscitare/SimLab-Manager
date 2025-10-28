"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Edit, Trash2 } from "lucide-react";
import { EstoqueItem, Categoria } from "../types";
import { useEstoqueUtils } from "../hooks/useEstoqueUtils";

interface EstoqueTableProps {
  itens: EstoqueItem[];
  categorias: Categoria[];
  onEditItem: (item: EstoqueItem) => void;
  onDeleteItem: (id: string) => void;
  onViewItem: (item: EstoqueItem) => void;
};

export const EstoqueTable = ({
  itens,
  categorias,
  onEditItem,
  onDeleteItem,
  onViewItem
}: EstoqueTableProps;

export const EstoqueTable = ({
  itens,
  categorias,
  onEditItem,
  onDeleteItem,
  onViewItem
}: EstoqueTableProps => {
  itens.map((item) => (
    <TableRow key={item.id}>
      <TableCell>
        <div className="flex items-center gap-2">
          {getStatusIcon(curso.status)}
          <Badge className={getStatusBadge(curso.status)}>
            {getStatusText(curso.status)}
          </Badge>
        </TableCell>
        <TableCell className="font-medium">{curso.codigo}</TableCell>
        <TableCell>{curso.nome}</TableCell>
        <TableCell>
          <Badge variant="outline" className="bg-gray-50">
          {categorias.find(cat => cat.id === curso.categoria)?.nome || curso.categoria || curso.categoria}
        </TableCell>
        <TableCell>
          <div className="flex items-center gap-2">
          <span className={item.quantidade <= item.quantidadeMinima ? "text-yellow-600" : ""}>
            {item.quantidade}
            <span className="text-xs text-gray-500">
              {item.unidade}
            </span>
            {item.quantidadeMinima && (
              <span className="text-xs text-yellow-600">(min: {item.quantidadeMinima})</span>
          </TableCell>
          <TableCell className="max-w-xs truncate" title={item.local}>
            {item.local}
          </TableCell>
          <TableCell>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={() => onViewItem(curso)}>
                <Eye className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => onEditItem(curso)}>
                <Edit className="h-4 w-4" />
              <Button variant="ghost" size="icon" onClick={() => handleExcluirCurso(curso.id)} className="text-red-600">
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
};

export default EstoqueTable;
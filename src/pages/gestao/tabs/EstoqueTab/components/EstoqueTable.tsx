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
}

export const EstoqueTable = ({
  itens,
  categorias,
  onEditItem,
  onDeleteItem,
  onViewItem
}: EstoqueTableProps) => {
  const { getStatusBadge, getStatusIcon, getStatusText } = useEstoqueUtils();

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Status</TableHead>
            <TableHead>Código</TableHead>
            <TableHead>Nome</TableHead>
            <TableHead>Categoria</TableHead>
            <TableHead>Quantidade</TableHead>
            <TableHead>Valor Total</TableHead>
            <TableHead>Local</TableHead>
            <TableHead className="w-[120px]">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {itens.map((item) => {
            const statusInfo = {
              text: getStatusText(item.status),
              className: getStatusBadge(item.status),
              icon: getStatusIcon(item.status),
            };
            return (
              <TableRow key={item.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {statusInfo.icon}
                    <Badge variant="outline" className={statusInfo.className}>
                      {statusInfo.text}
                    </Badge>
                  </div>
                </TableCell>
                <TableCell className="font-mono text-xs">{item.codigo}</TableCell>
                <TableCell>
                  <div className="font-medium">{item.nome}</div>
                  <div className="text-xs text-gray-500">{item.marca} - {item.modelo}</div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={categorias.find(c => c.id === item.categoria)?.cor || 'bg-gray-100'}>
                    {categorias.find(cat => cat.id === item.categoria)?.nome || item.categoria}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span className={item.quantidade <= item.quantidadeMinima ? "text-yellow-600 font-bold" : ""}>
                      {item.quantidade}
                    </span>
                    <span className="text-xs text-gray-500">
                      {item.unidade}
                    </span>
                    {item.quantidade <= item.quantidadeMinima && (
                      <span className="text-xs text-yellow-600">(min: {item.quantidadeMinima})</span>
                    )}
                  </div>
                </TableCell>
                <TableCell className="font-medium">R$ {item.valorTotal.toFixed(2)}</TableCell>
                <TableCell className="max-w-xs truncate" title={item.local}>
                  {item.local}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" onClick={() => onViewItem(item)} className="h-8 w-8">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => onEditItem(item)} className="h-8 w-8">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => onDeleteItem(item.id)} className="h-8 w-8 text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};
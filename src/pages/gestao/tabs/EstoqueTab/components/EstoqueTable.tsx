"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Edit, Trash2, CheckCircle, AlertTriangle } from "lucide-react";
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
            <TableHead>Valor Unit.</TableHead>
            <TableHead>Valor Total</TableHead>
            <TableHead>Local</TableHead>
            <TableHead>Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {itens.map((item) => (
            <TableRow key={item.id}>
              <TableCell>
                <div className="flex items-center gap-2">
                  {getStatusIcon(item.status)}
                  <Badge className={getStatusBadge(item.status)}>
                    {getStatusText(item.status)}
                  </Badge>
                </div>
              </TableCell>
              <TableCell className="font-medium">{item.codigo}</TableCell>
              <TableCell>{item.nome}</TableCell>
              <TableCell>
                <Badge variant="outline" className="bg-gray-50">
                  {categorias.find(cat => cat.id === item.categoria)?.nome || item.categoria}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <span className={item.quantidade <= item.quantidadeMinima ? "text-yellow-600" : ""}>
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
              <TableCell>R$ {item.valorUnitario.toFixed(2)}</TableCell>
              <TableCell className="font-medium">R$ {item.valorTotal.toFixed(2)}</TableCell>
              <TableCell className="max-w-xs truncate" title={item.local}>
                {item.local}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" onClick={() => onViewItem(item)}>
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => onEditItem(item)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => onDeleteItem(item.id)} className="text-red-600">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
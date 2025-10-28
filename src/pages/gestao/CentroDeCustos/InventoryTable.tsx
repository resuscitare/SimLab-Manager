"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Package, TrendingUp, TrendingDown } from "lucide-react";
import { InventoryItem } from "./types";

interface InventoryTableProps {
  items: InventoryItem[];
  onEdit: (item: InventoryItem) => void;
  onDelete: (id: string) => void;
  onSaida: (id: string, quantidade: number) => void;
}

export const InventoryTable = ({ items, onEdit, onDelete, onSaida }: InventoryTableProps) => {
  const getStatusBadge = (status: string) => {
    const variants = {
      ativo: "default",
      baixo: "secondary",
      critico: "destructive",
      inativo: "outline"
    } as const;

    return (
      <Badge variant={variants[status as keyof typeof variants] || "outline"}>
        {status === "ativo" && "Em Estoque"}
        {status === "baixo" && "Estoque Baixo"}
        {status === "critico" && "Estoque Crítico"}
        {status === "inativo" && "Sem Estoque"}
      </Badge>
    );
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Lote</TableHead>
            <TableHead>Nº Item</TableHead>
            <TableHead>Descrição</TableHead>
            <TableHead>Marca/Modelo</TableHead>
            <TableHead>Qtd. Recebida</TableHead>
            <TableHead>Qtd. Saída</TableHead>
            <TableHead>Estoque Atual</TableHead>
            <TableHead>Valor Unit.</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="font-medium">{item.lote}</TableCell>
              <TableCell>{item.numeroItem}</TableCell>
              <TableCell>{item.descricao}</TableCell>
              <TableCell>{item.marcaModelo}</TableCell>
              <TableCell>{item.quantidadeRecebida} {item.unidade}</TableCell>
              <TableCell>{item.quantidadeSaida} {item.unidade}</TableCell>
              <TableCell className="font-semibold">{item.estoqueAtual} {item.unidade}</TableCell>
              <TableCell>R$ {item.valorUnitario.toFixed(2)}</TableCell>
              <TableCell>R$ {(item.estoqueAtual * item.valorUnitario).toFixed(2)}</TableCell>
              <TableCell>{getStatusBadge(item.status)}</TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(item)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(item.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {items.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          Nenhum item encontrado
        </div>
      )}
    </div>
  );
};
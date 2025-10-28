"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { EstoqueItem } from "../types";
import { showSuccess, showError } from "@/utils/toast";

interface ImportDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (items: EstoqueItem[]) => void;
}

export const ImportDialog = ({ isOpen, onClose, onImport }: ImportDialogProps) => {
  const handleImportarCSV = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const lines = text.split('\n').filter(line => line.trim());
        
        if (lines.length < 2) {
          showError("Arquivo CSV inválido ou vazio");
          return;
        }

        const headers = lines[0].split(',').map(h => h.trim());
        const novosItens: EstoqueItem[] = [];

        for (let i = 1; i < lines.length; i++) {
          const values = lines[i].split(',').map(v => v.trim());
          if (values.length >= headers.length) {
            const item: any = {};
            headers.forEach((header, index) => {
              const key = header.toLowerCase().replace(/\s+/g, '_');
              item[key] = values[index] || '';
            });

            // Converter campos numéricos
            item.quantidade = parseInt(item.quantidade) || 0;
            item.quantidadeMinima = parseInt(item.quantidade_minima) || 0;
            item.valorUnitario = parseFloat(item.valor_unitario) || 0;

            // Gerar ID se não existir
            if (!item.id) {
              item.id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
            }

            // Definir valores padrão
            item.status = "disponivel";
            item.valorTotal = item.quantidade * item.valorUnitario;

            novosItens.push(item as EstoqueItem);
          }
        }

        onImport(novosItens);
        showSuccess(`${novosItens.length} itens importados com sucesso!`);
      } catch (error) {
        showError("Erro ao processar arquivo CSV");
        console.error(error);
      }
    };

    reader.readAsText(file);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Importar Itens via CSV</DialogTitle>
          <DialogDescription>
            Importe múltiplos itens de uma vez usando um arquivo CSV
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Formato do Arquivo CSV</Label>
            <div className="p-3 bg-gray-50 rounded-lg text-sm">
              <p>O arquivo CSV deve conter as seguintes colunas:</p>
              <code className="block mt-2 text-xs bg-white p-2 rounded">
                codigo,nome,categoria,marca,modelo,quantidade,quantidade_minima,unidade,valor_unitario,local,data_validade,observacoes
              </code>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="csvFile">Selecione o arquivo CSV</Label>
            <Input
              id="csvFile"
              type="file"
              accept=".csv"
              onChange={handleImportarCSV}
              className="cursor-pointer"
            />
          </div>
        </div>
        
        <div className="flex justify-end gap-2 px-6 py-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, FileText, AlertCircle } from "lucide-react";
import { EstoqueItem } from "../types";

interface ImportDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (itens: EstoqueItem[]) => void;
}

export const ImportDialog = ({
  isOpen,
  onClose,
  onImport
}: ImportDialogProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleImport = async () => {
    if (!file) return;

    setIsProcessing(true);
    try {
      const text = await file.text();
      const lines = text.split('\n');
      const headers = lines[0].split(',').map(h => h.trim());
      
      const itens: EstoqueItem[] = [];
      
      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(v => v.trim());
        if (values.length === headers.length) {
          const item: EstoqueItem = {
            id: Date.now().toString() + i,
            codigo: values[0] || '',
            nome: values[1] || '',
            categoria: values[2] || '',
            marca: values[3] || '',
            modelo: values[4] || '',
            quantidade: parseInt(values[5]) || 0,
            quantidadeMinima: parseInt(values[6]) || 0,
            unidade: values[7] || '',
            valorUnitario: parseFloat(values[8]) || 0,
            valorTotal: 0,
            local: values[9] || '',
            dataValidade: values[10] || '',
            status: 'disponivel',
            observacoes: values[11] || ''
          };
          item.valorTotal = item.quantidade * item.valorUnitario;
          itens.push(item);
        }
      }
      
      onImport(itens);
      onClose();
      setFile(null);
    } catch (error) {
      console.error('Erro ao importar arquivo:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Importar Itens</DialogTitle>
          <DialogDescription>
            Importe itens de um arquivo CSV
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="file">Arquivo CSV</Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <FileText className="mx-auto h-12 w-12 text-gray-400" />
              <div className="mt-2">
                <label htmlFor="file" className="cursor-pointer">
                  <span className="mt-2 block text-sm font-medium text-gray-900">
                    Clique para selecionar um arquivo
                  </span>
                  <input
                    id="file"
                    type="file"
                    accept=".csv"
                    onChange={handleFileChange}
                    className="sr-only"
                  />
                </label>
                <p className="mt-1 text-xs text-gray-500">
                  CSV até 10MB
                </p>
              </div>
              {file && (
                <div className="mt-2 text-sm text-gray-600">
                  Arquivo selecionado: {file.name}
                </div>
              )}
            </div>
          </div>

          <div className="bg-blue-50 p-3 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-medium">Formato esperado:</p>
                <p className="text-xs mt-1">
                  código,nome,categoria,marca,modelo,quantidade,quantidade_minima,unidade,valor_unitario,local,data_validade,observacoes
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleImport} disabled={!file || isProcessing}>
            {isProcessing ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Processando...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                Importar
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
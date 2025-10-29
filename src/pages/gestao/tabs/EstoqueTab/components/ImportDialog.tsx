"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Upload, FileText, AlertCircle } from "lucide-react";
import { EstoqueItem } from "../types";
import Papa from "papaparse";
import { showError } from "@/utils/toast";

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
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const itens: EstoqueItem[] = results.data.map((row: any, index: number) => ({
          id: row.id || Date.now().toString() + index,
          codigo: row["Código"] || "",
          nome: row["Nome"] || "",
          categoria: row["Categoria"] || "",
          marca: row["Marca"] || "",
          modelo: row["Modelo"] || "",
          quantidade: parseInt(row["Quantidade"]) || 0,
          quantidadeMinima: parseInt(row["Quantidade Mínima"]) || 0,
          unidade: row["Unidade"] || "un",
          valorUnitario: parseFloat(row["Valor Unitário"]) || 0,
          valorTotal: 0,
          local: row["Local"] || "",
          dataValidade: row["Data de Validade"] || "",
          status: 'disponivel',
          observacoes: row["Observações"] || ""
        }));
        onImport(itens);
        onClose();
        setFile(null);
        setIsProcessing(false);
      },
      error: (error: any) => {
        showError("Erro ao processar o arquivo CSV.");
        console.error(error);
        setIsProcessing(false);
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Importar Itens</DialogTitle>
          <DialogDescription>
            Importe itens de um arquivo CSV.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="file-upload">Arquivo CSV</Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <FileText className="mx-auto h-12 w-12 text-gray-400" />
              <div className="mt-2">
                <label htmlFor="file-upload" className="cursor-pointer">
                  <span className="mt-2 block text-sm font-medium text-primary">
                    Clique para selecionar um arquivo
                  </span>
                  <input
                    id="file-upload"
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
                  Código,Nome,Categoria,Marca,Modelo,Quantidade,Quantidade Mínima,Unidade,Valor Unitário,Local,Data de Validade,Observações
                </p>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
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
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
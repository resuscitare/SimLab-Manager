"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { LocationCombobox } from "@/components/LocationCombobox";
import { EstoqueItem, Categoria } from "../types";
import { useEstoqueUtils } from "../hooks/useEstoqueUtils";
import { Local } from "@/types";

interface ItemDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: EstoqueItem) => void;
  item: EstoqueItem | null;
  categorias: Categoria[];
  locais: Local[];
}

export const ItemDialog = ({
  isOpen,
  onClose,
  onSave,
  item,
  categorias,
  locais
}: ItemDialogProps) => {
  const [formData, setFormData] = useState<EstoqueItem | null>(null);

  const { calcularStatus, getStatusBadge, getStatusIcon, getStatusText } = useEstoqueUtils();

  // Função para formatar valor para exibição no input
  const formatarValorParaInput = (valor: number): string => {
    return valor.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  // Função para converter valor do input para número
  const converterInputParaNumero = (valor: string): number => {
    // Remove pontos (separadores de milhares) e substitui vírgula por ponto
    const numeroLimpo = valor.replace(/\./g, '').replace(',', '.');
    return parseFloat(numeroLimpo) || 0;
  };

  useEffect(() => {
    if (isOpen) {
      setFormData(item || {
        id: "",
        codigo: "",
        nome: "",
        categoria: "",
        marca: "",
        modelo: "",
        quantidade: 0,
        quantidadeMinima: 0,
        unidade: "un",
        valorUnitario: 0,
        valorTotal: 0,
        local: "",
        dataValidade: "",
        status: "disponivel",
        observacoes: ""
      });
    }
  }, [item, isOpen]);

  const handleInputChange = (field: keyof EstoqueItem, value: string | number) => {
    if (!formData) return;
    setFormData(prev => {
      const updated = { ...prev!, [field]: value };
      
      if (field === "quantidade" || field === "valorUnitario") {
        updated.valorTotal = (Number(updated.quantidade) || 0) * (Number(updated.valorUnitario) || 0);
      }
      
      const newStatus = calcularStatus(updated);
      if (updated.status !== newStatus) {
        updated.status = newStatus;
      }
      
      return updated;
    });
  };

  const handleValorUnitarioChange = (valor: string) => {
    const numeroConvertido = converterInputParaNumero(valor);
    handleInputChange("valorUnitario", numeroConvertido);
  };

  const handleSave = () => {
    if (!formData || !formData.codigo || !formData.nome || !formData.categoria) {
      return;
    }
    onSave(formData);
  };

  if (!formData) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {item?.id ? "Editar Item" : "Novo Item"}
          </DialogTitle>
          <DialogDescription>
            {item?.id ? "Edite as informações do item existente" : "Cadastre um novo item no estoque"}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="codigo">Código *</Label>
              <Input id="codigo" value={formData.codigo} onChange={(e) => handleInputChange("codigo", e.target.value)} placeholder="Ex: MED001" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="nome">Nome *</Label>
              <Input id="nome" value={formData.nome} onChange={(e) => handleInputChange("nome", e.target.value)} placeholder="Ex: Adrenalina 1mg/1mL" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="categoria">Categoria *</Label>
              <Select value={formData.categoria} onValueChange={(value) => handleInputChange("categoria", value)}>
                <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                <SelectContent>{categorias.map(cat => (<SelectItem key={cat.id} value={cat.id}>{cat.nome}</SelectItem>))}</SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="marca">Marca</Label>
              <Input id="marca" value={formData.marca} onChange={(e) => handleInputChange("marca", e.target.value)} placeholder="Ex: Laerdal" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="quantidade">Quantidade *</Label>
              <Input id="quantidade" type="number" value={formData.quantidade} onChange={(e) => handleInputChange("quantidade", parseInt(e.target.value) || 0)} placeholder="0" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="quantidadeMinima">Qtd. Mínima *</Label>
              <Input id="quantidadeMinima" type="number" value={formData.quantidadeMinima} onChange={(e) => handleInputChange("quantidadeMinima", parseInt(e.target.value) || 0)} placeholder="0" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="valorUnitario">Valor Unitário (R$) *</Label>
              <Input 
                id="valorUnitario" 
                value={formData.valorUnitario ? formatarValorParaInput(formData.valorUnitario) : ""} 
                onChange={(e) => handleValorUnitarioChange(e.target.value)} 
                placeholder="0,00" 
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dataValidade">Data de Validade</Label>
              <Input id="dataValidade" type="date" value={formData.dataValidade} onChange={(e) => handleInputChange("dataValidade", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="local">Local</Label>
              <LocationCombobox locais={locais} value={formData.local} onValueChange={(value) => handleInputChange("local", value)} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="observacoes">Observações</Label>
            <Textarea id="observacoes" value={formData.observacoes} onChange={(e) => handleInputChange("observacoes", e.target.value)} placeholder="Observações adicionais sobre o item" rows={3} />
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Valor Total:</span>
                <div className="text-lg font-bold">R$ {formData.valorTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
              </div>
              <div>
                <span className="font-medium">Status:</span>
                <div className="flex items-center gap-2">
                  {getStatusIcon(formData.status)}
                  <Badge className={getStatusBadge(formData.status)}>{getStatusText(formData.status)}</Badge>
                </div>
              </div>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button onClick={handleSave}>{item?.id ? "Salvar Alterações" : "Adicionar Item"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
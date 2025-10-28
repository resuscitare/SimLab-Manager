"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { LocationCombobox } from "@/components/LocationCombobox";
import { EstoqueItem, Categoria, Local } from "../types";
import { useEstoqueUtils } from "../hooks/useEstoqueUtils";

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
  const [formData, setFormData] = useState<EstoqueItem>(
    item || {
      id: "",
      codigo: "",
      nome: "",
      categoria: "",
      marca: "",
      modelo: "",
      quantidade: 0,
      quantidadeMinima: 0,
      unidade: "",
      valorUnitario: 0,
      valorTotal: 0,
      local: "",
      dataValidade: "",
      status: "disponivel",
      observacoes: ""
    }
  );

  const { calcularStatus, getStatusBadge, getStatusIcon, getStatusText } = useEstoqueUtils();

  const handleInputChange = (field: keyof EstoqueItem, value: string | number) => {
    setFormData(prev => {
      const updated = { ...prev, [field]: value };
      
      // Auto-calculate dependent fields
      if (field === "quantidade" || field === "valorUnitario") {
        updated.valorTotal = updated.quantidade * updated.valorUnitario;
      }
      
      if (field === "quantidade" || field === "quantidadeMinima" || field === "dataValidade") {
        updated.status = calcularStatus(updated);
      }
      
      return updated;
    });
  };

  const handleSave = () => {
    if (!formData.codigo || !formData.nome || !formData.categoria) {
      return;
    }
    
    const itemToSave = {
      ...formData,
      id: item?.id || Date.now().toString(),
      valorTotal: formData.quantidade * formData.valorUnitario,
      status: calcularStatus(formData)
    };
    
    onSave(itemToSave);
    onClose();
  };

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
              <Input
                id="codigo"
                value={formData.codigo}
                onChange={(e) => handleInputChange("codigo", e.target.value)}
                placeholder="Ex: MED001"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="nome">Nome *</Label>
              <Input
                id="nome"
                value={formData.nome}
                onChange={(e) => handleInputChange("nome", e.target.value)}
                placeholder="Ex: Adrenalina 1mg/1mL"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="categoria">Categoria *</Label>
              <Select value={formData.categoria} onValueChange={(value) => handleInputChange("categoria", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {categorias.map(cat => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="marca">Marca</Label>
              <Input
                id="marca"
                value={formData.marca}
                onChange={(e) => handleInputChange("marca", e.target.value)}
                placeholder="Ex: Laerdal"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="quantidade">Quantidade *</Label>
              <Input
                id="quantidade"
                type="number"
                value={formData.quantidade}
                onChange={(e) => handleInputChange("quantidade", parseInt(e.target.value) || 0)}
                placeholder="0"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="quantidadeMinima">Quantidade Mínima *</Label>
              <Input
                id="quantidadeMinima"
                type="number"
                value={formData.quantidadeMinima}
                onChange={(e) => handleInputChange("quantidadeMinima", parseInt(e.target.value) || 0)}
                placeholder="0"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="valorUnitario">Valor Unitário (R$) *</Label>
              <Input
                id="valorUnitario"
                type="number"
                step="0.01"
                value={formData.valorUnitario}
                onChange={(e) => handleInputChange("valorUnitario", parseFloat(e.target.value) || 0)}
                placeholder="0.00"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dataValidade">Data de Validade</Label>
              <Input
                id="dataValidade"
                type="date"
                value={formData.dataValidade}
                onChange={(e) => handleInputChange("dataValidade", e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="local">Local</Label>
              <LocationCombobox
                locais={locais}
                value={formData.local}
                onValueChange={(value) => handleInputChange("local", value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="observacoes">Observações</Label>
            <Textarea
              id="observacoes"
              value={formData.observacoes}
              onChange={(e) => handleInputChange("observacoes", e.target.value)}
              placeholder="Observações adicionais sobre o item"
              rows={3}
            />
          </div>

          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Valor Total:</span>
                <div className="text-lg font-bold">R$ {(formData.quantidade * formData.valorUnitario).toFixed(2)}</div>
              </div>
              <div>
                <span className="font-medium">Status:</span>
                <div className="flex items-center gap-2">
                  {getStatusIcon(calcularStatus(formData))}
                  <Badge className={getStatusBadge(calcularStatus(formData))}>
                    {getStatusText(calcularStatus(formData))}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 px-6 py-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSave}>
            {item?.id ? "Salvar Alterações" : "Adicionar Item"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
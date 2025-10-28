"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { showSuccess, showError } from "@/utils/toast";

interface InventoryItem {
  id: string;
  lote: string;
  numeroItem: string;
  descricao: string;
  marcaModelo: string;
  quantidadeRecebida: number;
  unidade: string;
  valorUnitario: number;
  quantidadeSaida: number;
  estoqueAtual: number;
  dataEntrada: string;
  ultimaSaida?: string;
  fornecedor?: string;
  categoria?: string;
  localizacao?: string;
  status: "ativo" | "baixo" | "critico" | "inativo";
}

interface InventoryFormProps {
  item?: InventoryItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: InventoryItem) => void;
}

const unidades = [
  { value: "un", label: "Unidade" },
  { value: "kg", label: "Quilograma" },
  { value: "l", label: "Litro" },
  { value: "m", label: "Metro" },
  { value: "cx", label: "Caixa" },
  { value: "pct", label: "Pacote" }
];

const categories = [
  "Equipamentos Médicos",
  "Medicamentos",
  "Material de Consumo",
  "Simuladores",
  "Manutenção",
  "Outros"
];

export const InventoryForm = ({ item, isOpen, onClose, onSave }: InventoryFormProps) => {
  const [formData, setFormData] = useState<Partial<InventoryItem>>({
    lote: "",
    numeroItem: "",
    descricao: "",
    marcaModelo: "",
    quantidadeRecebida: 0,
    unidade: "un",
    valorUnitario: 0,
    quantidadeSaida: 0,
    estoqueAtual: 0,
    dataEntrada: new Date().toISOString().split('T')[0],
    fornecedor: "",
    categoria: "",
    localizacao: "",
    status: "ativo"
  });

  useEffect(() => {
    if (item) {
      setFormData(item);
    } else {
      setFormData({
        lote: "",
        numeroItem: "",
        descricao: "",
        marcaModelo: "",
        quantidadeRecebida: 0,
        unidade: "un",
        valorUnitario: 0,
        quantidadeSaida: 0,
        estoqueAtual: 0,
        dataEntrada: new Date().toISOString().split('T')[0],
        fornecedor: "",
        categoria: "",
        localizacao: "",
        status: "ativo"
      });
    }
  }, [item]);

  const calculateStatus = (data: Partial<InventoryItem>): "ativo" | "baixo" | "critico" | "inativo" => {
    const estoque = data.estoqueAtual || 0;
    const recebida = data.quantidadeRecebida || 1;
    const percentage = (estoque / recebida) * 100;

    if (estoque === 0) return "inativo";
    if (percentage <= 20) return "critico";
    if (percentage <= 50) return "baixo";
    return "ativo";
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const estoqueAtual = (formData.quantidadeRecebida || 0) - (formData.quantidadeSaida || 0);
      const status = calculateStatus({ ...formData, estoqueAtual });

      const itemToSave: InventoryItem = {
        id: item?.id || Date.now().toString(),
        lote: formData.lote || "",
        numeroItem: formData.numeroItem || "",
        descricao: formData.descricao || "",
        marcaModelo: formData.marcaModelo || "",
        quantidadeRecebida: formData.quantidadeRecebida || 0,
        unidade: formData.unidade || "un",
        valorUnitario: formData.valorUnitario || 0,
        quantidadeSaida: formData.quantidadeSaida || 0,
        estoqueAtual,
        dataEntrada: formData.dataEntrada || new Date().toISOString().split('T')[0],
        fornecedor: formData.fornecedor,
        categoria: formData.categoria,
        localizacao: formData.localizacao,
        status
      };

      onSave(itemToSave);
      onClose();
    } catch (error) {
      showError("Erro ao salvar item");
    }
  };

  const handleInputChange = (field: keyof InventoryItem, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <DialogContent className="max-w-2xl">
      <DialogHeader>
        <DialogTitle>{item ? "Editar Item" : "Adicionar Novo Item"}</DialogTitle>
        <DialogDescription>
          Preencha as informações do item para o controle de estoque
        </DialogDescription>
      </DialogHeader>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="lote">Lote *</Label>
            <Input
              id="lote"
              value={formData.lote}
              onChange={(e) => handleInputChange("lote", e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="numeroItem">Número do Item *</Label>
            <Input
              id="numeroItem"
              value={formData.numeroItem}
              onChange={(e) => handleInputChange("numeroItem", e.target.value)}
              required
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="descricao">Descrição/Especificação *</Label>
          <Input
            id="descricao"
            value={formData.descricao}
            onChange={(e) => handleInputChange("descricao", e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="marcaModelo">Marca/Modelo</Label>
          <Input
            id="marcaModelo"
            value={formData.marcaModelo}
            onChange={(e) => handleInputChange("marcaModelo", e.target.value)}
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="quantidadeRecebida">Quantidade Recebida *</Label>
            <Input
              id="quantidadeRecebida"
              type="number"
              min="0"
              value={formData.quantidadeRecebida}
              onChange={(e) => handleInputChange("quantidadeRebecida", Number(e.target.value))}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="unidade">Unidade</Label>
            <Select value={formData.unidade} onValueChange={(value) => handleInputChange("unidade", value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {unidades.map(un => (
                  <SelectItem key={un.value} value={un.value}>{un.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="valorUnitario">Valor Unitário (R$)</Label>
            <Input
              id="valorUnitario"
              type="number"
              min="0"
              step="0.01"
              value={formData.valorUnitario}
              onChange={(e) => handleInputChange("valorUnitario", Number(e.target.value))}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="categoria">Categoria</Label>
            <Select value={formData.categoria} onValueChange={(value) => handleInputChange("categoria", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma categoria" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(cat => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="fornecedor">Fornecedor</Label>
            <Input
              id="fornecedor"
              value={formData.fornecedor}
              onChange={(e) => handleInputChange("fornecedor", e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="dataEntrada">Data de Entrada</Label>
            <Input
              id="dataEntrada"
              type="date"
              value={formData.dataEntrada}
              onChange={(e) => handleInputChange("dataEntrada", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="localizacao">Localização</Label>
            <Input
              id="localizacao"
              value={formData.localizacao}
              onChange={(e) => handleInputChange("localizacao", e.target.value)}
            />
          </div>
        </div>

        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit">
            {item ? "Atualizar" : "Adicionar"}
          </Button>
        </div>
      </form>
    </DialogContent>
  );
};
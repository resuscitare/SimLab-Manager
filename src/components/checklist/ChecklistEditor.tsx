"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Plus, 
  Trash2, 
  GripVertical, 
  Package, 
  MessageSquare, 
  Edit, 
  Save,
  X,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { useState, useCallback } from "react";
import { cn } from "@/lib/utils";

interface ChecklistItem {
  id: string;
  nome: string;
  quantidade?: string;
  checked?: boolean;
  observacoes?: string;
}

interface ChecklistSection {
  id: string;
  titulo: string;
  itens: ChecklistItem[];
}

interface Checklist {
  id: string;
  titulo: string;
  tipo: "debriefing" | "materiais";
  secoes: ChecklistSection[];
}

interface ChecklistEditorProps {
  checklist: Checklist | null;
  onSave: (checklist: Checklist) => void;
  onCancel: () => void;
  tipo: "debriefing" | "materiais";
}

const ChecklistEditor = ({ checklist, onSave, onCancel, tipo }: ChecklistEditorProps) => {
  const [editando, setEditando] = useState(false);
  const [checklistData, setChecklistData] = useState<Checklist>(
    checklist || {
      id: Date.now().toString(),
      titulo: tipo === "debriefing" ? "Novo Checklist de Debriefing" : "Novo Checklist de Materiais",
      tipo,
      secoes: [
        {
          id: "secao-1",
          titulo: tipo === "debriefing" ? "Aspectos Técnicos" : "Equipamentos",
          itens: []
        },
        {
          id: "secao-2", 
          titulo: tipo === "debriefing" ? "Aspectos Não Técnicos" : "Medicamentos",
          itens: []
        }
      ]
    }
  );

  const adicionarSecao = useCallback(() => {
    const novaSecao: ChecklistSection = {
      id: `secao-${Date.now()}`,
      titulo: `Nova Seção ${checklistData.secoes.length + 1}`,
      itens: []
    };
    
    setChecklistData(prev => ({
      ...prev,
      secoes: [...prev.secoes, novaSecao]
    }));
  }, [checklistData.secoes.length]);

  const removerSecao = useCallback((secaoId: string) => {
    if (checklistData.secoes.length <= 1) return;
    
    setChecklistData(prev => ({
      ...prev,
      secoes: prev.secoes.filter(s => s.id !== secaoId)
    }));
  }, [checklistData.secoes.length]);

  const atualizarSecao = useCallback((secaoId: string, campo: string, valor: string) => {
    setChecklistData(prev => ({
      ...prev,
      secoes: prev.secoes.map(secao => 
        secao.id === secaoId 
          ? { ...secao, [campo]: valor }
          : secao
      )
    }));
  }, []);

  const adicionarItem = useCallback((secaoId: string) => {
    const novoItem: ChecklistItem = {
      id: `item-${Date.now()}`,
      nome: "",
      quantidade: tipo === "materiais" ? "1" : undefined,
      checked: false
    };
    
    setChecklistData(prev => ({
      ...prev,
      secoes: prev.secoes.map(secao => 
        secao.id === secaoId 
          ? { ...secao, itens: [...secao.itens, novoItem] }
          : secao
      )
    }));
  }, [tipo]);

  const removerItem = useCallback((secaoId: string, itemId: string) => {
    setChecklistData(prev => ({
      ...prev,
      secoes: prev.secoes.map(secao => 
        secao.id === secaoId 
          ? { ...secao, itens: secao.itens.filter(item => item.id !== itemId) }
          : secao
      )
    }));
  }, []);

  const atualizarItem = useCallback((secaoId: string, itemId: string, campo: string, valor: any) => {
    setChecklistData(prev => ({
      ...prev,
      secoes: prev.secoes.map(secao => 
        secao.id === secaoId 
          ? {
              ...secao,
              itens: secao.itens.map(item => 
                item.id === itemId 
                  ? { ...item, [campo]: valor }
                  : item
              )
            }
          : secao
      )
    }));
  }, []);

  const validarChecklist = (): boolean => {
    return !!(
      checklistData.titulo.trim() &&
      checklistData.secoes.length > 0 &&
      checklistData.secoes.every(secao => 
        secao.titulo.trim() && 
        secao.itens.length > 0 &&
        secao.itens.every(item => item.nome.trim())
      )
    );
  };

  const handleSave = () => {
    if (!validarChecklist()) {
      alert("Preencha todos os campos obrigatórios antes de salvar.");
      return;
    }
    
    onSave(checklistData);
  };

  const totalItens = checklistData.secoes.reduce((acc, secao) => acc + secao.itens.length, 0);
  const isValido = validarChecklist();

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-3">
              <div className={cn(
                "p-2 rounded-lg",
                tipo === "debriefing" ? "bg-blue-100" : "bg-green-100"
              )}>
                {tipo === "debriefing" ? (
                  <MessageSquare className="h-5 w-5 text-blue-600" />
                ) : (
                  <Package className="h-5 w-5 text-green-600" />
                )}
              </div>
              <div>
                <CardTitle className="flex items-center gap-2">
                  {editando ? (
                    <Input
                      value={checklistData.titulo}
                      onChange={(e) => setChecklistData(prev => ({ ...prev, titulo: e.target.value }))}
                      className="text-lg font-semibold h-8"
                      placeholder="Título do checklist"
                    />
                  ) : (
                    checklistData.titulo
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setEditando(!editando)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </CardTitle>
                <CardDescription>
                  {tipo === "debriefing" 
                    ? "Checklist para orientar a discussão pós-simulação"
                    : "Checklist para organizar materiais e equipamentos"
                  }
                </CardDescription>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Badge variant="outline">
                {totalItens} itens
              </Badge>
              <Badge variant={isValido ? "default" : "destructive"}>
                {isValido ? "Válido" : "Incompleto"}
              </Badge>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Seções */}
      <div className="space-y-4">
        {checklistData.secoes.map((secao, secaoIndex) => (
          <Card key={secao.id} className="border-l-4 border-l-blue-500">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <GripVertical className="h-4 w-4 text-gray-400" />
                  <Input
                    value={secao.titulo}
                    onChange={(e) => atualizarSecao(secao.id, 'titulo', e.target.value)}
                    className="font-medium h-8 w-64"
                    placeholder="Título da seção"
                  />
                  <Badge variant="secondary">
                    {secao.itens.length} itens
                  </Badge>
                </div>
                
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removerSecao(secao.id)}
                  disabled={checklistData.secoes.length <= 1}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-3">
              {secao.itens.length === 0 ? (
                <div className="text-center py-4 border-2 border-dashed border-gray-300 rounded-lg">
                  <p className="text-sm text-gray-500 mb-2">Nenhum item nesta seção</p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => adicionarItem(secao.id)}
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    Adicionar Item
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  {secao.itens.map((item, itemIndex) => (
                    <div key={item.id} className="flex items-center gap-3 p-3 border rounded-lg bg-gray-50">
                      <GripVertical className="h-4 w-4 text-gray-400" />
                      
                      <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3">
                        <Input
                          value={item.nome}
                          onChange={(e) => atualizarItem(secao.id, item.id, 'nome', e.target.value)}
                          placeholder="Nome do item"
                          className={cn(
                            !item.nome.trim() && "border-red-300 focus:border-red-500"
                          )}
                        />
                        
                        {tipo === "materiais" && (
                          <Input
                            value={item.quantidade || ""}
                            onChange={(e) => atualizarItem(secao.id, item.id, 'quantidade', e.target.value)}
                            placeholder="Quantidade"
                            className="w-32"
                          />
                        )}
                        
                        <Input
                          value={item.observacoes || ""}
                          onChange={(e) => atualizarItem(secao.id, item.id, 'observacoes', e.target.value)}
                          placeholder="Observações (opcional)"
                          className="text-sm"
                        />
                      </div>
                      
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removerItem(secao.id, item.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => adicionarItem(secao.id)}
                    className="w-full"
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    Adicionar Item
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Adicionar Seção */}
      <Button
        variant="outline"
        onClick={adicionarSecao}
        className="w-full"
      >
        <Plus className="h-4 w-4 mr-2" />
        Adicionar Nova Seção
      </Button>

      {/* Validação e Ações */}
      <Card className={cn(
        "border-2",
        isValido ? "border-green-200 bg-green-50" : "border-yellow-200 bg-yellow-50"
      )}>
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            {isValido ? (
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
            ) : (
              <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
            )}
            <div>
              <h4 className="font-medium">
                {isValido ? "Checklist pronto para salvar!" : "Atenção necessária"}
              </h4>
              <div className="text-sm text-gray-600 mt-1">
                {!checklistData.titulo.trim() && (
                  <p>• O título do checklist é obrigatório</p>
                )}
                {checklistData.secoes.some(secao => !secao.titulo.trim()) && (
                  <p>• Todas as seções precisam de título</p>
                )}
                {checklistData.secoes.some(secao => secao.itens.length === 0) && (
                  <p>• Todas as seções precisam ter pelo menos um item</p>
                )}
                {checklistData.secoes.some(secao => 
                  secao.itens.some(item => !item.nome.trim())
                ) && (
                  <p>• Todos os itens precisam de nome</p>
                )}
                {isValido && (
                  <p>• Checklist validado e pronto para uso</p>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Ações Finais */}
      <div className="flex justify-end space-x-2">
        <Button variant="outline" onClick={onCancel}>
          <X className="w-4 h-4 mr-2" />
          Cancelar
        </Button>
        <Button onClick={handleSave} disabled={!isValido}>
          <Save className="w-4 h-4 mr-2" />
          Salvar Checklist
        </Button>
      </div>
    </div>
  );
};

export default ChecklistEditor;
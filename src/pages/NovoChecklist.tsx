"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Package, MessageSquare, ArrowLeft } from "lucide-react";
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { cn } from "@/lib/utils";
import ChecklistEditor from "../checklist/ChecklistEditor";

interface Checklist {
  id: string;
  titulo: string;
  tipo: "debriefing" | "materiais";
  secoes: Array<{
    id: string;
    titulo: string;
    itens: Array<{
      id: string;
      nome: string;
      quantidade?: string;
      checked?: boolean;
      observacoes?: string;
    }>;
  }>;
}

const NovoChecklist = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const tipoInicial = searchParams.get('tipo') as "debriefing" | "materiais" || "materiais";
  
  const [tipo, setTipo] = useState<"debriefing" | "materiais">(tipoInicial);
  const [checklistSalvo, setChecklistSalvo] = useState<Checklist | null>(null);

  const handleSaveChecklist = (checklist: Checklist) => {
    // Salvar no localStorage (mock)
    const checklistsExistentes = JSON.parse(localStorage.getItem('checklists') || '[]');
    const novosChecklists = [...checklistsExistentes, checklist];
    localStorage.setItem('checklists', JSON.stringify(novosChecklists));
    
    setChecklistSalvo(checklist);
    console.log("Checklist salvo:", checklist);
  };

  const handleCancel = () => {
    navigate("/checklists");
  };

  const handleContinue = () => {
    navigate("/checklists");
  };

  const handleCreateNew = () => {
    setChecklistSalvo(null);
    // Resetar para criar novo
  };

  if (checklistSalvo) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Checklist Criado!</h1>
            <p className="text-gray-600">Seu checklist foi salvo com sucesso</p>
          </div>
          <Button variant="outline" onClick={() => navigate("/checklists")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar para Checklists
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {checklistSalvo.tipo === "debriefing" ? (
                <MessageSquare className="h-5 w-5 text-blue-600" />
              ) : (
                <Package className="h-5 w-5 text-green-600" />
              )}
              {checklistSalvo.titulo}
            </CardTitle>
            <CardDescription>
              Checklist de {checklistSalvo.tipo === "debriefing" ? "debriefing" : "materiais"} criado com sucesso
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {checklistSalvo.secoes.length}
                  </div>
                  <div className="text-sm text-blue-600">Seções</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {checklistSalvo.secoes.reduce((acc, secao) => acc + secao.itens.length, 0)}
                  </div>
                  <div className="text-sm text-green-600">Itens</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">
                    {checklistSalvo.tipo === "debriefing" ? "Debriefing" : "Materiais"}
                  </div>
                  <div className="text-sm text-purple-600">Tipo</div>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">Resumo das Seções:</h4>
                {checklistSalvo.secoes.map((secao, index) => (
                  <div key={secao.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <span className="font-medium">{secao.titulo}</span>
                      <Badge variant="outline" className="ml-2">
                        {secao.itens.length} itens
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-end space-x-2 pt-4 border-t">
                <Button variant="outline" onClick={handleCreateNew}>
                  Criar Outro Checklist
                </Button>
                <Button onClick={handleContinue}>
                  Continuar
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Novo Checklist</h1>
          <p className="text-gray-600">Crie um novo checklist de materiais ou debriefing</p>
        </div>
        <Button variant="outline" onClick={handleCancel}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Cancelar
        </Button>
      </div>

      {/* Seleção de Tipo */}
      <Card>
        <CardHeader>
          <CardTitle>Tipo de Checklist</CardTitle>
          <CardDescription>Selecione o tipo de checklist que deseja criar</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div 
              className={cn(
                "p-6 border-2 rounded-lg cursor-pointer transition-all",
                tipo === "materiais" 
                  ? "border-green-500 bg-green-50" 
                  : "border-gray-200 hover:border-gray-300"
              )}
              onClick={() => setTipo("materiais")}
            >
              <div className="flex items-center gap-3 mb-3">
                <Package className="h-8 w-8 text-green-600" />
                <h3 className="text-lg font-semibold">Checklist de Materiais</h3>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                Organize equipamentos, medicamentos e materiais necessários para suas simulações.
              </p>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm">
                  <Badge variant="outline" className="text-green-600 border-green-600">
                    Equipamentos
                  </Badge>
                  <Badge variant="outline" className="text-green-600 border-green-600">
                    Medicamentos
                  </Badge>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Badge variant="outline" className="text-green-600 border-green-600">
                    Quantidades
                  </Badge>
                  <Badge variant="outline" className="text-green-600 border-green-600">
                    Observações
                  </Badge>
                </div>
              </div>
            </div>

            <div 
              className={cn(
                "p-6 border-2 rounded-lg cursor-pointer transition-all",
                tipo === "debriefing" 
                  ? "border-blue-500 bg-blue-50" 
                  : "border-gray-200 hover:border-gray-300"
              )}
              onClick={() => setTipo("debriefing")}
            >
              <div className="flex items-center gap-3 mb-3">
                <MessageSquare className="h-8 w-8 text-blue-600" />
                <h3 className="text-lg font-semibold">Checklist de Debriefing</h3>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                Estruture pontos norteadores para discussão e reflexão pós-simulação.
              </p>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm">
                  <Badge variant="outline" className="text-blue-600 border-blue-600">
                    Aspectos Técnicos
                  </Badge>
                  <Badge variant="outline" className="text-blue-600 border-blue-600">
                    Não Técnicos
                  </Badge>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Badge variant="outline" className="text-blue-600 border-blue-600">
                    Metas de Aprendizagem
                  </Badge>
                  <Badge variant="outline" className="text-blue-600 border-blue-600">
                    Protocolos
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Editor de Checklist */}
      <ChecklistEditor
        checklist={null}
        onSave={handleSaveChecklist}
        onCancel={handleCancel}
        tipo={tipo}
      />
    </div>
  );
};

export default NovoChecklist;
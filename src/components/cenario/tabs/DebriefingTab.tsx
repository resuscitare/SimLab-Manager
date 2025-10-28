"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, MessageSquare, Edit, Save, X, Trash2, ArrowRight, CheckCircle, Copy } from "lucide-react";
import { DebriefingTemplate, DebriefingModelType } from "@/types/debriefing";
import { ScenarioFormData } from "@/types/prisma";
import { Label } from "@/components/ui/label";
import { showSuccess, showError } from "@/utils/toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PearlsForm from "../debriefing/PearlsForm";
import TeamGainsForm from "../debriefing/TeamGainsForm";
import ThreeDForm from "../debriefing/ThreeDForm";
import GasForm from "../debriefing/GasForm";

interface DebriefingTabProps {
  scenarioData: ScenarioFormData;
}

const DebriefingTab = ({ scenarioData }: DebriefingTabProps) => {
  const [templates, setTemplates] = useState<DebriefingTemplate[]>([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedModel, setSelectedModel] = useState<DebriefingModelType>("PEARLS");
  const [newTemplate, setNewTemplate] = useState<Partial<DebriefingTemplate>>({
    titulo: "",
    modelo: "PEARLS",
    dados: {
      descricao: "",
      duracao: "30",
      nivelParticipantes: "graduacao",
      objetivos: [],
      momentosCriticos: [],
      fasePreparacao: "",
      faseReacao: "",
      faseDescricao: "",
      faseAnalise: "",
      faseResumo: ""
    }
  });

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = () => {
    try {
      const allItems = JSON.parse(localStorage.getItem('checklists') || '[]');
      const debriefingTemplates = allItems.filter((item: any) => item.tipo === 'debriefing');
      setTemplates(debriefingTemplates);
    } catch (e) {
      console.error("Failed to load debriefing templates", e);
    }
  };

  const generateUniqueId = () => {
    return `template-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  };

  const handleStartCreating = () => {
    setNewTemplate({
      titulo: "",
      modelo: selectedModel,
      dados: {
        descricao: "",
        duracao: "30",
        nivelParticipantes: "graduacao",
        objetivos: scenarioData.technicalLearningObjectives.concat(scenarioData.nonTechnicalLearningObjectives),
        momentosCriticos: [],
        fasePreparacao: "",
        faseReacao: "",
        faseDescricao: "",
        faseAnalise: "",
        faseResumo: ""
      }
    });
    setIsCreating(true);
    setIsEditing(false);
    setSelectedTemplateId(null);
  };

  const handleStartEditing = () => {
    if (selectedTemplateId) {
      const template = templates.find(t => t.id === selectedTemplateId);
      if (template) {
        setNewTemplate({ ...template });
        setSelectedModel(template.modelo);
        setIsEditing(true);
        setIsCreating(false);
      }
    }
  };

  const handleCancel = () => {
    setIsCreating(false);
    setIsEditing(false);
    setNewTemplate({
      titulo: "",
      modelo: "PEARLS",
      dados: {
        descricao: "",
        duracao: "30",
        nivelParticipantes: "graduacao",
        objetivos: [],
        momentosCriticos: [],
        fasePreparacao: "",
        faseReacao: "",
        faseDescricao: "",
        faseAnalise: "",
        faseResumo: ""
      }
    });
  };

  const handleSaveTemplate = () => {
    if (!newTemplate.titulo?.trim()) {
      showError("Por favor, dê um título ao template.");
      return;
    }

    try {
      const allItems = JSON.parse(localStorage.getItem('checklists') || '[]');
      
      const templateToSave: DebriefingTemplate = {
        id: isEditing ? newTemplate.id! : generateUniqueId(),
        titulo: newTemplate.titulo!,
        tipo: "debriefing",
        modelo: selectedModel,
        dados: newTemplate.dados || {
          descricao: "",
          duracao: "30",
          nivelParticipantes: "graduacao",
          objetivos: [],
          momentosCriticos: [],
          fasePreparacao: "",
          faseReacao: "",
          faseDescricao: "",
          faseAnalise: "",
          faseResumo: ""
        },
        autor: "Usuário",
        dataCriacao: new Date().toISOString().split('T')[0]
      };

      if (isEditing) {
        const index = allItems.findIndex((item: any) => item.id === newTemplate.id);
        if (index !== -1) {
          allItems[index] = templateToSave;
        }
      } else {
        allItems.push(templateToSave);
      }

      localStorage.setItem('checklists', JSON.stringify(allItems));
      setTemplates(allItems.filter((item: any) => item.tipo === 'debriefing'));
      
      setIsCreating(false);
      setIsEditing(false);
      setNewTemplate({
        titulo: "",
        modelo: "PEARLS",
        dados: {
          descricao: "",
          duracao: "30",
          nivelParticipantes: "graduacao",
          objetivos: [],
          momentosCriticos: [],
          fasePreparacao: "",
          faseReacao: "",
          faseDescricao: "",
          faseAnalise: "",
          faseResumo: ""
        }
      });

      showSuccess(isEditing ? "Template atualizado com sucesso!" : "Template criado com sucesso!");
    } catch (e) {
      showError("Erro ao salvar template.");
    }
  };

  const handleDeleteTemplate = () => {
    if (!selectedTemplateId) return;
    
    if (confirm("Tem certeza que deseja excluir este template?")) {
      try {
        const allItems = JSON.parse(localStorage.getItem('checklists') || '[]');
        const filteredItems = allItems.filter((item: any) => item.id !== selectedTemplateId);
        localStorage.setItem('checklists', JSON.stringify(filteredItems));
        
        setTemplates(filteredItems.filter((item: any) => item.tipo === 'debriefing'));
        setSelectedTemplateId(null);
        
        showSuccess("Template excluído com sucesso!");
      } catch (e) {
        showError("Erro ao excluir template.");
      }
    }
  };

  const handleDuplicateTemplate = () => {
    if (!selectedTemplateId) return;
    
    const template = templates.find(t => t.id === selectedTemplateId);
    if (template) {
      const duplicatedTemplate: DebriefingTemplate = {
        ...template,
        id: generateUniqueId(),
        titulo: `${template.titulo} (Cópia)`,
        dataCriacao: new Date().toISOString().split('T')[0]
      };

      try {
        const allItems = JSON.parse(localStorage.getItem('checklists') || '[]');
        allItems.push(duplicatedTemplate);
        localStorage.setItem('checklists', JSON.stringify(allItems));
        
        setTemplates(allItems.filter((item: any) => item.tipo === 'debriefing'));
        setSelectedTemplateId(duplicatedTemplate.id);
        
        showSuccess("Template duplicado com sucesso!");
      } catch (e) {
        showError("Erro ao duplicar template.");
      }
    }
  };

  const handleTemplateFieldChange = (field: string, value: any) => {
    setNewTemplate(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleDataFieldChange = (field: string, value: any) => {
    setNewTemplate(prev => ({
      ...prev,
      dados: {
        ...prev.dados,
        [field]: value
      }
    }));
  };

  const selectedTemplate = templates.find(t => t.id === selectedTemplateId);

  const modelDescriptions = {
    PEARLS: "Debriefings abrangentes com tempo adequado (20-30 minutos). 5 fases estruturadas com 3 opções de análise.",
    TeamGAINS: "Focado em trabalho em equipe e dinâmica interprofissional. 6 fases incluindo prebriefing.",
    "3D": "Para cenários emocionalmente intensos. 3 fases focadas em processamento emocional e cognitivo.",
    GAS: "Debriefings rápidos e objetivos (10-15 minutos). Modelo oficial da American Heart Association."
  };

  const renderModelForm = () => {
    switch (selectedModel) {
      case "PEARLS":
        return <PearlsForm scenarioData={scenarioData} />;
      case "TeamGAINS":
        return <TeamGainsForm scenarioData={scenarioData} />;
      case "3D":
        return <ThreeDForm scenarioData={scenarioData} />;
      case "GAS":
        return <GasForm scenarioData={scenarioData} />;
      default:
        return <PearlsForm scenarioData={scenarioData} />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Plano de Debriefing
        </CardTitle>
        <CardDescription>
          Crie e gerencie templates de debriefing para este cenário
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Modo de visualização */}
        {!isCreating && !isEditing && (
          <>
            <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg">
              <div>
                <h3 className="font-semibold text-blue-800">Templates de Debriefing</h3>
                <p className="text-sm text-blue-600">Selecione ou crie um template para este cenário</p>
              </div>
              <div className="flex gap-2">
                <Select value={selectedModel} onValueChange={(value: DebriefingModelType) => setSelectedModel(value)}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PEARLS">PEARLS</SelectItem>
                    <SelectItem value="TeamGAINS">TeamGAINS</SelectItem>
                    <SelectItem value="3D">3D</SelectItem>
                    <SelectItem value="GAS">GAS</SelectItem>
                  </SelectContent>
                </Select>
                <Button onClick={handleStartCreating} className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Criar Novo Template
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
              <div className="space-y-2">
                <Label>Selecionar Template Existente</Label>
                <Select 
                  value={selectedTemplateId || ""} 
                  onValueChange={setSelectedTemplateId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Escolha um template..." />
                  </SelectTrigger>
                  <SelectContent>
                    {templates.map(template => (
                      <SelectItem key={template.id} value={template.id}>
                        {template.titulo} ({template.modelo})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {selectedTemplateId && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline">
                      <Edit className="w-4 h-4 mr-2" />
                      Ações
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={handleStartEditing}>
                      <Edit className="w-4 h-4 mr-2" />
                      Editar
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleDuplicateTemplate}>
                      <Copy className="w-4 h-4 mr-2" />
                      Duplicar
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleDeleteTemplate} className="text-red-600">
                      <Trash2 className="w-4 h-4 mr-2" />
                      Excluir
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>

            {selectedTemplate && (
              <div className="p-4 border rounded-lg bg-muted">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-semibold">{selectedTemplate.titulo}</h4>
                    <p className="text-sm text-muted-foreground">
                      <strong>Modelo:</strong> {selectedTemplate.modelo}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      <strong>Autor:</strong> {selectedTemplate.autor}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      <strong>Criado em:</strong> {selectedTemplate.dataCriacao}
                    </p>
                  </div>
                  <Badge variant="secondary">{selectedTemplate.modelo}</Badge>
                </div>
                
                {selectedTemplate.dados?.descricao && (
                  <div className="mt-3 p-3 bg-white rounded-md">
                    <h5 className="font-medium text-sm mb-2">Descrição:</h5>
                    <p className="text-sm text-gray-700">{selectedTemplate.dados.descricao}</p>
                  </div>
                )}
              </div>
            )}

            {templates.length === 0 && (
              <div className="p-4 border rounded-lg bg-blue-50 text-center">
                <MessageSquare className="h-8 w-8 text-blue-400 mx-auto mb-2" />
                <p className="text-sm text-blue-800 mb-4">
                  Nenhum template de debriefing encontrado.
                </p>
                <Button onClick={handleStartCreating} variant="outline">
                  <Plus className="w-4 h-4 mr-2" />
                  Criar Primeiro Template
                </Button>
              </div>
            )}
          </>
        )}

        {/* Modo de criação/edição */}
        {(isCreating || isEditing) && (
          <div className="p-4 border-2 border-blue-300 rounded-lg bg-blue-50">
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-semibold text-blue-800">
                {isCreating ? "Criando Novo Template" : "Editando Template"}
              </h4>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleCancel}>
                  <X className="w-4 h-4 mr-1" />
                  Cancelar
                </Button>
                <Button size="sm" onClick={handleSaveTemplate}>
                  <Save className="w-4 h-4 mr-1" />
                  {isCreating ? "Criar" : "Salvar"}
                </Button>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="template-title">Título do Template *</Label>
                  <Input
                    id="template-title"
                    value={newTemplate.titulo || ""}
                    onChange={(e) => handleTemplateFieldChange('titulo', e.target.value)}
                    placeholder="Ex: Debriefing Padrão para RCP"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="template-model">Modelo de Debriefing</Label>
                  <Select 
                    value={selectedModel} 
                    onValueChange={(value: DebriefingModelType) => setSelectedModel(value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PEARLS">PEARLS</SelectItem>
                      <SelectItem value="TeamGAINS">TeamGAINS</SelectItem>
                      <SelectItem value="3D">3D</SelectItem>
                      <SelectItem value="GAS">GAS</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="template-description">Descrição</Label>
                <Textarea
                  id="template-description"
                  value={newTemplate.dados?.descricao || ""}
                  onChange={(e) => handleDataFieldChange('descricao', e.target.value)}
                  placeholder="Descreva o propósito deste template de debriefing..."
                  rows={3}
                />
              </div>

              <div className="p-4 bg-white rounded-lg">
                <h5 className="font-medium mb-3">Modelo Selecionado: {selectedModel}</h5>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-gray-700">{modelDescriptions[selectedModel]}</p>
                </div>
              </div>

              {/* Formulário específico do modelo */}
              <div className="pt-4 border-t">
                <h5 className="font-medium mb-4">Configurações do Modelo {selectedModel}</h5>
                {renderModelForm()}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DebriefingTab;
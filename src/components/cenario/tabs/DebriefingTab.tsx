"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, MessageSquare, Edit, Save, X } from "lucide-react";
import { DebriefingTemplate, DebriefingModelType } from "@/types/debriefing";
import { ScenarioFormData } from "@/types/prisma";
import { Label } from "@/components/ui/label";
import { showSuccess, showError } from "@/utils/toast";

interface DebriefingTabProps {
  scenarioData: ScenarioFormData;
}

const DebriefingTab = ({ scenarioData }: DebriefingTabProps) => {
  const [templates, setTemplates] = useState<DebriefingTemplate[]>([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);
  const [templateCounter, setTemplateCounter] = useState(1);
  const [isEditing, setIsEditing] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<Partial<DebriefingTemplate> | null>(null);

  useEffect(() => {
    loadTemplates();
    const existingTemplates = JSON.parse(localStorage.getItem('checklists') || '[]')
      .filter((item: any) => item.tipo === 'debriefing');
    setTemplateCounter(existingTemplates.length + 1);
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

  const handleCreateNewTemplate = () => {
    const newTemplate: DebriefingTemplate = {
      id: generateUniqueId(),
      titulo: `Template de Debriefing ${templateCounter}`,
      tipo: "debriefing",
      modelo: "PEARLS" as DebriefingModelType,
      dados: {
        descricao: "Novo template de debriefing. Clique em 'Editar' para personalizar.",
        duracao: "30",
        nivelParticipantes: "graduacao",
        objetivos: scenarioData.technicalLearningObjectives.concat(scenarioData.nonTechnicalLearningObjectives),
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

    try {
      const allItems = JSON.parse(localStorage.getItem('checklists') || '[]');
      allItems.push(newTemplate);
      localStorage.setItem('checklists', JSON.stringify(allItems));
      
      setTemplates([...templates, newTemplate]);
      setSelectedTemplateId(newTemplate.id);
      setTemplateCounter(prev => prev + 1);
      setEditingTemplate(newTemplate);
      setIsEditing(true);
      
      showSuccess("Novo template criado com sucesso! Você pode editá-lo agora.");
    } catch (e) {
      showError("Erro ao criar template.");
    }
  };

  const handleStartEditing = () => {
    if (selectedTemplateId) {
      const template = templates.find(t => t.id === selectedTemplateId);
      if (template) {
        setEditingTemplate({ ...template });
        setIsEditing(true);
      }
    }
  };

  const handleCancelEditing = () => {
    setIsEditing(false);
    setEditingTemplate(null);
  };

  const handleSaveTemplate = () => {
    if (!editingTemplate || !editingTemplate.id) {
      showError("Nenhum template para salvar.");
      return;
    }

    try {
      const allItems = JSON.parse(localStorage.getItem('checklists') || '[]');
      const index = allItems.findIndex((item: any) => item.id === editingTemplate.id);
      
      if (index !== -1) {
        allItems[index] = { ...allItems[index], ...editingTemplate };
        localStorage.setItem('checklists', JSON.stringify(allItems));
        
        setTemplates(allItems.filter((item: any) => item.tipo === 'debriefing'));
        setIsEditing(false);
        setEditingTemplate(null);
        
        showSuccess("Template salvo com sucesso!");
      }
    } catch (e) {
      showError("Erro ao salvar template.");
    }
  };

  const handleTemplateFieldChange = (field: string, value: any) => {
    if (editingTemplate) {
      setEditingTemplate(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleDataFieldChange = (field: string, value: any) => {
    if (editingTemplate && editingTemplate.dados) {
      setEditingTemplate(prev => ({
        ...prev,
        dados: {
          ...prev.dados,
          [field]: value
        }
      }));
    }
  };

  const selectedTemplate = templates.find(t => t.id === selectedTemplateId);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Plano de Debriefing
        </CardTitle>
        <CardDescription>
          Associe um template de debriefing a este cenário.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
          <div className="space-y-2">
            <Label>Selecionar Template de Debriefing</Label>
            <Select 
              value={selectedTemplateId || ""} 
              onValueChange={setSelectedTemplateId}
              disabled={isEditing}
            >
              <SelectTrigger>
                <SelectValue placeholder="Escolha um template existente..." />
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
          <Button variant="outline" onClick={handleCreateNewTemplate} disabled={isEditing}>
            <Plus className="w-4 h-4 mr-2" />
            Criar Novo Template
          </Button>
        </div>

        {selectedTemplate && !isEditing && (
          <div className="p-4 border rounded-lg bg-muted">
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-semibold">Template Selecionado: {selectedTemplate.titulo}</h4>
              <Button variant="outline" size="sm" onClick={handleStartEditing}>
                <Edit className="w-4 h-4 mr-1" />
                Editar Template
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              <strong>Modelo:</strong> {selectedTemplate.modelo}
            </p>
            <p className="text-sm text-muted-foreground">
              <strong>Autor:</strong> {selectedTemplate.autor}
            </p>
            <p className="text-sm text-muted-foreground">
              <strong>Criado em:</strong> {selectedTemplate.dataCriacao}
            </p>
            {selectedTemplate.dados?.descricao && (
              <p className="text-sm text-muted-foreground mt-2">
                <strong>Descrição:</strong> {selectedTemplate.dados.descricao}
              </p>
            )}
          </div>
        )}

        {isEditing && editingTemplate && (
          <div className="p-4 border rounded-lg bg-blue-50">
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-semibold">Editando Template</h4>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleCancelEditing}>
                  <X className="w-4 h-4 mr-1" />
                  Cancelar
                </Button>
                <Button size="sm" onClick={handleSaveTemplate}>
                  <Save className="w-4 h-4 mr-1" />
                  Salvar
                </Button>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="template-title">Título do Template</Label>
                  <Input
                    id="template-title"
                    value={editingTemplate.titulo || ""}
                    onChange={(e) => handleTemplateFieldChange('titulo', e.target.value)}
                    placeholder="Digite o título do template"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="template-model">Modelo de Debriefing</Label>
                  <Select 
                    value={editingTemplate.modelo || "PEARLS"} 
                    onValueChange={(value) => handleTemplateFieldChange('modelo', value)}
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
                  value={editingTemplate.dados?.descricao || ""}
                  onChange={(e) => handleDataFieldChange('descricao', e.target.value)}
                  placeholder="Descreva o propósito deste template de debriefing..."
                  rows={3}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="template-duration">Duração Estimada (minutos)</Label>
                <Input
                  id="template-duration"
                  type="number"
                  value={editingTemplate.dados?.duracao || ""}
                  onChange={(e) => handleDataFieldChange('duracao', e.target.value)}
                  placeholder="30"
                />
              </div>
            </div>
          </div>
        )}

        {templates.length === 0 && !isEditing && (
          <div className="p-4 border rounded-lg bg-blue-50">
            <p className="text-sm text-blue-800">
              Nenhum template de debriefing encontrado. Clique em "Criar Novo Template" para começar.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DebriefingTab;
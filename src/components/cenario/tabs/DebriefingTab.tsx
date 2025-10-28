"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, MessageSquare, Edit, Save, X, Trash2, ArrowRight } from "lucide-react";
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

interface DebriefingTabProps {
  scenarioData: ScenarioFormData;
}

const DebriefingTab = ({ scenarioData }: DebriefingTabProps) => {
  const navigate = useNavigate();
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

  const handleCreateNewTemplate = () => {
    // Navegar para a página de criação de template, passando o ID do cenário atual
    navigate(`/debriefing-templates/novo?fromScenario=true&scenarioId=new`);
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
          Associe um template de debriefing a este cenário ou crie um novo
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Cabeçalho com ações */}
        <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg">
          <div>
            <h3 className="font-semibold text-blue-800">Templates de Debriefing</h3>
            <p className="text-sm text-blue-600">Gerencie modelos pré-configurados para suas sessões</p>
          </div>
          <Button onClick={handleCreateNewTemplate} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Criar Novo Template
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
          <div className="space-y-2">
            <Label>Selecionar Template Existente</Label>
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
          
          {selectedTemplateId && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" disabled={isEditing}>
                  <Edit className="w-4 h-4 mr-2" />
                  Ações do Template
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={handleStartEditing}>
                  <Edit className="w-4 h-4 mr-2" />
                  Editar
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleDeleteTemplate} className="text-red-600">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Excluir
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        {selectedTemplate && !isEditing && (
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
            </div>
            
            {selectedTemplate.dados?.descricao && (
              <div className="mt-3 p-3 bg-white rounded-md">
                <h5 className="font-medium text-sm mb-2">Descrição:</h5>
                <p className="text-sm text-gray-700">{selectedTemplate.dados.descricao}</p>
              </div>
            )}
          </div>
        )}

        {isEditing && editingTemplate && (
          <div className="p-4 border-2 border-blue-300 rounded-lg bg-blue-50">
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-semibold text-blue-800">Editando Template</h4>
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
            </div>
          </div>
        )}

        {templates.length === 0 && !isEditing && (
          <div className="p-4 border rounded-lg bg-blue-50 text-center">
            <MessageSquare className="h-8 w-8 text-blue-400 mx-auto mb-2" />
            <p className="text-sm text-blue-800 mb-4">
              Nenhum template de debriefing encontrado.
            </p>
            <Button onClick={handleCreateNewTemplate} variant="outline">
              <Plus className="w-4 h-4 mr-2" />
              Criar Primeiro Template
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DebriefingTab;
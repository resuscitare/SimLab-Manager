"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, MessageSquare } from "lucide-react";
import { DebriefingTemplate, DebriefingModelType } from "@/types/debriefing";
import { ScenarioFormData } from "@/types/prisma";
import { Label } from "@/components/ui/label";
import { showSuccess } from "@/utils/toast";

interface DebriefingTabProps {
  scenarioData: ScenarioFormData;
}

const DebriefingTab = ({ scenarioData }: DebriefingTabProps) => {
  const [templates, setTemplates] = useState<DebriefingTemplate[]>([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);
  const [templateCounter, setTemplateCounter] = useState(1);

  useEffect(() => {
    loadTemplates();
    // Inicializar o contador baseado nos templates existentes
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
      dados: {},
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
      
      showSuccess("Novo template criado com sucesso!");
    } catch (e) {
      console.error("Erro ao criar template:", e);
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
            <Select value={selectedTemplateId || ""} onValueChange={setSelectedTemplateId}>
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
          <Button variant="outline" onClick={handleCreateNewTemplate}>
            <Plus className="w-4 w-4 mr-2" />
            Criar Novo Template
          </Button>
        </div>

        {selectedTemplate && (
          <div className="p-4 border rounded-lg bg-muted">
            <h4 className="font-semibold mb-2">Template Selecionado: {selectedTemplate.titulo}</h4>
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
        )}

        {templates.length === 0 && (
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
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, MessageSquare } from "lucide-react";
import { DebriefingTemplate } from "@/types/debriefing";
import { ScenarioFormData } from "@/types/prisma";
import { Label } from "@/components/ui/label";

interface DebriefingTabProps {
  scenarioData: ScenarioFormData;
}

const DebriefingTab = ({ scenarioData }: DebriefingTabProps) => {
  const [templates, setTemplates] = useState<DebriefingTemplate[]>([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);

  useEffect(() => {
    try {
      const allItems = JSON.parse(localStorage.getItem('checklists') || '[]');
      const debriefingTemplates = allItems.filter((item: any) => item.tipo === 'debriefing');
      setTemplates(debriefingTemplates);
    } catch (e) {
      console.error("Failed to load debriefing templates", e);
    }
  }, []);

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
            <Select onValueChange={setSelectedTemplateId}>
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
          <Button variant="outline" onClick={() => console.log("Criar novo template de debriefing")}>
            <Plus className="w-4 h-4 mr-2" />
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
            <Button variant="link" className="p-0 h-auto mt-2" onClick={() => console.log("Visualizar template")}>
              Visualizar Template
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DebriefingTab;
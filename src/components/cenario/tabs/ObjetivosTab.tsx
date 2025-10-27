"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Plus, X, Activity } from "lucide-react";
import { ScenarioFormData, SmartObjectives } from "@/types/prisma";

interface ObjetivosTabProps {
  scenarioData: ScenarioFormData;
  handleSmartObjectivesChange: (field: keyof SmartObjectives, value: string) => void;
  adicionarObjetivoTecnico: (objetivo: string) => void;
  removerObjetivoTecnico: (objetivo: string) => void;
  adicionarObjetivoNaoTecnico: (objetivo: string) => void;
  removerObjetivoNaoTecnico: (objetivo: string) => void;
}

const ObjetivosTab = ({
  scenarioData,
  handleSmartObjectivesChange,
  adicionarObjetivoTecnico,
  removerObjetivoTecnico,
  adicionarObjetivoNaoTecnico,
  removerObjetivoNaoTecnico,
}: ObjetivosTabProps) => {
  const [novoObjetivoTecnico, setNovoObjetivoTecnico] = useState("");
  const [novoObjetivoNaoTecnico, setNovoObjetivoNaoTecnico] = useState("");

  const handleAdicionarObjetivoTecnico = () => {
    if (novoObjetivoTecnico.trim()) {
      adicionarObjetivoTecnico(novoObjetivoTecnico);
      setNovoObjetivoTecnico("");
    }
  };

  const handleAdicionarObjetivoNaoTecnico = () => {
    if (novoObjetivoNaoTecnico.trim()) {
      adicionarObjetivoNaoTecnico(novoObjetivoNaoTecnico);
      setNovoObjetivoNaoTecnico("");
    }
  };

  const smartFields = [
    {
      key: 'specific',
      label: 'S – Específico',
      description: 'O que você quer alcançar com este cenário?',
    },
    {
      key: 'measurable',
      label: 'M – Mensurável',
      description: 'Qual indicador será usado para medir o sucesso?',
    },
    {
      key: 'achievable',
      label: 'A – Alcançável',
      description: 'O objetivo é realista para o tempo e recursos disponíveis?',
    },
    {
      key: 'relevant',
      label: 'R – Relevante',
      description: 'O objetivo faz sentido para o público-alvo e o contexto?',
    },
    {
      key: 'timeBound',
      label: 'T – Temporal',
      description: 'Em quanto tempo a meta de aprendizagem deve ser atingida?',
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Objetivos de Aprendizagem
        </CardTitle>
        <CardDescription>Defina os objetivos SMART e os objetivos técnicos e não técnicos do cenário.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4 rounded-lg border p-4">
          <h3 className="font-semibold">Objetivos SMART do Programa</h3>
          <p className="text-sm text-muted-foreground">
            Estruture os objetivos gerais do programa de simulação usando o método SMART para garantir clareza e foco.
          </p>
          <div className="space-y-4 pt-2">
            {smartFields.map(field => (
              <div key={field.key} className="space-y-2">
                <Label htmlFor={field.key} className="text-base">{field.label}</Label>
                <Textarea
                  id={field.key}
                  value={scenarioData.smartObjectives?.[field.key as keyof SmartObjectives] || ''}
                  onChange={(e) => handleSmartObjectivesChange(field.key as keyof SmartObjectives, e.target.value)}
                  placeholder={field.description}
                  rows={2}
                  className="text-sm"
                />
                <p className="text-xs text-muted-foreground">{field.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <Label>Objetivos de Aprendizagem Técnicos</Label>
            <div className="flex gap-2">
              <Input
                value={novoObjetivoTecnico}
                onChange={(e) => setNovoObjetivoTecnico(e.target.value)}
                placeholder="Adicionar objetivo técnico"
                onKeyPress={(e) => e.key === 'Enter' && handleAdicionarObjetivoTecnico()}
              />
              <Button type="button" onClick={handleAdicionarObjetivoTecnico}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {scenarioData.technicalLearningObjectives.map((objetivo, index) => (
                <Badge key={index} variant="secondary" className="flex items-center gap-1">
                  {objetivo}
                  <X className="w-3 h-3 cursor-pointer" onClick={() => removerObjetivoTecnico(objetivo)} />
                </Badge>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <Label>Objetivos de Aprendizagem Não Técnicos</Label>
            <div className="flex gap-2">
              <Input
                value={novoObjetivoNaoTecnico}
                onChange={(e) => setNovoObjetivoNaoTecnico(e.target.value)}
                placeholder="Adicionar objetivo não técnico"
                onKeyPress={(e) => e.key === 'Enter' && handleAdicionarObjetivoNaoTecnico()}
              />
              <Button type="button" onClick={handleAdicionarObjetivoNaoTecnico}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {scenarioData.nonTechnicalLearningObjectives.map((objetivo, index) => (
                <Badge key={index} variant="secondary" className="flex items-center gap-1">
                  {objetivo}
                  <X className="w-3 h-3 cursor-pointer" onClick={() => removerObjetivoNaoTecnico(objetivo)} />
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ObjetivosTab;
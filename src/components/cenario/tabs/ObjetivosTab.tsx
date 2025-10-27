"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Plus, X, Activity } from "lucide-react";
import { ScenarioFormData } from "@/types/prisma";

interface ObjetivosTabProps {
  scenarioData: ScenarioFormData;
  handleScenarioDataChange: (field: keyof ScenarioFormData, value: any) => void;
  adicionarObjetivoTecnico: (objetivo: string) => void;
  removerObjetivoTecnico: (objetivo: string) => void;
  adicionarObjetivoNaoTecnico: (objetivo: string) => void;
  removerObjetivoNaoTecnico: (objetivo: string) => void;
}

const ObjetivosTab = ({
  scenarioData,
  handleScenarioDataChange,
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

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Objetivos de Aprendizagem
        </CardTitle>
        <CardDescription>Defina os objetivos técnicos e não técnicos</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="smartObjectives">Objetivos SMART do Programa</Label>
          <Textarea
            id="smartObjectives"
            value={scenarioData.smartObjectives}
            onChange={(e) => handleScenarioDataChange('smartObjectives', e.target.value)}
            placeholder="Descreva os objetivos SMART (Específicos, Mensuráveis, Atingíveis, Relevantes, Temporais)..."
            rows={4}
          />
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
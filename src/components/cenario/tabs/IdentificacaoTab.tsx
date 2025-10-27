"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ScenarioFormData } from "@/types/prisma";
import { Eye } from "lucide-react";

interface IdentificacaoTabProps {
  scenarioData: ScenarioFormData;
  handleScenarioDataChange: (field: keyof ScenarioFormData, value: any) => void;
}

const IdentificacaoTab = ({ scenarioData, handleScenarioDataChange }: IdentificacaoTabProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Eye className="h-5 w-5" />
          Identificação do Cenário
        </CardTitle>
        <CardDescription>Informações básicas do cenário</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="title">Título do Cenário *</Label>
            <Input
              id="title"
              value={scenarioData.title}
              onChange={(e) => handleScenarioDataChange('title', e.target.value)}
              placeholder="Ex: Parada Cardiorrespiratória em AESP"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="participantType">Tipo Principal de Participante</Label>
            <Select value={scenarioData.patientGender} onValueChange={(value) => handleScenarioDataChange('patientGender', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Simulador">Simulador</SelectItem>
                <SelectItem value="Paciente Padronizado">Paciente Padronizado</SelectItem>
                <SelectItem value="Ambos">Ambos</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="scenarioOutline">Descrição do Cenário</Label>
          <Textarea
            id="scenarioOutline"
            value={scenarioData.scenarioOutline}
            onChange={(e) => handleScenarioDataChange('scenarioOutline', e.target.value)}
            placeholder="Descreva brevemente o cenário..."
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="learnerBrief">Informações para os Participantes</Label>
          <Textarea
            id="learnerBrief"
            value={scenarioData.learnerBrief}
            onChange={(e) => handleScenarioDataChange('learnerBrief', e.target.value)}
            placeholder="O que será informado aos participantes..."
            rows={3}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default IdentificacaoTab;
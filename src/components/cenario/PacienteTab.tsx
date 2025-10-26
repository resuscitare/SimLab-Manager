"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Sparkles } from "lucide-react";

interface PacienteTabProps {
  formData: {
    nomePaciente: string;
    idade: string;
    sexo: string;
    historicoMedico: string;
    comoInicia: string;
    localSimulacao: string;
    voluntarios: string;
  };
  onFormDataChange: (field: string, value: string) => void;
  onAISuggestion: (campo: string) => void;
}

const PacienteTab = ({
  formData,
  onFormDataChange,
  onAISuggestion
}: PacienteTabProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Perfil do Paciente</CardTitle>
        <CardDescription>Informações sobre o paciente simulado</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <Label htmlFor="nome-paciente">Nome do Paciente *</Label>
            <Input 
              id="nome-paciente" 
              placeholder="Ex: João Silva" 
              value={formData.nomePaciente}
              onChange={(e) => onFormDataChange('nomePaciente', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="idade">Idade *</Label>
            <Input 
              id="idade" 
              type="number" 
              placeholder="Ex: 45" 
              value={formData.idade}
              onChange={(e) => onFormDataChange('idade', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="sexo">Sexo *</Label>
            <Select value={formData.sexo} onValueChange={(value) => onFormDataChange('sexo', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="M">Masculino</SelectItem>
                <SelectItem value="F">Feminino</SelectItem>
                <SelectItem value="O">Outro</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <Label>Histórico Médico</Label>
            <Button variant="outline" size="sm" onClick={() => onAISuggestion('historicoMedico')}>
              <Sparkles className="w-4 h-4 mr-2" />
              Sugerir com IA
            </Button>
          </div>
          <Textarea 
            placeholder="Ex: HAS há 10 anos, DM tipo 2, tabagista..."
            rows={4}
            value={formData.historicoMedico}
            onChange={(e) => onFormDataChange('historicoMedico', e.target.value)}
          />
        </div>

        <Separator />

        <div className="space-y-4">
          <Label>Como o cenário inicia</Label>
          <Textarea 
            placeholder="Descreva como o cenário começa, o cenário inicial, o que o participante encontra ao entrar..."
            rows={3}
            value={formData.comoInicia}
            onChange={(e) => onFormDataChange('comoInicia', e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Local da simulação</Label>
            <Input 
              placeholder="Ex: Sala A, Pronto-Socorro"
              value={formData.localSimulacao}
              onChange={(e) => onFormDataChange('localSimulacao', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Voluntários necessários</Label>
            <Input 
              placeholder="Ex: 2 voluntários"
              value={formData.voluntarios}
              onChange={(e) => onFormDataChange('voluntarios', e.target.value)}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PacienteTab;
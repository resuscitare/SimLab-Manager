"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Sparkles } from "lucide-react";

interface PacientePerfilTabProps {
  formData: {
    nomePaciente: string;
    idade: string;
    sexo: string;
    peso: string;
    altura: string;
    perfilFisico: string;
    perfilPsicologico: string;
    perfilTecnico: string;
    historicoMedico: string;
    dm: boolean;
    has: boolean;
    asma: boolean;
    alergias: string;
    etilismo: boolean;
    tabagismo: boolean;
    outros: string;
    acompanhamentoMedico: string;
    medicacoesUso: string;
    cirurgiasInternacoes: string;
  };
  onFormDataChange: (field: string, value: any) => void;
  onAISuggestion: (campo: string) => void;
}

const PacientePerfilTab = ({
  formData,
  onFormDataChange,
  onAISuggestion
}: PacientePerfilTabProps) => {
  const handleCheckboxChange = (field: string, checked: boolean) => {
    onFormDataChange(field, checked);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Perfil do Paciente</CardTitle>
        <CardDescription>Informações completas sobre o paciente simulado</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Dados Básicos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="space-y-2">
            <Label htmlFor="nome-paciente">Nome *</Label>
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
            <Label htmlFor="peso">Peso (kg)</Label>
            <Input 
              id="peso" 
              placeholder="Ex: 70" 
              value={formData.peso}
              onChange={(e) => onFormDataChange('peso', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="altura">Altura (cm)</Label>
            <Input 
              id="altura" 
              placeholder="Ex: 170" 
              value={formData.altura}
              onChange={(e) => onFormDataChange('altura', e.target.value)}
            />
          </div>
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

        <Separator />

        {/* Perfis */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <Label>Perfil Físico</Label>
            <Textarea 
              placeholder="Descrição física do paciente..."
              rows={3}
              value={formData.perfilFisico}
              onChange={(e) => onFormDataChange('perfilFisico', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Perfil Psicológico</Label>
            <Textarea 
              placeholder="Estado psicológico, comportamento..."
              rows={3}
              value={formData.perfilPsicologico}
              onChange={(e) => onFormDataChange('perfilPsicologico', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Perfil Técnico</Label>
            <Textarea 
              placeholder="Habilidades técnicas, conhecimentos..."
              rows={3}
              value={formData.perfilTecnico}
              onChange={(e) => onFormDataChange('perfilTecnico', e.target.value)}
            />
          </div>
        </div>

        <Separator />

        {/* Histórico Médico */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <Label>Histórico Médico</Label>
            <Button variant="outline" size="sm" onClick={() => onAISuggestion('historicoMedico')}>
              <Sparkles className="w-4 h-4 mr-2" />
              Sugerir com IA
            </Button>
          </div>
          <Textarea 
            placeholder="Informações relevantes do histórico médico..."
            rows={4}
            value={formData.historicoMedico}
            onChange={(e) => onFormDataChange('historicoMedico', e.target.value)}
          />
        </div>

        {/* Condições Médicas */}
        <div className="space-y-4">
          <Label>Condições Médicas</Label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="dm"
                checked={formData.dm}
                onCheckedChange={(checked) => handleCheckboxChange('dm', !!checked)}
              />
              <Label htmlFor="dm">DM</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="has"
                checked={formData.has}
                onCheckedChange={(checked) => handleCheckboxChange('has', !!checked)}
              />
              <Label htmlFor="has">HAS</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="asma"
                checked={formData.asma}
                onCheckedChange={(checked) => handleCheckboxChange('asma', !!checked)}
              />
              <Label htmlFor="asma">Asma</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="etilismo"
                checked={formData.etilismo}
                onCheckedChange={(checked) => handleCheckboxChange('etilismo', !!checked)}
              />
              <Label htmlFor="etilismo">Etilismo</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="tabagismo"
                checked={formData.tabagismo}
                onCheckedChange={(checked) => handleCheckboxChange('tabagismo', !!checked)}
              />
              <Label htmlFor="tabagismo">Tabagismo</Label>
            </div>
          </div>
        </div>

        {/* Alergias e Outros */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label>Alergias</Label>
            <Input 
              placeholder="Ex: Penicilina, Dipirona..."
              value={formData.alergias}
              onChange={(e) => onFormDataChange('alergias', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Outras Condições</Label>
            <Input 
              placeholder="Outras condições relevantes..."
              value={formData.outros}
              onChange={(e) => onFormDataChange('outros', e.target.value)}
            />
          </div>
        </div>

        <Separator />

        {/* Informações Adicionais */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Acompanhamento Médico</Label>
            <Textarea 
              placeholder="Nome do médico, especialidade..."
              rows={2}
              value={formData.acompanhamentoMedico}
              onChange={(e) => onFormDataChange('acompanhamentoMedico', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Medicações em Uso</Label>
            <Textarea 
              placeholder="Medicamentos, dosagens, tempo de uso..."
              rows={3}
              value={formData.medicacoesUso}
              onChange={(e) => onFormDataChange('medicacoesUso', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Cirurgias e/ou Internações Anteriores</Label>
            <Textarea 
              placeholder="Histórico cirúrgico e de internações..."
              rows={3}
              value={formData.cirurgiasInternacoes}
              onChange={(e) => onFormDataChange('cirurgiasInternacoes', e.target.value)}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PacientePerfilTab;
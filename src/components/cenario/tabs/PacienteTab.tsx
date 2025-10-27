"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { ScenarioFormData, HistoricoMedico } from "@/types/prisma";
import { User } from "lucide-react";

interface PacienteTabProps {
  scenarioData: ScenarioFormData;
  handleScenarioDataChange: (field: keyof ScenarioFormData, value: any) => void;
  handleHistoricoMedicoChange: (field: keyof HistoricoMedico, value: string | boolean) => void;
}

const PacienteTab = ({ scenarioData, handleScenarioDataChange, handleHistoricoMedicoChange }: PacienteTabProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Perfil do Paciente
        </CardTitle>
        <CardDescription>Informações sobre o paciente simulado</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
          {/* Coluna 1 */}
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="patientName">Nome</Label>
              <Input id="patientName" value={scenarioData.patientName} onChange={(e) => handleScenarioDataChange('patientName', e.target.value)} placeholder="Ex: João da Silva" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="patientGender">Sexo</Label>
              <Select value={scenarioData.patientGender} onValueChange={(value) => handleScenarioDataChange('patientGender', value)}>
                <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Masculino">Masculino</SelectItem>
                  <SelectItem value="Feminino">Feminino</SelectItem>
                  <SelectItem value="Outro">Outro</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="perfilFisico">Perfil Físico</Label>
              <Textarea id="perfilFisico" value={scenarioData.perfilFisico} onChange={(e) => handleScenarioDataChange('perfilFisico', e.target.value)} placeholder="Descrição física do paciente" rows={2} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="perfilTecnico">Perfil Técnico</Label>
              <Textarea id="perfilTecnico" value={scenarioData.perfilTecnico} onChange={(e) => handleScenarioDataChange('perfilTecnico', e.target.value)} placeholder="Informações técnicas relevantes" rows={2} />
            </div>
          </div>

          {/* Coluna 2 */}
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="patientAge">Idade</Label>
              <Input id="patientAge" value={scenarioData.patientAge} onChange={(e) => handleScenarioDataChange('patientAge', e.target.value)} placeholder="Ex: 45 anos" />
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="patientWeight">Peso</Label>
                <Input id="patientWeight" value={scenarioData.patientWeight} onChange={(e) => handleScenarioDataChange('patientWeight', e.target.value)} placeholder="Ex: 80 kg" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="patientHeight">Altura</Label>
                <Input id="patientHeight" value={scenarioData.patientHeight} onChange={(e) => handleScenarioDataChange('patientHeight', e.target.value)} placeholder="Ex: 1.75 m" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="perfilPsicologico">Perfil Psicológico</Label>
              <Textarea id="perfilPsicologico" value={scenarioData.perfilPsicologico} onChange={(e) => handleScenarioDataChange('perfilPsicologico', e.target.value)} placeholder="Descrição psicológica/comportamental" rows={2} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="atualizadoEm">Atualizado em</Label>
              <Input id="atualizadoEm" type="date" value={scenarioData.atualizadoEm} onChange={(e) => handleScenarioDataChange('atualizadoEm', e.target.value)} />
            </div>
          </div>
        </div>

        {/* Histórico Médico */}
        <div className="space-y-4 rounded-lg border p-4">
          <Label className="font-semibold">Histórico Médico</Label>
          <p className="text-sm text-muted-foreground">Incluir informações relevantes para o cenário.</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {(['dm', 'has', 'asma', 'etilismo'] as Array<keyof HistoricoMedico>).map(item => (
              <div key={item} className="flex items-center space-x-2">
                <Checkbox id={item} checked={!!scenarioData.historicoMedico?.[item]} onCheckedChange={(checked) => handleHistoricoMedicoChange(item, !!checked)} />
                <Label htmlFor={item} className="font-normal capitalize">{item.toUpperCase()}</Label>
              </div>
            ))}
          </div>
          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-2">
              <Checkbox id="alergias" checked={!!scenarioData.historicoMedico?.alergias} onCheckedChange={(checked) => handleHistoricoMedicoChange('alergias', !!checked)} />
              <Label htmlFor="alergias" className="font-normal shrink-0">Alergias:</Label>
              <Input disabled={!scenarioData.historicoMedico?.alergias} value={scenarioData.historicoMedico?.alergiasDesc} onChange={(e) => handleHistoricoMedicoChange('alergiasDesc', e.target.value)} className="h-8" />
            </div>
            <div className="flex items-center gap-2">
              <Checkbox id="tabagismo" checked={!!scenarioData.historicoMedico?.tabagismo} onCheckedChange={(checked) => handleHistoricoMedicoChange('tabagismo', !!checked)} />
              <Label htmlFor="tabagismo" className="font-normal shrink-0">Tabagismo:</Label>
              <Input disabled={!scenarioData.historicoMedico?.tabagismo} value={scenarioData.historicoMedico?.tabagismoDesc} onChange={(e) => handleHistoricoMedicoChange('tabagismoDesc', e.target.value)} placeholder="Quantos maços dia/semana" className="h-8" />
            </div>
            <div className="flex items-center gap-2">
              <Checkbox id="outros" checked={!!scenarioData.historicoMedico?.outros} onCheckedChange={(checked) => handleHistoricoMedicoChange('outros', !!checked)} />
              <Label htmlFor="outros" className="font-normal shrink-0">Outros:</Label>
              <Input disabled={!scenarioData.historicoMedico?.outros} value={scenarioData.historicoMedico?.outrosDesc} onChange={(e) => handleHistoricoMedicoChange('outrosDesc', e.target.value)} className="h-8 flex-1" />
            </div>
          </div>
        </div>

        {/* Textareas */}
        <div className="space-y-2">
          <Label htmlFor="acompanhamentoMedico">Acompanhamento médico</Label>
          <Textarea id="acompanhamentoMedico" value={scenarioData.acompanhamentoMedico} onChange={(e) => handleScenarioDataChange('acompanhamentoMedico', e.target.value)} placeholder="(se necessário e pertinente: nome do médico, especialidade...)" rows={3} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="medicacoesEmUso">Medicações em uso/tempo</Label>
          <Textarea id="medicacoesEmUso" value={scenarioData.medicacoesEmUso} onChange={(e) => handleScenarioDataChange('medicacoesEmUso', e.target.value)} placeholder="Liste as medicações e há quanto tempo o paciente as utiliza" rows={3} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="cirurgiasAnteriores">Cirurgias e/ou internações anteriores</Label>
          <Textarea id="cirurgiasAnteriores" value={scenarioData.cirurgiasAnteriores} onChange={(e) => handleScenarioDataChange('cirurgiasAnteriores', e.target.value)} placeholder="Liste cirurgias e internações prévias relevantes" rows={3} />
        </div>
      </CardContent>
    </Card>
  );
};

export default PacienteTab;
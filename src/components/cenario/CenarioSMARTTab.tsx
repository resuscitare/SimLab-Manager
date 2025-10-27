"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Plus, X, Calendar, MapPin, Clock, Users } from "lucide-react";

interface CenarioSMARTTabProps {
  formData: {
    nomeCenario: string;
    localCenario: string;
    tempoCenario: string;
    tempoDebriefing: string;
    voluntarios: string;
    tipoSimulacao: string;
    descricaoCenario: string;
    inicioCenario: string;
    objetivosTecnicos: string;
    objetivosNaoTecnicos: string;
    escritoPor: string;
    atualizadoPor: string;
    validadoPor: string;
    produzidoEm: string;
    atualizadoEm: string;
  };
  onFormDataChange: (field: string, value: string) => void;
}

const CenarioSMARTTab = ({
  formData,
  onFormDataChange
}: CenarioSMARTTabProps) => {
  const objetivosTecnicosExemplo = [
    "Reconhecer PCR em AESP no primeiro minuto de cenário",
    "Realizar RCP eficaz (frequência, profundidade e minimizar interrupções)",
    "Identificar ritmo de parada cardíaca no monitor",
    "Administrar medicamentos de emergência conforme protocolo"
  ];

  const objetivosNaoTecnicosExemplo = [
    "Estabelecer liderança nos 2 minutos de cenário",
    "Dividir papéis e responsabilidades durante atendimento",
    "Comunicar-se efetivamente com a equipe",
    "Manter consciência situacional durante emergência"
  ];

  const adicionarObjetivoTecnico = (objetivo: string) => {
    const objetivosAtuais = formData.objetivosTecnicos.split('\n').filter(o => o.trim());
    const novosObjetivos = [...objetivosAtuais, objetivo];
    onFormDataChange('objetivosTecnicos', novosObjetivos.join('\n'));
  };

  const adicionarObjetivoNaoTecnico = (objetivo: string) => {
    const objetivosAtuais = formData.objetivosNaoTecnicos.split('\n').filter(o => o.trim());
    const novosObjetivos = [...objetivosAtuais, objetivo];
    onFormDataChange('objetivosNaoTecnicos', novosObjetivos.join('\n'));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Identificação do Cenário</CardTitle>
        <CardDescription>Informações específicas do cenário de simulação</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Informações Básicas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="nome-cenario">Nome do Cenário *</Label>
            <Input 
              id="nome-cenario" 
              placeholder="Ex: Parada Cardiorrespiratória em AESP"
              value={formData.nomeCenario}
              onChange={(e) => onFormDataChange('nomeCenario', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Local do cenário
            </Label>
            <Input 
              placeholder="Ex: Sala A, Pronto-Socorro"
              value={formData.localCenario}
              onChange={(e) => onFormDataChange('localCenario', e.target.value)}
            />
          </div>
        </div>

        {/* Tempos e Voluntários */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Tempo de cenário (min)
            </Label>
            <Input 
              type="number"
              placeholder="Ex: 30"
              value={formData.tempoCenario}
              onChange={(e) => onFormDataChange('tempoCenario', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Tempo de Debriefing (min)
            </Label>
            <Input 
              type="number"
              placeholder="Ex: 20"
              value={formData.tempoDebriefing}
              onChange={(e) => onFormDataChange('tempoDebriefing', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Voluntários necessários
            </Label>
            <Input 
              placeholder="Ex: 2 médicos, 1 enfermeiro"
              value={formData.voluntarios}
              onChange={(e) => onFormDataChange('voluntarios', e.target.value)}
            />
          </div>
        </div>

        {/* Tipo de Simulação */}
        <div className="space-y-2">
          <Label>Tipo de Simulação</Label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="tipoSimulacao"
                value="simulador"
                checked={formData.tipoSimulacao === "simulador"}
                onChange={(e) => onFormDataChange('tipoSimulacao', e.target.value)}
              />
              Simulador
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="tipoSimulacao"
                value="paciente"
                checked={formData.tipoSimulacao === "paciente"}
                onChange={(e) => onFormDataChange('tipoSimulacao', e.target.value)}
              />
              Paciente Padronizado
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="tipoSimulacao"
                value="ambos"
                checked={formData.tipoSimulacao === "ambos"}
                onChange={(e) => onFormDataChange('tipoSimulacao', e.target.value)}
              />
              Ambos
            </label>
          </div>
        </div>

        {/* Objetivos de Aprendizagem - Técnicos */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <Label>Objetivos de Aprendizagem Técnicos *</Label>
            <div className="flex gap-2">
              {objetivosTecnicosExemplo.map((objetivo, index) => (
                <Badge 
                  key={index} 
                  variant="outline" 
                  className="cursor-pointer hover:bg-primary/10"
                  onClick={() => adicionarObjetivoTecnico(objetivo)}
                >
                  + {objetivo.split(' ').slice(0, 2).join(' ')}...
                </Badge>
              ))}
            </div>
          </div>
          <Textarea 
            placeholder="Ex: Reconhecer PCR em AESP no primeiro minuto de cenário. Realizar RCP eficaz..."
            rows={4}
            value={formData.objetivosTecnicos}
            onChange={(e) => onFormDataChange('objetivosTecnicos', e.target.value)}
          />
        </div>

        {/* Objetivos de Aprendizagem - Não Técnicos */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <Label>Objetivos de Aprendizagem Não Técnicos *</Label>
            <div className="flex gap-2">
              {objetivosNaoTecnicosExemplo.map((objetivo, index) => (
                <Badge 
                  key={index} 
                  variant="outline" 
                  className="cursor-pointer hover:bg-primary/10"
                  onClick={() => adicionarObjetivoNaoTecnico(objetivo)}
                >
                  + {objetivo.split(' ').slice(0, 2).join(' ')}...
                </Badge>
              ))}
            </div>
          </div>
          <Textarea 
            placeholder="Ex: Estabelecer liderança nos 2 minutos de cenário. Dividir papéis e responsabilidades..."
            rows={4}
            value={formData.objetivosNaoTecnicos}
            onChange={(e) => onFormDataChange('objetivosNaoTecnicos', e.target.value)}
          />
        </div>

        {/* Metadados do Cenário */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Escrito por</Label>
              <Input 
                placeholder="Ex: Dr. Carlos Silva"
                value={formData.escritoPor}
                onChange={(e) => onFormDataChange('escritoPor', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Produzido em</Label>
              <Input 
                type="date"
                value={formData.produzidoEm}
                onChange={(e) => onFormDataChange('produzidoEm', e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Atualizado por</Label>
              <Input 
                placeholder="Ex: Dra. Ana Costa"
                value={formData.atualizadoPor}
                onChange={(e) => onFormDataChange('atualizadoPor', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Atualizado em</Label>
              <Input 
                type="date"
                value={formData.atualizadoEm}
                onChange={(e) => onFormDataChange('atualizadoEm', e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Validação */}
        <div className="space-y-2">
          <Label>Validado por</Label>
          <Input 
            placeholder="Ex: Comitê de Simulação"
            value={formData.validadoPor}
            onChange={(e) => onFormDataChange('validadoPor', e.target.value)}
          />
        </div>

        {/* Descrição e Início */}
        <div className="grid grid-cols-1 gap-6">
          <div className="space-y-2">
            <Label>Descrição do Cenário</Label>
            <Textarea 
              placeholder="O que será contado ao participante..."
              rows={3}
              value={formData.descricaoCenario}
              onChange={(e) => onFormDataChange('descricaoCenario', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Início de Cenário</Label>
            <Textarea 
              placeholder="Como o cenário se inicia (ator em maca? Cadeira? Dispneico?)..."
              rows={2}
              value={formData.inicioCenario}
              onChange={(e) => onFormDataChange('inicioCenario', e.target.value)}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CenarioSMARTTab;
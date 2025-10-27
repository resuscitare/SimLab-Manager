"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Plus, Package, MessageSquare, Sparkles } from "lucide-react";

interface MateriaisDebriefingTabProps {
  formData: {
    materiaisEquipamentos: string;
    impressosNecessarios: string;
    preparoMontagem: string;
    falasDirecionadoras: string;
    metasSeguranca: {
      meta1: boolean;
      meta2: boolean;
      meta3: boolean;
      meta4: boolean;
      meta5: boolean;
      meta6: boolean;
    };
    dominiosDesempenho: {
      tomadaDecisao: boolean;
      habilidadeTecnica: boolean;
      comunicacao: boolean;
      utilizacaoRecursos: boolean;
      liderancaTrabalhoEquipe: boolean;
      conscienciaSituacional: boolean;
    };
    protocolosEspecificos: string;
    exemplosFrases: string;
  };
  onFormDataChange: (field: string, value: any) => void;
  onAISuggestion: (campo: string) => void;
}

const MateriaisDebriefingTab = ({
  formData,
  onFormDataChange,
  onAISuggestion
}: MateriaisDebriefingTabProps) => {
  const handleCheckboxChange = (field: string, checked: boolean) => {
    onFormDataChange(field, checked);
  };

  const metasSeguranca = [
    { id: "meta1", label: "Meta 1 – Identificação correta dos pacientes" },
    { id: "meta2", label: "Meta 2 – Comunicação efetiva" },
    { id: "meta3", label: "Meta 3 – Melhorar a segurança dos medicamentos de Alta Vigilância" },
    { id: "meta4", label: "Meta 4 – Cirurgia segura" },
    { id: "meta5", label: "Meta 5 – Redução do risco de infecções associadas aos cuidados em saúde" },
    { id: "meta6", label: "Meta 6 – Prevenção de danos decorrentes de quedas" }
  ];

  const dominiosDesempenho = [
    { id: "tomadaDecisao", label: "Tomada de decisão" },
    { id: "habilidadeTecnica", label: "Habilidade técnica" },
    { id: "comunicacao", label: "Comunicação" },
    { id: "utilizacaoRecursos", label: "Utilização de recursos" },
    { id: "liderancaTrabalhoEquipe", label: "Liderança e trabalho em equipe" },
    { id: "conscienciaSituacional", label: "Consciência situacional" }
  ];

  return (
    <div className="space-y-6">
      {/* Materiais e Equipamentos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Materiais e Equipamentos Necessários
          </CardTitle>
          <CardDescription>Lista completa de materiais, equipamentos e preparo necessário</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label>Materiais e Equipamentos</Label>
              <Button variant="outline" size="sm" onClick={() => onAISuggestion('materiaisEquipamentos')}>
                <Sparkles className="w-4 h-4 mr-2" />
                Sugerir com IA
              </Button>
            </div>
            <Textarea 
              placeholder="Liste todos os materiais e equipamentos necessários para a simulação..."
              rows={4}
              value={formData.materiaisEquipamentos}
              onChange={(e) => onFormDataChange('materiaisEquipamentos', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Impressos Necessários</Label>
            <Textarea 
              placeholder="Documentos, formulários, checklists impressos..."
              rows={2}
              value={formData.impressosNecessarios}
              onChange={(e) => onFormDataChange('impressosNecessarios', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Preparo de Montagem do Simulador/Paciente Padronizado e Sala</Label>
            <Textarea 
              placeholder="Orientações específicas para preparação da sala e equipamentos..."
              rows={3}
              value={formData.preparoMontagem}
              onChange={(e) => onFormDataChange('preparoMontagem', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Falas Direcionadoras do Simulador e/ou Paciente Padronizado</Label>
            <Textarea 
              placeholder="Scripts específicos para os atores durante a simulação..."
              rows={3}
              value={formData.falasDirecionadoras}
              onChange={(e) => onFormDataChange('falasDirecionadoras', e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Pontos Norteadores para o Debriefing */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Pontos Norteadores para o Debriefing
          </CardTitle>
          <CardDescription>Estrutura para orientar a discussão pós-simulação</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Metas de Segurança do Paciente */}
          <div className="space-y-4">
            <Label>Metas de Segurança do Paciente</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {metasSeguranca.map((meta) => (
                <div key={meta.id} className="flex items-center space-x-2">
                  <Checkbox 
                    id={meta.id}
                    checked={formData.metasSeguranca[meta.id as keyof typeof formData.metasSeguranca]}
                    onCheckedChange={(checked) => 
                      onFormDataChange(`metasSeguranca.${meta.id}`, !!checked)
                    }
                  />
                  <Label htmlFor={meta.id} className="text-sm">{meta.label}</Label>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Domínios de Desempenho */}
          <div className="space-y-4">
            <Label>Domínios de Desempenho</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {dominiosDesempenho.map((dominio) => (
                <div key={dominio.id} className="flex items-center space-x-2">
                  <Checkbox 
                    id={dominio.id}
                    checked={formData.dominiosDesempenho[dominio.id as keyof typeof formData.dominiosDesempenho]}
                    onCheckedChange={(checked) => 
                      onFormDataChange(`dominiosDesempenho.${dominio.id}`, !!checked)
                    }
                  />
                  <Label htmlFor={dominio.id} className="text-sm">{dominio.label}</Label>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Protocolos Específicos */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label>Protocolos Específicos</Label>
              <Button variant="outline" size="sm" onClick={() => onAISuggestion('protocolosEspecificos')}>
                <Sparkles className="w-4 h-4 mr-2" />
                Sugerir com IA
              </Button>
            </div>
            <Textarea 
              placeholder="Protocolos clínicos específicos relevantes para o cenário..."
              rows={3}
              value={formData.protocolosEspecificos}
              onChange={(e) => onFormDataChange('protocolosEspecificos', e.target.value)}
            />
          </div>

          {/* Exemplos de Frases */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label>Exemplos de Frases que Podem Ser Utilizadas no Debriefing</Label>
              <Button variant="outline" size="sm" onClick={() => onAISuggestion('exemplosFrases')}>
                <Sparkles className="w-4 h-4 mr-2" />
                Sugerir com IA
              </Button>
            </div>
            <Textarea 
              placeholder="Frases úteis para facilitar a discussão durante o debriefing..."
              rows={3}
              value={formData.exemplosFrases}
              onChange={(e) => onFormDataChange('exemplosFrases', e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Anotações do Debriefing */}
      <Card>
        <CardHeader>
          <CardTitle>Anotações / Percepções do Debriefing</CardTitle>
          <CardDescription>Espaço para registrar observações durante a simulação</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Objetivos Técnicos</Label>
                <Textarea 
                  placeholder="Observações sobre os objetivos técnicos..."
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label>Objetivos Não Técnicos</Label>
                <Textarea 
                  placeholder="Observações sobre os objetivos não técnicos..."
                  rows={3}
                />
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Segurança do Paciente</Label>
                <Textarea 
                  placeholder="Aspectos de segurança observados..."
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label>Habilidades</Label>
                <Textarea 
                  placeholder="Habilidades demonstradas pelos participantes..."
                  rows={3}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MateriaisDebriefingTab;
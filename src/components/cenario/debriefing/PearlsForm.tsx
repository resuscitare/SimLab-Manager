"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ScenarioFormData } from "@/types/prisma";
import { Plus, Info, Upload, Link as LinkIcon, Trash2 } from "lucide-react";

interface PearlsFormProps {
  scenarioData: ScenarioFormData;
}

interface CriticalMoment {
  id: number;
  description: string;
  expectedAction: string;
  possibleGap: string;
}

const PearlsForm = ({ scenarioData }: PearlsFormProps) => {
  const [analysisApproach, setAnalysisApproach] = useState("advocacy-inquiry");
  const [summaryApproach, setSummaryApproach] = useState("aprendiz");
  const [criticalMoments, setCriticalMoments] = useState<CriticalMoment[]>([
    { id: 1, description: "", expectedAction: "", possibleGap: "" }
  ]);

  const addCriticalMoment = () => {
    setCriticalMoments([
      ...criticalMoments,
      { id: Date.now(), description: "", expectedAction: "", possibleGap: "" }
    ]);
  };

  const removeCriticalMoment = (id: number) => {
    if (criticalMoments.length > 1) {
      setCriticalMoments(criticalMoments.filter(moment => moment.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Modelo PEARLS - Planejamento de Debriefing</CardTitle>
          <CardDescription>Preencha as informações para estruturar seu debriefing usando o modelo PEARLS.</CardDescription>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Informações Básicas do Cenário</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <Label>Nome do Cenário</Label>
              <Input value={scenarioData.title} disabled />
            </div>
            <div>
              <Label>Duração Prevista do Debriefing</Label>
              <Select>
                <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                <SelectContent>
                  {[15, 20, 25, 30, 35, 40].map(t => <SelectItem key={t} value={String(t)}>{t} min</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Nível dos Participantes</Label>
              <Select>
                <SelectTrigger><SelectValue placeholder="Selecione o nível" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="graduacao">Estudantes de graduação</SelectItem>
                  <SelectItem value="residente_r1_r2">Residentes R1-R2</SelectItem>
                  <SelectItem value="residente_r3+">Residentes R3+</SelectItem>
                  <SelectItem value="profissionais">Profissionais</SelectItem>
                  <SelectItem value="multiprofissional">Equipe multiprofissional</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Objetivos de Aprendizagem</CardTitle>
          <CardDescription>Revise os objetivos definidos para o cenário, que guiarão o debriefing.</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {scenarioData.technicalLearningObjectives.map((obj, i) => <li key={`tech-${i}`} className="text-sm p-2 bg-muted rounded-md">{obj} (Técnico)</li>)}
            {scenarioData.nonTechnicalLearningObjectives.map((obj, i) => <li key={`nontech-${i}`} className="text-sm p-2 bg-muted rounded-md">{obj} (Não Técnico)</li>)}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Momentos Críticos Antecipados</CardTitle>
          <CardDescription>Identifique 2-4 pontos decisivos esperados no cenário para focar sua análise.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {criticalMoments.map((moment, index) => (
            <div key={moment.id} className="p-4 border rounded-lg space-y-3 relative">
              <Label className="font-semibold">Momento Crítico {index + 1}</Label>
              <div className="space-y-2">
                <Label htmlFor={`desc-${moment.id}`}>Descrição do momento</Label>
                <Input id={`desc-${moment.id}`} placeholder="Ex: Paciente desenvolve taquicardia ventricular sem pulso." />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`action-${moment.id}`}>Ação/decisão esperada</Label>
                <Input id={`action-${moment.id}`} placeholder="Ex: Iniciar RCP e desfibrilar imediatamente." />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`gap-${moment.id}`}>Lacuna de performance possível</Label>
                <Input id={`gap-${moment.id}`} placeholder="Ex: Atraso na desfibrilação, comunicação ineficaz da equipe." />
              </div>
              {criticalMoments.length > 1 && (
                <Button variant="ghost" size="icon" className="absolute top-2 right-2 text-destructive" onClick={() => removeCriticalMoment(moment.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
          <Button variant="outline" onClick={addCriticalMoment}>
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Momento Crítico
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Fase 1: Preparando o Cenário (1-2 min)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Label>Script de Abertura Sugerido</Label>
          <Textarea
            defaultValue={`Vamos passar os próximos [XX] minutos debriefando esta simulação. O objetivo é refletir sobre o que aconteceu, entender melhor nossas decisões e ações, e identificar como podemos melhorar nossa prática clínica. Lembrem-se de que este é um espaço seguro para aprendizado.`}
            rows={4}
          />
          <Label>Notas/Personalizações</Label>
          <Textarea placeholder="Adicione suas observações aqui..." />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Fase 2: Reação (2-3 min)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Label>Perguntas Preparadas</Label>
          <div className="space-y-2">
            <div className="flex items-center space-x-2"><Checkbox id="r1" defaultChecked /><Label htmlFor="r1">Como foi essa experiência para vocês?</Label></div>
            <div className="flex items-center space-x-2"><Checkbox id="r2" defaultChecked /><Label htmlFor="r2">Como vocês estão se sentindo agora?</Label></div>
            <div className="flex items-center space-x-2"><Checkbox id="r3" /><Label htmlFor="r3">O que foi mais desafiador neste cenário?</Label></div>
          </div>
          <Label>Observações para o Facilitador</Label>
          <Textarea defaultValue="Dica: Permita que vários participantes compartilhem. Valide todas as emoções. Não aprofunde demais nesta fase - apenas reconheça sentimentos." />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Fase 3: Descrição (3-5 min)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Label>Perguntas Preparadas</Label>
          <div className="space-y-2">
            <div className="flex items-center space-x-2"><Checkbox id="d1" defaultChecked /><Label htmlFor="d1">Quem pode resumir o caso do ponto de vista médico?</Label></div>
            <div className="flex items-center space-x-2"><Checkbox id="d2" defaultChecked /><Label htmlFor="d2">Quais foram as principais questões clínicas que vocês enfrentaram?</Label></div>
          </div>
          <Label>Linha do Tempo Esperada</Label>
          <Textarea placeholder="Mapeie a sequência de eventos esperada aqui..." />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Fase 4: Análise (10-15 min)</CardTitle>
          <CardDescription>Identificação de domínios de performance e lacunas. Escolha uma das três abordagens dependendo do contexto.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Label>Selecione a Abordagem de Análise Principal</Label>
          <RadioGroup value={analysisApproach} onValueChange={setAnalysisApproach} className="space-y-3">
            <div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="plus-delta" id="plus-delta" />
                <Label htmlFor="plus-delta">A) Autoavaliação do Aprendiz (Plus-Delta)</Label>
              </div>
              <p className="text-sm text-muted-foreground ml-6">Usar quando o tempo é limitado e o aprendiz gera os objetivos.</p>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="advocacy-inquiry" id="advocacy-inquiry" />
                <Label htmlFor="advocacy-inquiry">B) Facilitação Focada (Advocacy-Inquiry)</Label>
              </div>
              <p className="text-sm text-muted-foreground ml-6">Usar quando a justificativa para a ação não é clara e há tempo para explorar.</p>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="feedback-diretivo" id="feedback-diretivo" />
                <Label htmlFor="feedback-diretivo">C) Feedback Diretivo e Ensino</Label>
              </div>
              <p className="text-sm text-muted-foreground ml-6">Usar para prazos menores e para lacunas de conteúdo técnico/cognitivo.</p>
            </div>
          </RadioGroup>

          {analysisApproach === 'plus-delta' && (
            <div className="p-4 border rounded-md mt-4 space-y-4">
              <h4 className="font-semibold">A) Autoavaliação do Aprendiz (Plus-Delta)</h4>
              <div className="space-y-2">
                <Label>Perguntas Sugeridas:</Label>
                <div className="flex items-center space-x-2"><Checkbox defaultChecked /><Label className="font-normal">"Quais aspectos do caso vocês acham que gerenciaram bem?" (Plus)</Label></div>
                <div className="flex items-center space-x-2"><Checkbox defaultChecked /><Label className="font-normal">"Quais aspectos vocês gostariam de mudar?" (Delta)</Label></div>
                <div className="flex items-center space-x-2"><Checkbox defaultChecked /><Label className="font-normal">"Por quê?"</Label></div>
              </div>
            </div>
          )}

          {analysisApproach === 'advocacy-inquiry' && (
            <div className="p-4 border rounded-md mt-4 space-y-4">
              <h4 className="font-semibold">B) Facilitação Focada (Advocacy-Inquiry)</h4>
              
              <div className="p-3 border bg-background rounded-lg space-y-3">
                <h5 className="font-medium text-sm">Etapa 1 - Explorar Lacunas de Performance</h5>
                <p className="text-xs text-muted-foreground">Para cada objetivo, prepare sua observação (Advocacy) e sua pergunta (Inquiry).</p>
                <Label>Observação (Advocacy):</Label>
                <Textarea placeholder={`"Eu notei que..." / "Eu ouvi você dizer..." (Apreciação)\n"Eu gostei que..." (Preocupação)\n"Eu fiquei desconfortável porque..."`} rows={3}/>
                <Label>Pergunta (Inquiry):</Label>
                <Textarea placeholder={`"Como você vê isso?"\n"O que estava passando pela sua cabeça naquele momento?"`} rows={2}/>
              </div>

              <div className="p-3 border bg-background rounded-lg space-y-3">
                <h5 className="font-medium text-sm">Etapa 2 - Compreender e Fechar Lacunas</h5>
                <p className="text-xs text-muted-foreground">Use estas estruturas como guia durante a discussão.</p>
                <div className="space-y-1">
                  <Label className="text-xs">Clarificar:</Label>
                  <p className="text-sm p-2 bg-muted rounded-md">"Então o que estou ouvindo é que [lacuna de performance] estava relacionado a [frame/justificativa]..."</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Ensinar:</Label>
                  <p className="text-sm p-2 bg-muted rounded-md">Ensinar para fechar a lacuna quando a necessidade de aprendizado está clara.</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Perguntar:</Label>
                  <p className="text-sm p-2 bg-muted rounded-md">"Que estratégias vocês veem daqui para frente?"</p>
                </div>
              </div>
            </div>
          )}

          {analysisApproach === 'feedback-diretivo' && (
             <div className="p-4 border rounded-md mt-4 space-y-4">
                <h4 className="font-semibold">C) Feedback Diretivo e Ensino</h4>
                <div className="flex items-start gap-2 p-3 bg-blue-50 border-l-4 border-blue-400 rounded-md">
                  <Info className="h-4 w-4 text-blue-600 mt-1 shrink-0"/>
                  <p className="text-xs text-blue-800">
                    <strong>Formato:</strong> "Eu notei que [lacuna de performance]. Na próxima vez, você pode querer... [fechar lacuna] porque [fornecer justificativa]."
                  </p>
                </div>
                <div className="p-3 border bg-background rounded-lg space-y-2">
                    <Label>Lacuna de Performance 1</Label>
                    <Input placeholder="Descrição da lacuna de performance" />
                    <Label>Observação Direta</Label>
                    <Input placeholder="Eu notei que..." />
                    <Label>Estratégia Corretiva</Label>
                    <Input placeholder="Na próxima vez, você pode querer..." />
                    <Label>Justificativa (evidência/protocolo)</Label>
                    <Input placeholder="...porque..." />
                </div>
                <Button variant="outline" size="sm"><Plus className="h-4 w-4 mr-2" />Adicionar Lacuna</Button>
             </div>
          )}

          <div className="pt-4 border-t">
            <div className="flex items-center space-x-2">
              <Checkbox id="q-final" />
              <Label htmlFor="q-final">"Há alguma questão pendente que não discutimos antes de começarmos a encerrar?"</Label>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Fase 5: Resumo/Aplicação (3-5 min)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Label>Escolha a Abordagem de Resumo</Label>
          <RadioGroup value={summaryApproach} onValueChange={setSummaryApproach}>
            <div className="flex items-center space-x-2"><RadioGroupItem value="aprendiz" id="aprendiz" /><Label htmlFor="aprendiz">Centrado no Aprendiz (Recomendado)</Label></div>
            <div className="flex items-center space-x-2"><RadioGroupItem value="instrutor" id="instrutor" /><Label htmlFor="instrutor">Centrado no Instrutor</Label></div>
          </RadioGroup>
          {summaryApproach === 'aprendiz' && (
            <div className="p-4 border rounded-md mt-4 space-y-2">
              <Label>Pergunta de Encerramento</Label>
              <Textarea defaultValue="Gostaria de encerrar pedindo que cada um de vocês compartilhe um ou dois pontos-chave que levarão dessa experiência e que os ajudarão na prática clínica futura." />
            </div>
          )}
          {summaryApproach === 'instrutor' && (
            <div className="p-4 border rounded-md mt-4 space-y-2">
              <Label>Pontos-Chave para Resumir</Label>
              <Textarea placeholder="Resuma os 2-3 pontos mais importantes que foram discutidos e que se alinham com os objetivos de aprendizagem." />
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recursos de Apoio</CardTitle>
          <CardDescription>Anexe protocolos, artigos ou links relevantes para o debriefing.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2">
            <Input placeholder="Nome do recurso" className="flex-1" />
            <Input placeholder="Link ou upload" className="flex-1" />
            <Button variant="ghost" size="icon"><Upload className="h-4 w-4" /></Button>
          </div>
          <Button variant="outline" size="sm"><Plus className="h-4 w-4 mr-2" />Adicionar Recurso</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Checklist de Preparação do Facilitador</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <h4 className="font-semibold text-sm">Antes do Debriefing:</h4>
          <div className="flex items-center space-x-2"><Checkbox id="prep1" /><Label htmlFor="prep1">Ambiente preparado (sala privada, confortável)</Label></div>
          <div className="flex items-center space-x-2"><Checkbox id="prep2" /><Label htmlFor="prep2">Materiais de apoio disponíveis</Label></div>
          <div className="flex items-center space-x-2"><Checkbox id="prep3" /><Label htmlFor="prep3">Revisei objetivos de aprendizagem e momentos críticos</Label></div>
          <h4 className="font-semibold text-sm mt-4">Durante o Debriefing:</h4>
          <div className="flex items-center space-x-2"><Checkbox id="during1" /><Label htmlFor="during1">Manter segurança psicológica</Label></div>
          <div className="flex items-center space-x-2"><Checkbox id="during2" /><Label htmlFor="during2">Envolver todos os participantes</Label></div>
          <div className="flex items-center space-x-2"><Checkbox id="during3" /><Label htmlFor="during3">Gerenciar tempo efetivamente</Label></div>
        </CardContent>
      </Card>

      <div className="flex justify-end space-x-2">
        <Button variant="outline">Salvar Rascunho</Button>
        <Button>Gerar Script Completo</Button>
        <Button variant="secondary">Exportar PDF</Button>
      </div>
    </div>
  );
};

export default PearlsForm;
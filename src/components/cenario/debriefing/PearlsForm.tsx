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
import { Plus } from "lucide-react";

interface PearlsFormProps {
  scenarioData: ScenarioFormData;
}

const PearlsForm = ({ scenarioData }: PearlsFormProps) => {
  const [analysisApproach, setAnalysisApproach] = useState("advocacy-inquiry");
  const [summaryApproach, setSummaryApproach] = useState("aprendiz");

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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Objetivos de Aprendizagem</CardTitle>
          <CardDescription>Revise os objetivos definidos para o cenário.</CardDescription>
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
        </CardHeader>
        <CardContent className="space-y-4">
          <Label>Selecione a Abordagem de Análise Principal</Label>
          <RadioGroup value={analysisApproach} onValueChange={setAnalysisApproach} className="space-y-3">
            <div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="plus-delta" id="plus-delta" />
                <Label htmlFor="plus-delta">Plus-Delta (Autoavaliação do Aprendiz)</Label>
              </div>
              <p className="text-sm text-muted-foreground ml-6">Use quando: tempo limitado, aprendizes geram os objetivos.</p>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="advocacy-inquiry" id="advocacy-inquiry" />
                <Label htmlFor="advocacy-inquiry">Advocacy-Inquiry (Facilitação Focada)</Label>
              </div>
              <p className="text-sm text-muted-foreground ml-6">Use quando: justificativa para ação não é clara, tempo para explorar performance.</p>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="feedback-diretivo" id="feedback-diretivo" />
                <Label htmlFor="feedback-diretivo">Feedback Diretivo (Ensino Direto)</Label>
              </div>
              <p className="text-sm text-muted-foreground ml-6">Use quando: prazos menores, lacunas técnicas/cognitivas claras.</p>
            </div>
          </RadioGroup>

          {analysisApproach === 'plus-delta' && (
            <div className="p-4 border rounded-md mt-4 space-y-4">
              <h4 className="font-semibold">Plus-Delta</h4>
              <div className="space-y-2">
                <Label>Perguntas Plus (Positivo)</Label>
                <div className="flex items-center space-x-2"><Checkbox defaultChecked /><Label className="font-normal">Quais aspectos do caso vocês acham que gerenciaram bem?</Label></div>
                <div className="flex items-center space-x-2"><Checkbox /><Label className="font-normal">O que funcionou bem na equipe?</Label></div>
              </div>
              <div className="space-y-2">
                <Label>Perguntas Delta (Mudança)</Label>
                <div className="flex items-center space-x-2"><Checkbox defaultChecked /><Label className="font-normal">Quais aspectos vocês gostariam de mudar?</Label></div>
                <div className="flex items-center space-x-2"><Checkbox defaultChecked /><Label className="font-normal">Por quê?</Label></div>
                <div className="flex items-center space-x-2"><Checkbox /><Label className="font-normal">O que fariam diferente na próxima vez?</Label></div>
              </div>
            </div>
          )}

          {analysisApproach === 'advocacy-inquiry' && (
            <div className="p-4 border rounded-md mt-4 space-y-4">
              <h4 className="font-semibold">Advocacy-Inquiry</h4>
              <p className="text-sm text-muted-foreground">Para cada objetivo, prepare sua observação e pergunta.</p>
              {scenarioData.technicalLearningObjectives.map((obj, i) => (
                <div key={i} className="p-3 border bg-background rounded-lg space-y-2">
                  <p className="font-medium text-sm">Para Objetivo: "{obj}"</p>
                  <Label>Observação (O que você notou):</Label>
                  <Input placeholder="Eu notei que..." />
                  <Label>Pergunta de Inquiry:</Label>
                  <Input defaultValue="O que estava passando pela sua cabeça naquele momento?" />
                </div>
              ))}
            </div>
          )}

          {analysisApproach === 'feedback-diretivo' && (
             <div className="p-4 border rounded-md mt-4 space-y-4">
                <h4 className="font-semibold">Feedback Diretivo</h4>
                <p className="text-sm text-muted-foreground">Para cada lacuna de performance antecipada, prepare o feedback.</p>
                <div className="p-3 border bg-background rounded-lg space-y-2">
                    <Label>Lacuna de Performance 1</Label>
                    <Input placeholder="Descrição da lacuna de performance" />
                    <Label>Observação Direta</Label>
                    <Input placeholder="Eu notei que [lacuna específica]..." />
                    <Label>Estratégia Corretiva</Label>
                    <Input placeholder="Na próxima vez, você pode querer..." />
                    <Label>Justificativa (evidência/protocolo)</Label>
                    <Input placeholder="...porque [fornecer justificativa baseada em evidência]" />
                </div>
                <Button variant="outline" size="sm"><Plus className="h-4 w-4 mr-2" />Adicionar Lacuna</Button>
             </div>
          )}
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
        </CardContent>
      </Card>

      <div className="flex justify-end space-x-2">
        <Button variant="outline">Salvar Rascunho</Button>
        <Button>Gerar Script Completo</Button>
      </div>
    </div>
  );
};

export default PearlsForm;
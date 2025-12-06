"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { ScenarioFormData } from "@/types/prisma";
import { Plus, Trash2, Users, MessageCircle, Repeat, Send, Star } from "lucide-react";

interface TeamGainsFormProps {
  scenarioData: ScenarioFormData;
}

const TeamGainsForm = ({ scenarioData }: TeamGainsFormProps) => {
  const [circularQuestions, setCircularQuestions] = useState<string[]>([""]);

  const addCircularQuestion = () => {
    setCircularQuestions([...circularQuestions, ""]);
  };

  const removeCircularQuestion = (index: number) => {
    if (circularQuestions.length > 1) {
      setCircularQuestions(circularQuestions.filter((_, i) => i !== index));
    }
  };

  const updateCircularQuestion = (index: number, value: string) => {
    const newQuestions = [...circularQuestions];
    newQuestions[index] = value;
    setCircularQuestions(newQuestions);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Modelo TeamGAINS - Debriefing de Equipe</CardTitle>
          <CardDescription>Estruture seu debriefing com foco em dinâmica de equipe, comunicação e performance interprofissional.</CardDescription>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Users className="h-5 w-5 text-primary" />Fase 1: Prebriefing e Preparação do Cenário</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Label>Script de Abertura Focado em Equipe</Label>
          <Textarea
            defaultValue={`Bem-vindos. O objetivo desta simulação é praticarmos nosso trabalho em equipe. Não há julgamento individual; estamos aqui para aprender juntos como uma equipe. A confidencialidade é fundamental. Vamos todos nos comprometer com um ambiente de aprendizado seguro e respeitoso.`}
            rows={4}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><MessageCircle className="h-5 w-5 text-primary" />Fase 2: Reações</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Label>Perguntas para Iniciar a Discussão</Label>
          <div className="space-y-2">
            <div className="flex items-center space-x-2"><Checkbox id="tg-r1" defaultChecked /><Label htmlFor="tg-r1">"Como a equipe se sentiu durante essa simulação?"</Label></div>
            <div className="flex items-center space-x-2"><Checkbox id="tg-r2" /><Label htmlFor="tg-r2">"Qual foi o momento de maior pressão para a equipe?"</Label></div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Repeat className="h-5 w-5 text-primary" />Fase 3: Compreensão e Análise</CardTitle>
          <CardDescription>Explore a performance da equipe usando autoavaliação, advocacy-inquiry e perguntas circulares.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="p-4 border rounded-lg space-y-3">
            <h4 className="font-semibold">A) Autoavaliação Guiada da Equipe</h4>
            <Label>Perguntas para a equipe:</Label>
            <Textarea
              placeholder={`- O que funcionou bem em termos de trabalho em equipe?\n- Onde a comunicação foi mais eficaz?\n- Que aspecto do nosso trabalho em equipe poderíamos melhorar na próxima vez?`}
              rows={4}
            />
          </div>

          <div className="p-4 border rounded-lg space-y-3">
            <h4 className="font-semibold">B) Advocacy-Inquiry Focado na Equipe</h4>
            <Label>Observação (Advocacy):</Label>
            <Textarea placeholder={`"Eu notei que a equipe rapidamente definiu papéis no início..."\n"Percebi um momento de silêncio quando o monitor apitou. O que estava acontecendo com a equipe naquele instante?"`} rows={3}/>
            <Label>Pergunta (Inquiry):</Label>
            <Textarea placeholder={`"Como essa divisão de tarefas impactou o fluxo de trabalho?"\n"Qual era o entendimento da equipe sobre o plano naquele momento?"`} rows={2}/>
          </div>

          <div className="p-4 border rounded-lg space-y-3">
            <h4 className="font-semibold">C) Perguntas Circulares</h4>
            <p className="text-sm text-muted-foreground">Explore as perspectivas dos membros da equipe sobre as ações e pensamentos uns dos outros.</p>
            {circularQuestions.map((question, index) => (
              <div key={index} className="flex items-center gap-2">
                <Input
                  value={question}
                  onChange={(e) => updateCircularQuestion(index, e.target.value)}
                  placeholder={`Ex: [Nome A], do seu ponto de vista, o que [Nome B] estava priorizando naquele momento?`}
                />
                {circularQuestions.length > 1 && (
                  <Button variant="ghost" size="icon" className="text-destructive" onClick={() => removeCircularQuestion(index)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
            <Button variant="outline" size="sm" onClick={addCircularQuestion}>
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Pergunta Circular
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Users className="h-5 w-5 text-primary" />Fase 4: Resumo</CardTitle>
        </CardHeader>
        <CardContent>
          <Label>Pontos-Chave de Performance da Equipe</Label>
          <Textarea
            placeholder="Liste 2-3 takeaways principais focados em trabalho em equipe, comunicação e liderança que emergiram da análise."
            rows={4}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Send className="h-5 w-5 text-primary" />Fase 5: Transferência para a Prática</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Label>Perguntas de Aplicação</Label>
          <div className="space-y-2">
            <div className="flex items-center space-x-2"><Checkbox id="tg-t1" defaultChecked /><Label htmlFor="tg-t1">"Como essa experiência vai mudar a forma como vocês se comunicam na próxima emergência real?"</Label></div>
            <div className="flex items-center space-x-2"><Checkbox id="tg-t2" defaultChecked /><Label htmlFor="tg-t2">"Qual é a única coisa que vocês, como equipe, se comprometerão a fazer diferente da próxima vez?"</Label></div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Star className="h-5 w-5 text-primary" />Fase 6: Feedback sobre o Debriefing</CardTitle>
        </CardHeader>
        <CardContent>
          <Label>Pergunta para Feedback</Label>
          <p className="text-sm p-2 bg-muted rounded-md">"Para me ajudar a melhorar, que feedback vocês têm para mim como facilitador deste debriefing?"</p>
        </CardContent>
      </Card>

      <div className="flex justify-end space-x-2">
        <Button variant="outline">Salvar Rascunho</Button>
        <Button>Gerar Script Completo</Button>
      </div>
    </div>
  );
};

export default TeamGainsForm;
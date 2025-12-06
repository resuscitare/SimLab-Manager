"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { ScenarioFormData } from "@/types/prisma";
import { Wind, Search, Brain } from "lucide-react";

interface ThreeDFormProps {
  scenarioData: ScenarioFormData;
}

const ThreeDForm = ({ scenarioData }: ThreeDFormProps) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Modelo 3D - Debriefing Emocional e Reflexivo</CardTitle>
          <CardDescription>Estruture seu debriefing para cenários emocionalmente intensos, focando em descompressão, descoberta e aprofundamento.</CardDescription>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Wind className="h-5 w-5 text-primary" />Fase 1: Defusing (Descompressão Emocional)</CardTitle>
          <CardDescription>Permita que os participantes processem as emoções iniciais antes de analisar a performance.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Label>Perguntas para Iniciar a Descompressão</Label>
          <div className="space-y-2">
            <div className="flex items-center space-x-2"><Checkbox id="3d-d1" defaultChecked /><Label htmlFor="3d-d1">"Como vocês estão se sentindo depois dessa simulação?"</Label></div>
            <div className="flex items-center space-x-2"><Checkbox id="3d-d2" /><Label htmlFor="3d-d2">"Qual foi a parte mais desafiadora ou estressante para você?"</Label></div>
            <div className="flex items-center space-x-2"><Checkbox id="3d-d3" /><Label htmlFor="3d-d3">"Houve algum momento em que você se sentiu sobrecarregado?"</Label></div>
          </div>
          <Label>Notas para o Facilitador</Label>
          <Textarea
            placeholder="Dica: Valide todos os sentimentos expressos. Use frases como 'Isso parece ter sido muito intenso' ou 'É compreensível que você tenha se sentido assim'. Não tente resolver problemas nesta fase, apenas ouça e valide."
            rows={3}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Search className="h-5 w-5 text-primary" />Fase 2: Discovering (Descoberta de Modelos Mentais)</CardTitle>
          <CardDescription>Explore o raciocínio por trás das ações para entender os modelos mentais dos participantes.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="p-4 border rounded-lg space-y-3">
            <h4 className="font-semibold">Uso de Advocacy-Inquiry</h4>
            <p className="text-sm text-muted-foreground">Combine sua observação (advocacy) com uma pergunta genuína (inquiry) para promover a reflexão.</p>
            <Label>Observação (Advocacy):</Label>
            <Textarea placeholder={`"Eu notei que a decisão de administrar a medicação X foi tomada rapidamente..."\n"Percebi que houve uma pausa antes de iniciar as compressões..."`} rows={3}/>
            <Label>Pergunta (Inquiry):</Label>
            <Textarea placeholder={`"...o que estava passando pela sua cabeça naquele momento?"\n"...qual era a sua principal preocupação ali?"`} rows={2}/>
          </div>
          <div className="p-4 border rounded-lg space-y-3">
            <h4 className="font-semibold">Perguntas Adicionais de Descoberta</h4>
            <div className="space-y-2">
                <div className="flex items-center space-x-2"><Checkbox id="3d-disc1" /><Label htmlFor="3d-disc1">"Qual era o seu entendimento da situação naquele ponto?"</Label></div>
                <div className="flex items-center space-x-2"><Checkbox id="3d-disc2" /><Label htmlFor="3d-disc2">"O que você estava tentando alcançar com aquela ação?"</Label></div>
                <div className="flex items-center space-x-2"><Checkbox id="3d-disc3" /><Label htmlFor="3d-disc3">"Se você pudesse voltar àquele momento, o que você estaria pensando?"</Label></div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Brain className="h-5 w-5 text-primary" />Fase 3: Deepening (Aprofundamento e Aplicação)</CardTitle>
          <CardDescription>Conecte os aprendizados da simulação com a prática clínica real e futura.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Label>Perguntas para Aprofundamento</Label>
          <div className="space-y-2">
            <div className="flex items-center space-x-2"><Checkbox id="3d-deep1" defaultChecked /><Label htmlFor="3d-deep1">"Como essa experiência pode influenciar sua abordagem em uma situação semelhante no futuro?"</Label></div>
            <div className="flex items-center space-x-2"><Checkbox id="3d-deep2" defaultChecked /><Label htmlFor="3d-deep2">"Qual é o principal aprendizado que você levará desta simulação para sua prática diária?"</Label></div>
            <div className="flex items-center space-x-2"><Checkbox id="3d-deep3" /><Label htmlFor="3d-deep3">"Que princípios ou regras podemos extrair desta experiência?"</Label></div>
          </div>
          <Label>Pontos-Chave para Resumir</Label>
          <Textarea
            placeholder="Liste 2-3 takeaways principais que conectam a performance na simulação com a melhoria do cuidado ao paciente no mundo real."
            rows={4}
          />
        </CardContent>
      </Card>

      <div className="flex justify-end space-x-2">
        <Button variant="outline">Salvar Rascunho</Button>
        <Button>Gerar Script Completo</Button>
      </div>
    </div>
  );
};

export default ThreeDForm;
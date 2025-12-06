"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ScenarioFormData } from "@/types/prisma";
import { MessagesSquare, Lightbulb, CheckCircle } from "lucide-react";

interface GasFormProps {
  scenarioData: ScenarioFormData;
}

const GasForm = ({ scenarioData }: GasFormProps) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Modelo GAS - Debriefing Rápido e Objetivo</CardTitle>
          <CardDescription>Estruture um debriefing eficiente e direto, ideal para cursos de suporte de vida (BLS, ACLS) e sessões com tempo limitado.</CardDescription>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><MessagesSquare className="h-5 w-5 text-primary" />Fase 1: Gather (Reunir)</CardTitle>
          <CardDescription>Obtenha um resumo rápido dos eventos do ponto de vista da equipe.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Label>Pergunta de Abertura</Label>
          <Textarea
            defaultValue="Ok, pessoal, bom trabalho. Quem pode me dar um resumo rápido do que aconteceu do início ao fim?"
            rows={2}
          />
          <Label>Notas para o Facilitador</Label>
          <Textarea
            placeholder="Dica: Mantenha esta fase breve. O objetivo é apenas estabelecer um entendimento comum dos fatos, não analisar."
            rows={2}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Lightbulb className="h-5 w-5 text-primary" />Fase 2: Analyze (Analisar)</CardTitle>
          <CardDescription>Discuta o que foi bem feito e o que pode ser melhorado (Plus/Delta).</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="p-4 border rounded-lg space-y-3">
            <h4 className="font-semibold">Plus (Pontos Positivos)</h4>
            <Label>Pergunta Sugerida: "O que foi bem feito que devemos continuar fazendo?"</Label>
            <Textarea
              placeholder="Ex: A comunicação foi clara e em circuito fechado.&#x0a;O primeiro choque foi aplicado em menos de 2 minutos."
              rows={4}
            />
          </div>

          <div className="p-4 border rounded-lg space-y-3">
            <h4 className="font-semibold">Delta (Pontos a Melhorar)</h4>
            <Label>Pergunta Sugerida: "Qual é a única coisa que poderíamos mudar para melhorar o resultado ou a performance da equipe?"</Label>
            <Textarea
              placeholder="Ex: Melhorar a qualidade das compressões torácicas.&#x0a;Designar um líder de equipe mais claramente no início."
              rows={4}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><CheckCircle className="h-5 w-5 text-primary" />Fase 3: Summarize (Resumir)</CardTitle>
          <CardDescription>Reforce 1-2 pontos de aprendizado mais importantes que serão levados para a prática.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Label>Principais Takeaways</Label>
          <Textarea
            placeholder="Ex: 1. A importância de compressões de alta qualidade e minimizar interrupções.&#x0a;2. A comunicação clara do líder é crucial para a organização da equipe."
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

export default GasForm;
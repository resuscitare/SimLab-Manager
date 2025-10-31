"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { ScenarioFormData } from "@/types/prisma";
import { 
  ClipboardList, 
  Users, 
  Brain, 
  MessageSquare, 
  Target, 
  AlertTriangle, 
  Heart, 
  Activity,
  CheckCircle,
  Clock,
  Stethoscope,
  Zap,
  Shield,
  TrendingUp
} from "lucide-react";

interface ChecklistClinicoFormProps {
  scenarioData: ScenarioFormData;
}

const ChecklistClinicoForm = ({ scenarioData }: ChecklistClinicoFormProps) => {
  const [fasesCompletadas, setFasesCompletadas] = useState<Record<string, boolean>>({});

  const toggleFase = (fase: string) => {
    setFasesCompletadas(prev => ({
      ...prev,
      [fase]: !prev[fase]
    }));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Modelo Checklist Clínico - Debriefing Estruturado</CardTitle>
          <CardDescription>
            Template baseado no Checklist Genérico de Simulação Clínica Realística. 
            Estrutura sistemática focada em competências técnicas, não-técnicas, comunicação e segurança do paciente.
          </CardDescription>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ClipboardList className="h-5 w-5 text-primary" />
            Fase 1: Preparação e Ambiente (2-3 minutos)
          </CardTitle>
          <CardDescription>Estabeleça o ambiente seguro e prepare o grupo para o debriefing</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="prep-ambiente" 
              checked={fasesCompletadas['prep-ambiente'] || false}
              onCheckedChange={() => toggleFase('prep-ambiente')}
            />
            <Label htmlFor="prep-ambiente">Ambiente preparado (privacidade, conforto, tempo adequado)</Label>
          </div>

          <Label>Script de Abertura</Label>
          <Textarea
            defaultValue={`Bem-vindos ao debriefing estruturado. Esta é uma oportunidade segura para refletirmos sobre nossa prática clínica. Vamos seguir uma estrutura sistemática baseada no checklist de simulação clínica para garantir que abordemos todos os aspectos importantes da nossa performance. Lembrem-se: estamos aqui para aprender, não para julgar.`}
            rows={3}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="flex items-center gap-2"><Heart className="h-4 w-4" />Estado Emocional</Label>
              <Textarea
                placeholder="Como vocês estão se sentindo após a simulação? Há alguma emoção ou preocupação que gostariam de compartilhar antes de começarmos?"
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-2"><Target className="h-4 w-4" />Objetivos do Debriefing</Label>
              <Textarea
                defaultValue={`• Revisar competências técnicas e não-técnicas
• Identificar pontos fortes e oportunidades de melhoria
• Conectar aprendizado com prática clínica real
• Estabelecer plano de ação para implementação`}
                rows={4}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            Fase 2: Reconstrução dos Fatos (5-7 minutos)
          </CardTitle>
          <CardDescription>Estabeleça um entendimento comum da sequência de eventos</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="reconstrucao-fatos" 
              checked={fasesCompletadas['reconstrucao-fatos'] || false}
              onCheckedChange={() => toggleFase('reconstrucao-fatos')}
            />
            <Label htmlFor="reconstrucao-fatos">Sequência cronológica estabelecida</Label>
          </div>

          <Label>Perguntas Orientadoras</Label>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox id="q1" defaultChecked />
              <Label htmlFor="q1">Quem pode resumir a apresentação inicial do caso?</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="q2" defaultChecked />
              <Label htmlFor="q2">Quais foram os sinais e sintomas apresentados pelo paciente?</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="q3" defaultChecked />
              <Label htmlFor="q3">Que intervenções foram realizadas e em que ordem?</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="q4" defaultChecked />
              <Label htmlFor="q4">Como evoluiu a condição do paciente ao longo da simulação?</Label>
            </div>
          </div>

          <Label>Linha do Tempo Esperada vs. Observada</Label>
          <Textarea
            placeholder="Mapeie a sequência esperada do caso clínico e compare com o que efetivamente ocorreu durante a simulação."
            rows={4}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Stethoscope className="h-5 w-5 text-primary" />
            Fase 3: Análise de Competências Técnicas (10-12 minutos)
          </CardTitle>
          <CardDescription>Avalie o conhecimento clínico e habilidades técnicas demonstradas</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="competencias-tecnicas" 
              checked={fasesCompletadas['competencias-tecnicas'] || false}
              onCheckedChange={() => toggleFase('competencias-tecnicas')}
            />
            <Label htmlFor="competencias-tecnicas">Análise de competências técnicas realizada</Label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-semibold flex items-center gap-2">
                <Brain className="h-4 w-4" />
                Conhecimento Clínico
              </h4>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox id="diag-correto" />
                  <Label htmlFor="diag-correto">Diagnóstico/problema identificado corretamente</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="priorizacao" />
                  <Label htmlFor="priorizacao">Intervenções priorizadas adequadamente (ABCDE)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="protocolos" />
                  <Label htmlFor="protocolos">Protocolos seguidos corretamente</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="medicacao" />
                  <Label htmlFor="medicacao">Medicações dosadas e administradas corretamente</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="sinais-vitais" />
                  <Label htmlFor="sinais-vitais">Sinais vitais interpretados adequadamente</Label>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold flex items-center gap-2">
                <Zap className="h-4 w-4" />
                Habilidades Técnicas
              </h4>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox id="procedimentos" />
                  <Label htmlFor="procedimentos">Procedimentos realizados com técnica adequada</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="equipamentos" />
                  <Label htmlFor="equipamentos">Equipamentos utilizados corretamente</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="seguranca" />
                  <Label htmlFor="seguranca">Medidas de segurança observadas</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="documentacao" />
                  <Label htmlFor="documentacao">Documentação realizada adequadamente</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="monitoramento" />
                  <Label htmlFor="monitoramento">Monitoramento contínuo do paciente</Label>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Observações sobre Competências Técnicas</Label>
            <Textarea
              placeholder="Registre observações específicas sobre o desempenho técnico, pontos positivos e oportunidades de melhoria."
              rows={4}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Fase 4: Análise de Competências Não-Técnicas (8-10 minutos)
          </CardTitle>
          <CardDescription>Avalie habilidades comportamentais e trabalho em equipe</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="competencias-nao-tecnicas" 
              checked={fasesCompletadas['competencias-nao-tecnicas'] || false}
              onCheckedChange={() => toggleFase('competencias-nao-tecnicas')}
            />
            <Label htmlFor="competencias-nao-tecnicas">Análise de competências não-técnicas realizada</Label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-semibold flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                Comunicação
              </h4>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox id="comunicacao-clara" />
                  <Label htmlFor="comunicacao-clara">Comunicação clara e objetiva</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="circuito-fechado" />
                  <Label htmlFor="circuito-fechado">Comunicação em circuito fechado</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="sbar" />
                  <Label htmlFor="sbar">Uso adequado de ferramentas estruturadas (SBAR)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="assertividade" />
                  <Label htmlFor="assertividade">Assertividade quando necessário</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="comunicacao-paciente" />
                  <Label htmlFor="comunicacao-paciente">Comunicação adequada com paciente</Label>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold flex items-center gap-2">
                <Users className="h-4 w-4" />
                Trabalho em Equipe
              </h4>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox id="lideranca" />
                  <Label htmlFor="lideranca">Liderança identificada e efetiva</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="delegacao" />
                  <Label htmlFor="delegacao">Delegação adequada de tarefas</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="suporte-mutuo" />
                  <Label htmlFor="suporte-mutuo">Suporte mútuo entre membros</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="conscientizacao" />
                  <Label htmlFor="conscientizacao">Conscientização situacional mantida</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="gestao-recursos" />
                  <Label htmlFor="gestao-recursos">Gestão adequada de recursos</Label>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Segurança do Paciente
            </h4>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox id="verificacao-identidade" />
                <Label htmlFor="verificacao-identidade">Verificação de identidade do paciente</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="time-out" />
                <Label htmlFor="time-out">Time-out cirúrgico/segurança realizado</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="checagem-dupla" />
                <Label htmlFor="checagem-dupla">Checagem dupla de medicações de alto risco</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="ambiente-seguro" />
                <Label htmlFor="ambiente-seguro">Ambiente seguro mantido</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="prevencao-erros" />
                <Label htmlFor="prevencao-erros">Medidas de prevenção de erros implementadas</Label>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Observações sobre Competências Não-Técnicas</Label>
            <Textarea
              placeholder="Registre observações sobre comunicação, trabalho em equipe, liderança e aspectos de segurança do paciente."
              rows={4}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Fase 5: Síntese e Plano de Ação (5-7 minutos)
          </CardTitle>
          <CardDescription>Consolide aprendizados e estabeleça compromissos para melhoria</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="sintese-plano" 
              checked={fasesCompletadas['sintese-plano'] || false}
              onCheckedChange={() => toggleFase('sintese-plano')}
            />
            <Label htmlFor="sintese-plano">Síntese e plano de ação estabelecidos</Label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Pontos Fortes Identificados</Label>
              <Textarea
                placeholder="Liste 2-3 aspectos que funcionaram bem e devem ser mantidos."
                rows={4}
              />
            </div>
            <div className="space-y-2">
              <Label>Oportunidades de Melhoria</Label>
              <Textarea
                placeholder="Liste 2-3 aspectos que podem ser melhorados na prática clínica."
                rows={4}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Plano de Ação Específico</Label>
            <Textarea
              placeholder={`• Ação 1: [O que será feito] [Por quem] [Quando] [Como será avaliado]
• Ação 2: [O que será feito] [Por quem] [Quando] [Como será avaliado]
• Ação 3: [O que será feito] [Por quem] [Quando] [Como será avaliado]`}
              rows={6}
            />
          </div>

          <div className="space-y-2">
            <Label>Frase de Encerramento</Label>
            <Textarea
              defaultValue={`Obrigado pela participação ativa neste debriefing. Lembrem-se: a simulação é uma ferramenta poderosa para melhorar nossa prática clínica e, consequentemente, os cuidados que oferecemos aos nossos pacientes. Vamos implementar as ações definidas e continuar aprendendo juntos.`}
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-primary" />
            Fase 6: Avaliação do Debriefing (2-3 minutos)
          </CardTitle>
          <CardDescription>Feedback sobre o processo de debriefing para melhoria contínua</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="avaliacao-debriefing" 
              checked={fasesCompletadas['avaliacao-debriefing'] || false}
              onCheckedChange={() => toggleFase('avaliacao-debriefing')}
            />
            <Label htmlFor="avaliacao-debriefing">Avaliação do debriefing realizada</Label>
          </div>

          <Label>Pergunta de Feedback</Label>
          <Textarea
            defaultValue="Para ajudar-me a melhorar como facilitador, que feedback vocês têm sobre este debriefing? O que funcionou bem e o que poderia ser diferente na próxima vez?"
            rows={3}
          />

          <div className="p-4 bg-blue-50 rounded-lg">
            <h4 className="font-semibold text-blue-800 mb-2">Checklist de Qualidade do Debriefing</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
              <div className="flex items-center space-x-2">
                <Checkbox id="qualidade-1" />
                <Label htmlFor="qualidade-1">Ambiente seguro mantido</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="qualidade-2" />
                <Label htmlFor="qualidade-2">Estrutura clara seguida</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="qualidade-3" />
                <Label htmlFor="qualidade-3">Todos participaram ativamente</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="qualidade-4" />
                <Label htmlFor="qualidade-4">Tempo adequado para reflexão</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="qualidade-5" />
                <Label htmlFor="qualidade-5">Aprendizados identificados</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="qualidade-6" />
                <Label htmlFor="qualidade-6">Plano de ação estabelecido</Label>
              </div>
            </div>
          </div>
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

export default ChecklistClinicoForm;
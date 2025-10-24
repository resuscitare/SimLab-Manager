"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sparkles, Copy, CheckCircle, Clock } from "lucide-react";
import { useState } from "react";

const AssistenteIA = () => {
  const [prompt, setPrompt] = useState("");
  const [sugestao, setSugestao] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [copiado, setCopiado] = useState(false);

  const camposSugestao = [
    "Objetivos de Aprendizagem Técnicos",
    "Objetivos de Aprendizagem Não Técnicos",
    "Histórico Médico do Paciente",
    "Pontos Norteadores para Debriefing",
    "Sequência de Frames do Cenário",
    "Materiais Necessários",
    "Script do Paciente Padronizado"
  ];

  const gerarSugestao = async () => {
    if (!prompt.trim()) return;
    
    setCarregando(true);
    setSugestao("");
    
    // Simulação de chamada à API de IA
    setTimeout(() => {
      setSugestao(`Baseado no seu prompt "${prompt}", aqui está uma sugestão para objetivos de aprendizagem técnicos:

1. Realizar avaliação primária ABCDE conforme protocolo ATLS
2. Identificar e tratar causas reversíveis de parada cardiorrespiratória
3. Executar algoritmo de suporte avançado de vida em cardiologia
4. Realizar manejo de via aérea avançada com dispositivo supraglótico
5. Administrar medicamentos de emergência conforme protocolo
6. Interpretar ritmos cardíacos no monitor multiparâmetros
7. Coordenar trabalho em equipe durante situação de emergência

Estes objetivos são mensuráveis e alinhados com as diretrizes atuais de reanimação cardiopulmonar.`);
      setCarregando(false);
    }, 2000);
  };

  const copiarSugestao = async () => {
    await navigator.clipboard.writeText(sugestao);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Assistente de IA</h1>
          <p className="text-gray-600">Obtenha sugestões inteligentes para seus cenários</p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <Clock className="w-4 h-4" />
          <span>Créditos disponíveis: 15</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Solicitar Sugestão</CardTitle>
            <CardDescription>Descreva o que você precisa para o cenário</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="campo">Campo para Sugestão</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o campo" />
                </SelectTrigger>
                <SelectContent>
                  {camposSugestao.map((campo) => (
                    <SelectItem key={campo} value={campo}>{campo}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="contexto">Contexto do Cenário</Label>
              <Input 
                id="contexto" 
                placeholder="Ex: Cenário de parada cardiorrespiratória para residentes"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="prompt">Sua Solicitação</Label>
              <Textarea
                id="prompt"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Descreva o que você precisa. Ex: 'Preciso de objetivos de aprendizagem para um cenário de trauma com múltiplas vítimas'"
                rows={4}
              />
              <div className="text-xs text-gray-500">
                {prompt.length}/500 caracteres
              </div>
            </div>

            <Button 
              onClick={gerarSugestao} 
              disabled={carregando || !prompt.trim()}
              className="w-full"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              {carregando ? "Gerando sugestão..." : "Gerar Sugestão com IA"}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Sugestão da IA</CardTitle>
            <CardDescription>Resultado gerado pelo assistente inteligente</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {carregando ? (
              <div className="flex items-center justify-center py-8">
                <div className="text-center">
                  <Sparkles className="w-8 h-8 mx-auto mb-2 text-blue-600 animate-pulse" />
                  <p className="text-sm text-gray-500">Gerando sugestão...</p>
                </div>
              </div>
            ) : sugestao ? (
              <>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="prose prose-sm max-w-none">
                    {sugestao.split('\n').map((line, index) => (
                      <p key={index} className="mb-2">{line}</p>
                    ))}
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button onClick={copiarSugestao} variant="outline" className="flex-1">
                    {copiado ? (
                      <>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Copiado!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 mr-2" />
                        Copiar
                      </>
                    )}
                  </Button>
                  <Button variant="outline" className="flex-1">
                    Usar no Cenário
                  </Button>
                </div>
                <div className="flex justify-center space-x-4 pt-4 border-t">
                  <Button variant="ghost" size="sm">
                    👍 Útil
                  </Button>
                  <Button variant="ghost" size="sm">
                    👎 Não útil
                  </Button>
                </div>
              </>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Sparkles className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>Digite sua solicitação ao lado para gerar uma sugestão</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Histórico de Sugestões</CardTitle>
          <CardDescription>Suas solicitações recentes à IA</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              {
                data: "2024-01-15",
                campo: "Objetivos de Aprendizagem Técnicos",
                prompt: "Cenário de sepse pediátrica",
                util: true
              },
              {
                data: "2024-01-14",
                campo: "Histórico Médico do Paciente",
                prompt: "Paciente idoso com múltiplas comorbidades",
                util: true
              },
              {
                data: "2024-01-13",
                campo: "Pontos Norteadores para Debriefing",
                prompt: "Debriefing para cenário de comunicação difícil",
                util: null
              }
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex-1">
                  <div className="font-medium">{item.campo}</div>
                  <div className="text-sm text-gray-500">{item.prompt}</div>
                  <div className="text-xs text-gray-400">{item.data}</div>
                </div>
                <div>
                  {item.util === true && <span className="text-green-600">👍</span>}
                  {item.util === false && <span className="text-red-600">👎</span>}
                  {item.util === null && <span className="text-gray-400">-</span>}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AssistenteIA;
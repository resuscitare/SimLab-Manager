"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Plus, X } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const NovoCenario = () => {
  const navigate = useNavigate();
  const [palavrasChave, setPalavrasChave] = useState<string[]>([]);
  const [novaPalavra, setNovaPalavra] = useState("");

  const adicionarPalavraChave = () => {
    if (novaPalavra.trim() && !palavrasChave.includes(novaPalavra.trim())) {
      setPalavrasChave([...palavrasChave, novaPalavra.trim()]);
      setNovaPalavra("");
    }
  };

  const removerPalavraChave = (palavra: string) => {
    setPalavrasChave(palavrasChave.filter(p => p !== palavra));
  };

  const publicosAlvo = [
    "Residentes de Medicina",
    "Enfermeiros",
    "Médicos Emergencistas",
    "Estudantes de Medicina",
    "Equipe Multiprofissional",
    "Pediatras",
    "Cardiologistas"
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Novo Cenário</h1>
          <p className="text-gray-600">Crie um novo cenário de simulação realística</p>
        </div>
        <Button variant="outline" onClick={() => navigate("/cenarios")}>
          Voltar
        </Button>
      </div>

      <Tabs defaultValue="identificacao" className="space-y-6">
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="identificacao">Identificação</TabsTrigger>
          <TabsTrigger value="objetivos">Objetivos</TabsTrigger>
          <TabsTrigger value="paciente">Paciente</TabsTrigger>
          <TabsTrigger value="frames">Frames</TabsTrigger>
          <TabsTrigger value="materiais">Materiais</TabsTrigger>
          <TabsTrigger value="debriefing">Debriefing</TabsTrigger>
          <TabsTrigger value="revisao">Revisão</TabsTrigger>
        </TabsList>

        <TabsContent value="identificacao">
          <Card>
            <CardHeader>
              <CardTitle>Identificação do Cenário</CardTitle>
              <CardDescription>Informações básicas do cenário</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome do Cenário *</Label>
                  <Input id="nome" placeholder="Ex: Parada Cardiorrespiratória em AESP" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="publico">Público-Alvo *</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o público-alvo" />
                    </SelectTrigger>
                    <SelectContent>
                      {publicosAlvo.map((publico) => (
                        <SelectItem key={publico} value={publico}>{publico}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tempo">Tempo de Execução (minutos) *</Label>
                  <Input id="tempo" type="number" placeholder="Ex: 30" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tipo">Tipo de Simulação *</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="simulador">Simulador</SelectItem>
                      <SelectItem value="paciente">Paciente Padronizado</SelectItem>
                      <SelectItem value="ambos">Ambos</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="palavras-chave">Palavras-Chave</Label>
                <div className="flex gap-2">
                  <Input
                    value={novaPalavra}
                    onChange={(e) => setNovaPalavra(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), adicionarPalavraChave())}
                    placeholder="Digite uma palavra-chave"
                  />
                  <Button type="button" onClick={adicionarPalavraChave}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {palavrasChave.map((palavra) => (
                    <Badge key={palavra} variant="secondary" className="flex items-center gap-1">
                      {palavra}
                      <X className="w-3 h-3 cursor-pointer" onClick={() => removerPalavraChave(palavra)} />
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="descricao">Descrição do Cenário</Label>
                <Textarea 
                  id="descricao" 
                  placeholder="Descreva brevemente o cenário..."
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="objetivos">
          <Card>
            <CardHeader>
              <CardTitle>Objetivos de Aprendizagem</CardTitle>
              <CardDescription>Defina os objetivos técnicos e não técnicos</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label>Objetivos Técnicos</Label>
                  <Button variant="outline" size="sm">
                    <Sparkles className="w-4 h-4 mr-2" />
                    Sugerir com IA
                  </Button>
                </div>
                <Textarea 
                  placeholder="Ex: Realizar RCP de acordo com diretrizes AHA, Identificar ritmo de parada cardíaca..."
                  rows={4}
                />
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label>Objetivos Não Técnicos</Label>
                  <Button variant="outline" size="sm">
                    <Sparkles className="w-4 h-4 mr-2" />
                    Sugerir com IA
                  </Button>
                </div>
                <Textarea 
                  placeholder="Ex: Trabalho em equipe, Comunicação efetiva, Liderança..."
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="paciente">
          <Card>
            <CardHeader>
              <CardTitle>Perfil do Paciente</CardTitle>
              <CardDescription>Informações sobre o paciente simulado</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="nome-paciente">Nome do Paciente</Label>
                  <Input id="nome-paciente" placeholder="Ex: João Silva" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="idade">Idade</Label>
                  <Input id="idade" type="number" placeholder="Ex: 45" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sexo">Sexo</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="M">Masculino</SelectItem>
                      <SelectItem value="F">Feminino</SelectItem>
                      <SelectItem value="O">Outro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label>Histórico Médico</Label>
                  <Button variant="outline" size="sm">
                    <Sparkles className="w-4 h-4 mr-2" />
                    Sugerir com IA
                  </Button>
                </div>
                <Textarea 
                  placeholder="Ex: HAS há 10 anos, DM tipo 2, tabagista..."
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Outras abas seriam implementadas de forma similar */}

        <div className="flex justify-between">
          <Button variant="outline">Salvar Rascunho</Button>
          <div className="flex space-x-2">
            <Button variant="outline">Anterior</Button>
            <Button>Próximo</Button>
          </div>
        </div>
      </Tabs>
    </div>
  );
};

export default NovoCenario;
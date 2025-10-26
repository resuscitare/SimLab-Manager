"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Sparkles, Plus, X, Save, Eye, AlertCircle, CheckCircle, Package, MessageSquare } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import FramesTab from "@/components/cenario/FramesTab";

// Fix: Define Frame type with required properties to match FramesTab component
interface Frame {
  id: string;
  ordem: number;
  nomeEtapa: string;
  frameIdentifier: string;
  durationEstimateMin: number; // Changed from optional to required
  participantType: string; // Changed from optional to required
  isCompleto: boolean; // Changed from optional to required
  fc?: number;
  satO2?: number;
  paSistolica?: number;
  paDiastolica?: number;
  fr?: number;
  temp?: number;
  otherFindings?: string;
  operatorInstructions?: string;
  expectedParticipantActions?: string;
  loadingIA?: boolean;
}

const NovoCenario = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("identificacao");
  const [palavrasChave, setPalavrasChave] = useState<string[]>([]);
  const [novaPalavra, setNovaPalavra] = useState("");
  
  // Frames state - now matches the required properties
  const [frames, setFrames] = useState<Frame[]>([
    {
      id: "1",
      ordem: 1,
      nomeEtapa: "Estado Inicial",
      frameIdentifier: "1",
      durationEstimateMin: 5, // Now required
      participantType: "Simulador", // Now required
      isCompleto: false // Now required
    }
  ]);

  // Checklists state
  const [checklists, setChecklists] = useState({
    debriefing: null,
    materiais: null
  });

  // Estado do formulário
  const [formData, setFormData] = useState({
    nome: "",
    publicoAlvo: "",
    tempoExecucao: "",
    tipoSimulacao: "",
    descricao: "",
    objetivosTecnicos: "",
    objetivosNaoTecnicos: "",
    nomePaciente: "",
    idade: "",
    sexo: "",
    historicoMedico: "",
    comoInicia: "",
    localSimulacao: "",
    voluntarios: "",
    tempoDebriefing: "",
    falasDirecionadoras: "",
    metasSeguranca: "",
    dominiosDesempenho: "",
    protocolosEspecificos: "",
    exemplosFrases: ""
  });

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

  const validarAba = (aba: string) => {
    switch (aba) {
      case "identificacao":
        return !!(formData.nome && formData.publicoAlvo && formData.tempoExecucao && formData.tipoSimulacao);
      case "objetivos":
        return !!(formData.objetivosTecnicos && formData.objetivosNaoTecnicos);
      case "paciente":
        return !!(formData.nomePaciente && formData.idade && formData.sexo);
      case "frames":
        return frames.length >= 3 && frames.filter(f => f.isCompleto).length >= 3;
      case "materiais":
        return !!checklists.materiais;
      case "debriefing":
        return !!checklists.debriefing;
      default:
        return true;
    }
  };

  const getTabStatus = (aba: string) => {
    if (validarAba(aba)) {
      return "completo";
    } else if (aba === activeTab) {
      return "ativo";
    } else {
      return "incompleto";
    }
  };

  const salvarRascunho = () => {
    const cenarioData = {
      ...formData,
      frames,
      checklists,
      palavrasChave,
      status: "rascunho",
      dataCriacao: new Date().toISOString()
    };
    
    // Salvar no localStorage (mock)
    localStorage.setItem("cenario_rascunho", JSON.stringify(cenarioData));
    console.log("Rascunho salvo:", cenarioData);
    
    // Mostrar feedback
    alert("Rascunho salvo com sucesso!");
  };

  const publicarCenario = () => {
    // Validar se todas as abas estão completas
    const abasObrigatorias = ["identificacao", "objetivos", "paciente", "frames", "materiais", "debriefing"];
    const abasIncompletas = abasObrigatorias.filter(aba => !validarAba(aba));
    
    if (abasIncompletas.length > 0) {
      alert(`Complete as seguintes abas antes de publicar: ${abasIncompletas.join(", ")}`);
      return;
    }
    
    const cenarioData = {
      ...formData,
      frames,
      checklists,
      palavrasChave,
      status: "publicado",
      dataCriacao: new Date().toISOString()
    };
    
    console.log("Publicando cenário:", cenarioData);
    navigate("/cenarios");
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Novo Cenário</h1>
          <p className="text-gray-600">Crie um novo cenário de simulação realística</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => navigate("/cenarios")}>
            Cancelar
          </Button>
          <Button variant="outline" onClick={salvarRascunho}>
            <Save className="w-4 h-4 mr-2" />
            Salvar Rascunho
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="identificacao" className="relative">
            <div className="flex items-center gap-2">
              {getTabStatus("identificacao") === "completo" && <CheckCircle className="h-3 w-3" />}
              {getTabStatus("identificacao") === "incompleto" && <AlertCircle className="h-3 w-3" />}
              Identificação
            </div>
          </TabsTrigger>
          <TabsTrigger value="objetivos" className="relative">
            <div className="flex items-center gap-2">
              {getTabStatus("objetivos") === "completo" && <CheckCircle className="h-3 w-3" />}
              {getTabStatus("objetivos") === "incompleto" && <AlertCircle className="h-3 w-3" />}
              Objetivos
            </div>
          </TabsTrigger>
          <TabsTrigger value="paciente" className="relative">
            <div className="flex items-center gap-2">
              {getTabStatus("paciente") === "completo" && <CheckCircle className="h-3 w-3" />}
              {getTabStatus("paciente") === "incompleto" && <AlertCircle className="h-3 w-3" />}
              Paciente
            </div>
          </TabsTrigger>
          <TabsTrigger value="frames" className="relative">
            <div className="flex items-center gap-2">
              {getTabStatus("frames") === "completo" && <CheckCircle className="h-3 w-3" />}
              {getTabStatus("frames") === "incompleto" && <AlertCircle className="h-3 w-3" />}
              Frames
            </div>
          </TabsTrigger>
          <TabsTrigger value="materiais" className="relative">
            <div className="flex items-center gap-2">
              {getTabStatus("materiais") === "completo" && <CheckCircle className="h-3 w-3" />}
              {getTabStatus("materiais") === "incompleto" && <AlertCircle className="h-3 w-3" />}
              Materiais
            </div>
          </TabsTrigger>
          <TabsTrigger value="debriefing" className="relative">
            <div className="flex items-center gap-2">
              {getTabStatus("debriefing") === "completo" && <CheckCircle className="h-3 w-3" />}
              {getTabStatus("debriefing") === "incompleto" && <AlertCircle className="h-3 w-3" />}
              Debriefing
            </div>
          </TabsTrigger>
          <TabsTrigger value="revisao">
            <div className="flex items-center gap-2">
              <Eye className="h-3 w-3" />
              Revisão
            </div>
          </TabsTrigger>
        </TabsList>

        {/* Aba Identificação */}
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
                  <Input 
                    id="nome" 
                    placeholder="Ex: Parada Cardiorrespiratória em AESP" 
                    value={formData.nome}
                    onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="publico">Público-Alvo *</Label>
                  <Select value={formData.publicoAlvo} onValueChange={(value) => setFormData(prev => ({ ...prev, publicoAlvo: value }))}>
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
                  <Input 
                    id="tempo" 
                    type="number" 
                    placeholder="Ex: 30" 
                    value={formData.tempoExecucao}
                    onChange={(e) => setFormData(prev => ({ ...prev, tempoExecucao: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tipo">Tipo de Simulação *</Label>
                  <Select value={formData.tipoSimulacao} onValueChange={(value) => setFormData(prev => ({ ...prev, tipoSimulacao: value }))}>
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
                  value={formData.descricao}
                  onChange={(e) => setFormData(prev => ({ ...prev, descricao: e.target.value }))}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Aba Objetivos */}
        <TabsContent value="objetivos">
          <Card>
            <CardHeader>
              <CardTitle>Objetivos de Aprendizagem</CardTitle>
              <CardDescription>Defina os objetivos técnicos e não técnicos</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label>Objetivos Técnicos *</Label>
                  <Button variant="outline" size="sm">
                    <Sparkles className="w-4 h-4 mr-2" />
                    Sugerir com IA
                  </Button>
                </div>
                <Textarea 
                  placeholder="Ex: Realizar RCP de acordo com diretrizes AHA, Identificar ritmo de parada cardíaca..."
                  rows={4}
                  value={formData.objetivosTecnicos}
                  onChange={(e) => setFormData(prev => ({ ...prev, objetivosTecnicos: e.target.value }))}
                />
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label>Objetivos Não Técnicos *</Label>
                  <Button variant="outline" size="sm">
                    <Sparkles className="w-4 h-4 mr-2" />
                    Sugerir com IA
                  </Button>
                </div>
                <Textarea 
                  placeholder="Ex: Trabalho em equipe, Comunicação efetiva, Liderança..."
                  rows={4}
                  value={formData.objetivosNaoTecnicos}
                  onChange={(e) => setFormData(prev => ({ ...prev, objetivosNaoTecnicos: e.target.value }))}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Aba Paciente */}
        <TabsContent value="paciente">
          <Card>
            <CardHeader>
              <CardTitle>Perfil do Paciente</CardTitle>
              <CardDescription>Informações sobre o paciente simulado</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="nome-paciente">Nome do Paciente *</Label>
                  <Input 
                    id="nome-paciente" 
                    placeholder="Ex: João Silva" 
                    value={formData.nomePaciente}
                    onChange={(e) => setFormData(prev => ({ ...prev, nomePaciente: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="idade">Idade *</Label>
                  <Input 
                    id="idade" 
                    type="number" 
                    placeholder="Ex: 45" 
                    value={formData.idade}
                    onChange={(e) => setFormData(prev => ({ ...prev, idade: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sexo">Sexo *</Label>
                  <Select value={formData.sexo} onValueChange={(value) => setFormData(prev => ({ ...prev, sexo: value }))}>
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
                  value={formData.historicoMedico}
                  onChange={(e) => setFormData(prev => ({ ...prev, historicoMedico: e.target.value }))}
                />
              </div>

              <Separator />

              <div className="space-y-4">
                <Label>Como o cenário inicia</Label>
                <Textarea 
                  placeholder="Descreva como o cenário começa, o cenário inicial, o que o participante encontra ao entrar..."
                  rows={3}
                  value={formData.comoInicia}
                  onChange={(e) => setFormData(prev => ({ ...prev, comoInicia: e.target.value }))}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Local da simulação</Label>
                  <Input 
                    placeholder="Ex: Sala A, Pronto-Socorro"
                    value={formData.localSimulacao}
                    onChange={(e) => setFormData(prev => ({ ...prev, localSimulacao: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Voluntários necessários</Label>
                  <Input 
                    placeholder="Ex: 2 voluntários"
                    value={formData.voluntarios}
                    onChange={(e) => setFormData(prev => ({ ...prev, voluntarios: e.target.value }))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Aba Frames */}
        <TabsContent value="frames">
          <FramesTab frames={frames} onFramesChange={(newFrames) => setFrames(newFrames)} />
        </TabsContent>

        {/* Aba Materiais */}
        <TabsContent value="materiais">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Checklist de Materiais
              </CardTitle>
              <CardDescription>
                Defina todos os materiais e equipamentos necessários para a simulação
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {!checklists.materiais ? (
                <div className="text-center py-8">
                  <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 mb-4">Nenhum checklist de materiais criado ainda</p>
                  <Button onClick={() => setChecklists(prev => ({ ...prev, materiais: { id: "1", titulo: "Checklist de Materiais", tipo: "materiais", secoes: [] } }))}>
                    <Plus className="w-4 h-4 mr-2" />
                    Criar Checklist de Materiais
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium">{checklists.materiais.titulo}</h3>
                    <Button variant="outline" size="sm">
                      Editar Checklist
                    </Button>
                  </div>
                  
                  <div className="text-center p-4 border-2 border-dashed border-gray-300 rounded-lg">
                    <p className="text-gray-500">Checklist de materiais associado ao cenário</p>
                    <p className="text-sm text-gray-400">Funcionalidade completa em desenvolvimento</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Aba Debriefing */}
        <TabsContent value="debriefing">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Checklist de Debriefing
              </CardTitle>
              <CardDescription>
                Defina os pontos norteadores para a discussão pós-simulação
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {!checklists.debriefing ? (
                <div className="text-center py-8">
                  <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 mb-4">Nenhum checklist de debriefing criado ainda</p>
                  <Button onClick={() => setChecklists(prev => ({ ...prev, debriefing: { id: "2", titulo: "Checklist de Debriefing", tipo: "debriefing", secoes: [] } }))}>
                    <Plus className="w-4 h-4 mr-2" />
                    Criar Checklist de Debriefing
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium">{checklists.debriefing.titulo}</h3>
                    <Button variant="outline" size="sm">
                      Editar Checklist
                    </Button>
                  </div>
                  
                  <div className="text-center p-4 border-2 border-dashed border-gray-300 rounded-lg">
                    <p className="text-gray-500">Checklist de debriefing associado ao cenário</p>
                    <p className="text-sm text-gray-400">Funcionalidade completa em desenvolvimento</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Aba Revisão */}
        <TabsContent value="revisao">
          <Card>
            <CardHeader>
              <CardTitle>Revisão Final</CardTitle>
              <CardDescription>Revise todas as informações antes de publicar</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Resumo das informações */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-medium">Informações Básicas</h4>
                    <div className="space-y-2 text-sm">
                      <p><span className="font-medium">Nome:</span> {formData.nome || "Não definido"}</p>
                      <p><span className="font-medium">Público:</span> {formData.publicoAlvo || "Não definido"}</p>
                      <p><span className="font-medium">Tempo:</span> {formData.tempoExecucao || "Não definido"} min</p>
                      <p><span className="font-medium">Tipo:</span> {formData.tipoSimulacao || "Não definido"}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="font-medium">Estatísticas</h4>
                    <div className="space-y-2 text-sm">
                      <p><span className="font-medium">Frames:</span> {frames.length} ({frames.filter(f => f.isCompleto).length} completos)</p>
                      <p><span className="font-medium">Palavras-chave:</span> {palavrasChave.length}</p>
                      <p><span className="font-medium">Checklists:</span> {(checklists.materiais ? 1 : 0) + (checklists.debriefing ? 1 : 0)} criados</p>
                    </div>
                  </div>
                </div>

                {/* Status das abas */}
                <div className="space-y-4">
                  <h4 className="font-medium">Status das Seções</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {["identificacao", "objetivos", "paciente", "frames", "materiais", "debriefing"].map((aba) => (
                      <div key={aba} className="flex items-center gap-2 p-3 border rounded-lg">
                        {validarAba(aba) ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : (
                          <AlertCircle className="h-4 w-4 text-yellow-600" />
                        )}
                        <span className="text-sm capitalize">{aba}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Ações */}
                <div className="flex justify-end space-x-2 pt-4 border-t">
                  <Button variant="outline" onClick={salvarRascunho}>
                    <Save className="w-4 h-4 mr-2" />
                    Salvar Rascunho
                  </Button>
                  <Button onClick={publicarCenario}>
                    Publicar Cenário
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Navegação entre abas */}
        <div className="flex justify-between">
          <Button 
            variant="outline" 
            onClick={() => {
              const tabs = ["identificacao", "objetivos", "paciente", "frames", "materiais", "debriefing", "revisao"];
              const currentIndex = tabs.indexOf(activeTab);
              if (currentIndex > 0) {
                setActiveTab(tabs[currentIndex - 1]);
              }
            }}
            disabled={activeTab === "identificacao"}
          >
            Anterior
          </Button>
          
          <Button 
            onClick={() => {
              const tabs = ["identificacao", "objetivos", "paciente", "frames", "materiais", "debriefing", "revisao"];
              const currentIndex = tabs.indexOf(activeTab);
              if (currentIndex < tabs.length - 1) {
                setActiveTab(tabs[currentIndex + 1]);
              }
            }}
            disabled={activeTab === "revisao"}
          >
            Próximo
          </Button>
        </div>
      </Tabs>
    </div>
  );
};

export default NovoCenario;
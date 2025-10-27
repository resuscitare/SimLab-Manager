"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Plus, X, ArrowLeft, Save, Eye, Heart, User, Activity, CheckCircle, AlertCircle } from "lucide-react";
import { useScenarioForm } from "@/hooks/useScenarioForm";
import FramesTab from "@/components/cenario/FramesTab";
import TabNavigation from "@/components/cenario/TabNavigation";
import { showSuccess, showError } from "@/utils/toast";

const NovoCenario = () => {
  const navigate = useNavigate();
  const [novoObjetivo, setNovoObjetivo] = useState("");
  const [novoEquipamento, setNovoEquipamento] = useState("");
  
  const {
    activeTab,
    frames,
    scenarioData,
    setActiveTab,
    handleScenarioDataChange,
    handleFramesChange,
    adicionarObjetivoAprendizagem,
    removerObjetivoAprendizagem,
    adicionarEquipamento,
    removerEquipamento,
    salvarCenario,
    validarAba,
    getTabsConfig
  } = useScenarioForm();

  const tabs = getTabsConfig();
  const currentIndex = tabs.findIndex(tab => tab.value === activeTab);
  const canGoPrevious = currentIndex > 0;
  const canGoNext = currentIndex < tabs.length - 1;

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  const handlePrevious = () => {
    if (canGoPrevious) {
      const previousTab = tabs[currentIndex - 1].value;
      setActiveTab(previousTab);
    }
  };

  const handleNext = () => {
    if (canGoNext) {
      const nextTab = tabs[currentIndex + 1].value;
      
      if (!validarAba(activeTab)) {
        showError("Complete a aba atual antes de avançar");
        return;
      }
      
      setActiveTab(nextTab);
    }
  };

  const handleSalvarRascunho = () => {
    salvarCenario();
    showSuccess("Rascunho salvo com sucesso!");
  };

  const handlePublicarCenario = () => {
    const todasValidas = tabs.every(tab => validarAba(tab.value));
    
    if (!todasValidas) {
      showError("Complete todas as seções obrigatórias antes de publicar");
      return;
    }
    
    salvarCenario();
    showSuccess("Cenário publicado com sucesso!");
    navigate("/cenarios");
  };

  const handleAdicionarObjetivo = () => {
    if (novoObjetivo.trim()) {
      adicionarObjetivoAprendizagem(novoObjetivo);
      setNovoObjetivo("");
    }
  };

  const handleAdicionarEquipamento = () => {
    if (novoEquipamento.trim()) {
      adicionarEquipamento(novoEquipamento);
      setNovoEquipamento("");
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Novo Cenário</h1>
          <p className="text-gray-600">Crie um cenário de simulação com estrutura completa</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => navigate("/cenarios")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
          <Button variant="outline" onClick={handleSalvarRascunho}>
            <Save className="w-4 h-4 mr-2" />
            Salvar Rascunho
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} className="space-y-6">
        <TabNavigation
          activeTab={activeTab}
          tabs={tabs}
          onTabChange={handleTabChange}
          onPrevious={handlePrevious}
          onNext={handleNext}
          canGoPrevious={canGoPrevious}
          canGoNext={canGoNext}
        />

        <TabsContent value="identificacao">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Identificação do Cenário
              </CardTitle>
              <CardDescription>Informações básicas do cenário</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Título do Cenário *</Label>
                  <Input 
                    id="title"
                    value={scenarioData.title}
                    onChange={(e) => handleScenarioDataChange('title', e.target.value)}
                    placeholder="Ex: Parada Cardiorrespiratória em AESP"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="participantType">Tipo Principal de Participante</Label>
                  <Select value={scenarioData.patientGender} onValueChange={(value) => handleScenarioDataChange('patientGender', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Simulador">Simulador</SelectItem>
                      <SelectItem value="Paciente Padronizado">Paciente Padronizado</SelectItem>
                      <SelectItem value="Ambos">Ambos</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="scenarioOutline">Descrição do Cenário</Label>
                <Textarea 
                  id="scenarioOutline"
                  value={scenarioData.scenarioOutline}
                  onChange={(e) => handleScenarioDataChange('scenarioOutline', e.target.value)}
                  placeholder="Descreva brevemente o cenário..."
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="learnerBrief">Informações para os Participantes</Label>
                <Textarea 
                  id="learnerBrief"
                  value={scenarioData.learnerBrief}
                  onChange={(e) => handleScenarioDataChange('learnerBrief', e.target.value)}
                  placeholder="O que será informado aos participantes..."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="objetivos">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Objetivos de Aprendizagem
              </CardTitle>
              <CardDescription>Defina os objetivos técnicos e não técnicos</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <Label>Objetivos de Aprendizagem</Label>
                <div className="flex gap-2">
                  <Input
                    value={novoObjetivo}
                    onChange={(e) => setNovoObjetivo(e.target.value)}
                    placeholder="Digite um objetivo de aprendizagem"
                    onKeyPress={(e) => e.key === 'Enter' && handleAdicionarObjetivo()}
                  />
                  <Button type="button" onClick={handleAdicionarObjetivo}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {scenarioData.learningObjectives.map((objetivo, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {objetivo}
                      <X className="w-3 h-3 cursor-pointer" onClick={() => removerObjetivoAprendizagem(objetivo)} />
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="paciente">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Perfil do Paciente
              </CardTitle>
              <CardDescription>Informações sobre o paciente simulado</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="patientName">Nome do Paciente</Label>
                  <Input 
                    id="patientName"
                    value={scenarioData.patientName}
                    onChange={(e) => handleScenarioDataChange('patientName', e.target.value)}
                    placeholder="Ex: João Silva"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="patientAge">Idade</Label>
                  <Input 
                    id="patientAge"
                    value={scenarioData.patientAge}
                    onChange={(e) => handleScenarioDataChange('patientAge', e.target.value)}
                    placeholder="Ex: 45"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="patientGender">Gênero</Label>
                  <Select value={scenarioData.patientGender} onValueChange={(value) => handleScenarioDataChange('patientGender', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Masculino">Masculino</SelectItem>
                      <SelectItem value="Feminino">Feminino</SelectItem>
                      <SelectItem value="Outro">Outro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="frames">
          <FramesTab 
            frames={frames} 
            onFramesChange={handleFramesChange} 
          />
        </TabsContent>

        <TabsContent value="materiais">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5" />
                Equipamentos e Materiais
              </CardTitle>
              <CardDescription>Lista de equipamentos necessários</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <Label>Equipamentos Necessários</Label>
                <div className="flex gap-2">
                  <Input
                    value={novoEquipamento}
                    onChange={(e) => setNovoEquipamento(e.target.value)}
                    placeholder="Digite um equipamento"
                    onKeyPress={(e) => e.key === 'Enter' && handleAdicionarEquipamento()}
                  />
                  <Button type="button" onClick={handleAdicionarEquipamento}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {scenarioData.equipmentList.map((equipamento, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {equipamento}
                      <X className="w-3 h-3 cursor-pointer" onClick={() => removerEquipamento(equipamento)} />
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="revisao">
          <Card>
            <CardHeader>
              <CardTitle>Revisão Final</CardTitle>
              <CardDescription>Revise todas as informações antes de publicar</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-medium">Informações Básicas</h4>
                    <div className="space-y-2 text-sm">
                      <p><span className="font-medium">Título:</span> {scenarioData.title || "Não definido"}</p>
                      <p><span className="font-medium">Paciente:</span> {scenarioData.patientName || "Não definido"}</p>
                      <p><span className="font-medium">Idade:</span> {scenarioData.patientAge || "Não definido"}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="font-medium">Estatísticas</h4>
                    <div className="space-y-2 text-sm">
                      <p><span className="font-medium">Frames:</span> {frames.length}</p>
                      <p><span className="font-medium">Objetivos:</span> {scenarioData.learningObjectives.length}</p>
                      <p><span className="font-medium">Equipamentos:</span> {scenarioData.equipmentList.length}</p>
                    </div>
                  </div>
                </div>

                <div className={`p-4 rounded-lg border-2 ${tabs.every(tab => tab.status === 'completo') ? 'border-green-300 bg-green-50' : 'border-yellow-300 bg-yellow-50'}`}>
                  <div className="flex items-start gap-3">
                    {tabs.every(tab => tab.status === 'completo') ? (
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                    ) : (
                      <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                    )}
                    <div>
                      <h4 className="font-medium">
                        {tabs.every(tab => tab.status === 'completo') 
                          ? "Cenário pronto para publicação!" 
                          : "Atenção necessária"
                        }
                      </h4>
                      <div className="text-sm text-gray-600 mt-1">
                        {!tabs.every(tab => tab.status === 'completo') && (
                          <p>• Complete as seções incompletas antes de publicar</p>
                        )}
                        {tabs.every(tab => tab.status === 'completo') && (
                          <p>• Todas as seções obrigatórias foram preenchidas</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-2 pt-4 border-t">
                  <Button variant="outline" onClick={handleSalvarRascunho}>
                    <Save className="w-4 h-4 mr-2" />
                    Salvar Rascunho
                  </Button>
                  <Button onClick={handlePublicarCenario} disabled={!tabs.every(tab => tab.status === 'completo')}>
                    Publicar Cenário
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default NovoCenario;
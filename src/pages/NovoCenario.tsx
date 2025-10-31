"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Save, Eye, Activity, User, Clock, Package, MessageSquare, CheckCircle } from "lucide-react";
import { useScenarioForm } from "@/hooks/useScenarioForm";
import { showSuccess, showError } from "@/utils/toast";

// Import tab components
import IdentificacaoTab from "@/components/cenario/tabs/IdentificacaoTab";
import ObjetivosTab from "@/components/cenario/tabs/ObjetivosTab";
import PacienteTab from "@/components/cenario/tabs/PacienteTab";
import FramesTab from "@/components/cenario/FramesTab";
import MateriaisTab from "@/components/cenario/tabs/MateriaisTab";
import DebriefingTab from "@/components/cenario/tabs/DebriefingTab";
import RevisaoTab from "@/components/cenario/tabs/RevisaoTab";

const NovoCenario = () => {
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);

  const {
    activeTab,
    setActiveTab,
    scenarioData,
    frames,
    handleScenarioDataChange,
    handleHistoricoMedicoChange,
    handleSmartObjectivesChange,
    handleFramesChange,
    adicionarObjetivoTecnico,
    removerObjetivoTecnico,
    adicionarObjetivoNaoTecnico,
    removerObjetivoNaoTecnico,
    addEquipmentItem,
    updateEquipmentItem,
    removeEquipmentItem,
    salvarCenario,
    getTabsConfig
  } = useScenarioForm();

  const tabs = getTabsConfig();

  const handleSalvarRascunho = async () => {
    setIsSaving(true);
    try {
      const scenario = salvarCenario();
      showSuccess("Cenário salvo como rascunho!");
      navigate(`/cenarios/${scenario.id}`);
    } catch (error) {
      showError("Erro ao salvar cenário");
    } finally {
      setIsSaving(false);
    }
  };

  const handlePublicarCenario = async () => {
    setIsSaving(true);
    try {
      const scenario = salvarCenario();
      showSuccess("Cenário publicado com sucesso!");
      navigate(`/cenarios/${scenario.id}`);
    } catch (error) {
      showError("Erro ao publicar cenário");
    } finally {
      setIsSaving(false);
    }
  };

  const handleTabChange = (tabValue: string) => {
    setActiveTab(tabValue);
  };

  const handlePrevious = () => {
    const currentIndex = tabs.findIndex(tab => tab.value === activeTab);
    if (currentIndex > 0) {
      setActiveTab(tabs[currentIndex - 1].value);
    }
  };

  const handleNext = () => {
    const currentIndex = tabs.findIndex(tab => tab.value === activeTab);
    if (currentIndex < tabs.length - 1) {
      setActiveTab(tabs[currentIndex + 1].value);
    }
  };

  const canGoPrevious = tabs.findIndex(tab => tab.value === activeTab) > 0;
  const canGoNext = tabs.findIndex(tab => tab.value === activeTab) < tabs.length - 1;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Novo Cenário</h1>
          <p className="text-gray-600">Crie um novo cenário de simulação médica</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => navigate("/cenarios")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
          <Button variant="outline" onClick={handleSalvarRascunho} disabled={isSaving}>
            <Save className="w-4 h-4 mr-2" />
            {isSaving ? "Salvando..." : "Salvar Rascunho"}
          </Button>
        </div>
      </div>

      {/* Progress Indicator */}
      <Card>
        <CardHeader>
          <CardTitle>Progresso da Criação</CardTitle>
          <CardDescription>Complete todas as etapas para publicar seu cenário</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            {tabs.map((tab, index) => {
              const getTabIcon = () => {
                switch (tab.value) {
                  case "identificacao": return <Eye className="h-3 w-3" />;
                  case "objetivos": return <Activity className="h-3 w-3" />;
                  case "paciente": return <User className="h-3 w-3" />;
                  case "frames": return <Clock className="h-3 w-3" />;
                  case "materiais": return <Package className="h-3 w-3" />;
                  case "debriefing": return <MessageSquare className="h-3 w-3" />;
                  case "revisao": return <CheckCircle className="h-3 w-3" />;
                  default: return null;
                }
              };

              return (
                <div key={tab.value} className="flex items-center">
                  <Badge
                    variant={activeTab === tab.value ? "default" : tab.status === "ativo" ? "default" : "secondary"}
                    className={`cursor-pointer flex items-center gap-1 ${
                      activeTab === tab.value ? "bg-primary" : 
                      tab.status === "ativo" ? "bg-green-500" : ""
                    }`}
                    onClick={() => handleTabChange(tab.value)}
                  >
                    {getTabIcon()}
                    {tab.label}
                  </Badge>
                  {index < tabs.length - 1 && (
                    <div className="w-8 h-0.5 bg-gray-300 mx-2" />
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsContent value="identificacao" className="mt-0">
          <IdentificacaoTab
            scenarioData={scenarioData}
            handleScenarioDataChange={handleScenarioDataChange}
          />
        </TabsContent>

        <TabsContent value="objetivos" className="mt-0">
          <ObjetivosTab
            scenarioData={scenarioData}
            handleSmartObjectivesChange={handleSmartObjectivesChange}
            adicionarObjetivoTecnico={adicionarObjetivoTecnico}
            removerObjetivoTecnico={removerObjetivoTecnico}
            adicionarObjetivoNaoTecnico={adicionarObjetivoNaoTecnico}
            removerObjetivoNaoTecnico={removerObjetivoNaoTecnico}
          />
        </TabsContent>

        <TabsContent value="paciente" className="mt-0">
          <PacienteTab
            scenarioData={scenarioData}
            handleScenarioDataChange={handleScenarioDataChange}
            handleHistoricoMedicoChange={handleHistoricoMedicoChange}
          />
        </TabsContent>

        <TabsContent value="frames" className="mt-0">
          <FramesTab
            frames={frames}
            onFramesChange={handleFramesChange}
          />
        </TabsContent>

        <TabsContent value="materiais" className="mt-0">
          <MateriaisTab
            scenarioData={scenarioData}
            addEquipmentItem={addEquipmentItem}
            updateEquipmentItem={updateEquipmentItem}
            removeEquipmentItem={removeEquipmentItem}
          />
        </TabsContent>

        <TabsContent value="debriefing" className="mt-0">
          <DebriefingTab scenarioData={scenarioData} />
        </TabsContent>

        <TabsContent value="revisao" className="mt-0">
          <RevisaoTab
            scenarioData={scenarioData}
            frames={frames}
            tabs={tabs}
            handleSalvarRascunho={handleSalvarRascunho}
            handlePublicarCenario={handlePublicarCenario}
          />
        </TabsContent>
      </Tabs>

      {/* Navigation */}
      {activeTab !== "revisao" && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between">
              <Button 
                variant="outline" 
                onClick={handlePrevious}
                disabled={!canGoPrevious}
              >
                Anterior
              </Button>
              
              <Button 
                onClick={handleNext}
                disabled={!canGoNext}
              >
                Próximo
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default NovoCenario;
"use client";

import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { ArrowLeft, Save } from "lucide-react";
import { useScenarioForm } from "@/hooks/useScenarioForm";
import FramesTab from "../components/cenario/FramesTab";
import TabNavigation from "../components/cenario/TabNavigation";
import { showSuccess, showError } from "@/utils/toast";
import IdentificacaoTab from "../components/cenario/tabs/IdentificacaoTab";
import ObjetivosTab from "../components/cenario/tabs/ObjetivosTab";
import PacienteTab from "../components/cenario/tabs/PacienteTab";
import MateriaisTab from "../components/cenario/tabs/MateriaisTab";
import RevisaoTab from "../components/cenario/tabs/RevisaoTab";
import DebriefingTab from "../components/cenario/tabs/DebriefingTab";

const NovoCenario = () => {
  const navigate = useNavigate();
  
  const {
    activeTab,
    frames,
    scenarioData,
    setActiveTab,
    handleScenarioDataChange,
    handleHistoricoMedicoChange,
    handleSmartObjectivesChange,
    handleFramesChange,
    adicionarObjetivoTecnico,
    removerObjetivoTecnico,
    adicionarObjetivoNaoTecnico,
    removerObjetivoNaoTecnico,
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
          <IdentificacaoTab 
            scenarioData={scenarioData}
            handleScenarioDataChange={handleScenarioDataChange}
          />
        </TabsContent>

        <TabsContent value="objetivos">
          <ObjetivosTab
            scenarioData={scenarioData}
            handleSmartObjectivesChange={handleSmartObjectivesChange}
            adicionarObjetivoTecnico={adicionarObjetivoTecnico}
            removerObjetivoTecnico={removerObjetivoTecnico}
            adicionarObjetivoNaoTecnico={adicionarObjetivoNaoTecnico}
            removerObjetivoNaoTecnico={removerObjetivoNaoTecnico}
          />
        </TabsContent>

        <TabsContent value="paciente">
          <PacienteTab
            scenarioData={scenarioData}
            handleScenarioDataChange={handleScenarioDataChange}
            handleHistoricoMedicoChange={handleHistoricoMedicoChange}
          />
        </TabsContent>

        <TabsContent value="frames">
          <FramesTab 
            frames={frames} 
            onFramesChange={handleFramesChange} 
          />
        </TabsContent>

        <TabsContent value="materiais">
          <MateriaisTab
            scenarioData={scenarioData}
            adicionarEquipamento={adicionarEquipamento}
            removerEquipamento={removerEquipamento}
          />
        </TabsContent>

        <TabsContent value="debriefing">
          <DebriefingTab scenarioData={scenarioData} />
        </TabsContent>

        <TabsContent value="revisao">
          <RevisaoTab
            scenarioData={scenarioData}
            frames={frames}
            tabs={tabs}
            handleSalvarRascunho={handleSalvarRascunho}
            handlePublicarCenario={handlePublicarCenario}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default NovoCenario;
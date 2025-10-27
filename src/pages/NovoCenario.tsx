"use client";

import { Tabs, TabsContent } from "@/components/ui/tabs";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ProgramaTab from "@/components/cenario/ProgramaTab";
import CenarioSMARTTab from "@/components/cenario/CenarioSMARTTab";
import PacientePerfilTab from "@/components/cenario/PacientePerfilTab";
import FramesTab from "@/components/cenario/FramesTab";
import MateriaisDebriefingTab from "@/components/cenario/MateriaisDebriefingTab";
import RevisaoTab from "@/components/cenario/RevisaoTab";
import TabNavigation from "@/components/cenario/TabNavigation";
import ScenarioHeader from "@/components/cenario/ScenarioHeader";
import { useScenarioForm } from "@/hooks/useScenarioForm";
import { validateCompleteScenario } from "@/utils/scenarioValidation";
import { showSuccess, showError } from "@/utils/toast";

const NovoCenario = () => {
  const navigate = useNavigate();
  
  const {
    // State
    activeTab,
    palavrasChave,
    novaPalavra,
    frames,
    checklists,
    formData,
    
    // Setters
    setActiveTab,
    
    // Handlers
    handleFormDataChange,
    handlePalavrasChaveChange,
    handleNovaPalavraChange,
    handleChecklistChange,
    handleFramesChange,
    
    // Validations
    validarAba,
    getTabsConfig
  } = useScenarioForm();

  const tabs = getTabsConfig();
  const currentIndex = tabs.findIndex(tab => tab.value === activeTab);
  const canGoPrevious = currentIndex > 0;
  const canGoNext = currentIndex < tabs.length - 1;

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
    showSuccess("Rascunho salvo com sucesso!");
  };

  const publicarCenario = () => {
    const validation = validateCompleteScenario(formData, frames, checklists);
    
    if (!validation.isValid) {
      showError(`Erros de validação: ${validation.errors.join(', ')}`);
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
    
    // Simular salvamento
    console.log("Publicando cenário:", cenarioData);
    showSuccess("Cenário publicado com sucesso!");
    navigate("/cenarios");
  };

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
      
      // Validar aba atual antes de avançar
      if (!validarAba(activeTab)) {
        showError(`Complete a aba atual antes de avançar`);
        return;
      }
      
      setActiveTab(nextTab);
    }
  };

  const handleAISuggestion = (campo: string) => {
    // Simulação de sugestão de IA
    console.log(`Solicitando sugestão de IA para: ${campo}`);
    showSuccess("Sugestão gerada com IA!");
  };

  return (
    <div className="p-6 space-y-6">
      <ScenarioHeader
        title="Novo Cenário"
        description="Crie um novo cenário de simulação realística seguindo o modelo estruturado"
        onCancel={() => navigate("/cenarios")}
        onSaveDraft={salvarRascunho}
      />

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

        {/* Aba Programa */}
        <TabsContent value="programa">
          <ProgramaTab
            formData={formData}
            palavrasChave={palavrasChave}
            novaPalavra={novaPalavra}
            onFormDataChange={handleFormDataChange}
            onPalavrasChaveChange={handlePalavrasChaveChange}
            onNovaPalavraChange={handleNovaPalavraChange}
          />
        </TabsContent>

        {/* Aba Cenário */}
        <TabsContent value="cenario">
          <CenarioSMARTTab
            formData={formData}
            onFormDataChange={handleFormDataChange}
          />
        </TabsContent>

        {/* Aba Paciente */}
        <TabsContent value="paciente">
          <PacientePerfilTab
            formData={formData}
            onFormDataChange={handleFormDataChange}
            onAISuggestion={handleAISuggestion}
          />
        </TabsContent>

        {/* Aba Frames */}
        <TabsContent value="frames">
          <FramesTab 
            frames={frames} 
            onFramesChange={handleFramesChange} 
          />
        </TabsContent>

        {/* Aba Materiais e Debriefing */}
        <TabsContent value="materiais">
          <MateriaisDebriefingTab
            formData={formData}
            onFormDataChange={handleFormDataChange}
            onAISuggestion={handleAISuggestion}
          />
        </TabsContent>

        {/* Aba Debriefing */}
        <TabsContent value="debriefing">
          <div className="text-center py-8">
            <p className="text-gray-500">Conteúdo específico do debriefing será implementado aqui</p>
          </div>
        </TabsContent>

        {/* Aba Revisão */}
        <TabsContent value="revisao">
          <RevisaoTab
            formData={formData}
            frames={frames}
            palavrasChave={palavrasChave}
            checklists={checklists}
            validarAba={validarAba}
            onSalvarRascunho={salvarRascunho}
            onPublicarCenario={publicarCenario}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default NovoCenario;
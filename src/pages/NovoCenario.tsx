"use client";

import { Tabs, TabsContent } from "@/components/ui/tabs";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import FramesTab from "@/components/cenario/FramesTab";
import IdentificacaoTab from "@/components/cenario/IdentificacaoTab";
import ObjetivosTab from "@/components/cenario/ObjetivosTab";
import PacienteTab from "@/components/cenario/PacienteTab";
import ChecklistTab from "@/components/cenario/ChecklistTab";
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
        description="Crie um novo cenário de simulação realística"
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

        {/* Aba Identificação */}
        <TabsContent value="identificacao">
          <IdentificacaoTab
            formData={formData}
            palavrasChave={palavrasChave}
            novaPalavra={novaPalavra}
            onFormDataChange={handleFormDataChange}
            onPalavrasChaveChange={handlePalavrasChaveChange}
            onNovaPalavraChange={handleNovaPalavraChange}
          />
        </TabsContent>

        {/* Aba Objetivos */}
        <TabsContent value="objetivos">
          <ObjetivosTab
            formData={formData}
            onFormDataChange={handleFormDataChange}
            onAISuggestion={(tipo) => handleAISuggestion(`objetivos_${tipo}`)}
          />
        </TabsContent>

        {/* Aba Paciente */}
        <TabsContent value="paciente">
          <PacienteTab
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

        {/* Aba Materiais */}
        <TabsContent value="materiais">
          <ChecklistTab
            tipo="materiais"
            checklist={checklists.materiais}
            onChecklistChange={(checklist) => handleChecklistChange('materiais', checklist)}
          />
        </TabsContent>

        {/* Aba Debriefing */}
        <TabsContent value="debriefing">
          <ChecklistTab
            tipo="debriefing"
            checklist={checklists.debriefing}
            onChecklistChange={(checklist) => handleChecklistChange('debriefing', checklist)}
          />
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
"use client";

import { useState, useCallback } from "react";
import { ScenarioFormData, HistoricoMedico, Frame, EquipmentItem } from "@/types/prisma";

export const useScenarioForm = () => {
  const [activeTab, setActiveTab] = useState("identificacao");
  const [frames, setFrames] = useState<Frame[]>([]);

  const [scenarioData, setScenarioData] = useState<ScenarioFormData>({
    title: "",
    patientName: "",
    patientAge: "",
    patientGender: "",
    patientHeight: "",
    patientWeight: "",
    perfilFisico: "",
    perfilPsicologico: "",
    perfilTecnico: "",
    atualizadoEm: "",
    historicoMedico: {
      dm: false,
      has: false,
      asma: false,
      alergias: false,
      alergiasDesc: "",
      etilismo: false,
      tabagismo: false,
      tabagismoDesc: "",
      outros: false,
      outrosDesc: "",
    },
    acompanhamentoMedico: "",
    medicacoesEmUso: "",
    cirurgiasAnteriores: "",
    scenarioOutline: "",
    learnerBrief: "",
    smartObjectives: undefined,
    technicalLearningObjectives: [],
    nonTechnicalLearningObjectives: [],
    equipmentList: []
  });

  const handleScenarioDataChange = useCallback((field: keyof ScenarioFormData, value: any) => {
    setScenarioData(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleHistoricoMedicoChange = useCallback((field: keyof HistoricoMedico, value: string | boolean) => {
    setScenarioData(prev => ({
      ...prev,
      historicoMedico: {
        ...prev.historicoMedico!,
        [field]: value,
      }
    }));
  }, []);

  const handleSmartObjectivesChange = useCallback((field: keyof import("@/types/prisma").SmartObjectives, value: string) => {
    setScenarioData(prev => ({
      ...prev,
      smartObjectives: {
        ...prev.smartObjectives,
        [field]: value,
      }
    }));
  }, []);

  const handleFramesChange = useCallback((newFrames: Frame[]) => {
    setFrames(newFrames);
  }, []);

  const adicionarObjetivoTecnico = useCallback((objetivo: string) => {
    if (objetivo.trim() && !scenarioData.technicalLearningObjectives.includes(objetivo.trim())) {
      handleScenarioDataChange('technicalLearningObjectives', [...scenarioData.technicalLearningObjectives, objetivo.trim()]);
    }
  }, [scenarioData.technicalLearningObjectives, handleScenarioDataChange]);

  const removerObjetivoTecnico = useCallback((objetivo: string) => {
    handleScenarioDataChange('technicalLearningObjectives', scenarioData.technicalLearningObjectives.filter(o => o !== objetivo));
  }, [scenarioData.technicalLearningObjectives, handleScenarioDataChange]);

  const adicionarObjetivoNaoTecnico = useCallback((objetivo: string) => {
    if (objetivo.trim() && !scenarioData.nonTechnicalLearningObjectives.includes(objetivo.trim())) {
      handleScenarioDataChange('nonTechnicalLearningObjectives', [...scenarioData.nonTechnicalLearningObjectives, objetivo.trim()]);
    }
  }, [scenarioData.nonTechnicalLearningObjectives, handleScenarioDataChange]);

  const removerObjetivoNaoTecnico = useCallback((objetivo: string) => {
    handleScenarioDataChange('nonTechnicalLearningObjectives', scenarioData.nonTechnicalLearningObjectives.filter(o => o !== objetivo));
  }, [scenarioData.nonTechnicalLearningObjectives, handleScenarioDataChange]);

  const adicionarEquipamento = useCallback(() => {
    const novoEquipamento: EquipmentItem = {
      id: Date.now().toString(),
      type: "",
      modelName: "",
      brand: "",
      quantity: "",
      observations: ""
    };
    handleScenarioDataChange('equipmentList', [...scenarioData.equipmentList, novoEquipamento]);
  }, [scenarioData.equipmentList, handleScenarioDataChange]);

  const atualizarEquipamento = useCallback((id: string, field: keyof EquipmentItem, value: string) => {
    handleScenarioDataChange('equipmentList',
      scenarioData.equipmentList.map(item =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  }, [scenarioData.equipmentList, handleScenarioDataChange]);

  const removerEquipamento = useCallback((id: string) => {
    handleScenarioDataChange('equipmentList', scenarioData.equipmentList.filter(e => e.id !== id));
  }, [scenarioData.equipmentList, handleScenarioDataChange]);

  const validarAba = useCallback((aba: string) => {
    switch (aba) {
      case "identificacao":
        return !!(scenarioData.title);
      case "objetivos":
        return scenarioData.technicalLearningObjectives.length >= 1 || scenarioData.nonTechnicalLearningObjectives.length >= 1;
      case "paciente":
        return !!(scenarioData.patientName && scenarioData.patientAge && scenarioData.patientGender);
      case "frames":
        return frames.length >= 1;
      case "materiais":
        return scenarioData.equipmentList.length >= 1;
      default:
        return true;
    }
  }, [scenarioData, frames]);

  const getTabStatus = useCallback((aba: string): "completo" | "ativo" | "incompleto" => {
    if (validarAba(aba)) {
      return "completo";
    } else if (aba === activeTab) {
      return "ativo";
    } else {
      return "incompleto";
    }
  }, [validarAba, activeTab]);

  const getTabsConfig = useCallback(() => {
    const tabs = [
      { value: "identificacao", label: "Identificação" },
      { value: "objetivos", label: "Objetivos" },
      { value: "paciente", label: "Paciente" },
      { value: "frames", label: "Frames" },
      { value: "materiais", label: "Materiais" },
      { value: "debriefing", label: "Debriefing" },
      { value: "revisao", label: "Revisão" }
    ];

    return tabs.map(tab => ({
      ...tab,
      status: getTabStatus(tab.value)
    }));
  }, [getTabStatus]);

  const salvarCenario = useCallback(() => {
    const scenarioCompleto = {
      ...scenarioData,
      frames,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    localStorage.setItem("cenario_rascunho", JSON.stringify(scenarioCompleto));
    return scenarioCompleto;
  }, [scenarioData, frames]);

  return {
    activeTab,
    frames,
    scenarioData,
    setActiveTab,
    setScenarioData,
    setFrames,
    handleScenarioDataChange,
    handleHistoricoMedicoChange,
    handleSmartObjectivesChange,
    handleFramesChange,
    adicionarObjetivoTecnico,
    removerObjetivoTecnico,
    adicionarObjetivoNaoTecnico,
    removerObjetivoNaoTecnico,
    adicionarEquipamento,
    atualizarEquipamento,
    removerEquipamento,
    salvarCenario,
    validarAba,
    getTabStatus,
    getTabsConfig
  };
};

"use client";

import { useState, useCallback } from "react";
import { Scenario, Frame, ScenarioFormData, HistoricoMedico, SmartObjectives } from "@/types/prisma";

export const useScenarioForm = () => {
  const [activeTab, setActiveTab] = useState("identificacao");
  const [frames, setFrames] = useState<Frame[]>([
    {
      id: "1",
      scenarioId: "temp",
      frameIdentifier: "1",
      title: "Estado Inicial",
      durationEstimateMin: 5,
      participantType: "Simulador",
      operatorInstructions: [],
      expectedParticipantActions: [],
      sourceTransitions: [],
      targetTransitions: [],
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ]);

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
    smartObjectives: {
      specific: "",
      measurable: "",
      achievable: "",
      relevant: "",
      timeBound: "",
    },
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

  const handleSmartObjectivesChange = useCallback((field: keyof SmartObjectives, value: string) => {
    setScenarioData(prev => ({
      ...prev,
      smartObjectives: {
        ...(prev.smartObjectives || {}),
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

  const adicionarEquipamento = useCallback((equipamento: string) => {
    if (equipamento.trim() && !scenarioData.equipmentList.includes(equipamento.trim())) {
      handleScenarioDataChange('equipmentList', [...scenarioData.equipmentList, equipamento.trim()]);
    }
  }, [scenarioData.equipmentList, handleScenarioDataChange]);

  const removerEquipamento = useCallback((equipamento: string) => {
    handleScenarioDataChange('equipmentList', scenarioData.equipmentList.filter(e => e !== equipamento));
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
        return frames.length >= 1 && frames.every(f => f.title && f.parameterSet);
      case "materiais":
        return scenarioData.equipmentList.length >= 1;
      case "debriefing":
        return true;
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
    const scenarioCompleto: Scenario = {
      id: Date.now().toString(),
      title: scenarioData.title,
      patientName: scenarioData.patientName,
      patientAge: scenarioData.patientAge,
      patientGender: scenarioData.patientGender,
      patientHeight: scenarioData.patientHeight,
      patientWeight: scenarioData.patientWeight,
      perfilFisico: scenarioData.perfilFisico,
      perfilPsicologico: scenarioData.perfilPsicologico,
      perfilTecnico: scenarioData.perfilTecnico,
      atualizadoEm: scenarioData.atualizadoEm,
      historicoMedico: scenarioData.historicoMedico,
      acompanhamentoMedico: scenarioData.acompanhamentoMedico,
      medicacoesEmUso: scenarioData.medicacoesEmUso,
      cirurgiasAnteriores: scenarioData.cirurgiasAnteriores,
      scenarioOutline: scenarioData.scenarioOutline,
      learnerBrief: scenarioData.learnerBrief,
      smartObjectives: JSON.stringify(scenarioData.smartObjectives),
      technicalLearningObjectives: scenarioData.technicalLearningObjectives,
      nonTechnicalLearningObjectives: scenarioData.nonTechnicalLearningObjectives,
      equipmentList: scenarioData.equipmentList,
      requiredResources: [],
      initialFrameId: frames[0]?.id,
      initialFrame: frames[0],
      frames: frames,
      checklist: undefined,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Salvar no localStorage (mock)
    localStorage.setItem("scenario_prisma", JSON.stringify(scenarioCompleto));
    console.log("Scenario salvo:", scenarioCompleto);
    
    return scenarioCompleto;
  }, [scenarioData, frames]);

  const carregarCenario = useCallback((scenarioId: string) => {
    // Carregar do localStorage (mock)
    const salvo = localStorage.getItem(`scenario_${scenarioId}`);
    if (salvo) {
      const scenario: Scenario = JSON.parse(salvo);
      setScenarioData({
        title: scenario.title,
        patientName: scenario.patientName,
        patientAge: scenario.patientAge,
        patientGender: scenario.patientGender,
        patientHeight: scenario.patientHeight,
        patientWeight: scenario.patientWeight,
        perfilFisico: scenario.perfilFisico,
        perfilPsicologico: scenario.perfilPsicologico,
        perfilTecnico: scenario.perfilTecnico,
        atualizadoEm: scenario.atualizadoEm,
        historicoMedico: scenario.historicoMedico,
        acompanhamentoMedico: scenario.acompanhamentoMedico,
        medicacoesEmUso: scenario.medicacoesEmUso,
        cirurgiasAnteriores: scenario.cirurgiasAnteriores,
        scenarioOutline: scenario.scenarioOutline,
        learnerBrief: scenario.learnerBrief,
        smartObjectives: scenario.smartObjectives ? JSON.parse(scenario.smartObjectives) : { specific: "", measurable: "", achievable: "", relevant: "", timeBound: "" },
        technicalLearningObjectives: scenario.technicalLearningObjectives,
        nonTechnicalLearningObjectives: scenario.nonTechnicalLearningObjectives,
        equipmentList: scenario.equipmentList
      });
      setFrames(scenario.frames);
    }
  }, []);

  return {
    // State
    activeTab,
    frames,
    scenarioData,
    
    // Setters
    setActiveTab,
    setScenarioData,
    setFrames,
    
    // Handlers
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
    carregarCenario,
    
    // Validations
    validarAba,
    getTabStatus,
    getTabsConfig
  };
};
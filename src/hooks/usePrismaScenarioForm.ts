"use client";

import { useState, useCallback } from "react";
import { Scenario, Frame, ParameterSet, FrameFormData, ScenarioFormData } from "@/types/prisma";

export const usePrismaScenarioForm = () => {
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
    scenarioOutline: "",
    learnerBrief: "",
    learningObjectives: [],
    equipmentList: []
  });

  const handleScenarioDataChange = useCallback((field: string, value: any) => {
    setScenarioData(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleFramesChange = useCallback((newFrames: Frame[]) => {
    setFrames(newFrames);
  }, []);

  const adicionarObjetivoAprendizagem = useCallback((objetivo: string) => {
    if (objetivo.trim() && !scenarioData.learningObjectives.includes(objetivo.trim())) {
      handleScenarioDataChange('learningObjectives', [...scenarioData.learningObjectives, objetivo.trim()]);
    }
  }, [scenarioData.learningObjectives, handleScenarioDataChange]);

  const removerObjetivoAprendizagem = useCallback((objetivo: string) => {
    handleScenarioDataChange('learningObjectives', scenarioData.learningObjectives.filter(o => o !== objetivo));
  }, [scenarioData.learningObjectives, handleScenarioDataChange]);

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
        return !!(scenarioData.title && scenarioData.patientName && scenarioData.patientAge);
      case "objetivos":
        return scenarioData.learningObjectives.length >= 2;
      case "paciente":
        return !!(scenarioData.patientName && scenarioData.patientAge && scenarioData.patientGender);
      case "frames":
        return frames.length >= 3 && frames.filter(f => f.parameterSet).length >= 3;
      case "materiais":
        return scenarioData.equipmentList.length >= 3;
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
      scenarioOutline: scenarioData.scenarioOutline,
      learnerBrief: scenarioData.learnerBrief,
      learningObjectives: scenarioData.learningObjectives,
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
        scenarioOutline: scenario.scenarioOutline,
        learnerBrief: scenario.learnerBrief,
        learningObjectives: scenario.learningObjectives,
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
    handleFramesChange,
    adicionarObjetivoAprendizagem,
    removerObjetivoAprendizagem,
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
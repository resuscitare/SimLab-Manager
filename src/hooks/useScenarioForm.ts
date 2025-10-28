"use client";

import { useState, useCallback } from "react";
import { Scenario, Frame, ScenarioFormData, HistoricoMedico, SmartObjectives, EquipmentItem } from "@/types/prisma";
import { DebriefingTemplate } from "@/types/debriefing";

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
  const [debriefingTemplate, setDebriefingTemplate] = useState<DebriefingTemplate | null>(null);

  const [scenarioData, setScenarioData] = useState<ScenarioFormData>({
    title: "",
    curso: "",
    turma: "",
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
        [field]: value
      }
    }));
  }, []);

  const handleSmartObjectivesChange = useCallback((field: keyof SmartObjectives, value: string) => {
    setScenarioData(prev => ({
      ...prev,
      smartObjectives: {
        ...prev.smartObjectives!,
        [field]: value
      }
    }));
  }, []);

  const handleFramesChange = useCallback((newFrames: Frame[]) => {
    setFrames(newFrames);
  }, []);

  const adicionarObjetivoTecnico = useCallback((objetivo: string) => {
    setScenarioData(prev => ({
      ...prev,
      technicalLearningObjectives: [...prev.technicalLearningObjectives, objetivo]
    }));
  }, []);

  const removerObjetivoTecnico = useCallback((objetivo: string) => {
    setScenarioData(prev => ({
      ...prev,
      technicalLearningObjectives: prev.technicalLearningObjectives.filter(obj => obj !== objetivo)
    }));
  }, []);

  const adicionarObjetivoNaoTecnico = useCallback((objetivo: string) => {
    setScenarioData(prev => ({
      ...prev,
      nonTechnicalLearningObjectives: [...prev.nonTechnicalLearningObjectives, objetivo]
    }));
  }, []);

  const removerObjetivoNaoTecnico = useCallback((objetivo: string) => {
    setScenarioData(prev => ({
      ...prev,
      nonTechnicalLearningObjectives: prev.nonTechnicalLearningObjectives.filter(obj => obj !== objetivo)
    }));
  }, []);

  const addEquipmentItem = useCallback(() => {
    const newItem: EquipmentItem = {
      id: Date.now().toString(),
      type: "",
      modelName: "",
      brand: "",
      quantity: "1",
      observations: ""
    };
    setScenarioData(prev => ({
      ...prev,
      equipmentList: [...prev.equipmentList, newItem]
    }));
  }, []);

  const updateEquipmentItem = useCallback((id: string, field: keyof EquipmentItem, value: string) => {
    setScenarioData(prev => ({
      ...prev,
      equipmentList: prev.equipmentList.map(item => 
        item.id === id ? { ...item, [field]: value } : item
      )
    }));
  }, []);

  const removeEquipmentItem = useCallback((id: string) => {
    setScenarioData(prev => ({
      ...prev,
      equipmentList: prev.equipmentList.filter(item => item.id !== id)
    }));
  }, []);

  const handleDebriefingTemplateChange = useCallback((template: DebriefingTemplate | null) => {
    setDebriefingTemplate(template);
  }, []);

  const salvarCenario = useCallback(() => {
    const scenarioCompleto: Scenario = {
      id: Date.now().toString(),
      title: scenarioData.title,
      curso: scenarioData.curso,
      turma: scenarioData.turma,
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

    localStorage.setItem("scenario_prisma", JSON.stringify(scenarioCompleto));
    
    if (debriefingTemplate) {
      const checklists = JSON.parse(localStorage.getItem('checklists') || '[]');
      const index = checklists.findIndex((c: any) => c.id === debriefingTemplate.id);
      
      if (index === -1) {
        checklists.push(debriefingTemplate);
      } else {
        checklists[index] = debriefingTemplate;
      }
      
      localStorage.setItem('checklists', JSON.stringify(checklists));
    }
    
    return scenarioCompleto;
  }, [scenarioData, frames, debriefingTemplate]);

  const getTabsConfig = useCallback(() => {
    return [
      { value: "identificacao", label: "Identificação", status: "ativo" as const },
      { value: "objetivos", label: "Objetivos", status: "ativo" as const },
      { value: "paciente", label: "Paciente", status: "ativo" as const },
      { value: "frames", label: "Frames", status: "ativo" as const },
      { value: "materiais", label: "Materiais", status: "ativo" as const },
      { value: "debriefing", label: "Debriefing", status: "ativo" as const },
      { value: "revisao", label: "Revisão", status: "incompleto" as const }
    ];
  }, []);

  return {
    // State
    activeTab,
    frames,
    scenarioData,
    debriefingTemplate,
    
    // Setters
    setActiveTab,
    setScenarioData,
    setFrames,
    setDebriefingTemplate: handleDebriefingTemplateChange,
    
    // Handlers
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
  };
};
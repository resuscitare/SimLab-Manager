"use client";

import { useState, useCallback } from "react";

interface Frame {
  id: string;
  ordem: number;
  nomeEtapa: string;
  frameIdentifier: string;
  durationEstimateMin: number;
  participantType: string;
  isCompleto: boolean;
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

interface FormData {
  nome: string;
  publicoAlvo: string;
  tempoExecucao: string;
  tipoSimulacao: string;
  descricao: string;
  objetivosTecnicos: string;
  objetivosNaoTecnicos: string;
  nomePaciente: string;
  idade: string;
  sexo: string;
  historicoMedico: string;
  comoInicia: string;
  localSimulacao: string;
  voluntarios: string;
  tempoDebriefing: string;
  falasDirecionadoras: string;
  metasSeguranca: string;
  dominiosDesempenho: string;
  protocolosEspecificos: string;
  exemplosFrases: string;
}

export const useScenarioForm = () => {
  const [activeTab, setActiveTab] = useState("identificacao");
  const [palavrasChave, setPalavrasChave] = useState<string[]>([]);
  const [novaPalavra, setNovaPalavra] = useState("");
  
  const [frames, setFrames] = useState<Frame[]>([
    {
      id: "1",
      ordem: 1,
      nomeEtapa: "Estado Inicial",
      frameIdentifier: "1",
      durationEstimateMin: 5,
      participantType: "Simulador",
      isCompleto: false
    }
  ]);

  const [checklists, setChecklists] = useState({
    debriefing: null,
    materiais: null
  });

  const [formData, setFormData] = useState<FormData>({
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

  const handleFormDataChange = useCallback((field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  const handlePalavrasChaveChange = useCallback((palavras: string[]) => {
    setPalavrasChave(palavras);
  }, []);

  const handleNovaPalavraChange = useCallback((palavra: string) => {
    setNovaPalavra(palavra);
  }, []);

  const handleChecklistChange = useCallback((tipo: 'materiais' | 'debriefing', checklist: any) => {
    setChecklists(prev => ({ ...prev, [tipo]: checklist }));
  }, []);

  const handleFramesChange = useCallback((newFrames: Frame[]) => {
    setFrames(newFrames);
  }, []);

  const validarAba = useCallback((aba: string) => {
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
  }, [formData, frames, checklists]);

  const getTabStatus = useCallback((aba: string) => {
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

  return {
    // State
    activeTab,
    palavrasChave,
    novaPalavra,
    frames,
    checklists,
    formData,
    
    // Setters
    setActiveTab,
    setPalavrasChave,
    setNovaPalavra,
    setFrames,
    setChecklists,
    setFormData,
    
    // Handlers
    handleFormDataChange,
    handlePalavrasChaveChange,
    handleNovaPalavraChange,
    handleChecklistChange,
    handleFramesChange,
    
    // Validations
    validarAba,
    getTabStatus,
    getTabsConfig
  };
};
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
  // Programa (Seções 1-3)
  nomePrograma: string;
  objetivosPrograma: string;
  publicoAlvo: string;
  datasCurso: string;
  horariosCurso: string;
  facilitadores: string;
  conteudoPrevio: string;
  avaliacaoAprendizagem: string;
  tarefasFacilitador: string;
  
  // Cenário (Seções 4-5)
  nomeCenario: string;
  localCenario: string;
  tempoCenario: string;
  tempoDebriefing: string;
  voluntarios: string;
  tipoSimulacao: string;
  descricaoCenario: string;
  inicioCenario: string;
  objetivosTecnicos: string;
  objetivosNaoTecnicos: string;
  escritoPor: string;
  atualizadoPor: string;
  validadoPor: string;
  produzidoEm: string;
  atualizadoEm: string;
  
  // Paciente (Seção 6)
  nomePaciente: string;
  idade: string;
  sexo: string;
  peso: string;
  altura: string;
  perfilFisico: string;
  perfilPsicologico: string;
  perfilTecnico: string;
  historicoMedico: string;
  dm: boolean;
  has: boolean;
  asma: boolean;
  alergias: string;
  etilismo: boolean;
  tabagismo: boolean;
  outros: string;
  acompanhamentoMedico: string;
  medicacoesUso: string;
  cirurgiasInternacoes: string;
  
  // Materiais e Debriefing (Seções 9-10)
  materiaisEquipamentos: string;
  impressosNecessarios: string;
  preparoMontagem: string;
  falasDirecionadoras: string;
  metasSeguranca: {
    meta1: boolean;
    meta2: boolean;
    meta3: boolean;
    meta4: boolean;
    meta5: boolean;
    meta6: boolean;
  };
  dominiosDesempenho: {
    tomadaDecisao: boolean;
    habilidadeTecnica: boolean;
    comunicacao: boolean;
    utilizacaoRecursos: boolean;
    liderancaTrabalhoEquipe: boolean;
    conscienciaSituacional: boolean;
  };
  protocolosEspecificos: string;
  exemplosFrases: string;
}

export const useScenarioForm = () => {
  const [activeTab, setActiveTab] = useState("programa");
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
    // Programa
    nomePrograma: "",
    objetivosPrograma: "",
    publicoAlvo: "",
    datasCurso: "",
    horariosCurso: "",
    facilitadores: "",
    conteudoPrevio: "",
    avaliacaoAprendizagem: "",
    tarefasFacilitador: "",
    
    // Cenário
    nomeCenario: "",
    localCenario: "",
    tempoCenario: "",
    tempoDebriefing: "",
    voluntarios: "",
    tipoSimulacao: "",
    descricaoCenario: "",
    inicioCenario: "",
    objetivosTecnicos: "",
    objetivosNaoTecnicos: "",
    escritoPor: "",
    atualizadoPor: "",
    validadoPor: "",
    produzidoEm: "",
    atualizadoEm: "",
    
    // Paciente
    nomePaciente: "",
    idade: "",
    sexo: "",
    peso: "",
    altura: "",
    perfilFisico: "",
    perfilPsicologico: "",
    perfilTecnico: "",
    historicoMedico: "",
    dm: false,
    has: false,
    asma: false,
    alergias: "",
    etilismo: false,
    tabagismo: false,
    outros: "",
    acompanhamentoMedico: "",
    medicacoesUso: "",
    cirurgiasInternacoes: "",
    
    // Materiais e Debriefing
    materiaisEquipamentos: "",
    impressosNecessarios: "",
    preparoMontagem: "",
    falasDirecionadoras: "",
    metasSeguranca: {
      meta1: false,
      meta2: false,
      meta3: false,
      meta4: false,
      meta5: false,
      meta6: false
    },
    dominiosDesempenho: {
      tomadaDecisao: false,
      habilidadeTecnica: false,
      comunicacao: false,
      utilizacaoRecursos: false,
      liderancaTrabalhoEquipe: false,
      conscienciaSituacional: false
    },
    protocolosEspecificos: "",
    exemplosFrases: ""
  });

  const handleFormDataChange = useCallback((field: string, value: any) => {
    // Handle nested objects (e.g., metasSeguranca.meta1)
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => {
        const parentValue = prev[parent as keyof FormData];
        
        // Ensure parent value is an object before spreading
        if (typeof parentValue === 'object' && parentValue !== null) {
          return {
            ...prev,
            [parent]: {
              ...parentValue,
              [child]: value
            }
          };
        }
        
        // If parent is not an object, create a new object
        return {
          ...prev,
          [parent]: { [child]: value }
        };
      });
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
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
      case "programa":
        return !!(formData.nomePrograma && formData.objetivosPrograma && formData.publicoAlvo);
      case "cenario":
        return !!(formData.nomeCenario && formData.objetivosTecnicos && formData.objetivosNaoTecnicos);
      case "paciente":
        return !!(formData.nomePaciente && formData.idade && formData.sexo);
      case "frames":
        return frames.length >= 3 && frames.filter(f => f.isCompleto).length >= 3;
      case "materiais":
        return !!formData.materiaisEquipamentos;
      case "debriefing":
        return !!formData.protocolosEspecificos;
      default:
        return true;
    }
  }, [formData, frames]);

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
      { value: "programa", label: "Programa" },
      { value: "cenario", label: "Cenário" },
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
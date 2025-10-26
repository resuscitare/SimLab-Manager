"use client";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, CheckCircle, Eye, Save } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import FramesTab from "@/components/cenario/FramesTab";
import IdentificacaoTab from "@/components/cenario/IdentificacaoTab";
import ObjetivosTab from "@/components/cenario/ObjetivosTab";
import PacienteTab from "@/components/cenario/PacienteTab";
import ChecklistTab from "@/components/cenario/ChecklistTab";
import RevisaoTab from "@/components/cenario/RevisaoTab";

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

const NovoCenario = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("identificacao");
  const [palavrasChave, setPalavrasChave] = useState<string[]>([]);
  const [novaPalavra, setNovaPalavra] = useState("");
  
  // Frames state
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

  // Checklists state
  const [checklists, setChecklists] = useState({
    debriefing: null,
    materiais: null
  });

  // Estado do formulário
  const [formData, setFormData] = useState({
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

  const handleFormDataChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePalavrasChaveChange = (palavras: string[]) => {
    setPalavrasChave(palavras);
  };

  const handleNovaPalavraChange = (palavra: string) => {
    setNovaPalavra(palavra);
  };

  const handleChecklistChange = (tipo: 'materiais' | 'debriefing', checklist: any) => {
    setChecklists(prev => ({ ...prev, [tipo]: checklist }));
  };

  const handleAISuggestion = (campo: string) => {
    // Simulação de sugestão de IA
    console.log(`Solicitando sugestão de IA para: ${campo}`);
    // Aqui seria a integração real com a API de IA
  };

  const validarAba = (aba: string) => {
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
  };

  const getTabStatus = (aba: string) => {
    if (validarAba(aba)) {
      return "completo";
    } else if (aba === activeTab) {
      return "ativo";
    } else {
      return "incompleto";
    }
  };

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
    console.log("Rascunho salvo:", cenarioData);
    
    // Mostrar feedback
    alert("Rascunho salvo com sucesso!");
  };

  const publicarCenario = () => {
    // Validar se todas as abas estão completas
    const abasObrigatorias = ["identificacao", "objetivos", "paciente", "frames", "materiais", "debriefing"];
    const abasIncompletas = abasObrigatorias.filter(aba => !validarAba(aba));
    
    if (abasIncompletas.length > 0) {
      alert(`Complete as seguintes abas antes de publicar: ${abasIncompletas.join(", ")}`);
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
    
    console.log("Publicando cenário:", cenarioData);
    navigate("/cenarios");
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Novo Cenário</h1>
          <p className="text-gray-600">Crie um novo cenário de simulação realística</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => navigate("/cenarios")}>
            Cancelar
          </Button>
          <Button variant="outline" onClick={salvarRascunho}>
            <Save className="w-4 h-4 mr-2" />
            Salvar Rascunho
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="identificacao" className="relative">
            <div className="flex items-center gap-2">
              {getTabStatus("identificacao") === "completo" && <CheckCircle className="h-3 w-3" />}
              {getTabStatus("identificacao") === "incompleto" && <AlertCircle className="h-3 w-3" />}
              Identificação
            </div>
          </TabsTrigger>
          <TabsTrigger value="objetivos" className="relative">
            <div className="flex items-center gap-2">
              {getTabStatus("objetivos") === "completo" && <CheckCircle className="h-3 w-3" />}
              {getTabStatus("objetivos") === "incompleto" && <AlertCircle className="h-3 w-3" />}
              Objetivos
            </div>
          </TabsTrigger>
          <TabsTrigger value="paciente" className="relative">
            <div className="flex items-center gap-2">
              {getTabStatus("paciente") === "completo" && <CheckCircle className="h-3 w-3" />}
              {getTabStatus("paciente") === "incompleto" && <AlertCircle className="h-3 w-3" />}
              Paciente
            </div>
          </TabsTrigger>
          <TabsTrigger value="frames" className="relative">
            <div className="flex items-center gap-2">
              {getTabStatus("frames") === "completo" && <CheckCircle className="h-3 w-3" />}
              {getTabStatus("frames") === "incompleto" && <AlertCircle className="h-3 w-3" />}
              Frames
            </div>
          </TabsTrigger>
          <TabsTrigger value="materiais" className="relative">
            <div className="flex items-center gap-2">
              {getTabStatus("materiais") === "completo" && <CheckCircle className="h-3 w-3" />}
              {getTabStatus("materiais") === "incompleto" && <AlertCircle className="h-3 w-3" />}
              Materiais
            </div>
          </TabsTrigger>
          <TabsTrigger value="debriefing" className="relative">
            <div className="flex items-center gap-2">
              {getTabStatus("debriefing") === "completo" && <CheckCircle className="h-3 w-3" />}
              {getTabStatus("debriefing") === "incompleto" && <AlertCircle className="h-3 w-3" />}
              Debriefing
            </div>
          </TabsTrigger>
          <TabsTrigger value="revisao">
            <div className="flex items-center gap-2">
              <Eye className="h-3 w-3" />
              Revisão
            </div>
          </TabsTrigger>
        </TabsList>

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
          <FramesTab frames={frames} onFramesChange={(newFrames) => setFrames(newFrames)} />
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

        {/* Navegação entre abas */}
        <div className="flex justify-between">
          <Button 
            variant="outline" 
            onClick={() => {
              const tabs = ["identificacao", "objetivos", "paciente", "frames", "materiais", "debriefing", "revisao"];
              const currentIndex = tabs.indexOf(activeTab);
              if (currentIndex > 0) {
                setActiveTab(tabs[currentIndex - 1]);
              }
            }}
            disabled={activeTab === "identificacao"}
          >
            Anterior
          </Button>
          
          <Button 
            onClick={() => {
              const tabs = ["identificacao", "objetivos", "paciente", "frames", "materiais", "debriefing", "revisao"];
              const currentIndex = tabs.indexOf(activeTab);
              if (currentIndex < tabs.length - 1) {
                setActiveTab(tabs[currentIndex + 1]);
              }
            }}
            disabled={activeTab === "revisao"}
          >
            Próximo
          </Button>
        </div>
      </Tabs>
    </div>
  );
};

export default NovoCenario;
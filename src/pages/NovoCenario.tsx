"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Sparkles, Plus, X, Save, Eye, AlertCircle, CheckCircle, Package, Users, MessageSquare } from "lucide-react";
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { cn } from "@/lib/utils";
import FramesTab from "@/components/cenario/FramesTab";

// Frame interface matching FramesTab expectations
interface Frame {
  id: string;
  ordem: number;
  nomeEtapa: string;
  frameIdentifier: string;
  durationEstimateMin?: number;
  participantType?: string;
  
  // Parâmetros fisiológicos principais
  fc?: number;
  fc_tooltip?: string;
  ecgDescription?: string;
  ecgDescription_tooltip?: string;
  pulse?: number;
  pulse_tooltip?: string;
  satO2?: number;
  satO2_tooltip?: string;
  paSistolica?: number;
  paSistolica_tooltip?: string;
  paDiastolica?: number;
  paDiastolica_tooltip?: string;
  paMedia?: number;
  paMedia_tooltip?: string;
  papSistolica?: number;
  papSistolica_tooltip?: string;
  papDiastolica?: number;
  papDiastolica_tooltip?: string;
  papMedia?: number;
  papMedia_tooltip?: string;
  wpMedia?: number;
  wpMedia_tooltip?: string;
  cvpMedia?: number;
  cvpMedia_tooltip?: string;
  co?: number;
  co_tooltip?: string;
  
  // Parâmetros respiratórios
  fr?: number;
  fr_tooltip?: string;
  etCO2?: number;
  etCO2_tooltip?: string;
  iCO2?: number;
  iCO2_tooltip?: string;
  inO2?: number;
  inO2_tooltip?: string;
  etO2?: number;
  etO2_tooltip?: string;
  
  // Temperatura
  temp?: number;
  temp_tooltip?: string;
  tblood?: number;
  tblood_tooltip?: string;
  
  // Neurológicos e outros
  icpMedia?: number;
  icpMedia_tooltip?: string;
  glicemia?: number;
  glicemia_tooltip?: string;
  pupilas?: string;
  pupilas_tooltip?: string;
  ph?: number;
  ph_tooltip?: string;
  inN2O?: number;
  inN2O_tooltip?: string;
  etN2O?: number;
  etN2O_tooltip?: string;
  anestheticAgent?: string;
  anestheticAgent_tooltip?: string;
  inAGT?: number;
  inAGT_tooltip?: string;
  etAGT?: number;
  etAGT_tooltip?: string;
  tofCount?: number;
  tofCount_tooltip?: string;
  tofRatio?: number;
  tofRatio_tooltip?: string;
  ptc?: number;
  ptc_tooltip?: string;
  
  // PANI
  paniSistolica?: number;
  paniSistolica_tooltip?: string;
  paniDiastolica?: number;
  paniDiastolica_tooltip?: string;
  paniMedia?: number;
  paniMedia_tooltip?: string;
  
  // Campos textuais
  otherFindings?: string;
  operatorInstructions?: string;
  expectedParticipantActions?: string;
  dynamicDescription?: string;
  otherParametersText?: string;
  
  isCompleto?: boolean;
  loadingIA?: boolean;
}

interface Checklist {
  id: string;
  titulo: string;
  tipo: "debriefing" | "materiais";
  secoes: Array<{
    titulo: string;
    itens: Array<{
      nome: string;
      quantidade?: string;
      checked?: boolean;
    }>;
  }>;
}

const NovoCenario = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("identificacao");
  const [palavrasChave, setPalavrasChave] = useState<string[]>([]);
  const [novaPalavra, setNovaPalavra] = useState("");
  
  // Frames state with proper Frame interface
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
  const [checklists, setChecklists] = useState<{
    debriefing: Checklist | null;
    materiais: Checklist | null;
  }>({
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

  const adicionarPalavraChave = () => {
    if (novaPalavra.trim() && !palavrasChave.includes(novaPalavra.trim())) {
      setPalavrasChave([...palavrasChave, novaPalavra.trim()]);
      setNovaPalavra("");
    }
  };

  const removerPalavraChave = (palavra: string) => {
    setPalavrasChave(palavrasChave.filter(p => p !== palavra));
  };

  const publicosAlvo = [
    "Residentes de Medicina",
    "Enfermeiros",
    "Médicos Emergencistas",
    "Estudantes de Medicina",
    "Equipe Multiprofissional",
    "Pediatras",
    "Cardiologistas"
  ];

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

  // Criar novo checklist
  const criarChecklist = (tipo: "debriefing" | "materiais") => {
    const novoChecklist: Checklist = {
      id: Date.now().toString(),
      titulo: tipo === "debriefing" ? "Checklist de Debriefing" : "Checklist de Materiais",
      tipo,
      secoes: [
        {
          titulo: tipo === "debriefing" ? "Aspectos Técnicos" : "Equipamentos",
          itens: []
        },
        {
          titulo: tipo === "debriefing" ? "Aspectos Não Técnicos" : "Medicamentos",
          itens: []
        }
      ]
    };
    
    setChecklists(prev => ({
      ...prev,
      [tipo]: novoChecklist
    }));
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
          <Card>
            <CardHeader>
              <CardTitle>Identificação do Cenário</CardTitle>
              <CardDescription>Informações básicas do cenário</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome do Cenário *</Label>
                  <Input 
                    id="nome" 
                    placeholder="Ex: Parada Cardiorrespiratória em AESP" 
                    value={formData.nome}
                    onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="publico">Público-Alvo *</Label>
                  <Select value={formData.publicoAlvo} onValueChange={(value) => setFormData(prev => ({ ...prev, publicoAlvo: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o público-alvo" />
                    </SelectTrigger>
                    <SelectContent>
                      {publicosAlvo.map((publico) => (
                        <SelectItem key={publico} value={publico}>{publico}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tempo">Tempo de Execução (minutos) *</Label>
                  <Input 
                    id="tempo" 
                    type="number" 
                    placeholder="Ex: 30" 
                    value={formData.tempoExecucao}
                    onChange={(e) => setFormData(prev => ({ ...prev, tempoExecucao: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tipo">Tipo de Simulação *</Label>
                  <Select value={formData.tipoSimulacao} onValueChange={(value) => setFormData(prev => ({ ...prev, tipoSimulacao: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="simulador">Simulador</SelectItem>
                      <SelectItem value="paciente">Paciente Padronizado</SelectItem>
                      <SelectItem value="ambos">Ambos</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="palavras-chave">Palavras-Chave</Label>
                <div className="flex gap-2">
                  <Input
                    value={novaPalavra}
                    onChange={(e) => setNovaPalavra(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), adicionarPalavraChave())}
                    placeholder="Digite uma palavra-chave"
                  />
                  <Button type="button" onClick={adicionarPalavraChave}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {palavrasChave.map((palavra) => (
                    <Badge key={palavra} variant="secondary" className="flex items-center gap-1">
                      {palavra}
                      <X className="w-3 h-3 cursor-pointer" onClick={() => removerPalavraChave(palavra)} />
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="descricao">Descrição do Cenário</Label>
                <Textarea 
                  id="descricao" 
                  placeholder="Descreva brevemente o cenário..."
                  rows={4}
                  value={formData.descricao}
                  onChange={(e) => setFormData(prev => ({ ...prev, descricao: e.target.value }))}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Aba Objetivos */}
        <TabsContent value="objetivos">
          <Card>
            <CardHeader>
              <CardTitle>Objetivos de Aprendizagem</CardTitle>
              <CardDescription>Defina os objetivos técnicos e não técnicos</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label>Objetivos Técnicos *</Label>
                  <Button variant="outline" size="sm">
                    <Sparkles className="w-4 h-4 mr-2" />
                    Sugerir com IA
                  </Button>
                </div>
                <Textarea 
                  placeholder="Ex: Realizar RCP de acordo com diretrizes AHA, Identificar ritmo de parada cardíaca..."
                  rows={4}
                  value={formData.objetivosTecnicos}
                  onChange={(e) => setFormData(prev => ({ ...prev, objetivosTecnicos: e.target.value }))}
                />
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label>Objetivos Não Técnicos *</Label>
                  <Button variant="outline" size="sm">
                    <Sparkles className="w-4 h-4 mr-2" />
                    Sugerir com IA
                  </Button>
                </div>
                <Textarea 
                  placeholder="Ex: Trabalho em<dyad-problem-report summary="28 problems">
<problem file="src/pages/NovoCenario.tsx" line="89" column="21" code="1005">',' expected.</problem>
<problem file="src/pages/NovoCenario.tsx" line="89" column="37" code="1005">';' expected.</problem>
<problem file="src/pages/NovoCenario.tsx" line="92" column="1" code="1128">Declaration or statement expected.</problem>
<problem file="src/pages/NovoCenario.tsx" line="93" column="2" code="17008">JSX element 'dyad-write' has no corresponding closing tag.</problem>
<problem file="src/pages/NovoCenario.tsx" line="103" column="11" code="1005">'&lt;/' expected.</problem>
<problem file="src/components/cenario/FramesTab.tsx" line="601" column="13" code="2322">Type 'string | number | true' is not assignable to type 'string | number | readonly string[]'.
  Type 'boolean' is not assignable to type 'string | number | readonly string[]'.</problem>
<problem file="src/pages/NovoCenario.tsx" line="89" column="22" code="2304">Cannot find name 'problem'.</problem>
<problem file="src/pages/NovoCenario.tsx" line="89" column="30" code="2552">Cannot find name 'report'. Did you mean 'Report'?</problem>
<problem file="src/pages/NovoCenario.tsx" line="89" column="37" code="2304">Cannot find name 'summary'.</problem>
<problem file="src/pages/NovoCenario.tsx" line="89" column="45" code="2365">Operator '&gt;' cannot be applied to types 'string' and 'Element'.</problem>
<problem file="src/pages/NovoCenario.tsx" line="90" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/pages/NovoCenario.tsx" line="91" column="82" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/pages/NovoCenario.tsx" line="92" column="3" code="2304">Cannot find name 'dyad'.</problem>
<problem file="src/pages/NovoCenario.tsx" line="92" column="3" code="2365">Operator '&gt;' cannot be applied to types 'number' and 'Element'.</problem>
<problem file="src/pages/NovoCenario.tsx" line="92" column="8" code="2304">Cannot find name 'problem'.</problem>
<problem file="src/pages/NovoCenario.tsx" line="92" column="16" code="2552">Cannot find name 'report'. Did you mean 'Report'?</problem>
<problem file="src/pages/NovoCenario.tsx" line="93" column="1" code="2339">Property 'dyad-write' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/pages/NovoCenario.tsx" line="95" column="18" code="2304">Cannot find name 'param'.</problem>
<problem file="src/pages/NovoCenario.tsx" line="95" column="31" code="2552">Cannot find name 'frame'. Did you mean 'frames'?</problem>
<problem file="src/pages/NovoCenario.tsx" line="96" column="17" code="2304">Cannot find name 'param'.</problem>
<problem file="src/pages/NovoCenario.tsx" line="96" column="39" code="2304">Cannot find name 'param'.</problem>
<problem file="src/pages/NovoCenario.tsx" line="97" column="16" code="2304">Cannot find name 'param'.</problem>
<problem file="src/pages/NovoCenario.tsx" line="98" column="16" code="2304">Cannot find name 'param'.</problem>
<problem file="src/pages/NovoCenario.tsx" line="99" column="17" code="2304">Cannot find name 'param'.</problem>
<problem file="src/pages/NovoCenario.tsx" line="100" column="18" code="2304">Cannot find name 'value'.</problem>
<problem file="src/pages/NovoCenario.tsx" line="101" column="28" code="2304">Cannot find name 'onUpdate'.</problem>
<problem file="src/pages/NovoCenario.tsx" line="101" column="37" code="2304">Cannot find name 'param'.</problem>
<problem file="src/App.tsx" line="11" column="8" code="1192">Module '&quot;C:/Users/danil/dyad-apps/SimLab Manager/src/pages/NovoCenario&quot;' has no default export.</problem>
</dyad-problem-report>
<dyad-write path="src/components/cenario/FramesTab.tsx" description="Fixing all TypeScript errors in FramesTab component">
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { 
  Plus, 
  Trash2, 
  GripVertical, 
  Sparkles, 
  Copy, 
  ChevronDown,
  ChevronUp,
  AlertCircle,
  CheckCircle,
  Clock,
  Activity,
  Heart,
  Thermometer,
  Wind,
  Gauge,
  Loader2,
  Info,
  Zap,
  Brain,
  Droplets,
  Eye,
  Target,
  Play,
  Pause
} from "lucide-react";
import { useState, useCallback, useMemo } from "react";
import { cn } from "@/lib/utils";

interface Frame {
  id: string;
  ordem: number;
  nomeEtapa: string;
  frameIdentifier: string;
  durationEstimateMin?: number;
  participantType?: string;
  
  // Parâmetros fisiológicos principais
  fc?: number;
  fc_tooltip?: string;
  ecgDescription?: string;
  ecgDescription_tooltip?: string;
  pulse?: number;
  pulse_tooltip?: string;
  satO2?: number;
  satO2_tooltip?: string;
  paSistolica?: number;
  paSistolica_tooltip?: string;
  paDiastolica?: number;
  paDiastolica_tooltip?: string;
  paMedia?: number;
  paMedia_tooltip?: string;
  papSistolica?: number;
  papSistolica_tooltip?: string;
  papDiastolica?: number;
  papDiastolica_tooltip?: string;
  papMedia?: number;
  papMedia_tooltip?: string;
  wpMedia?: number;
  wpMedia_tooltip?: string;
  cvpMedia?: number;
  cvpMedia_tooltip?: string;
  co?: number;
  co_tooltip?: string;
  
  // Parâmetros respiratórios
  fr?: number;
  fr_tooltip?: string;
  etCO2?: number;
  etCO2_tooltip?: string;
  iCO2?: number;
  iCO2_tooltip?: string;
  inO2?: number;
  inO2_tooltip?: string;
  etO2?: number;
  etO2_tooltip?: string;
  
  // Temperatura
  temp?: number;
  temp_tooltip?: string;
  tblood?: number;
  tblood_tooltip?: string;
  
  // Neurológicos e outros
  icpMedia?: number;
  icpMedia_tooltip?: string;
  glicemia?: number;
  glicemia_tooltip?: string;
  pupilas?: string;
  pupilas_tooltip?: string;
  ph?: number;
  ph_tooltip?: string;
  inN2O?: number;
  inN2O_tooltip?: string;
  etN2O?: number;
  etN2O_tooltip?: string;
  anestheticAgent?: string;
  anestheticAgent_tooltip?: string;
  inAGT?: number;
  inAGT_tooltip?: string;
  etAGT?: number;
  etAGT_tooltip?: string;
  tofCount?: number;
  tofCount_tooltip?: string;
  tofRatio?: number;
  tofRatio_tooltip?: string;
  ptc?: number;
  ptc_tooltip?: string;
  
  // PANI
  paniSistolica?: number;
  paniSistolica_tooltip?: string;
  paniDiastolica?: number;
  paniDiastolica_tooltip?: string;
  paniMedia?: number;
  paniMedia_tooltip?: string;
  
  // Campos textuais
  otherFindings?: string;
  operatorInstructions?: string;
  expectedParticipantActions?: string;
  dynamicDescription?: string;
  otherParametersText?: string;
  
  isCompleto?: boolean;
  loadingIA?: boolean;
}

interface FramesTabProps {
  frames: Frame[];
  onFramesChange: (frames: Frame[]) => void;
}

const FramesTab = ({ frames, onFramesChange }: FramesTabProps) => {
  const [frameExpandido, setFrameExpandido] = useState<string | null>(frames[0]?.id || null);
  const [filtroStatus, setFiltroStatus] = useState<'todos' | 'completos' | 'incompletos'>('todos');

  // Estatísticas dos frames
  const stats = useMemo(() => {
    const completos = frames.filter(f => f.isCompleto).length;
    const incompletos = frames.length - completos;
    const duracaoTotal = frames.reduce((acc, f) => acc + (f.durationEstimateMin || 0), 0);
    
    return {
      total: frames.length,
      completos,
      incompletos,
      duracaoTotal,
      percentualCompleto: frames.length > 0 ? Math.round((completos / frames.length) * 100) : 0
    };
  }, [frames]);

  // Frames filtrados
  const framesFiltrados = useMemo(() => {
    return frames.filter(frame => {
      if (filtroStatus === 'completos') return frame.isCompleto;
      if (filtroStatus === 'incompletos') return !frame.isCompleto;
      return true;
    });
  }, [frames, filtroStatus]);

  const adicionarFrame = useCallback(() => {
    const novoFrame: Frame = {
      id: Date.now().toString(),
      ordem: frames.length + 1,
      nomeEtapa: `Frame ${frames.length + 1}`,
      frameIdentifier: (frames.length + 1).toString(),
      durationEstimateMin: 5,
      participantType: "Simulador",
      isCompleto: false
    };
    
    const novosFrames = [...frames, novoFrame];
    onFramesChange(novosFrames);
    setFrameExpandido(novoFrame.id);
  }, [frames, onFramesChange]);

  const removerFrame = useCallback((id: string) => {
    if (frames.length <= 1) return;
    
    const novosFrames = frames
      .filter(frame => frame.id !== id)
      .map((frame, index) => ({ ...frame, ordem: index + 1 }));
    
    onFramesChange(novosFrames);
    
    if (frameExpandido === id) {
      setFrameExpandido(novosFrames[0]?.id || null);
    }
  }, [frames, onFramesChange, frameExpandido]);

  const duplicarFrame = useCallback((frameOriginal: Frame) => {
    const novoFrame: Frame = {
      ...frameOriginal,
      id: Date.now().toString(),
      ordem: frames.length + 1,
      nomeEtapa: `${frameOriginal.nomeEtapa} (Cópia)`,
      frameIdentifier: (frames.length + 1).toString(),
      isCompleto: false
    };
    
    const novosFrames = [...frames, novoFrame];
    onFramesChange(novosFrames);
    setFrameExpandido(novoFrame.id);
  }, [frames, onFramesChange]);

  const atualizarFrame = useCallback((id: string, campo: string, valor: any) => {
    const novosFrames = frames.map(frame => {
      if (frame.id === id) {
        const frameAtualizado = { ...frame, [campo]: valor };
        
        // Auto-validação de completude
        if (campo !== 'loadingIA') {
          frameAtualizado.isCompleto = validarCompletudeFrame(frameAtualizado);
        }
        
        return frameAtualizado;
      }
      return frame;
    });
    
    onFramesChange(novosFrames);
  }, [frames, onFramesChange]);

  // Função de sugestão de IA com tratamento de erro robusto
  const sugerirParametrosComIA = useCallback(async (frameId: string, contexto: string) => {
    const frame = frames.find(f => f.id === frameId);
    if (!frame) return;

    // Mostrar loading
    atualizarFrame(frameId, 'loadingIA', true);

    try {
      // Simular chamada à API com tratamento de erro
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Mock de sugestões para evitar erro da API
      const sugestoes = {
        inicial: { 
          fc: 80, satO2: 98, paSistolica: 120, paDiastolica: 80, fr: 16, temp: 36.5,
          ecgDescription: "Ritmo sinusal regular",
          otherFindings: "Paciente consciente, orientado, sem sinais de desconforto aparente. Responde adequadamente às perguntas.",
          operatorInstructions: "Manter paciente em estado basal. Aguardar avaliação primária da equipe. Permitir que realizem anamnese completa.",
          expectedParticipantActions: "Realizar avaliação ABCDE. Verificar sinais vitais. Obter histórico médico.",
          durationEstimateMin: 5
        },
        deterioracao: { 
          fc: 120, satO2: 88, paSistolica: 90, paDiastolica: 60, fr: 24, temp: 37.8,
          ecgDescription: "Taquicardia sinusal com ectopias ventriculares ocasionais",
          otherFindings: "Paciente apresenta dispneia, sudorese, ansiedade. Queixa-se de dor precordial. Pele pálida e úmida.",
          operatorInstructions: "Iniciar sinais de desconforto respiratório. Adicionar sons respiratórios reduzidos. Preparar para deterioração hemodinâmica.",
          expectedParticipantActions: "Reconhecer sinais de deterioração. Iniciar oxigenoterapia. Preparar para suporte avançado de vida.",
          durationEstimateMin: 8
        },
        critico: { 
          fc: 40, satO2: 70, paSistolica: 60, paDiastolica: 40, fr: 8, temp: 35.2,
          ecgDescription: "Bradicardia sinusal com bloqueio AV de primeiro grau",
          otherFindings: "Paciente inconsciente, cianótico, pulso fraco e irregular. Não responde a estímulos verbais. Pupilas midriáticas e não reagentes.",
          operatorInstructions: "Ativar parada cardiorrespiratória. Manter sinais de ausência de pulso e respiração. Preparar para RCP.",
          expectedParticipantActions: "Iniciar RCP imediatamente. Chamar ajuda. Preparar DEA. Verificar via aérea.",
          durationEstimateMin: 10
        },
        recuperacao: { 
          fc: 100, satO2: 94, paSistolica: 110, paDiastolica: 70, fr: 18, temp: 36.8,
          ecgDescription: "Ritmo sinusal regular com frequência normal",
          otherFindings: "Paciente retorna à consciência gradualmente. Ainda apresenta certa confusão mental. Melhora da coloração da pele.",
          operatorInstructions: "Restaurar sinais vitais estáveis. Manter paciente consciente mas sonolento. Responder a estímulos verbais.",
          expectedParticipantActions: "Monitorar sinais vitais. Avaliar nível de consciência. Preparar para transporte. Documentar eventos.",
          durationEstimateMin: 7
        }
      };

      const sugestao = sugestoes[contexto as keyof typeof sugestoes] || sugestoes.inicial;
      
      // Aplicar sugestões
      Object.entries(sugestao).forEach(([campo, valor]) => {
        atualizarFrame(frameId, campo, valor);
      });

    } catch (error) {
      console.error("Erro ao gerar sugestão com IA:", error);
      
      // Fallback com valores padrão
      const fallbackSugestao = {
        fc: 80,
        satO2: 98,
        paSistolica: 120,
        paDiastolica: 80,
        fr: 16,
        temp: 36.5,
        ecgDescription: "Ritmo sinusal regular",
        otherFindings: "Paciente em estado estável. Aguardar avaliação da equipe.",
        operatorInstructions: "Observar procedimentos padrão da equipe.",
        expectedParticipantActions: "Realizar avaliação inicial.",
        durationEstimateMin: 5
      };

      Object.entries(fallbackSugestao).forEach(([campo, valor]) => {
        atualizarFrame(frameId, campo, valor);
      });

    } finally {
      // Remover loading
      atualizarFrame(frameId, 'loadingIA', false);
    }
  }, [frames, atualizarFrame]);

  const validarCompletudeFrame = (frame: Frame): boolean => {
    return !!(
      frame.nomeEtapa?.trim() &&
      frame.frameIdentifier?.trim() &&
      (frame.fc || frame.satO2 || frame.paSistolica)
    );
  };

  // Configurações dos parâmetros médicos
  const parametrosConfig = {
    circulacao: [
      { key: 'fc', label: 'FC', unit: 'bpm', icon: Heart, tooltip: 'Frequência Cardíaca', color: 'text-red-500' },
      { key: 'pulse', label: 'Pulso', unit: 'bpm', icon: Heart, tooltip: 'Pulso periférico', color: 'text-red-400' },
      { key: 'satO2', label: 'SatO₂', unit: '%', icon: Wind, tooltip: 'Saturação de O₂', color: 'text-blue-500' },
      { key: 'paSistolica', label: 'PA Sist', unit: 'mmHg', icon: Gauge, tooltip: 'PA Sistólica', color: 'text-purple-500' },
      { key: 'paDiastolica', label: 'PA Diast', unit: 'mmHg', icon: Gauge, tooltip: 'PA Diastólica', color: 'text-purple-400' },
      { key: 'paMedia', label: 'PA Média', unit: 'mmHg', icon: Gauge, tooltip: 'PA Média', color: 'text-purple-600' },
    ],
    invasiva: [
      { key: 'papSistolica', label: 'PAP Sist', unit: 'mmHg', icon: Gauge, tooltip: 'Pressão Arterial Pulmonar Sistólica', color: 'text-pink-500' },
      { key: 'papDiastolica', label: 'PAP Diast', unit: 'mmHg', icon: Gauge, tooltip: 'Pressão Arterial Pulmonar Diastólica', color: 'text-pink-400' },
      { key: 'papMedia', label: 'PAP Média', unit: 'mmHg', icon: Gauge, tooltip: 'Pressão Arterial Pulmonar Média', color: 'text-pink-600' },
      { key: 'wpMedia', label: 'PCP', unit: 'mmHg', icon: Droplets, tooltip: 'Pressão Capilar Pulmonar', color: 'text-cyan-500' },
      { key: 'cvpMedia', label: 'PVC', unit: 'mmHg', icon: Activity, tooltip: 'Pressão Venosa Central', color: 'text-indigo-500' },
      { key: 'co', label: 'DC', unit: 'L/min', icon: Heart, tooltip: 'Débito Cardíaco', color: 'text-red-600' },
    ],
    respiratoria: [
      { key: 'fr', label: 'FR', unit: 'rpm', icon: Wind, tooltip: 'Frequência Respiratória', color: 'text-green-500' },
      { key: 'etCO2', label: 'etCO₂', unit: 'mmHg', icon: Wind, tooltip: 'CO₂ Expirado Final', color: 'text-teal-500' },
      { key: 'iCO2', label: 'FiCO₂', unit: '%', icon: Wind, tooltip: 'Fração Inspirada de CO₂', color: 'text-gray-500' },
      { key: 'inO2', label: 'FiO₂', unit: '%', icon: Wind, tooltip: 'Fração Inspirada de O₂', color: 'text-blue-400' },
    ],
    temperatura: [
      { key: 'temp', label: 'Temp', unit: '°C', icon: Thermometer, tooltip: 'Temperatura Periférica', color: 'text-orange-500' },
      { key: 'tblood', label: 'T Sang', unit: '°C', icon: Thermometer, tooltip: 'Temperatura Sanguínea', color: 'text-red-500' },
    ],
    neurologia: [
      { key: 'icpMedia', label: 'PIC', unit: 'mmHg', icon: Brain, tooltip: 'Pressão Intracraniana', color: 'text-purple-700' },
      { key: 'glicemia', label: 'Glicemia', unit: 'mg/dL', icon: Droplets, tooltip: 'Glicemia Capilar', color: 'text-yellow-600' },
      { key: 'pupilas', label: 'Pupilas', unit: '', icon: Eye, tooltip: 'Estado das Pupilas', color: 'text-gray-600' },
    ],
    gases: [
      { key: 'ph', label: 'pH', unit: '', icon: Activity, tooltip: 'pH Arterial', color: 'text-green-600' },
      { key: 'inN2O', label: 'FiN₂O', unit: '%', icon: Wind, tooltip: 'Fração Inspirada de N₂O', color: 'text-purple-400' },
      { key: 'anestheticAgent', label: 'Agente', unit: '', icon: Zap, tooltip: 'Agente Anestésico', color: 'text-indigo-400' },
      { key: 'inAGT', label: 'FiAGT', unit: '%', icon: Droplets, tooltip: 'Fração Inspirada de Agente', color: 'text-blue-600' },
      { key: 'tofCount', label: 'TOF', unit: '/4', icon: Zap, tooltip: 'Train-of-Four Count', color: 'text-yellow-500' },
      { key: 'tofRatio', label: 'TOF%', unit: '%', icon: Zap, tooltip: 'Train-of-Four Ratio', color: 'text-orange-600' },
    ],
    pani: [
      { key: 'paniSistolica', label: 'PANI Sist', unit: 'mmHg', icon: Gauge, tooltip: 'PA Não Invasiva Sistólica', color: 'text-blue-600' },
      { key: 'paniDiastolica', label: 'PANI Diast', unit: 'mmHg', icon: Gauge, tooltip: 'PA Não Invasiva Diastólica', color: 'text-blue-500' },
      { key: 'paniMedia', label: 'PANI Média', unit: 'mmHg', icon: Gauge, tooltip: 'PA Não Invasiva Média', color: 'text-blue-700' },
    ]
  };

  return (
    <TooltipProvider>
      <div className="space-y-6">
        {/* Header com Estatísticas */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-primary" />
                  Frames do Cenário
                </CardTitle>
                <CardDescription>
                  Defina a progressão fisiológica e comportamental do caso clínico
                </CardDescription>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Label className="text-sm">Filtro:</Label>
                  <Select value={filtroStatus} onValueChange={(value: 'todos' | 'completos' | 'incompletos') => setFiltroStatus(value)}>
                    <SelectTrigger className="w-36">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos</SelectItem>
                      <SelectItem value="completos">Completos</SelectItem>
                      <SelectItem value="incompletos">Incompletos</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
            {/* Estatísticas */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
                <div className="text-sm text-blue-600">Total</div>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{stats.completos}</div>
                <div className="text-sm text-green-600">Completos</div>
              </div>
              <div className="text-center p-3 bg-yellow-50 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600">{stats.incompletos}</div>
                <div className="text-sm text-yellow-600">Incompletos</div>
              </div>
              <div className="text-center p-3 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">{stats.duracaoTotal}min</div>
                <div className="text-sm text-purple-600">Duração</div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-gray-600">{stats.percentualCompleto}%</div>
                <div className="text-sm text-gray-600">Progresso</div>
              </div>
            </div>

            {/* Barra de Progresso */}
            <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${stats.percentualCompleto}%` }}
              />
            </div>

            {/* Controles */}
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Badge variant={frames.length >= 3 ? "default" : "destructive"}>
                  {frames.length} frames
                </Badge>
                {frames.length < 3 && (
                  <Badge variant="outline" className="text-yellow-600 border-yellow-600">
                    Mínimo: 3 frames
                  </Badge>
                )}
              </div>
              
              <Button onClick={adicionarFrame} disabled={frames.length >= 10}>
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Frame
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Lista de Frames */}
        <div className="space-y-4">
          {framesFiltrados.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">
                  {filtroStatus === 'todos' 
                    ? "Nenhum frame criado ainda. Clique em 'Adicionar Frame' para começar."
                    : `Nenhum frame ${filtroStatus === 'completos' ? 'completo' : 'incompleto'} encontrado.`
                  }
                </p>
              </CardContent>
            </Card>
          ) : (
            framesFiltrados.map((frame, index) => (
              <FrameCard
                key={frame.id}
                frame={frame}
                index={index}
                totalFrames={frames.length}
                isExpanded={frameExpandido === frame.id}
                onToggleExpand={() => setFrameExpandido(frameExpandido === frame.id ? null : frame.id)}
                onUpdate={(campo, valor) => atualizarFrame(frame.id, campo, valor)}
                onRemove={() => removerFrame(frame.id)}
                onDuplicate={() => duplicarFrame(frame)}
                onIASuggest={(contexto) => sugerirParametrosComIA(frame.id, contexto)}
                parametrosConfig={parametrosConfig}
              />
            ))
          )}
        </div>

        {/* Validação Geral */}
        {frames.length > 0 && (
          <Card className={cn(
            "border-2",
            frames.length >= 3 && stats.completos >= 3 
              ? "border-green-200 bg-green-50" 
              : "border-yellow-200 bg-yellow-50"
          )}>
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                {frames.length >= 3 && stats.completos >= 3 ? (
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                )}
                <div>
                  <h4 className="font-medium">
                    {frames.length >= 3 && stats.completos >= 3 
                      ? "Frames configurados corretamente!" 
                      : "Atenção necessária"
                    }
                  </h4>
                  <div className="text-sm text-gray-600 mt-1">
                    {frames.length < 3 && (
                      <p>• É necessário ter pelo menos 3 frames para o cenário</p>
                    )}
                    {stats.incompletos > 0 && (
                      <p>• {stats.incompletos} frame(s) precisam ser completados</p>
                    )}
                    {frames.length >= 3 && stats.completos >= 3 && (
                      <p>• Todos os requisitos mínimos foram atendidos</p>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </TooltipProvider>
  );
};

// Componente individual de Frame otimizado
interface FrameCardProps {
  frame: Frame;
  index: number;
  totalFrames: number;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onUpdate: (campo: string, valor: any) => void;
  onRemove: () => void;
  onDuplicate: () => void;
  onIASuggest: (contexto: string) => void;
  parametrosConfig: any;
}

const FrameCard = ({ 
  frame, 
  index, 
  totalFrames, 
  isExpanded, 
  onToggleExpand,
  onUpdate, 
  onRemove, 
  onDuplicate,
  onIASuggest,
  parametrosConfig
}: FrameCardProps) => {
  const contextosIA = [
    { value: "inicial", label: "Estado Inicial", icon: "🟢" },
    { value: "deterioracao", label: "Deterioração", icon: "🟡" },
    { value: "critico", label: "Estado Crítico", icon: "🔴" },
    { value: "recuperacao", label: "Recuperação", icon: "🔵" }
  ];

  const renderParameterInput = (param: any, frame: Frame) => {
    const IconComponent = param.icon;
    const value = frame[param.key as keyof Frame];
    const tooltipValue = frame[`${param.key}_tooltip` as keyof Frame];

    return (
      <div key={param.key} className="space-y-2">
        <Label htmlFor={`${param.key}-${frame.id}`} className="flex items-center gap-1">
          <IconComponent className={cn("h-3 w-3", param.color)} />
          {param.label}
          {tooltipValue && (
            <Tooltip>
              <TooltipTrigger>
                <Info className="h-3 w-3 text-gray-400" />
              </TooltipTrigger>
              <TooltipContent>
                <p>{tooltipValue as string}</p>
              </TooltipContent>
            </Tooltip>
          )}
        </Label>
        <div className="relative">
          <Input
            id={`${param.key}-${frame.id}`}
            type={param.unit === '%' || param.key === 'ph' ? "number" : "text"}
            min={param.unit === '%' ? 0 : undefined}
            max={param.unit === '%' ? 100 : undefined}
            step={param.key === 'ph' ? 0.01 : undefined}
            value={value || ''}
            onChange={(e) => onUpdate(param.key, e.target.value)}
            className="pr-12"
          />
          {param.unit && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-500">
              {param.unit}
            </span>
          )}
        </div>
      </div>
    );
  };

  return (
    <Card className={cn(
      "transition-all duration-200",
      frame.isCompleto ? "border-green-200 shadow-sm" : "border-yellow-200",
      isExpanded && "shadow-lg"
    )}>
      {/* Cabeçalho do Frame */}
      <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-gray-50 to-white">
        <div className="flex items-center space-x-3">
          <Tooltip>
            <TooltipTrigger>
              <GripVertical className="h-4 w-4 text-gray-400 cursor-move hover:text-gray-600" />
            </TooltipTrigger>
            <TooltipContent>Arrastar para reordenar</TooltipContent>
          </Tooltip>
            
          <Badge variant={frame.isCompleto ? "default" : "secondary"} className="flex items-center gap-1">
            {frame.isCompleto ? <CheckCircle className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
            Frame {frame.ordem}
          </Badge>
          
          <Input
            value={frame.nomeEtapa}
            onChange={(e) => onUpdate('nomeEtapa', e.target.value)}
            placeholder="Nome da etapa (ex: Estado Inicial)"
            className="w-64 font-medium"
          />
          
          <Input
            value={frame.frameIdentifier || ''}
            onChange={(e) => onUpdate('frameIdentifier', e.target.value)}
            placeholder="ID (ex: 1, 2A, Piora)"
            className="w-24"
          />
          
          {frame.durationEstimateMin && (
            <Badge variant="outline" className="text-xs">
              {frame.durationEstimateMin}min
            </Badge>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          {/* Sugestão de IA */}
          <Select onValueChange={onIASuggest} disabled={frame.loadingIA}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder={frame.loadingIA ? "Gerando..." : "Sugerir com IA"} />
            </SelectTrigger>
            <SelectContent>
              {contextosIA.map(contexto => (
                <SelectItem key={contexto.value} value={contexto.value}>
                  <div className="flex items-center gap-2">
                    <span>{contexto.icon}</span>
                    <Sparkles className="h-3 w-3" />
                    {contexto.label}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          {frame.loadingIA && (
            <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
          )}
          
          {/* Ações */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={onDuplicate}>
                <Copy className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Duplicar frame</TooltipContent>
          </Tooltip>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleExpand}
          >
            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={onRemove}
                disabled={totalFrames <= 1}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Remover frame</TooltipContent>
          </Tooltip>
        </div>
      </div>

      {/* Conteúdo Expandido */}
      {isExpanded && (
        <div className="p-6 space-y-6">
          {/* Configurações Básicas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor={`duracao-${frame.id}`}>Duração Estimada (minutos)</Label>
              <Input
                id={`duracao-${frame.id}`}
                type="number"
                min="1"
                max="60"
                value={frame.durationEstimateMin || ''}
                onChange={(e) => onUpdate('durationEstimateMin', parseInt(e.target.value) || undefined)}
                placeholder="5"
              />
            </div>
            
            <div className="space-y-2">
              <Label>Tipo de Participante</Label>
              <Select value={frame.participantType} onValueChange={(value) => onUpdate('participantType', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Simulador">🤖 Simulador</SelectItem>
                  <SelectItem value="Paciente Padronizado">👤 Paciente Padronizado</SelectItem>
                  <SelectItem value="Staff">👥 Staff</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Separator />

          {/* Parâmetros Fisiológicos - Organizados por Sistema */}
          <div className="space-y-6">
            {/* Circulação */}
            <div>
              <h4 className="font-semibold mb-4 flex items-center gap-2">
                <Heart className="h-4 w-4 text-red-500" />
                Parâmetros de Circulação
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {parametrosConfig.circulacao.map(param => renderParameterInput(param, frame))}
              </div>
            </div>

            {/* Monitoração Invasiva */}
            <div>
              <h4 className="font-semibold mb-4 flex items-center gap-2">
                <Activity className="h-4 w-4 text-purple-500" />
                Monitoração Invasiva
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {parametrosConfig.invasiva.map(param => renderParameterInput(param, frame))}
              </div>
            </div>

            {/* Respiratórios */}
            <div>
              <h4 className="font-semibold mb-4 flex items-center gap-2">
                <Wind className="h-4 w-4 text-green-500" />
                Parâmetros Respiratórios
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-3 lg<dyad-problem-report summary="28 problems">
<problem file="src/pages/NovoCenario.tsx" line="89" column="21" code="1005">',' expected.</problem>
<problem file="src/pages/NovoCenario.tsx" line="89" column="37" code="1005">';' expected.</problem>
<problem file="src/pages/NovoCenario.tsx" line="92" column="1" code="1128">Declaration or statement expected.</problem>
<problem file="src/pages/NovoCenario.tsx" line="93" column="2" code="17008">JSX element 'dyad-write' has no corresponding closing tag.</problem>
<problem file="src/pages/NovoCenario.tsx" line="103" column="11" code="1005">'&lt;/' expected.</problem>
<problem file="src/components/cenario/FramesTab.tsx" line="601" column="13" code="2322">Type 'string | number | true' is not assignable to type 'string | number | readonly string[]'.
  Type 'boolean' is not assignable to type 'string | number | readonly string[]'.</problem>
<problem file="src/pages/NovoCenario.tsx" line="89" column="22" code="2304">Cannot find name 'problem'.</problem>
<problem file="src/pages/NovoCenario.tsx" line="89" column="30" code="2552">Cannot find name 'report'. Did you mean 'Report'?</problem>
<problem file="src/pages/NovoCenario.tsx" line="89" column="37" code="2304">Cannot find name 'summary'.</problem>
<problem file="src/pages/NovoCenario.tsx" line="89" column="45" code="2365">Operator '&gt;' cannot be applied to types 'string' and 'Element'.</problem>
<problem file="src/pages/NovoCenario.tsx" line="90" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/pages/NovoCenario.tsx" line="91" column="82" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/pages/NovoCenario.tsx" line="92" column="3" code="2304">Cannot find name 'dyad'.</problem>
<problem file="src/pages/NovoCenario.tsx" line="92" column="3" code="2365">Operator '&gt;' cannot be applied to types 'number' and 'Element'.</problem>
<problem file="src/pages/NovoCenario.tsx" line="92" column="8" code="2304">Cannot find name 'problem'.</problem>
<problem file="src/pages/NovoCenario.tsx" line="92" column="16" code="2552">Cannot find name 'report'. Did you mean 'Report'?</problem>
<problem file="src/pages/NovoCenario.tsx" line="93" column="1" code="2339">Property 'dyad-write' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/pages/NovoCenario.tsx" line="95" column="18" code="2304">Cannot find name 'param'.</problem>
<problem file="src/pages/NovoCenario.tsx" line="95" column="31" code="2552">Cannot find name 'frame'. Did you mean 'frames'?</problem>
<problem file="src/pages/NovoCenario.tsx" line="96" column="17" code="2304">Cannot find name 'param'.</problem>
<problem file="src/pages/NovoCenario.tsx" line="96" column="39" code="2304">Cannot find name 'param'.</problem>
<problem file="src/pages/NovoCenario.tsx" line="97" column="16" code="2304">Cannot find name 'param'.</problem>
<problem file="src/pages/NovoCenario.tsx" line="98" column="16" code="2304">Cannot find name 'param'.</problem>
<problem file="src/pages/NovoCenario.tsx" line="99" column="17" code="2304">Cannot find name 'param'.</problem>
<problem file="src/pages/NovoCenario.tsx" line="100" column="18" code="2304">Cannot find name 'value'.</problem>
<problem file="src/pages/NovoCenario.tsx" line="101" column="28" code="2304">Cannot find name 'onUpdate'.</problem>
<problem file="src/pages/NovoCenario.tsx" line="101" column="37" code="2304">Cannot find name 'param'.</problem>
<problem file="src/App.tsx" line="11" column="8" code="1192">Module '&quot;C:/Users/danil/dyad-apps/SimLab Manager/src/pages/NovoCenario&quot;' has no default export.</problem>
</dyad-problem-report>
<dyad-write path="src/pages/NovoCenario.tsx" description="Fixing all TypeScript errors in NovoCenario component">
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Sparkles, Plus, X, Save, Eye, AlertCircle, CheckCircle, Package, Users, MessageSquare } from "lucide-react";
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { cn } from "@/lib/utils";
import FramesTab from "@/components/cenario/FramesTab";

// Frame interface matching FramesTab expectations
interface Frame {
  id: string;
  ordem: number;
  nomeEtapa: string;
  frameIdentifier: string;
  durationEstimateMin?: number;
  participantType?: string;
  
  // Parâmetros fisiológicos principais
  fc?: number;
  fc_tooltip?: string;
  ecgDescription?: string;
  ecgDescription_tooltip?: string;
  pulse?: number;
  pulse_tooltip?: string;
  satO2?: number;
  satO2_tooltip?: string;
  paSistolica?: number;
  paSistolica_tooltip?: string;
  paDiastolica?: number;
  paDiastolica_tooltip?: string;
  paMedia?: number;
  paMedia_tooltip?: string;
  papSistolica?: number;
  papSistolica_tooltip?: string;
  papDiastolica?: number;
  papDiastolica_tooltip?: string;
  papMedia?: number;
  papMedia_tooltip?: string;
  wpMedia?: number;
  wpMedia_tooltip?: string;
  cvpMedia?: number;
  cvpMedia_tooltip?: string;
  co?: number;
  co_tooltip?: string;
  
  // Parâmetros respiratórios
  fr?: number;
  fr_tooltip?: string;
  etCO2?: number;
  etCO2_tooltip?: string;
  iCO2?: number;
  iCO2_tooltip?: string;
  inO2?: number;
  inO2_tooltip?: string;
  etO2?: number;
  etO2_tooltip?: string;
  
  // Temperatura
  temp?: number;
  temp_tooltip?: string;
  tblood?: number;
  tblood_tooltip?: string;
  
  // Neurológicos e outros
  icpMedia?: number;
  icpMedia_tooltip?: string;
  glicemia?: number;
  glicemia_tooltip?: string;
  pupilas?: string;
  pupilas_tooltip?: string;
  ph?: number;
  ph_tooltip?: string;
  inN2O?: number;
  inN2O_tooltip?: string;
  etN2O?: number;
  etN2O_tooltip?: string;
  anestheticAgent?: string;
  anestheticAgent_tooltip?: string;
  inAGT?: number;
  inAGT_tooltip?: string;
  etAGT?: number;
  etAGT_tooltip?: string;
  tofCount?: number;
  tofCount_tooltip?: string;
  tofRatio?: number;
  tofRatio_tooltip?: string;
  ptc?: number;
  ptc_tooltip?: string;
  
  // PANI
  paniSistolica?: number;
  paniSistolica_tooltip?: string;
  paniDiastolica?: number;
  paniDiastolica_tooltip?: string;
  paniMedia?: number;
  paniMedia_tooltip?: string;
  
  // Campos textuais
  otherFindings?: string;
  operatorInstructions?: string;
  expectedParticipantActions?: string;
  dynamicDescription?: string;
  otherParametersText?: string;
  
  isCompleto?: boolean;
  loadingIA?: boolean;
}

interface Checklist {
  id: string;
  titulo: string;
  tipo: "debriefing" | "materiais";
  secoes: Array<{
    titulo: string;
    itens: Array<{
      nome: string;
      quantidade?: string;
      checked?: boolean;
    }>;
  }>;
}

const NovoCenario = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("identificacao");
  const [palavrasChave, setPalavrasChave] = useState<string[]>([]);
  const [novaPalavra, setNovaPalavra] = useState("");
  
  // Frames state with proper Frame interface
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
  const [checklists, setChecklists] = useState<{
    debriefing: Checklist | null;
    materiais: Checklist | null;
  }>({
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

  const adicionarPalavraChave = () => {
    if (novaPalavra.trim() && !palavrasChave.includes(novaPalavra.trim())) {
      setPalavrasChave([...palavrasChave, novaPalavra.trim()]);
      setNovaPalavra("");
    }
  };

  const removerPalavraChave = (palavra: string) => {
    setPalavrasChave(palavrasChave.filter(p => p !== palavra));
  };

  const publicosAlvo = [
    "Residentes de Medicina",
    "Enfermeiros",
    "Médicos Emergencistas",
    "Estudantes de Medicina",
    "Equipe Multiprofissional",
    "Pediatras",
    "Cardiologistas"
  ];

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

  // Criar novo checklist
  const criarChecklist = (tipo: "debriefing" | "materiais") => {
    const novoChecklist: Checklist = {
      id: Date.now().toString(),
      titulo: tipo === "debriefing" ? "Checklist de Debriefing" : "Checklist de Materiais",
      tipo,
      secoes: [
        {
          titulo: tipo === "debriefing" ? "Aspectos Técnicos" : "Equipamentos",
          itens: []
        },
        {
          titulo: tipo === "debriefing" ? "Aspectos Não Técnicos" : "Medicamentos",
          itens: []
        }
      ]
    };
    
    setChecklists(prev => ({
      ...prev,
      [tipo]: novoChecklist
    }));
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
          <Card>
            <CardHeader>
              <CardTitle>Identificação do Cenário</CardTitle>
              <CardDescription>Informações básicas do cenário</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome do Cenário *</Label>
                  <Input 
                    id="nome" 
                    placeholder="Ex: Parada Cardiorrespiratória em AESP" 
                    value={formData.nome}
                    onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="publico">Público-Alvo *</Label>
                  <Select value={formData.publicoAlvo} onValueChange={(value) => setFormData(prev => ({ ...prev, publicoAlvo: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o público-alvo" />
                    </SelectTrigger>
                    <SelectContent>
                      {publicosAlvo.map((publico) => (
                        <SelectItem key={publico} value={publico}>{publico}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tempo">Tempo de Execução (minutos) *</Label>
                  <Input 
                    id="tempo" 
                    type="number" 
                    placeholder="Ex: 30" 
                    value={formData.tempoExecucao}
                    onChange={(e) => setFormData(prev => ({ ...prev, tempoExecucao: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tipo">Tipo de Simulação *</Label>
                  <Select value={formData.tipoSimulacao} onValueChange={(value) => setFormData(prev => ({ ...prev, tipoSimulacao: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="simulador">Simulador</SelectItem>
                      <SelectItem value="paciente">Paciente Padronizado</SelectItem>
                      <SelectItem value="ambos">Ambos</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="palavras-chave">Palavras-Chave</Label>
                <div className="flex gap-2">
                  <Input
                    value={novaPalavra}
                    onChange={(e) => setNovaPalavra(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), adicionarPalavraChave())}
                    placeholder="Digite uma palavra-chave"
                  />
                  <Button type="button" onClick={adicionarPalavraChave}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {palavrasChave.map((palavra) => (
                    <Badge key={palavra} variant="secondary" className="flex items-center gap-1">
                      {palavra}
                      <X className="w-3 h-3 cursor-pointer" onClick={() => removerPalavraChave(palavra)} />
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="descricao">Descrição do Cenário</Label>
                <Textarea 
                  id="descricao" 
                  placeholder="Descreva brevemente o cenário..."
                  rows={4}
                  value={formData.descricao}
                  onChange={(e) => setFormData(prev => ({ ...prev, descricao: e.target.value }))}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Aba Objetivos */}
        <TabsContent value="objetivos">
          <Card>
            <CardHeader>
              <CardTitle>Objetivos de Aprendizagem</CardTitle>
              <CardDescription>Defina os objetivos técnicos e não técnicos</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label>Objetivos Técnicos *</Label>
                  <Button variant="outline" size="sm">
                    <Sparkles className="w-4 h-4 mr-2" />
                    Sugerir com IA
                  </Button>
                </div>
                <Textarea 
                  placeholder="Ex: Realizar RCP de acordo com diretrizes AHA, Identificar ritmo de parada cardíaca..."
                  rows={4}
                  value={formData.objetivosTecnicos}
                  onChange={(e) => setFormData(prev => ({ ...prev, objetivosTecnicos: e.target.value }))}
                />
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label>Objetivos Não Técnicos *</Label>
                  <Button variant="outline" size="sm">
                    <Sparkles className="w-4 h-4 mr-2" />
                    Sugerir com IA
                  </Button>
                </div>
                <Textarea 
                  placeholder="Ex: Trabalho em equipe, Comunicação efetiva, Liderança..."
                  rows={4}
                  value={formData.objetivosNaoTecnicos}
                  onChange={(e) => setFormData(prev => ({ ...prev, objetivosNaoTecnicos: e.target.value }))}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Aba Paciente */}
        <TabsContent value="paciente">
          <Card>
            <CardHeader>
              <CardTitle>Perfil do Paciente</CardTitle>
              <CardDescription>Informações sobre o paciente simulado</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="nome-paciente">Nome do Paciente *</Label>
                  <Input 
                    id="nome-paciente" 
                    placeholder="Ex: João Silva" 
                    value={formData.nomePaciente}
                    onChange={(e) => setFormData(prev => ({ ...prev, nomePaciente: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="idade">Idade *</Label>
                  <Input 
                    id="idade" 
                    type="number" 
                    placeholder="Ex: 45" 
                    value={formData.idade}
                    onChange={(e) => setFormData(prev => ({ ...prev, idade: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sexo">Sexo *</Label>
                  <Select value={formData.sexo} onValueChange={(value) => setFormData(prev => ({ ...prev, sexo: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="M">Masculino</SelectItem>
                      <SelectItem value="F">Feminino</SelectItem>
                      <SelectItem value="O">Outro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label>Histórico Médico</Label>
                  <Button variant="outline" size="sm">
                    <Sparkles className="w-4 h-4 mr-2" />
                    Sugerir com IA
                  </Button>
                </div>
                <Textarea 
                  placeholder="Ex: HAS há 10 anos, DM tipo 2, tabagista, tabagista"
                  rows={4}
                  value={formData.historicoMedico}
                  onChange={(e) => setFormData(prev => ({ ...prev, historicoMedico: e.target.value }))}
                />
              </div>

              <Separator />

              <div className="space-y-4">
                <Label>Como o cenário inicia</Label>
                <Textarea 
                  placeholder="Descreva como o cenário começa, o cenário inicial, o que o participante encontra ao entrar..."
                  rows={3}
                  value={formData.comoInicia}
                  onChange={(e) => setFormData(prev => ({ ...prev, comoInicia: e.target.value }))}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Local da simulação</Label>
                  <Input 
                    placeholder="Ex: Sala A, Pronto-Socorro"
                    value={formData.localSimulacao}
                    onChange={(e) => setFormData(prev => ({ ...prev, localSimulacao: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Voluntários necessários</Label>
                  <Input 
                    placeholder="Ex: 2 voluntários"
                    value={formData.voluntarios}
                    onChange={(e) => setFormData(prev => ({ ...prev, voluntarios: e.target.value }))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Aba Frames */}
        <TabsContent value="frames">
          <FramesTab frames={frames} onFramesChange={(newFrames) => setFrames(newFrames)} />
        </TabsContent>

        {/* Aba Materiais */}
        <TabsContent value="materiais">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Checklist de Materiais
              </CardTitle>
              <CardDescription>
                Defina todos os materiais e equipamentos necessários para a simulação
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {!checklists.materiais ? (
                <div className="text-center py-8">
                  <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 mb-4">Nenhum checklist de materiais criado ainda</p>
                  <Button onClick={() => criarChecklist("materiais")}>
                    <Plus className="w-4 h-4 mr-2" />
                    Criar Checklist de Materiais
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium">{checklists.materiais.titulo}</h3>
                    <Button variant="outline" size="sm">
                      Editar Checklist
                    </Button>
                  </div>
                  
                  {checklists.materiais.secoes.map((secao, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <h4 className="font-medium mb-3">{secao.titulo}</h4>
                      <div className="space-y-2">
                        {secao.itens.length === 0 ? (
                          <p className="text-sm text-gray-500">Nenhum item adicionado</p>
                        ) : (
                          secao.itens.map((item, itemIndex) => (
                            <div key={itemIndex} className="flex items-center justify-between p-2 border rounded">
                              <span className="text-sm">{item.nome}</span>
                              {item.quantidade && (
                                <Badge variant="outline" className="text-xs">
                                  {item.quantidade}
                                </Badge>
                              )}
                            </div>
                          ))}
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Aba Debriefing */}
        <TabsContent value="debriefing">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Checklist de Debriefing
              </CardTitle>
              <CardDescription>
                Defina os pontos norteadores para a discussão pós-simulação
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {!checklists.debriefing ? (
                <div className="text-center py-8">
                  <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 mb-4">Nenhum checklist de debriefing criado ainda</p>
                  <Button onClick={() => criarChecklist("debriefing")}>
                    <Plus className="w-4 h-4 mr-2" />
                    Criar Checklist de Debriefing
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium">{checklists.debriefing.titulo}</h3>
                    <Button variant="outline" size="sm">
                      Editar Checklist
                    </Button>
                  </div>
                  
                  {checklists.debriefing.secoes.map((secao, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <h4 className="font-medium mb-3">{secao.titulo}</h4>
                      <div className="space-y-2">
                        {secao.itens.length === 0 ? (
                          <p className="text-sm text-gray-500">Nenhum item adicionado</p>
                        ) : (
                          secao.itens.map((item, itemIndex) => (
                            <div key={itemIndex} className="flex items-center justify-between p-2 border rounded">
                              <span className="text-sm">{item.nome}</span>
                              {item.checked && (
                                <CheckCircle className="h-4 w-4 text-green-600" />
                              )}
                            </div>
                          ))}
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Aba Revisão */}
        <TabsContent value="revisao">
          <Card>
            <CardHeader>
              <CardTitle>Revisão Final</CardTitle>
              <CardDescription>Revise todas as informações antes de publicar</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Resumo das informações */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-medium">Informações Básicas</h4>
                    <div className="space-y-2 text-sm">
                      <p><span className="font-medium">Nome:</span> {formData.nome || "Não definido"}</p>
                      <p><span className="font-medium">Público:</span> {formData.publicoAlvo || "Não definido"}</p>
                      <p><span className="font-medium">Tempo:</span> {formData.tempoExecucao || "Não definido"} min</p>
                      <p><span className="font-medium">Tipo:</span> {formData.tipoSimulacao || "Não definido"}</p>
                    </div>
                  
                  <div className="space-y-4">
                    <h4 className="font-medium">Estatísticas</h4>
                    <div className="space-y-2 text-sm">
                      <p><span className="font-medium">Frames:</span> {frames.length} ({frames.filter(f => f.isCompleto).length} completos)</p>
                      <p><span className="font-medium">Palavras-chave:</span> {palavrasChave.length}</p>
                      <p><span className="font-medium">Checklists:</span> {(checklists.materiais ? 1 : 0) + (checklists.debriefing ? 1 : 0)} criados</p>
                    </div>
                  </div>
                </div>

                {/* Status das abas */}
                <div className="space-y-4">
                  <h4 className="font-medium">Status das Seções</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {["identificacao", "objetivos", "paciente", "frames", "materiais", "debriefing"].map((aba) => (
                      <div key={aba} className="flex items-center gap-2 p-3 border rounded-lg">
                        {validarAba(aba) ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : (
                          <AlertCircle className="h-4 w-4 text-yellow-600" />
                        )}
                        <span className="text-sm capitalize">{aba}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Ações */}
                <div className="flex justify-end space-x-2 pt-4 border-t">
                  <Button variant="outline" onClick={salvarRascunho}>
                    <Save className="w-4 h-4 mr-2" />
                    Salvar Rascunho
                  </Button>
                  <Button onClick={publicarCenario}>
                    Publicar Cenário
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
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
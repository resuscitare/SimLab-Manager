"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  Heart,
  Thermometer,
  Gauge,
  Eye,
  MessageSquare,
  User,
  Wind,
  Brain,
  Droplet,
  Zap,
  TrendingUp,
  Activity
} from "lucide-react";
import { useState, useCallback, useMemo } from "react";
import { cn } from "@/lib/utils";
import { Frame, ParameterSet, FrameFormData } from "@/types/prisma";

interface PrismaFramesTabProps {
  frames: Frame[];
  onFramesChange: (frames: Frame[]) => void;
}

const PrismaFramesTab = ({ frames, onFramesChange }: PrismaFramesTabProps) => {
  const [frameExpandido, setFrameExpandido] = useState<string | null>(frames[0]?.id || null);
  const [filtroStatus, setFiltroStatus] = useState<'todos' | 'completos' | 'incompletos'>('todos');

  // Estatísticas dos frames
  const stats = useMemo(() => {
    const completos = frames.filter(f => f.parameterSet).length;
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
      if (filtroStatus === 'completos') return !!frame.parameterSet;
      if (filtroStatus === 'incompletos') return !frame.parameterSet;
      return true;
    });
  }, [frames, filtroStatus]);

  const adicionarFrame = useCallback(() => {
    const novoFrame: Frame = {
      id: Date.now().toString(),
      scenarioId: "temp", // Will be set when saving
      frameIdentifier: (frames.length + 1).toString(),
      title: `Frame ${frames.length + 1}`,
      durationEstimateMin: 5,
      participantType: "Simulador",
      operatorInstructions: [],
      expectedParticipantActions: [],
      sourceTransitions: [],
      targetTransitions: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const novosFrames = [...frames, novoFrame];
    onFramesChange(novosFrames);
    setFrameExpandido(novoFrame.id);
  }, [frames, onFramesChange]);

  const removerFrame = useCallback((id: string) => {
    if (frames.length <= 1) return;
    
    const novosFrames = frames
      .filter(frame => frame.id !== id)
      .map((frame, index) => ({ 
        ...frame, 
        frameIdentifier: (index + 1).toString() 
      }));
    
    onFramesChange(novosFrames);
    
    if (frameExpandido === id) {
      setFrameExpandido(novosFrames[0]?.id || null);
    }
  }, [frames, onFramesChange, frameExpandido]);

  const duplicarFrame = useCallback((frameOriginal: Frame) => {
    const novoFrame: Frame = {
      ...frameOriginal,
      id: Date.now().toString(),
      frameIdentifier: (frames.length + 1).toString(),
      title: `${frameOriginal.title} (Cópia)`,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const novosFrames = [...frames, novoFrame];
    onFramesChange(novosFrames);
    setFrameExpandido(novoFrame.id);
  }, [frames, onFramesChange]);

  const atualizarFrame = useCallback((id: string, campo: string, valor: any) => {
    const novosFrames = frames.map(frame => {
      if (frame.id === id) {
        return { ...frame, [campo]: valor, updatedAt: new Date() };
      }
      return frame;
    });
    
    onFramesChange(novosFrames);
  }, [frames, onFramesChange]);

  const atualizarParametro = useCallback((frameId: string, campo: string, valor: any) => {
    const novosFrames = frames.map(frame => {
      if (frame.id === frameId) {
        const parametrosAtuais = frame.parameterSet || {
          id: Date.now().toString(),
          frameId: frameId
        };
        
        const parametrosAtualizados = {
          ...parametrosAtuais,
          [campo]: valor
        };
        
        return { 
          ...frame, 
          parameterSet: parametrosAtualizados,
          updatedAt: new Date()
        };
      }
      return frame;
    });
    
    onFramesChange(novosFrames);
  }, [frames, onFramesChange]);

  const gerarSugestaoSinaisVitais = useCallback((frameId: string) => {
    // Simulação de sugestão de IA baseada no tipo de cenário
    const sugestoes: Partial<ParameterSet> = {
      // Parâmetros Circulatórios
      FC: 85,
      Pulse: 85,
      SatO2: 94,
      PASist: 120,
      PADiast: 80,
      PAMean: 93,
      PANISist: 125,
      PANIDiast: 85,
      PANIMean: 98,
      PAPSist: 25,
      PAPDiast: 12,
      PAPMean: 16,
      WPMean: 12,
      CVPMean: 8,
      CO: 5.2,
      
      // Parâmetros Respiratórios
      FR: 18,
      etCO2: 35,
      iCO2: 0,
      inO2: 21,
      etO2: 17,
      
      // Temperatura
      Temp: 36.8,
      Tblood: 37.0,
      
      // Outros
      ICPMean: 15,
      Glicemia: 95,
      Pupilas: "Isocóricas fotorreagentes",
      pH: 7.40,
      inN2O: 0,
      etN2O: 0,
      anestheticAgent: "SEV",
      inAGT: 2.0,
      etAGT: 1.8,
      TOFCount: 4,
      TOFRatio: 90,
      PTC: 0
    };
    
    Object.entries(sugestoes).forEach(([campo, valor]) => {
      if (campo !== undefined && valor !== undefined) {
        atualizarParametro(frameId, campo, valor);
      }
    });
  }, [atualizarParametro]);

  const getParametroIcon = (parametro: string) => {
    const iconMap: Record<string, any> = {
      FC: Heart,
      Pulse: Heart,
      SatO2: Eye,
      PASist: Gauge,
      PADiast: Gauge,
      PAMean: Gauge,
      PANISist: Gauge,
      PANIDiast: Gauge,
      PANIMean: Gauge,
      PAPSist: TrendingUp,
      PAPDiast: TrendingUp,
      PAPMean: TrendingUp,
      WPMean: Activity,
      CVPMean: Activity,
      CO: Activity,
      FR: Wind,
      etCO2: Droplet,
      iCO2: Droplet,
      inO2: Wind,
      etO2: Wind,
      Temp: Thermometer,
      Tblood: Thermometer,
      ICPMean: Brain,
      Glicemia: Brain,
      Pupilas: Eye,
      pH: Zap,
      inN2O: Zap,
      etN2O: Zap,
      anestheticAgent: Activity,
      inAGT: Activity,
      etAGT: Activity,
      TOFCount: Activity,
      TOFRatio: Activity,
      PTC: Activity
    };
    return iconMap[parametro] || Activity;
  };

  const getParametroLabel = (parametro: string) => {
    const labelMap: Record<string, string> = {
      FC: "FC (bpm)",
      Pulse: "Pulso (bpm)",
      SatO2: "SatO₂ (%)",
      PASist: "PA Sistólica (mmHg)",
      PADiast: "PA Diastólica (mmHg)",
      PAMean: "PA Média (mmHg)",
      PANISist: "PANI Sistólica (mmHg)",
      PANIDiast: "PANI Diastólica (mmHg)",
      PANIMean: "PANI Média (mmHg)",
      PAPSist: "PAP Sistólica (mmHg)",
      PAPDiast: "PAP Diastólica (mmHg)",
      PAPMean: "PAP Média (mmHg)",
      WPMean: "PCWP Média (mmHg)",
      CVPMean: "CVP Média (mmHg)",
      CO: "Débito Cardíaco (L/min)",
      FR: "FR (rpm)",
      etCO2: "etCO₂ (mmHg)",
      iCO2: "FiCO₂ (%)",
      inO2: "FiO₂ (%)",
      etO2: "etO₂ (%)",
      Temp: "Temp Periférica (°C)",
      Tblood: "Temp Sanguínea (°C)",
      ICPMean: "PIC Média (mmHg)",
      Glicemia: "Glicemia (mg/dL)",
      Pupilas: "Pupilas",
      pH: "pH Arterial",
      inN2O: "FiN₂O (%)",
      etN2O: "etN₂O (%)",
      anestheticAgent: "Agente Anestésico",
      inAGT: "Agente Anestésico (%)",
      etAGT: "Agente Anestésico (%)",
      TOFCount: "TOF Contagem",
      TOFRatio: "TOF Razão (%)",
      PTC: "PTC Contagem"
    };
    return labelMap[parametro] || parametro;
  };

  const getParametroUnit = (parametro: string) => {
    const unitMap: Record<string, string> = {
      FC: "bpm",
      Pulse: "bpm",
      SatO2: "%",
      PASist: "mmHg",
      PADiast: "mmHg",
      PAMean: "mmHg",
      PANISist: "mmHg",
      PANIDiast: "mmHg",
      PANIMean: "mmHg",
      PAPSist: "mmHg",
      PAPDiast: "mmHg",
      PAPMean: "mmHg",
      WPMean: "mmHg",
      CVPMean: "mmHg",
      CO: "L/min",
      FR: "rpm",
      etCO2: "mmHg",
      iCO2: "%",
      inO2: "%",
      etO2: "%",
      Temp: "°C",
      Tblood: "°C",
      ICPMean: "mmHg",
      Glicemia: "mg/dL",
      Pupilas: "",
      pH: "",
      inN2O: "%",
      etN2O: "%",
      anestheticAgent: "",
      inAGT: "%",
      etAGT: "%",
      TOFCount: "",
      TOFRatio: "%",
      PTC: ""
    };
    return unitMap[parametro] || "";
  };

  return (
    <div className="space-y-6">
      {/* Header com Estatísticas */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>Frames do Cenário</CardTitle>
              <CardDescription>Defina a progressão fisiológica e comportamental do caso clínico</CardDescription>
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
              className="bg-green-600 h-2 rounded-full transition-all duration-300"
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
                <Badge variant="outline" className="text-yellow-600">
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
            <Card key={frame.id} className={cn(
              "transition-all duration-200",
              frame.parameterSet ? "border-green-300" : "border-yellow-300"
            )}>
              {/* Cabeçalho do Frame */}
              <div className="flex items-center justify-between p-4 border-b">
                <div className="flex items-center space-x-3">
                  <GripVertical className="h-4 w-4 text-gray-400" />
                  
                  <Badge variant={frame.parameterSet ? "default" : "secondary"} className={cn(
                    "flex items-center gap-1",
                    frame.parameterSet ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                  )}>
                    {frame.parameterSet ? <CheckCircle className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
                    Frame {frame.frameIdentifier}
                  </Badge>
                  
                  <Input
                    value={frame.title}
                    onChange={(e) => atualizarFrame(frame.id, 'title', e.target.value)}
                    placeholder="Nome da etapa"
                    className="w-64 font-medium"
                  />
                  
                  {frame.durationEstimateMin && (
                    <Badge variant="outline" className="text-xs">
                      {frame.durationEstimateMin}min
                    </Badge>
                  )}
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => gerarSugestaoSinaisVitais(frame.id)}
                  >
                    <Sparkles className="h-4 w-4 mr-1" />
                    IA
                  </Button>
                  
                  <Button variant="ghost" size="icon" onClick={() => duplicarFrame(frame)}>
                    <Copy className="h-4 w-4" />
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setFrameExpandido(frameExpandido === frame.id ? null : frame.id)}
                  >
                    {frameExpandido === frame.id ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removerFrame(frame.id)}
                    disabled={frames.length <= 1}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Conteúdo Expandido */}
              {frameExpandido === frame.id && (
                <div className="p-6 space-y-6">
                  {/* Informações Básicas */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Identificador do Frame</Label>
                      <Input
                        value={frame.frameIdentifier}
                        onChange={(e) => atualizarFrame(frame.id, 'frameIdentifier', e.target.value)}
                        placeholder="Ex: 1, 2A, Piora"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Duração Estimada (minutos)</Label>
                      <Input
                        type="number"
                        min="1"
                        max="60"
                        value={frame.durationEstimateMin || ''}
                        onChange={(e) => atualizarFrame(frame.id, 'durationEstimateMin', parseInt(e.target.value) || 5)}
                        placeholder="5"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Tipo de Participante</Label>
                      <Select value={frame.participantType} onValueChange={(value) => atualizarFrame(frame.id, 'participantType', value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Simulador">Simulador</SelectItem>
                          <SelectItem value="Paciente Padronizado">Paciente Padronizado</SelectItem>
                          <SelectItem value="Staff">Staff</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Parâmetros Fisiológicos - Organizados por Categoria */}
                <Tabs defaultValue="circulatorio" className="w-full">
                  <TabsList className="grid w-full grid-cols-5">
                   <dyad-problem-report summary="38 problems">
<problem file="src/components/cenario/PrismaFramesTab.tsx" line="501" column="17" code="2657">JSX expressions must have one parent element.</problem>
<problem file="src/components/cenario/PrismaFramesTab.tsx" line="543" column="17" code="1005">')' expected.</problem>
<problem file="src/components/cenario/PrismaFramesTab.tsx" line="758" column="29" code="1005">')' expected.</problem>
<problem file="src/components/cenario/PrismaFramesTab.tsx" line="773" column="30" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/cenario/PrismaFramesTab.tsx" line="775" column="25" code="1005">')' expected.</problem>
<problem file="src/components/cenario/PrismaFramesTab.tsx" line="776" column="25" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/cenario/PrismaFramesTab.tsx" line="777" column="23" code="17002">Expected corresponding JSX closing tag for 'TabsContent'.</problem>
<problem file="src/components/cenario/PrismaFramesTab.tsx" line="778" column="21" code="17002">Expected corresponding JSX closing tag for 'Tabs'.</problem>
<problem file="src/components/cenario/PrismaFramesTab.tsx" line="779" column="19" code="17002">Expected corresponding JSX closing tag for 'Card'.</problem>
<problem file="src/components/cenario/PrismaFramesTab.tsx" line="780" column="16" code="1005">',' expected.</problem>
<problem file="src/components/cenario/PrismaFramesTab.tsx" line="781" column="15" code="17002">Expected corresponding JSX closing tag for 'div'.</problem>
<problem file="src/components/cenario/PrismaFramesTab.tsx" line="783" column="10" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/cenario/PrismaFramesTab.tsx" line="786" column="7" code="1005">')' expected.</problem>
<problem file="src/components/cenario/PrismaFramesTab.tsx" line="824" column="5" code="1128">Declaration or statement expected.</problem>
<problem file="src/components/cenario/PrismaFramesTab.tsx" line="825" column="3" code="1109">Expression expected.</problem>
<problem file="src/components/cenario/PrismaFramesTab.tsx" line="826" column="1" code="1128">Declaration or statement expected.</problem>
<problem file="src/pages/Cenarios.tsx" line="189" column="32" code="2552">Cannot find name 'scenario'. Did you mean 'cenario'?</problem>
<problem file="src/pages/Cenarios.tsx" line="190" column="55" code="2552">Cannot find name 'scenario'. Did you mean 'cenario'?</problem>
<problem file="src/pages/Cenarios.tsx" line="191" column="31" code="2552">Cannot find name 'scenario'. Did you mean 'cenario'?</problem>
<problem file="src/pages/Cenarios.tsx" line="192" column="31" code="2552">Cannot find name 'scenario'. Did you mean 'cenario'?</problem>
<problem file="src/pages/Cenarios.tsx" line="194" column="52" code="2552">Cannot find name 'scenario'. Did you mean 'cenario'?</problem>
<problem file="src/pages/Cenarios.tsx" line="195" column="24" code="2552">Cannot find name 'scenario'. Did you mean 'cenario'?</problem>
<problem file="src/pages/Cenarios.tsx" line="199" column="54" code="2552">Cannot find name 'scenario'. Did you mean 'cenario'?</problem>
<problem file="src/pages/Cenarios.tsx" line="200" column="24" code="2552">Cannot find name 'scenario'. Did you mean 'cenario'?</problem>
<problem file="src/pages/Cenarios.tsx" line="204" column="22" code="2552">Cannot find name 'scenario'. Did you mean 'cenario'?</problem>
<problem file="src/components/cenario/PrismaFramesTab.tsx" line="23" column="3" code="2300">Duplicate identifier 'Activity'.</problem>
<problem file="src/components/cenario/PrismaFramesTab.tsx" line="35" column="3" code="2300">Duplicate identifier 'Activity'.</problem>
<problem file="src/components/cenario/PrismaFramesTab.tsx" line="201" column="7" code="2322">Type '&quot;SEV&quot;' is not assignable to type 'AgentType'.</problem>
<problem file="src/components/cenario/PrismaFramesTab.tsx" line="596" column="31" code="2322">Type 'string | number | Frame' is not assignable to type 'string | number | readonly string[]'.
  Type 'Frame' is not assignable to type 'string | number | readonly string[]'.</problem>
<problem file="src/components/cenario/PrismaFramesTab.tsx" line="633" column="31" code="2322">Type 'string | number | Frame' is not assignable to type 'string | number | readonly string[]'.
  Type 'Frame' is not assignable to type 'string | number | readonly string[]'.</problem>
<problem file="src/components/cenario/PrismaFramesTab.tsx" line="665" column="31" code="2322">Type 'string | number | Frame' is not assignable to type 'string | number | readonly string[]'.
  Type 'Frame' is not assignable to type 'string | number | readonly string[]'.</problem>
<problem file="src/components/cenario/PrismaFramesTab.tsx" line="697" column="33" code="2322">Type 'string | number | Frame' is not assignable to type 'string | number | readonly string[]'.
  Type 'Frame' is not assignable to type 'string | number | readonly string[]'.</problem>
<problem file="src/components/cenario/PrismaFramesTab.tsx" line="706" column="35" code="2322">Type 'string | number | Frame' is not assignable to type 'string | number | readonly string[]'.
  Type 'Frame' is not assignable to type 'string | number | readonly string[]'.</problem>
<problem file="src/components/cenario/PrismaFramesTab.tsx" line="743" column="33" code="2322">Type 'string | number | Frame' is not assignable to type 'string'.
  Type 'number' is not assignable to type 'string'.</problem>
<problem file="src/components/cenario/PrismaFramesTab.tsx" line="764" column="35" code="2322">Type 'string | number | Frame' is not assignable to type 'string | number | readonly string[]'.
  Type 'Frame' is not assignable to type 'string | number | readonly string[]'.</problem>
<problem file="src/components/cenario/PrismaFramesTab.tsx" line="824" column="7" code="2304">Cannot find name 'div'.</problem>
<problem file="src/pages/NovoCenarioPrisma.tsx" line="382" column="24" code="2304">Cannot find name 'CheckCircle'.</problem>
<problem file="src/pages/NovoCenarioPrisma.tsx" line="384" column="24" code="2304">Cannot find name 'AlertCircle'.</problem>
</dyad-problem-report>
I'll fix all the TypeScript errors in the files:

<dyad-write path="src/components/cenario/PrismaFramesTab.tsx" description="Fixed all TypeScript errors">
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  Heart,
  Thermometer,
  Gauge,
  Eye,
  MessageSquare,
  User,
  Wind,
  Brain,
  Droplet,
  Zap,
  TrendingUp,
  Activity
} from "lucide-react";
import { useState, useCallback, useMemo } from "react";
import { cn } from "@/lib/utils";
import { Frame, ParameterSet, FrameFormData } from "@/types/prisma";

interface PrismaFramesTabProps {
  frames: Frame[];
  onFramesChange: (frames: Frame[]) => void;
}

const PrismaFramesTab = ({ frames, onFramesChange }: PrismaFramesTabProps) => {
  const [frameExpandido, setFrameExpandido] = useState<string | null>(frames[0]?.id || null);
  const [filtroStatus, setFiltroStatus] = useState<'todos' | 'completos' | 'incompletos'>('todos');

  // Estatísticas dos frames
  const stats = useMemo(() => {
    const completos = frames.filter(f => f.parameterSet).length;
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
      if (filtroStatus === 'completos') return !!frame.parameterSet;
      if (filtroStatus === 'incompletos') return !frame.parameterSet;
      return true;
    });
  }, [frames, filtroStatus]);

  const adicionarFrame = useCallback(() => {
    const novoFrame: Frame = {
      id: Date.now().toString(),
      scenarioId: "temp", // Will be set when saving
      frameIdentifier: (frames.length + 1).toString(),
      title: `Frame ${frames.length + 1}`,
      durationEstimateMin: 5,
      participantType: "Simulador",
      operatorInstructions: [],
      expectedParticipantActions: [],
      sourceTransitions: [],
      targetTransitions: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const novosFrames = [...frames, novoFrame];
    onFramesChange(novosFrames);
    setFrameExpandido(novoFrame.id);
  }, [frames, onFramesChange]);

  const removerFrame = useCallback((id: string) => {
    if (frames.length <= 1) return;
    
    const novosFrames = frames
      .filter(frame => frame.id !== id)
      .map((frame, index) => ({ 
        ...frame, 
        frameIdentifier: (index + 1).toString() 
      }));
    
    onFramesChange(novosFrames);
    
    if (frameExpandido === id) {
      setFrameExpandido(novosFrames[0]?.id || null);
    }
  }, [frames, onFramesChange, frameExpandido]);

  const duplicarFrame = useCallback((frameOriginal: Frame) => {
    const novoFrame: Frame = {
      ...frameOriginal,
      id: Date.now().toString(),
      frameIdentifier: (frames.length + 1).toString(),
      title: `${frameOriginal.title} (Cópia)`,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const novosFrames = [...frames, novoFrame];
    onFramesChange(novosFrames);
    setFrameExpandido(novoFrame.id);
  }, [frames, onFramesChange]);

  const atualizarFrame = useCallback((id: string, campo: string, valor: any) => {
    const novosFrames = frames.map(frame => {
      if (frame.id === id) {
        return { ...frame, [campo]: valor, updatedAt: new Date() };
      }
      return frame;
    });
    
    onFramesChange(novosFrames);
  }, [frames, onFramesChange]);

  const atualizarParametro = useCallback((frameId: string, campo: string, valor: any) => {
    const novosFrames = frames.map(frame => {
      if (frame.id === frameId) {
        const parametrosAtuais = frame.parameterSet || {
          id: Date.now().toString(),
          frameId: frameId
        };
        
        const parametrosAtualizados = {
          ...parametrosAtuais,
          [campo]: valor
        };
        
        return { 
          ...frame, 
          parameterSet: parametrosAtualizados,
          updatedAt: new Date()
        };
      }
      return frame;
    });
    
    onFramesChange(novosFrames);
  }, [frames, onFramesChange]);

  const gerarSugestaoSinaisVitais = useCallback((frameId: string) => {
    // Simulação de sugestão de IA baseada no tipo de cenário
    const sugestoes: Partial<ParameterSet> = {
      // Parâmetros Circulatórios
      FC: 85,
      Pulse: 85,
      SatO2: 94,
      PASist: 120,
      PADiast: 80,
      PAMean: 93,
      PANISist: 125,
      PANIDiast: 85,
      PANIMean: 98,
      PAPSist: 25,
      PAPDiast: 12,
      PAPMean: 16,
      WPMean: 12,
      CVPMean: 8,
      CO: 5.2,
      
      // Parâmetros Respiratórios
      FR: 18,
      etCO2: 35,
      iCO2: 0,
      inO2: 21,
      etO2: 17,
      
      // Temperatura
      Temp: 36.8,
      Tblood: 37.0,
      
      // Outros
      ICPMean: 15,
      Glicemia: 95,
      Pupilas: "Isocóricas fotorreagentes",
      pH: 7.40,
      inN2O: 0,
      etN2O: 0,
      anestheticAgent: "SEV",
      inAGT: 2.0,
      etAGT: 1.8,
      TOFCount: 4,
      TOFRatio: 90,
      PTC: 0
    };
    
    Object.entries(sugestoes).forEach(([campo, valor]) => {
      if (campo !== undefined && valor !== undefined) {
        atualizarParametro(frameId, campo, valor);
      }
    });
  }, [atualizarParametro]);

  const getParametroIcon = (parametro: string) => {
    const iconMap: Record<string, any> = {
      FC: Heart,
      Pulse: Heart,
      SatO2: Eye,
      PASist: Gauge,
      PADiast: Gauge,
      PAMean: Gauge,
      PANISist: Gauge,
      PANIDiast: Gauge,
      PANIMean: Gauge,
      PAPSist: TrendingUp,
      PAPDiast: TrendingUp,
      PAPMean: TrendingUp,
      WPMean: Activity,
      CVPMean: Activity,
      CO: Activity,
      FR: Wind,
      etCO2: Droplet,
      iCO2: Droplet,
      inO2: Wind,
      etO2: Wind,
      Temp: Thermometer,
      Tblood: Thermometer,
      ICPMean: Brain,
      Glicemia: Brain,
      Pupilas: Eye,
      pH: Zap,
      inN2O: Zap,
      etN2O: Zap,
      anestheticAgent: Activity,
      inAGT: Activity,
      etAGT: Activity,
      TOFCount: Activity,
      TOFRatio: Activity,
      PTC: Activity
    };
    return iconMap[parametro] || Activity;
  };

  const getParametroLabel = (parametro: string) => {
    const labelMap: Record<string, string> = {
      FC: "FC (bpm)",
      Pulse: "Pulso (bpm)",
      SatO2: "SatO₂ (%)",
      PASist: "PA Sistólica (mmHg)",
      PADiast: "PA Diastólica (mmHg)",
      PAMean: "PA Média (mmHg)",
      PANISist: "PANI Sistólica (mmHg)",
      PANIDiast: "PANI Diastólica (mmHg)",
      PANIMean: "PANI Média (mmHg)",
      PAPSist: "PAP Sistólica (mmHg)",
      PAPDiast: "PAP Diastólica (mmHg)",
      PAPMean: "PAP Média (mmHg)",
      WPMean: "PCWP Média (mmHg)",
      CVPMean: "CVP Média (mmHg)",
      CO: "Débito Cardíaco (L/min)",
      FR: "FR (rpm)",
      etCO2: "etCO₂ (mmHg)",
      iCO2: "FiCO₂ (%)",
      inO2: "FiO₂ (%)",
      etO2: "etO₂ (%)",
      Temp: "Temp Periférica (°C)",
      Tblood: "Temp Sanguínea (°C)",
      ICPMean: "PIC Média (mmHg)",
      Glicemia: "Glicemia (mg/dL)",
      Pupilas: "Pupilas",
      pH: "pH Arterial",
      inN2O: "FiN₂O (%)",
      etN2O: "etN₂O (%)",
      anestheticAgent: "Agente Anestésico",
      inAGT: "Agente Anestésico (%)",
      etAGT: "Agente Anestésico (%)",
      TOFCount: "TOF Contagem",
      TOFRatio: "TOF Razão (%)",
      PTC: "PTC Contagem"
    };
    return labelMap[parametro] || parametro;
  };

  const getParametroUnit = (parametro: string) => {
    const unitMap: Record<string, string> = {
      FC: "bpm",
      Pulse: "bpm",
      SatO2: "%",
      PASist: "mmHg",
      PADiast: "mmHg",
      PAMean: "mmHg",
      PANISist: "mmHg",
      PANIDiast: "mmHg",
      PANIMean: "mmHg",
      PAPSist: "mmHg",
      PAPDiast: "mmHg",
      PAPMean: "mmHg",
      WPMean: "mmHg",
      CVPMean: "mmHg",
      CO: "L/min",
      FR: "rpm",
      etCO2: "mmHg",
      iCO2: "%",
      inO2: "%",
      etO2: "%",
      Temp: "°C",
      Tblood: "°C",
      ICPMean: "mmHg",
      Glicemia: "mg/dL",
      Pupilas: "",
      pH: "",
      inN2O: "%",
      etN2O: "%",
      anestheticAgent: "",
      inAGT: "%",
      etAGT: "%",
      TOFCount: "",
      TOFRatio: "%",
      PTC: ""
    };
    return unitMap[parametro] || "";
  };

  return (
    <div className="space-y-6">
      {/* Header com Estatísticas */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>Frames do Cenário</CardTitle>
              <CardDescription>Defina a progressão fisiológica e comportamental do caso clínico</CardDescription>
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
              className="bg-green-600 h-2 rounded-full transition-all duration-300"
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
                <Badge variant="outline" className="text-yellow-600">
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
            <Card key={frame.id} className={cn(
              "transition-all duration-200",
              frame.parameterSet ? "border-green-300" : "border-yellow-300"
            )}>
              {/* Cabeçalho do Frame */}
              <div className="flex items-center justify-between p-4 border-b">
                <div className="flex items-center space-x-3">
                  <GripVertical className="h-4 w-4 text-gray-400" />
                  
                  <Badge variant={frame.parameterSet ? "default" : "secondary"} className={cn(
                    "flex items-center gap-1",
                    frame.parameterSet ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                  )}>
                    {frame.parameterSet ? <CheckCircle className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
                    Frame {frame.frameIdentifier}
                  </Badge>
                  
                  <Input
                    value={frame.title}
                    onChange={(e) => atualizarFrame(frame.id, 'title', e.target.value)}
                    placeholder="Nome da etapa"
                    className="w-64 font-medium"
                  />
                  
                  {frame.durationEstimateMin && (
                    <Badge variant="outline" className="text-xs">
                      {frame.durationEstimateMin}min
                    </Badge>
                  )}
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => gerarSugestaoSinaisVitais(frame.id)}
                  >
                    <Sparkles className="h-4 w-4 mr-1" />
                    IA
                  </Button>
                  
                  <Button variant="ghost" size="icon" onClick={() => duplicarFrame(frame)}>
                    <Copy className="h-4 w-4" />
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setFrameExpandido(frameExpandido === frame.id ? null : frame.id)}
                  >
                    {frameExpandido === frame.id ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removerFrame(frame.id)}
                    disabled={frames.length <= 1}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Conteúdo Expandido */}
              {frameExpandido === frame.id && (
                <div className="p-6 space-y-6">
                  {/* Informações Básicas */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Identificador do Frame</Label>
                      <Input
                        value={frame.frameIdentifier}
                        onChange={(e) => atualizarFrame(frame.id, 'frameIdentifier', e.target.value)}
                        placeholder="Ex: 1, 2A, Piora"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Duração Estimada (minutos)</Label>
                      <Input
                        type="number"
                        min="1"
                        max="60"
                        value={frame.durationEstimateMin || ''}
                        onChange={(e) => atualizarFrame(frame.id, 'durationEstimateMin', parseInt(e.target.value) || 5)}
                        placeholder="5"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Tipo de Participante</Label>
                      <Select value={frame.participantType} onValueChange={(value) => atualizarFrame(frame.id, 'participantType', value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Simulador">Simulador</SelectItem>
                          <SelectItem value="Paciente Padronizado">Paciente Padronizado</SelectItem>
                          <SelectItem value="Staff">Staff</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Parâmetros Fisiológicos - Organizados por Categoria */}
                <Tabs defaultValue="circulatorio" className="w-full">
                  <TabsList className="grid w-full grid-cols-5">
                    <TabsTrigger value="circulatorio">Circulatório</TabsTrigger>
                    <TabsTrigger value="respiratorio">Respiratório</TabsTrigger>
                    <TabsTrigger value="temperatura">Temperatura</TabsTrigger>
                    <TabsTrigger value="neurologico">Neurológico</TabsTrigger>
                    <TabsTrigger value="anestesia">Anestesia</TabsTrigger>
                  </TabsList>

                  {/* Parâmetros Circulatórios */}
                  <TabsContent value="circulatorio" className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium flex items-center gap-2">
                        <Heart className="h-4 w-4 text-red-500" />
                        Parâmetros Circulatórios
                      </h4>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => gerarSugestaoSinaisVitais(frame.id)}
                      >
                        <Sparkles className="h-3 w-3 mr-1" />
                        Sugerir com IA
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {[
                        { field: 'FC', icon: Heart, color: 'text-red-500' },
                        { field: 'Pulse', icon: Heart, color: 'text-red-400' },
                        { field: 'SatO2', icon: Eye, color: 'text-blue-500' },
                        { field: 'PASist', icon: Gauge, color: 'text-green-500' },
                        { field: 'PADiast', icon: Gauge, color: 'text-green-400' },
                        { field: 'PAMean', icon: Gauge, color: 'text-green-600' },
                        { field: 'PANISist', icon: Gauge, color: 'text-blue-500' },
                        { field: 'PANIDiast', icon: Gauge, color: 'text-blue-400' },
                        { field: 'PANIMean', icon: Gauge, color: 'text-blue-600' },
                        { field: 'PAPSist', icon: TrendingUp, color: 'text-purple-500' },
                        { field: 'PAPDiast', icon: TrendingUp, color: 'text-purple-400' },
                        { field: 'PAPMean', icon: TrendingUp, color: 'text-purple-600' },
                        { field: 'WPMean', icon: Activity, color: 'text-orange-500' },
                        { field: 'CVPMean', icon: Activity, color: 'text-orange-400' },
                        { field: 'CO', icon: Activity, color: 'text-purple-500' }
                      ].map(({ field, icon: Icon, color }) => (
                        <div key={field} className="space-y-2">
                          <Label className="flex items-center gap-1 text-sm">
                            <Icon className={`h-3 w-3 ${color}`} />
                            {getParametroLabel(field)}
                          </Label>
                          <div className="flex items-center gap-2">
                            <Input
                              type="number"
                              value={frame.parameterSet?.[field as keyof ParameterSet] || ''}
                              onChange={(e) => atualizarParametro(frame.id, field, e.target.value ? parseFloat(e.target.value) : undefined)}
                              placeholder="---"
                              className="text-sm flex-1"
                            />
                            <span className="text-xs text-gray-500 min-w-[3rem]">
                              {getParametroUnit(field)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>

                  {/* Parâmetros Respiratórios */}
                  <TabsContent value="respiratorio" className="space-y-4">
                    <h4 className="font-medium flex items-center gap-2">
                      <Wind className="h-4 w-4 text-blue-500" />
                      Parâmetros Respiratórios
                    </h4>
                    
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {[
                        { field: 'FR', icon: Wind, color: 'text-blue-500' },
                        { field: 'etCO2', icon: Droplet, color: 'text-cyan-500' },
                        { field: 'iCO2', icon: Droplet, color: 'text-cyan-400' },
                        { field: 'inO2', icon: Wind, color: 'text-blue-400' },
                        { field: 'etO2', icon: Wind, color: 'text-blue-300' }
                      ].map(({ field, icon: Icon, color }) => (
                        <div key={field} className="space-y-2">
                          <Label className="flex items-center gap-1 text-sm">
                            <Icon className={`h-3 w-3 ${color}`} />
                            {getParametroLabel(field)}
                          </Label>
                          <div className="flex items-center gap-2">
                            <Input
                              type="number"
                              value={frame.parameterSet?.[field as keyof ParameterSet] || ''}
                              onChange={(e) => atualizarParametro(frame.id, field, e.target.value ? parseFloat(e.target.value) : undefined)}
                              placeholder="---"
                              className="text-sm flex-1"
                            />
                            <span className="text-xs text-gray-500 min-w-[3rem]">
                              {getParametroUnit(field)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>

                  {/* Parâmetros de Temperatura */}
                  <TabsContent value="temperatura" className="space-y-4">
                    <h4 className="font-medium flex items-center gap-2">
                      <Thermometer className="h-4 w-4 text-orange-500" />
                      Temperatura
                    </h4>
                    
                    <div className="grid grid-cols-2 gap-4">
                      {[
                        { field: 'Temp', label: 'Temp Periférica (°C)' },
                        { field: 'Tblood', label: 'Temp Sanguínea (°C)' }
                      ].map(({ field, label }) => (
                        <div key={field} className="space-y-2">
                          <Label className="text-sm">{label}</Label>
                          <div className="flex items-center gap-2">
                            <Input
                              type="number"
                              step="0.1"
                              value={frame.parameterSet?.[field as keyof ParameterSet] || ''}
                              onChange={(e) => atualizarParametro(frame.id, field, e.target.value ? parseFloat(e.target.value) : undefined)}
                              placeholder="---"
                              className="text-sm flex-1"
                            />
                            <span className="text-xs text-gray-500 min-w-[3rem]">
                              {getParametroUnit(field)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>

                  {/* Parâmetros Neurológicos */}
                  <TabsContent value="neurologico" className="space-y-4">
                    <h4 className="font-medium flex items-center gap-2">
                      <Brain className="h-4 w-4 text-purple-500" />
                      Parâmetros Neurológicos
                    </h4>
                    
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {[
                        { field: 'ICPMean', label: 'PIC Média (mmHg)' },
                        { field: 'Glicemia', label: 'Glicemia (mg/dL)' },
                        { field: 'Pupilas', label: 'Pupilas' }
                      ].map(({ field, label }) => (
                        <div key={field} className="space-y-2">
                          <Label className="text-sm">{label}</Label>
                          <div className="flex items-center gap-2">
                            {field === 'Pupilas' ? (
                              <Input
                                value={frame.parameterSet?.[field as keyof ParameterSet] || ''}
                                onChange={(e) => atualizarParametro(frame.id, field, e.target.value)}
                                placeholder="Ex: Isocóricas fotorreagentes"
                                className="text-sm flex-1"
                              />
                            ) : (
                              <>
                                <Input
                                  type="number"
                                  value={frame.parameterSet?.[field as keyof ParameterSet] || ''}
                                  onChange={(e) => atualizarParametro(frame.id, field, e.target.value ? parseFloat(e.target.value) : undefined)}
                                  placeholder="---"
                                  className="text-sm flex-1"
                                />
                                <span className="text-xs text-gray-500 min-w-[3rem]">
                                  {getParametroUnit(field)}
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>

                  {/* Parâmetros de Anestesia */}
                  <TabsContent value="anestesia" className="space-y-4">
                    <h4 className="font-medium flex items-center gap-2">
                      <Activity className="h-4 w-4 text-purple-500" />
                      Parâmetros de Anestesia
                    </h4>
                    
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {[
                        { field: 'anestheticAgent', label: 'Agente Anestésico' },
                        { field: 'inAGT', label: 'Agente Anestésico (%)' },
                        { field: 'etAGT', label: 'Agente Anestésico (%)' },
                        { field: 'TOFCount', label: 'TOF Contagem' },
                        { field: 'TOFRatio', label: 'TOF Razão (%)' },
                        { field: 'PTC', label: 'PTC Contagem' }
                      ].map(({ field, label }) => (
                        <div key={field} className="space-y-2">
                          <Label className="text-sm">{label}</Label>
                          <div className="flex items-center gap-2">
                            {field === 'anestheticAgent' ? (
                              <Select
                                value={frame.parameterSet?.[field as keyof ParameterSet] || ''}
                                onChange={(value) => atualizarParametro(frame.id, field, value)}
                                className="text-sm flex-1"
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecione" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="HAL">HAL</SelectItem>
                                  <SelectItem value="ISO">ISO</SelectItem>
                                  <SelectItem value="ENF">ENF</SelectItem>
                                  <SelectItem value="SEV">SEV</SelectItem>
                                  <SelectItem value="DES">DES</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            ) : (
                              <>
                                <Input
                                  type={field === 'TOFCount' || field === 'PTC' ? "number" : "number"}
                                  step={field === 'TOFRatio' ? "0.1" : "0.1"}
                                  value={frame.parameterSet?.[field as keyof ParameterSet] || ''}
                                  onChange={(e) => atualizarParametro(frame.id, field, e.target.value ? parseFloat(e.target.value) : undefined)}
                                  placeholder="---"
                                  className="text-sm flex-1"
                                />
                                <span className="text-xs text-gray-500 min-w-[3rem]">
                                  {getParametroUnit(field)}
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              )}
            </Card>
          ))
        )}
      </div>

      {/* Validação Geral */}
      {frames.length > 0 && (
        <Card className={cn(
          "border-2",
          frames.length >= 3 && stats.completos >= 3 
            ? "border-green-300 bg-green-50" 
            : "border-yellow-300 bg-yellow-50"
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
                    <p>• {stats.incompletos} frame(s) precisam ser completados com parâmetros</p>
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
  );
};

export default PrismaFramesTab;
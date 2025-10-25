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

  // Configurações dos parâmetros médicos com cores da Resuscitare
  const parametrosConfig = {
    circulacao: [
      { key: 'fc', label: 'FC', unit: 'bpm', icon: Heart, tooltip: 'Frequência Cardíaca', color: 'text-red-600' },
      { key: 'pulse', label: 'Pulso', unit: 'bpm', icon: Heart, tooltip: 'Pulso periférico', color: 'text-red-500' },
      { key: 'satO2', label: 'SatO₂', unit: '%', icon: Wind, tooltip: 'Saturação de O₂', color: 'text-blue-600' },
      { key: 'paSistolica', label: 'PA Sist', unit: 'mmHg', icon: Gauge, tooltip: 'PA Sistólica', color: 'text-primary' },
      { key: 'paDiastolica', label: 'PA Diast', unit: 'mmHg', icon: Gauge, tooltip: 'PA Diastólica', color: 'text-primary' },
      { key: 'paMedia', label: 'PA Média', unit: 'mmHg', icon: Gauge, tooltip: 'PA Média', color: 'text-primary' },
    ],
    invasiva: [
      { key: 'papSistolica', label: 'PAP Sist', unit: 'mmHg', icon: Gauge, tooltip: 'Pressão Arterial Pulmonar Sistólica', color: 'text-pink-600' },
      { key: 'papDiastolica', label: 'PAP Diast', unit: 'mmHg', icon: Gauge, tooltip: 'Pressão Arterial Pulmonar Diastólica', color: 'text-pink-500' },
      { key: 'papMedia', label: 'PAP Média', unit: 'mmHg', icon: Gauge, tooltip: 'Pressão Arterial Pulmonar Média', color: 'text-pink-700' },
      { key: 'wpMedia', label: 'PCP', unit: 'mmHg', icon: Droplets, tooltip: 'Pressão Capilar Pulmonar', color: 'text-cyan-600' },
      { key: 'cvpMedia', label: 'PVC', unit: 'mmHg', icon: Activity, tooltip: 'Pressão Venosa Central', color: 'text-indigo-600' },
      { key: 'co', label: 'DC', unit: 'L/min', icon: Heart, tooltip: 'Débito Cardíaco', color: 'text-red-700' },
    ],
    respiratoria: [
      { key: 'fr', label: 'FR', unit: 'rpm', icon: Wind, tooltip: 'Frequência Respiratória', color: 'text-green-600' },
      { key: 'etCO2', label: 'etCO₂', unit: 'mmHg', icon: Wind, tooltip: 'CO₂ Expirado Final', color: 'text-teal-600' },
      { key: 'iCO2', label: 'FiCO₂', unit: '%', icon: Wind, tooltip: 'Fração Inspirada de CO₂', color: 'text-gray-600' },
      { key: 'inO2', label: 'FiO₂', unit: '%', icon: Wind, tooltip: 'Fração Inspirada de O₂', color: 'text-blue-500' },
    ],
    temperatura: [
      { key: 'temp', label: 'Temp', unit: '°C', icon: Thermometer, tooltip: 'Temperatura Periférica', color: 'text-orange-600' },
      { key: 'tblood', label: 'T Sang', unit: '°C', icon: Thermometer, tooltip: 'Temperatura Sanguínea', color: 'text-red-600' },
    ],
    neurologia: [
      { key: 'icpMedia', label: 'PIC', unit: 'mmHg', icon: Brain, tooltip: 'Pressão Intracraniana', color: 'text-purple-700' },
      { key: 'glicemia', label: 'Glicemia', unit: 'mg/dL', icon: Droplets, tooltip: 'Glicemia Capilar', color: 'text-yellow-600' },
      { key: 'pupilas', label: 'Pupilas', unit: '', icon: Eye, tooltip: 'Estado das Pupilas', color: 'text-gray-700' },
    ],
    gases: [
      { key: 'ph', label: 'pH', unit: '', icon: Activity, tooltip: 'pH Arterial', color: 'text-green-700' },
      { key: 'inN2O', label: 'FiN₂O', unit: '%', icon: Wind, tooltip: 'Fração Inspirada de N₂O', color: 'text-purple-500' },
      { key: 'anestheticAgent', label: 'Agente', unit: '', icon: Zap, tooltip: 'Agente Anestésico', color: 'text-indigo-500' },
      { key: 'inAGT', label: 'FiAGT', unit: '%', icon: Droplets, tooltip: 'Fração Inspirada de Agente', color: 'text-blue-700' },
      { key: 'tofCount', label: 'TOF', unit: '/4', icon: Zap, tooltip: 'Train-of-Four Count', color: 'text-yellow-700' },
      { key: 'tofRatio', label: 'TOF%', unit: '%', icon: Zap, tooltip: 'Train-of-Four Ratio', color: 'text-orange-700' },
    ],
    pani: [
      { key: 'paniSistolica', label: 'PANI Sist', unit: 'mmHg', icon: Gauge, tooltip: 'PA Não Invasiva Sistólica', color: 'text-blue-700' },
      { key: 'paniDiastolica', label: 'PANI Diast', unit: 'mmHg', icon: Gauge, tooltip: 'PA Não Invasiva Diastólica', color: 'text-blue-600' },
      { key: 'paniMedia', label: 'PANI Média', unit: 'mmHg', icon: Gauge, tooltip: 'PA Não Invasiva Média', color: 'text-blue-800' },
    ]
  };

  return (
    <TooltipProvider>
      <div className="space-y-6">
        {/* Header com Estatísticas - Cores Resuscitare */}
        <Card className="bg-card border-card-border">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="flex items-center gap-2 text-foreground">
                  <Activity className="h-5 w-5 text-primary" />
                  Frames do Cenário
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  Defina a progressão fisiológica e comportamental do caso clínico
                </CardDescription>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Label className="text-sm text-foreground">Filtro:</Label>
                  <Select value={filtroStatus} onValueChange={(value: 'todos' | 'completos' | 'incompletos') => setFiltroStatus(value)}>
                    <SelectTrigger className="w-36 bg-background border-border">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-background border-border">
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
            {/* Estatísticas com cores Resuscitare */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
              <div className="text-center p-3 bg-secondary rounded-lg border border-secondary-border">
                <div className="text-2xl font-bold text-primary">{stats.total}</div>
                <div className="text-sm text-secondary-foreground">Total</div>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg border border-green-200">
                <div className="text-2xl font-bold text-green-700">{stats.completos}</div>
                <div className="text-sm text-green-600">Completos</div>
              </div>
              <div className="text-center p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                <div className="text-2xl font-bold text-yellow-700">{stats.incompletos}</div>
                <div className="text-sm text-yellow-600">Incompletos</div>
              </div>
              <div className="text-center p-3 bg-purple-50 rounded-lg border border-purple-200">
                <div className="text-2xl font-bold text-purple-700">{stats.duracaoTotal}min</div>
                <div className="text-sm text-purple-600">Duração</div>
              </div>
              <div className="text-center p-3 bg-muted rounded-lg border border-border">
                <div className="text-2xl font-bold text-muted-foreground">{stats.percentualCompleto}%</div>
                <div className="text-sm text-muted-foreground">Progresso</div>
              </div>
            </div>

            {/* Barra de Progresso com cor primária */}
            <div className="w-full bg-muted rounded-full h-2 mb-4">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${stats.percentualCompleto}%` }}
              />
            </div>

            {/* Controles */}
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Badge variant={frames.length >= 3 ? "default" : "destructive"} className="bg-primary text-primary-foreground">
                  {frames.length} frames
                </Badge>
                {frames.length < 3 && (
                  <Badge variant="outline" className="text-warning border-warning bg-yellow-50">
                    Mínimo: 3 frames
                  </Badge>
                )}
              </div>
              
              <Button onClick={adicionarFrame} disabled={frames.length >= 10} className="bg-primary hover:bg-primary/90 text-primary-foreground">
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Frame
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Lista de Frames */}
        <div className="space-y-4">
          {framesFiltrados.length === 0 ? (
            <Card className="bg-card border-card-border">
              <CardContent className="text-center py-8">
                <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
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

        {/* Validação Geral com cores Resuscitare */}
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
                  <CheckCircle className="h-5 w-5 text-green-700 mt-0.5" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-yellow-700 mt-0.5" />
                )}
                <div>
                  <h4 className="font-medium text-foreground">
                    {frames.length >= 3 && stats.completos >= 3 
                      ? "Frames configurados corretamente!" 
                      : "Atenção necessária"
                    }
                  </h4>
                  <div className="text-sm text-muted-foreground mt-1">
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

// Componente individual de Frame otimizado com cores Resuscitare
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
        <Label htmlFor={`${param.key}-${frame.id}`} className="flex items-center gap-1 text-foreground">
          <IconComponent className={cn("h-3 w-3", param.color)} />
          {param.label}
          {tooltipValue && (
            <Tooltip>
              <TooltipTrigger>
                <Info className="h-3 w-3 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent className="bg-background border-border">
                <p className="text-foreground">{tooltipValue as string}</p>
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
            value={String(value || '')}
            onChange={(e) => onUpdate(param.key, e.target.value)}
            className="pr-12 bg-background border-border text-foreground"
          />
          {param.unit && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
              {param.unit}
            </span>
          )}
        </div>
      </div>
    );
  };

  return (
    <Card className={cn(
      "transition-all duration-200 bg-card border-card-border",
      frame.isCompleto ? "border-green-300 shadow-sm" : "border-yellow-300",
      isExpanded && "shadow-lg"
    )}>
      {/* Cabeçalho do Frame com cores Resuscitare */}
      <div className="flex items-center justify-between p-4 border-b border-border bg-gradient-to-r from-secondary to-background">
        <div className="flex items-center space-x-3">
          <Tooltip>
            <TooltipTrigger>
              <GripVertical className="h-4 w-4 text-muted-foreground cursor-move hover:text-foreground" />
            </TooltipTrigger>
            <TooltipContent className="bg-background border-border">
              <p className="text-foreground">Arrastar para reordenar</p>
            </TooltipContent>
          </Tooltip>
            
          <Badge variant={frame.isCompleto ? "default" : "secondary"} className={cn(
            "flex items-center gap-1",
            frame.isCompleto ? "bg-green-100 text-green-800 border-green-300" : "bg-yellow-100 text-yellow-800 border-yellow-300"
          )}>
            {frame.isCompleto ? <CheckCircle className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
            Frame {frame.ordem}
          </Badge>
          
          <Input
            value={frame.nomeEtapa}
            onChange={(e) => onUpdate('nomeEtapa', e.target.value)}
            placeholder="Nome da etapa (ex: Estado Inicial)"
            className="w-64 font-medium bg-background border-border text-foreground"
          />
          
          <Input
            value={frame.frameIdentifier || ''}
            onChange={(e) => onUpdate('frameIdentifier', e.target.value)}
            placeholder="ID (ex: 1, 2A, Piora)"
            className="w-24 bg-background border-border text-foreground"
          />
          
          {frame.durationEstimateMin && (
            <Badge variant="outline" className="text-xs bg-accent text-accent-foreground border-border">
              {frame.durationEstimateMin}min
            </Badge>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          {/* Sugestão de IA */}
          <Select onValueChange={onIASuggest} disabled={frame.loadingIA}>
            <SelectTrigger className="w-48 bg-background border-border">
              <SelectValue placeholder={frame.loadingIA ? "Gerando..." : "Sugerir com IA"} />
            </SelectTrigger>
            <SelectContent className="bg-background border-border">
              {contextosIA.map(contexto => (
                <SelectItem key={contexto.value} value={contexto.value}>
                  <div className="flex items-center gap-2">
                    <span>{contexto.icon}</span>
                    <Sparkles className="h-3 w-3 text-primary" />
                    {contexto.label}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          {frame.loadingIA && (
            <Loader2 className="h-4 w-4 animate-spin text-primary" />
          )}
          
          {/* Ações */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={onDuplicate} className="hover:bg-accent">
                <Copy className="h-4 w-4 text-muted-foreground" />
              </Button>
            </TooltipTrigger>
            <TooltipContent className="bg-background border-border">
              <p className="text-foreground">Duplicar frame</p>
            </TooltipContent>
          </Tooltip>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleExpand}
            className="hover:bg-accent"
          >
            {isExpanded ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
          </Button>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={onRemove}
                disabled={totalFrames <= 1}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent className="bg-background border-border">
              <p className="text-foreground">Remover frame</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>

      {/* Conteúdo Expandido */}
      {isExpanded && (
        <div className="p-6 space-y-6 bg-background">
          {/* Configurações Básicas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor={`duracao-${frame.id}`} className="text-foreground">Duração Estimada (minutos)</Label>
              <Input
                id={`duracao-${frame.id}`}
                type="number"
                min="1"
                max="60"
                value={frame.durationEstimateMin || ''}
                onChange={(e) => onUpdate('durationEstimateMin', parseInt(e.target.value) || undefined)}
                placeholder="5"
                className="bg-background border-border text-foreground"
              />
            </div>
            
            <div className="space-y-2">
              <Label className="text-foreground">Tipo de Participante</Label>
              <Select value={frame.participantType} onValueChange={(value) => onUpdate('participantType', value)}>
                <SelectTrigger className="bg-background border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-background border-border">
                  <SelectItem value="Simulador">🤖 Simulador</SelectItem>
                  <SelectItem value="Paciente Padronizado">👤 Paciente Padronizado</SelectItem>
                  <SelectItem value="Staff">👥 Staff</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Separator className="bg-border" />

          {/* Parâmetros Fisiológicos - Organizados por Sistema */}
          <div className="space-y-6">
            {/* Circulação */}
            <div className="p-4 bg-red-50 rounded-lg border border-red-200">
              <h4 className="font-semibold mb-4 flex items-center gap-2 text-red-800">
                <Heart className="h-4 w-4 text-red-600" />
                Parâmetros de Circulação
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {parametrosConfig.circulacao.map(param => renderParameterInput(param, frame))}
              </div>
            </div>

            {/* Monitoração Invasiva */}
            <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
              <h4 className="font-semibold mb-4 flex items-center gap-2 text-purple-800">
                <Activity className="h-4 w-4 text-purple-600" />
                Monitoração Invasiva
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {parametrosConfig.invasiva.map(param => renderParameterInput(param, frame))}
              </div>
            </div>

            {/* Respiratórios */}
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <h4 className="font-semibold mb-4 flex items-center gap-2 text-green-800">
                <Wind className="h-4 w-4 text-green-600" />
                Parâmetros Respiratórios
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {parametrosConfig.respiratoria.map(param => renderParameterInput(param, frame))}
              </div>
            </div>

            {/* Temperatura */}
            <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
              <h4 className="font-semibold mb-4 flex items-center gap-2 text-orange-800">
                <Thermometer className="h-4 w-4 text-orange-600" />
                Temperatura
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {parametrosConfig.temperatura.map(param => renderParameterInput(param, frame))}
              </div>
            </div>

            {/* Neurológicos */}
            <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
              <h4 className="font-semibold mb-4 flex items-center gap-2 text-purple-800">
                <Brain className="h-4 w-4 text-purple-700" />
                Parâmetros Neurológicos
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {parametrosConfig.neurologia.map(param => renderParameterInput(param, frame))}
              </div>
            </div>

            {/* Gases e Anestesia */}
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="font-semibold mb-4 flex items-center gap-2 text-blue-800">
                <Droplets className="h-4 w-4 text-blue-600" />
                Gases e Anestesia
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {parametrosConfig.gases.map(param => renderParameterInput(param, frame))}
              </div>
            </div>

            {/* PANI */}
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="font-semibold mb-4 flex items-center gap-2 text-blue-800">
                <Gauge className="h-4 w-4 text-blue-700" />
                PA Não Invasiva
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {parametrosConfig.pani.map(param => renderParameterInput(param, frame))}
              </div>
            </div>
          </div>

          <Separator className="bg-border" />

          {/* Campos Textuais com fundo adequado */}
          <div className="space-y-4 p-4 bg-muted rounded-lg">
            <div className="space-y-2">
              <Label htmlFor={`ecg-${frame.id}`} className="flex items-center gap-2 text-foreground">
                <Activity className="h-4 w-4 text-red-600" />
                Descrição do ECG/Ritmo
              </Label>
              <Input
                id={`ecg-${frame.id}`}
                value={frame.ecgDescription || ''}
                onChange={(e) => onUpdate('ecgDescription', e.target.value)}
                placeholder="Ex: Ritmo sinusal regular, taquicardia sinusal, bradicardia"
                className="bg-background border-border text-foreground"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor={`outros-${frame.id}`} className="flex items-center gap-2 text-foreground">
                <Target className="h-4 w-4 text-primary" />
                Outros Achados Clínicos
              </Label>
              <Textarea
                id={`outros-${frame.id}`}
                value={frame.otherFindings || ''}
                onChange={(e) => onUpdate('otherFindings', e.target.value)}
                placeholder="Ex: Ausculta pulmonar normal, pele pálida e úmida, pupilas isocóricas..."
                rows={3}
                className="bg-background border-border text-foreground"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor={`operador-${frame.id}`} className="flex items-center gap-2 text-foreground">
                <Play className="h-4 w-4 text-blue-600" />
                Instruções para Operador
              </Label>
              <Textarea
                id={`operador-${frame.id}`}
                value={frame.operatorInstructions || ''}
                onChange={(e) => onUpdate('operatorInstructions', e.target.value)}
                placeholder="Instruções específicas para o operador do simulador..."
                rows={3}
                className="bg-background border-border text-foreground"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor={`acoes-${frame.id}`} className="flex items-center gap-2 text-foreground">
                <Target className="h-4 w-4 text-green-600" />
                Ações Esperadas do Participante
              </Label>
              <Textarea
                id={`acoes-${frame.id}`}
                value={frame.expectedParticipantActions || ''}
                onChange={(e) => onUpdate('expectedParticipantActions', e.target.value)}
                placeholder="Ações esperadas ou possíveis dos participantes neste frame..."
                rows={3}
                className="bg-background border-border text-foreground"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor={`dinamica-${frame.id}`} className="flex items-center gap-2 text-foreground">
                <Activity className="h-4 w-4 text-purple-600" />
                Descrição da Dinâmica
              </Label>
              <Textarea
                id={`dinamica-${frame.id}`}
                value={frame.dynamicDescription || ''}
                onChange={(e) => onUpdate('dynamicDescription', e.target.value)}
                placeholder="Como os parâmetros devem mudar *dentro* deste frame ou *para* o próximo (ex: 'Aumentar FR linearmente para 25rpm em 3 min', 'Iniciar Trend 'Febre.tnd')"
                rows={2}
                className="bg-background border-border text-foreground"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor={`outros-parametros-${frame.id}`} className="text-foreground">Outros Parâmetros</Label>
              <Textarea
                id={`outros-parametros-${frame.id}`}
                value={frame.otherParametersText || ''}
                onChange={(e) => onUpdate('otherParametersText', e.target.value)}
                placeholder="Outros parâmetros menos comuns em formato livre..."
                rows={2}
                className="bg-background border-border text-foreground"
              />
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};

export default FramesTab;
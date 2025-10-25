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
  Loader2
} from "lucide-react";
import { useState, useCallback, useMemo } from "react";
import { cn } from "@/lib/utils";

interface Frame {
  id: string;
  ordem: number;
  nomeEtapa: string;
  fc?: number;
  sato2?: number;
  paSistolica?: number;
  paDiastolica?: number;
  fr?: number;
  temperatura?: number;
  outrosParametros?: string;
  infoSimulador: string;
  infoFacilitador: string;
  observacoes: string;
  tipoParticipante: "simulador" | "paciente" | "staff";
  duracao?: number;
  gatilhos?: string;
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
    const duracaoTotal = frames.reduce((acc, f) => acc + (f.duracao || 0), 0);
    
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
      nomeEtapa: `Etapa ${frames.length + 1}`,
      infoSimulador: "",
      infoFacilitador: "",
      observacoes: "",
      tipoParticipante: "simulador",
      duracao: 5,
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
          fc: 80, sato2: 98, paSistolica: 120, paDiastolica: 80, fr: 16, temperatura: 36.5,
          infoSimulador: "Paciente consciente, orientado, sem sinais de desconforto aparente. Responde adequadamente às perguntas.",
          infoFacilitador: "Observar avaliação primária da equipe. Permitir que realizem anamnese completa.",
          duracao: 5
        },
        deterioracao: { 
          fc: 120, sato2: 88, paSistolica: 90, paDiastolica: 60, fr: 24, temperatura: 37.8,
          infoSimulador: "Paciente apresenta dispneia, sudorese, ansiedade. Queixa-se de dor precordial.",
          infoFacilitador: "Aguardar reconhecimento dos sinais de deterioração. Intervir se não identificarem em 3 minutos.",
          duracao: 8
        },
        critico: { 
          fc: 40, sato2: 70, paSistolica: 60, paDiastolica: 40, fr: 8, temperatura: 35.2,
          infoSimulador: "Paciente inconsciente, cianótico, pulso fraco e irregular. Não responde a estímulos verbais.",
          infoFacilitador: "Situação crítica. Observar se equipe inicia RCP. Estar pronto para orientar se necessário.",
          duracao: 10
        },
        recuperacao: { 
          fc: 100, sato2: 94, paSistolica: 110, paDiastolica: 70, fr: 18, temperatura: 36.8,
          infoSimulador: "Paciente retorna à consciência gradualmente. Ainda apresenta certa confusão mental.",
          infoFacilitador: "Fase de estabilização. Observar cuidados pós-emergência e comunicação com paciente.",
          duracao: 7
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
        sato2: 98,
        paSistolica: 120,
        paDiastolica: 80,
        fr: 16,
        temperatura: 36.5,
        infoSimulador: "Paciente em estado estável. Aguardar avaliação da equipe.",
        infoFacilitador: "Observar procedimentos padrão da equipe.",
        duracao: 5
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
      frame.infoSimulador?.trim() &&
      frame.infoFacilitador?.trim() &&
      (frame.fc || frame.sato2 || frame.paSistolica)
    );
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
                  <Activity className="h-5 w-5 text-green-600" />
                  Frames do Cenário
                </CardTitle>
                <CardDescription>
                  Defina a progressão fisiológica e comportamental do caso clínico
                </CardDescription>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Label className="text-sm">Filtro:</Label>
                  <Select value={filtroStatus} onValueChange={(value: typeof filtroStatus) => setFiltroStatus(value)}>
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
  onIASuggest 
}: FrameCardProps) => {
  const contextosIA = [
    { value: "inicial", label: "Estado Inicial", icon: "🟢" },
    { value: "deterioracao", label: "Deterioração", icon: "🟡" },
    { value: "critico", label: "Estado Crítico", icon: "🔴" },
    { value: "recuperacao", label: "Recuperação", icon: "🔵" }
  ];

  const parametrosVitais = [
    { 
      key: 'fc', 
      label: 'FC', 
      unit: 'bpm', 
      icon: Heart, 
      placeholder: '80',
      min: 0, 
      max: 300,
      color: 'text-red-500'
    },
    { 
      key: 'sato2', 
      label: 'SatO₂', 
      unit: '%', 
      icon: Wind, 
      placeholder: '98',
      min: 0, 
      max: 100,
      color: 'text-blue-500'
    },
    { 
      key: 'paSistolica', 
      label: 'PA Sist', 
      unit: 'mmHg', 
      icon: Gauge, 
      placeholder: '120',
      min: 0, 
      max: 300,
      color: 'text-purple-500'
    },
    { 
      key: 'paDiastolica', 
      label: 'PA Diast', 
      unit: 'mmHg', 
      icon: Gauge, 
      placeholder: '80',
      min: 0, 
      max: 200,
      color: 'text-purple-500'
    },
    { 
      key: 'fr', 
      label: 'FR', 
      unit: 'rpm', 
      icon: Wind, 
      placeholder: '16',
      min: 0, 
      max: 60,
      color: 'text-green-500'
    },
    { 
      key: 'temperatura', 
      label: 'Temp', 
      unit: '°C', 
      icon: Thermometer, 
      placeholder: '36.5',
      min: 30, 
      max: 45,
      step: 0.1,
      color: 'text-orange-500'
    }
  ];

  return (
    <Card className={cn(
      "transition-all duration-200",
      frame.isCompleto ? "border-green-200 shadow-sm" : "border-yellow-200",
      isExpanded && "shadow-lg"
    )}>
      {/* Cabeçalho do Frame */}
      <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-gray-50 to-white">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
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
          </div>
          
          <Input
            value={frame.nomeEtapa}
            onChange={(e) => onUpdate('nomeEtapa', e.target.value)}
            placeholder="Nome da etapa (ex: Estado Inicial)"
            className="w-64 font-medium"
          />
          
          {frame.duracao && (
            <Badge variant="outline" className="text-xs">
              {frame.duracao}min
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor={`duracao-${frame.id}`}>Duração Estimada (minutos)</Label>
              <Input
                id={`duracao-${frame.id}`}
                type="number"
                min="1"
                max="60"
                value={frame.duracao || ''}
                onChange={(e) => onUpdate('duracao', parseInt(e.target.value) || undefined)}
                placeholder="5"
              />
            </div>
            
            <div className="space-y-2">
              <Label>Tipo de Participante</Label>
              <Select value={frame.tipoParticipante} onValueChange={(value) => onUpdate('tipoParticipante', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="simulador">🤖 Simulador</SelectItem>
                  <SelectItem value="paciente">👤 Paciente Padronizado</SelectItem>
                  <SelectItem value="staff">👥 Staff</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Separator />

          {/* Parâmetros Fisiológicos */}
          <div>
            <h4 className="font-semibold mb-4 flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Parâmetros Fisiológicos
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {parametrosVitais.map((param) => {
                const IconComponent = param.icon;
                return (
                  <div key={param.key} className="space-y-2">
                    <Label htmlFor={`${param.key}-${frame.id}`} className="flex items-center gap-1">
                      <IconComponent className={cn("h-3 w-3", param.color)} />
                      {param.label}
                    </Label>
                    <div className="relative">
                      <Input
                        id={`${param.key}-${frame.id}`}
                        type="number"
                        min={param.min}
                        max={param.max}
                        step={param.step}
                        value={frame[param.key as keyof Frame] as number || ''}
                        onChange={(e) => onUpdate(param.key, parseFloat(e.target.value) || undefined)}
                        placeholder={param.placeholder}
                        className="pr-12"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-500">
                        {param.unit}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div className="mt-4 space-y-2">
              <Label htmlFor={`outros-${frame.id}`}>Outros Parâmetros</Label>
              <Input
                id={`outros-${frame.id}`}
                value={frame.outrosParametros || ''}
                onChange={(e) => onUpdate('outrosParametros', e.target.value)}
                placeholder="Ex: Glicemia 120mg/dL, ECG - ritmo sinusal, Pupilas isocóricas"
              />
            </div>
          </div>

          <Separator />

          {/* Informações Detalhadas */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor={`info-simulador-${frame.id}`} className="flex items-center gap-2">
                🤖 Informações para Simulador/Operador *
                <Badge variant="destructive" className="text-xs">Obrigatório</Badge>
              </Label>
              <Textarea
                id={`info-simulador-${frame.id}`}
                value={frame.infoSimulador}
                onChange={(e) => onUpdate('infoSimulador', e.target.value)}
                placeholder="Descreva as ações, falas, comportamentos e respostas do simulador/paciente padronizado nesta etapa..."
                rows={3}
                className={cn(
                  "transition-colors",
                  !frame.infoSimulador.trim() && "border-red-300 focus:border-red-500"
                )}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor={`info-facilitador-${frame.id}`} className="flex items-center gap-2">
                👨‍🏫 Informações para Facilitador *
                <Badge variant="destructive" className="text-xs">Obrigatório</Badge>
              </Label>
              <Textarea
                id={`info-facilitador-${frame.id}`}
                value={frame.infoFacilitador}
                onChange={(e) => onUpdate('infoFacilitador', e.target.value)}
                placeholder="Orientações específicas para o facilitador: gatilhos, intervenções, pontos de atenção, quando avançar para próximo frame..."
                rows={3}
                className={cn(
                  "transition-colors",
                  !frame.infoFacilitador.trim() && "border-red-300 focus:border-red-500"
                )}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor={`gatilhos-${frame.id}`}>Gatilhos para Próximo Frame</Label>
              <Input
                id={`gatilhos-${frame.id}`}
                value={frame.gatilhos || ''}
                onChange={(e) => onUpdate('gatilhos', e.target.value)}
                placeholder="Ex: Após administração de medicação, Quando FC < 60 bpm, Após 5 minutos"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor={`observacoes-${frame.id}`}>Observações Adicionais</Label>
              <Textarea
                id={`observacoes-${frame.id}`}
                value={frame.observacoes}
                onChange={(e) => onUpdate('observacoes', e.target.value)}
                placeholder="Observações, dicas ou informações complementares sobre esta etapa..."
                rows={2}
              />
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};

export default FramesTab;
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
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
  Gauge,
  Eye,
  MessageSquare,
  User
} from "lucide-react";
import { useState, useCallback, useMemo } from "react";
import { cn } from "@/lib/utils";

interface Frame {
  id: string;
  ordem: number;
  nomeEtapa: string;
  frameIdentifier: string;
  durationEstimateMin: number;
  participantType: string;
  fc?: number;
  satO2?: number;
  paSistolica?: number;
  paDiastolica?: number;
  fr?: number;
  temp?: number;
  otherFindings?: string;
  operatorInstructions?: string;
  expectedParticipantActions?: string;
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

  const validarCompletudeFrame = (frame: Frame): boolean => {
    return !!(
      frame.nomeEtapa?.trim() &&
      frame.frameIdentifier?.trim() &&
      frame.durationEstimateMin > 0 &&
      frame.participantType?.trim() &&
      (frame.fc !== undefined || frame.satO2 !== undefined || frame.paSistolica !== undefined)
    );
  };

  const gerarSugestaoSinaisVitais = useCallback((frameId: string) => {
    atualizarFrame(frameId, 'loadingIA', true);
    
    // Simulação de chamada à IA
    setTimeout(() => {
      const sugestao = {
        fc: 120,
        satO2: 92,
        paSistolica: 80,
        paDiastolica: 50,
        fr: 28,
        temp: 38.2,
        otherFindings: "Pele pálida e úmida, taquipneia, taquicardia"
      };
      
      Object.entries(sugestao).forEach(([campo, valor]) => {
        atualizarFrame(frameId, campo, valor);
      });
      
      atualizarFrame(frameId, 'loadingIA', false);
    }, 1500);
  }, [atualizarFrame]);

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
              frame.isCompleto ? "border-green-300" : "border-yellow-300"
            )}>
              {/* Cabeçalho do Frame */}
              <div className="flex items-center justify-between p-4 border-b">
                <div className="flex items-center space-x-3">
                  <GripVertical className="h-4 w-4 text-gray-400" />
                  
                  <Badge variant={frame.isCompleto ? "default" : "secondary"} className={cn(
                    "flex items-center gap-1",
                    frame.isCompleto ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                  )}>
                    {frame.isCompleto ? <CheckCircle className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
                    Frame {frame.ordem}
                  </Badge>
                  
                  <Input
                    value={frame.nomeEtapa}
                    onChange={(e) => atualizarFrame(frame.id, 'nomeEtapa', e.target.value)}
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
                    disabled={frame.loadingIA}
                  >
                    <Sparkles className="h-4 w-4 mr-1" />
                    {frame.loadingIA ? "Gerando..." : "IA"}
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
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

                  <Separator />

                  {/* Sinais Vitais - RESTAURADOS */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium flex items-center gap-2">
                        <Heart className="h-4 w-4 text-red-500" />
                        Sinais Vitais
                      </h4>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => gerarSugestaoSinaisVitais(frame.id)}
                        disabled={frame.loadingIA}
                      >
                        <Sparkles className="h-3 w-3 mr-1" />
                        {frame.loadingIA ? "Gerando..." : "Sugerir com IA"}
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                      <div className="space-y-2">
                        <Label className="flex items-center gap-1 text-sm">
                          <Heart className="h-3 w-3 text-red-500" />
                          FC (bpm)
                        </Label>
                        <Input
                          type="number"
                          value={frame.fc || ''}
                          onChange={(e) => atualizarFrame(frame.id, 'fc', parseInt(e.target.value) || undefined)}
                          placeholder="80"
                          className="text-sm"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label className="flex items-center gap-1 text-sm">
                          <Eye className="h-3 w-3 text-blue-500" />
                          SatO₂ (%)
                        </Label>
                        <Input
                          type="number"
                          min="0"
                          max="100"
                          value={frame.satO2 || ''}
                          onChange={(e) => atualizarFrame(frame.id, 'satO2', parseInt(e.target.value) || undefined)}
                          placeholder="98"
                          className="text-sm"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label className="flex items-center gap-1 text-sm">
                          <Gauge className="h-3 w-3 text-green-500" />
                          PA Sistólica
                        </Label>
                        <Input
                          type="number"
                          value={frame.paSistolica || ''}
                          onChange={(e) => atualizarFrame(frame.id, 'paSistolica', parseInt(e.target.value) || undefined)}
                          placeholder="120"
                          className="text-sm"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label className="flex items-center gap-1 text-sm">
                          <Gauge className="h-3 w-3 text-green-500" />
                          PA Diastólica
                        </Label>
                        <Input
                          type="number"
                          value={frame.paDiastolica || ''}
                          onChange={(e) => atualizarFrame(frame.id, 'paDiastolica', parseInt(e.target.value) || undefined)}
                          placeholder="80"
                          className="text-sm"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label className="flex items-center gap-1 text-sm">
                          <User className="h-3 w-3 text-purple-500" />
                          FR (rpm)
                        </Label>
                        <Input
                          type="number"
                          value={frame.fr || ''}
                          onChange={(e) => atualizarFrame(frame.id, 'fr', parseInt(e.target.value) || undefined)}
                          placeholder="16"
                          className="text-sm"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label className="flex items-center gap-1 text-sm">
                          <Thermometer className="h-3 w-3 text-orange-500" />
                          Temp (°C)
                        </Label>
                        <Input
                          type="number"
                          step="0.1"
                          value={frame.temp || ''}
                          onChange={(e) => atualizarFrame(frame.id, 'temp', parseFloat(e.target.value) || undefined)}
                          placeholder="36.5"
                          className="text-sm"
                        />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="font-medium flex items-center gap-2">
                        <MessageSquare className="h-4 w-4 text-blue-500" />
                        Descrições Clínicas
                      </h4>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label>Achados Clínicos Adicionais</Label>
                          <Textarea
                            value={frame.otherFindings || ''}
                            onChange={(e) => atualizarFrame(frame.id, 'otherFindings', e.target.value)}
                            placeholder="Ex: Ausculta pulmonar normal, pele pálida e úmida, sudorese profusa..."
                            rows={3}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Instruções para Operador do Simulador</Label>
                          <Textarea
                            value={frame.operatorInstructions || ''}
                            onChange={(e) => atualizarFrame(frame.id, 'operatorInstructions', e.target.value)}
                            placeholder="Instruções específicas para o operador do simulador neste frame..."
                            rows={2}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-medium flex items-center gap-2">
                        <User className="h-4 w-4 text-green-500" />
                        Comportamento Esperado
                      </h4>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label>Ações Esperadas dos Participantes</Label>
                          <Textarea
                            value={frame.expectedParticipantActions || ''}
                            onChange={(e) => atualizarFrame(frame.id, 'expectedParticipantActions', e.target.value)}
                            placeholder="Ações esperadas dos participantes neste frame. Ex: Realizar avaliação primária ABCDE, solicitar exames complementares..."
                            rows={3}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
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
  );
};

export default FramesTab;